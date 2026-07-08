/* ============================================================
   ALL THE JAVASCRIPT — commented step by step for learning.

   The 4 things this script does:
   1. Load opportunities from Supabase (the real database)
   2. Draw ("render") that data onto the page as board rows
   3. Filter what's shown when a dropdown changes
   4. Handle the "add an opportunity" form — saves to Supabase
      AND emails you a notification via EmailJS

   This replaces the old hardcoded array — now everyone who
   visits the site sees the same live, shared data.
   ============================================================ */

// ---------- 0. CONNECT TO SUPABASE ----------
// These two values identify YOUR project. The key is safe to expose
// publicly in frontend code — that's what "publishable" means.
const SUPABASE_URL = "https://yeepmfrvoojcbgqdvagp.supabase.co";
const SUPABASE_KEY = "sb_publishable_Ir7lD1H9T4IYFrqMxDUzfA__7_mbmj2";

// This creates a "client" object we use to talk to the database.
// createClient() comes from the Supabase library loaded in index.html.
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// EmailJS config — fill these in once you've created your account (see setup guide).
const EMAILJS_PUBLIC_KEY = "X8rurEPBngYpH4b8a";
const EMAILJS_SERVICE_ID = "service_e05oikl";
const EMAILJS_TEMPLATE_ID = "template_6jrh3mr";
if (window.emailjs) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

// This starts as an empty array — it gets filled in by loadOpportunities() below,
// using real data fetched from your Supabase table instead of hardcoded values.
let opportunities = [];

// ---------- 1. LOAD DATA FROM SUPABASE ----------
// "async function" means this function can "await" (pause for) slow operations
// like a network request, without freezing the rest of the page.
async function loadOpportunities() {
  const { data, error } = await supabaseClient
    .from('opportunities')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error("Error loading opportunities:", error);
    document.getElementById("listings").innerHTML =
      '<div class="empty-state">Could not load data — check your internet connection and refresh.</div>';
    return;
  }

  opportunities = data; // store what we got back from the database

  // Now that we have real data, build the filter dropdowns and show the list.
  populateFilter("filterType", opportunities.map(o => o.type));
  populateFilter("filterYear", opportunities.map(o => o.year));
  populateFilter("filterMode", opportunities.map(o => o.mode));
  renderListings(opportunities);
}

// ---------- 2. RENDERING THE LIST ----------
// This function takes an array of opportunities and draws them as HTML.
// It runs every time the page loads AND every time a filter changes.
function renderListings(list) {
  const container = document.getElementById("listings");
  const countEl = document.getElementById("resultCount");

  countEl.textContent = list.length + " listed";

  // If nothing matches the filters, show a friendly empty state instead of a blank page.
  if (list.length === 0) {
    container.innerHTML = '<div class="empty-state">NO MATCHES — try clearing a filter</div>';
    return;
  }

  // .map() turns each opportunity object into an HTML string,
  // then .join("") glues all those strings into one big block of HTML.
  container.innerHTML = list.map(function(op) {
    // Pick a CSS class based on the mode, so remote/hybrid/on-site get different colors.
    let modeClass = "mode-onsite";
    if (op.mode.toLowerCase().includes("remote")) modeClass = "mode-remote";
    if (op.mode.toLowerCase().includes("hybrid")) modeClass = "mode-hybrid";

    return `
      <div class="board-row">
        <div class="company">${op.company}<span class="program-name">${op.program}</span></div>
        <div><span class="tag">${op.type}</span></div>
        <div><span class="tag">${op.year}</span></div>
        <div><span class="tag ${modeClass}">${op.mode}</span></div>
        <div class="stipend">${op.stipend}</div>
        <a class="apply-link" href="${op.link}" target="_blank" rel="noopener">Apply →</a>
        <div class="notes-line">${op.notes} &nbsp;·&nbsp; <span class="deadline">${op.deadline}</span></div>
      </div>
    `;
  }).join("");
}

// ---------- 3. FILTERING ----------
// Build the dropdown options automatically from whatever values
// exist in the data, so you never have to manually update the
// filter list when you add a new opportunity type.
function populateFilter(selectId, values) {
  const select = document.getElementById(selectId);
  const unique = ["All", ...new Set(values)]; // Set removes duplicates
  select.innerHTML = unique.map(v => `<option value="${v}">${v}</option>`).join("");
}

// This function reads the current dropdown values and filters the
// full opportunities array down to only the matching rows.
function applyFilters() {
  const typeVal = document.getElementById("filterType").value;
  const yearVal = document.getElementById("filterYear").value;
  const modeVal = document.getElementById("filterMode").value;

  const filtered = opportunities.filter(function(op) {
    const matchesType = (typeVal === "All") || (op.type === typeVal);
    const matchesYear = (yearVal === "All") || (op.year === yearVal);
    const matchesMode = (modeVal === "All") || (op.mode === modeVal);
    return matchesType && matchesYear && matchesMode;
  });

  renderListings(filtered);
}

// Whenever any dropdown changes, re-run the filter.
document.getElementById("filterType").addEventListener("change", applyFilters);
document.getElementById("filterYear").addEventListener("change", applyFilters);
document.getElementById("filterMode").addEventListener("change", applyFilters);

// ---------- 4. THE SUBMIT FORM ----------
const toggleFormBtn = document.getElementById("toggleFormBtn");
const submitPanel = document.getElementById("submitPanel");

toggleFormBtn.addEventListener("click", function() {
  submitPanel.classList.toggle("open");
});

// "async" here too, because inserting into the database is a network request —
// we need to wait for it to finish before we know whether it succeeded.
document.getElementById("submitForm").addEventListener("submit", async function(event) {
  event.preventDefault(); // stops the page from reloading, which forms do by default

  const submitBtn = this.querySelector(".submit-btn");
  submitBtn.disabled = true;
  submitBtn.textContent = "Adding...";

  const newEntry = {
    company: document.getElementById("f-company").value,
    program: document.getElementById("f-program").value,
    type: document.getElementById("f-type").value,
    mode: document.getElementById("f-mode").value,
    year: document.getElementById("f-year").value || "Check listing",
    stipend: document.getElementById("f-stipend").value || "Check listing",
    deadline: "Recently added",
    link: document.getElementById("f-link").value,
    notes: document.getElementById("f-notes").value || "Submitted by a student."
  };

  // Insert the new row into the real Supabase table.
  // .select() at the end asks Supabase to hand back the row it just created
  // (including the auto-generated id), so we can add it to our local list immediately.
  const { data, error } = await supabaseClient
    .from('opportunities')
    .insert([newEntry])
    .select();

  submitBtn.disabled = false;
  submitBtn.textContent = "Add to the board";

  if (error) {
    console.error("Error saving submission:", error);
    alert("Something went wrong saving this — please try again.");
    return;
  }

  // Send yourself an email notification, if EmailJS is set up.
  // If you haven't filled in the EMAILJS_ values above yet, this quietly does nothing.
  if (window.emailjs && EMAILJS_SERVICE_ID !== "PASTE_YOUR_SERVICE_ID_HERE" && EMAILJS_SERVICE_ID) {
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      company: newEntry.company,
      program: newEntry.program,
      link: newEntry.link,
      notes: newEntry.notes
    }).catch(err => console.error("EmailJS notification failed:", err));
  }

  // Add the newly created row (returned by Supabase) to our local list and re-render,
  // so the person who just submitted sees it appear immediately without refreshing.
  opportunities.push(data[0]);
  populateFilter("filterType", opportunities.map(o => o.type));
  populateFilter("filterYear", opportunities.map(o => o.year));
  populateFilter("filterMode", opportunities.map(o => o.mode));
  applyFilters();

  document.getElementById("confirmMsg").style.display = "block";
  this.reset();
  setTimeout(() => { document.getElementById("confirmMsg").style.display = "none"; }, 3000);
});

// ---------- INITIAL LOAD ----------
// Run once when the page first loads — fetches real data from Supabase
// and renders it. (Replaces the old renderListings(opportunities) call,
// since data now arrives asynchronously instead of being hardcoded.)
loadOpportunities();
