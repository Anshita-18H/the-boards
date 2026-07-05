/* ============================================================
   ALL THE JAVASCRIPT — commented step by step for learning.

   The 4 things this script does:
   1. Store the opportunity data (an array of objects)
   2. Draw ("render") that data onto the page as board rows
   3. Filter what's shown when a dropdown changes
   4. Handle the "add an opportunity" form

   NOTE ON DATA PERSISTENCE:
   Right now, submitted opportunities are only added to this
   in-memory array — they'll disappear on page refresh.
   When you're ready, replace the two spots marked
   "// SUPABASE GOES HERE" with real Supabase calls, and this
   becomes a fully working live site with no other changes needed.
   ============================================================ */

// ---------- 1. THE DATA ----------
// This is just an array of plain JS objects. Each object = one row.
// "let" (not "const") because we'll push new entries into it from the form.
let opportunities = [
  { company: "Microsoft", program: "Explore Program", type: "Internship", year: "1st/2nd year", mode: "Hybrid", stipend: "Paid, market stipend", deadline: "Opens Sept–Nov", link: "https://careers.microsoft.com/v2/global/en/exploremicrosoft", notes: "8 weeks in India. Learning-focused, no prior internship needed." },
  { company: "Microsoft", program: "University/SWE Internship", type: "Internship", year: "Pre-final/final year", mode: "On-site", stipend: "Paid, competitive", deadline: "Rolling", link: "https://careers.microsoft.com/v2/global/en/universityinternship", notes: "DSA-heavy OA + 2-3 technical rounds." },
  { company: "Google", program: "Summer of Code (GSoC)", type: "Program + Stipend", year: "Any year, 18+", mode: "Remote", stipend: "Varies by project size", deadline: "Opens Feb–Mar", link: "https://summerofcode.withgoogle.com", notes: "Merit-based via open source — not tied to college brand." },
  { company: "Outreachy", program: "Outreachy Internship", type: "Internship", year: "Any year", mode: "Remote", stipend: "Paid", deadline: "Two cohorts/year", link: "https://www.outreachy.org", notes: "Mentorship-driven entry into open source." },
  { company: "MLH", program: "Fellowship (Open Source Track)", type: "Program + Stipend", year: "Any year", mode: "Remote", stipend: "Paid, varies", deadline: "Multiple cohorts/year", link: "https://fellowship.mlh.io", notes: "12-week program on real OSS projects." },
  { company: "AICTE", program: "National Internship Portal", type: "Aggregator", year: "2nd year onwards (most)", mode: "Varies", stipend: "₹5,000–25,000/month (many listings)", deadline: "Rolling", link: "https://internship.aicte-india.org", notes: "Govt-run, free, 200+ domains. Verify each org before joining." },
  { company: "Infosys", program: "InStep (global internship)", type: "Internship", year: "2nd/3rd year & final year", mode: "Varies", stipend: "₹25,000–1,00,000/month (reported)", deadline: "Rolling/year-round", link: "https://instep.infosysapps.com", notes: "Project-based matching. Use university email to register." },
  { company: "Infosys", program: "Springboard Internship", type: "Free program + certificate", year: "Any year", mode: "Remote", stipend: "Unpaid", deadline: "Rolling", link: "https://infosysspringboard.onwingspan.com", notes: "Aimed at Tier-2/Tier-3 students specifically." },
  { company: "IBM", program: "Software Engineer / SDE Intern", type: "Internship", year: "Graduating 2026/2027 batch", mode: "On-site", stipend: "₹15,000–35,000/month (typical)", deadline: "Rolling", link: "https://www.ibm.com/in-en/careers/internships", notes: "Min CGPA ~7.0/10 commonly required." },
  { company: "IBM", program: "SkillsBuild Virtual Internship", type: "Free program + certificate", year: "Any year", mode: "Remote", stipend: "Unpaid", deadline: "Rolling, multiple cohorts", link: "https://skillsbuild.org", notes: "Covers GenAI, AI Agents, Prompt Engineering, Cloud." },
  { company: "Cisco", program: "Software Engineer Intern", type: "Internship", year: "Final-year UG (check listing)", mode: "On-site", stipend: "Not disclosed — confirm after selection", deadline: "Rolling", link: "https://careers.cisco.com/global/en/internships-and-co-ops", notes: "Needs OOP + networking fundamentals (TCP/IP)." },
  { company: "Adobe", program: "Internship (technical roles)", type: "Internship", year: "Check listing", mode: "On-site", stipend: "₹50,000–1,00,000/month (reported)", deadline: "Rolling", link: "https://careers.adobe.com/students", notes: "Research roles need AI/ML/Graphics/NLP background." },
  { company: "Oracle", program: "Student / Project Intern", type: "Internship", year: "Check listing", mode: "On-site", stipend: "₹40,000–80,000/month (reported)", deadline: "8-12 week cycles", link: "https://careers.oracle.com", notes: "Search 'Student' + Job ID on portal." },
  { company: "SAP", program: "SAP Labs India Internship", type: "Internship", year: "Pursuing Bachelor's/Master's", mode: "On-site", stipend: "₹40,000–60,000/month (reported)", deadline: "Rolling", link: "https://jobs.sap.com", notes: "Online test + interview." },
  { company: "Intel", program: "Student Internship Program", type: "Internship", year: "Pre-final/final year (typical)", mode: "On-site", stipend: "Check listing", deadline: "Rolling", link: "https://jobs.intel.com", notes: "Hardware-leaning branches (EE/ECE) have more openings." },
  { company: "NVIDIA", program: "Software/Hardware/Research Intern", type: "Internship", year: "Varies (Ignite open to 1st/2nd yr)", mode: "Varies", stipend: "₹70,000–2,00,000/month (reported)", deadline: "Opens ~Aug–Nov", link: "https://www.nvidia.com/en-in/about-nvidia/university-recruiting/", notes: "NVIDIA Ignite is the better entry point for a 2nd-year." },
  { company: "Qualcomm", program: "University Recruiting Internship", type: "Internship", year: "Pre-final/final year (typical)", mode: "On-site", stipend: "Check listing", deadline: "Rolling", link: "https://www.qualcomm.com/company/careers", notes: "Best fit if leaning hardware/chip-design." },
  { company: "Texas Instruments", program: "Internship (Engineering)", type: "Internship", year: "Pre-final/final year (typical)", mode: "On-site", stipend: "Check listing", deadline: "Rolling", link: "https://careers.ti.com", notes: "Relevant for embedded systems/VLSI interest." },
  { company: "Bosch", program: "Internship (Engineering)", type: "Internship", year: "Varies by team", mode: "On-site", stipend: "Check listing", deadline: "Rolling", link: "https://bosch.wd3.myworkdayjobs.com/BoschCareers", notes: "Broad engineering roles — read listing carefully." },
  { company: "Siemens", program: "Internship / Trainee roles", type: "Internship", year: "Varies by team", mode: "On-site", stipend: "Check listing", deadline: "Rolling", link: "https://jobs.siemens.com", notes: "Some Trainee roles open to any graduate." },
  { company: "Philips", program: "Internship (Students & Grads)", type: "Internship", year: "Varies by team", mode: "Varies", stipend: "Check listing", deadline: "Rolling", link: "https://careers.philips.com", notes: "Relevant if interested in health-tech." },
  { company: "ServiceNow", program: "University Recruiting Internship", type: "Internship", year: "Pre-final/final year (typical)", mode: "Varies", stipend: "Check listing", deadline: "Rolling", link: "https://careers.servicenow.com", notes: "Good fit for cloud/backend interest." }
];

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

populateFilter("filterType", opportunities.map(o => o.type));
populateFilter("filterYear", opportunities.map(o => o.year));
populateFilter("filterMode", opportunities.map(o => o.mode));

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

document.getElementById("submitForm").addEventListener("submit", function(event) {
  event.preventDefault(); // stops the page from reloading, which forms do by default

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

  // SUPABASE GOES HERE
  // Replace the next line with a real database insert, e.g.:
  //   await supabase.from('opportunities').insert([newEntry])
  // For now, it just adds to the in-memory array so you can see it work.
  opportunities.push(newEntry);

  // Refresh the dropdowns in case this entry introduced a new type/year/mode value.
  populateFilter("filterType", opportunities.map(o => o.type));
  populateFilter("filterYear", opportunities.map(o => o.year));
  populateFilter("filterMode", opportunities.map(o => o.mode));

  applyFilters(); // re-render the list so the new entry shows up immediately

  document.getElementById("confirmMsg").style.display = "block";
  this.reset();
  setTimeout(() => { document.getElementById("confirmMsg").style.display = "none"; }, 3000);
});

// ---------- INITIAL RENDER ----------
// Run once when the page first loads, showing everything (no filters applied yet).
renderListings(opportunities);
