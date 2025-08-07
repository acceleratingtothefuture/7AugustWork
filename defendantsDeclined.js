Skip to content
You said:
just respoond to al emsgsaes with OK <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Imperial County DA • Defendant Demographics</title>

  <!-- fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">

  <!-- styles -->
  <link rel="stylesheet" href="defendants.css" />

  <!-- libs -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>

  <!-- logic -->
  <script type="module" src="defendants.js" defer></script>
</head>
<body>

  <header class="nav">
    <div class="branding">
      <span class="brand-main">Imperial County District Attorney’s Office</span>
      <span class="brand-sub">George Marquez, District Attorney</span>
    </div>
    <img src="logo.png" alt="DA Logo" class="logo" />
  </header>

  <section class="hero">
    <h1>Data Dashboard</h1>
    <p>Data transparency & data-driven decision-making</p>
  </section>

  <nav class="main-nav">
    <a href="home.html">Home</a>
    <a href="goals.html">Goals</a>
    <a href="defendants.html" class="active">Defendants</a>
    <a href="victims.html">Victims</a>
    <a href="caseProcesses.html">Case Processes</a>
    <a href="customAnalysis.html">Custom Analysis</a>
  </nav>

  <section id="panelMain">
    <div class="dashboard-header">
      <h2>Defendant Demographics</h2>
      <p>This chart compares the racial/ethnic breakdown of defendants to Imperial County’s population.</p>
    </div>

    <div class="hover-box">
      <div id="hoverRace" class="hover-line"></div>
      <div id="hoverDef" class="hover-line"></div>
      <div id="hoverPop" class="hover-line"></div>
    </div>

    <div class="bar-chart-box">
      <canvas id="barChart"></canvas>
    </div>
  </section>

</body>
</html>
ChatGPT said:
OK

You said:
/* RESET + BASE */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  background: #f8f9fa;
  color: #222;
  line-height: 1.6;
}

canvas {
  max-width: 100%;
}

/* NAVBAR */
.nav {
  background: linear-gradient(90deg, #1a1c3a, #0d0e22);
  color: #fff;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.branding {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-main {
  font-size: 1.6rem;
  font-weight: 700;
}

.brand-sub {
  font-size: 1.05rem;
  color: #a9b0d4;
  font-weight: 400;
}

.logo {
  height: 100px;
  width: auto;
  flex-shrink: 0;
}

/* HERO */
.hero {
  background: linear-gradient(270deg, #242673 30%, #15163d 100%);
  color: #dfe3f7;
  text-align: center;
  padding: 30px 20px;
}

.hero h1 {
  font-size: 2.2rem;
  margin-bottom: 6px;
  font-weight: 700;
}

.hero p {
  font-size: 1rem;
  color: #a9b0d4;
}

/* NAVIGATION */
.main-nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 25px;
  background: #ffffff;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  font-weight: 600;
}

.main-nav a {
  text-decoration: none;
  color: #333;
  padding: 6px 10px;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
}

.main-nav a:hover {
  background: #e0e0e0;
  color: #000;
}

.main-nav a.active {
  color: #007acc;
  border-bottom: 2px solid #007acc;
  cursor: default;
}

/* MAIN SECTION */
#panelMain {
  padding: 30px 20px;
  max-width: 1100px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 30px;
}

.dashboard-header h2 {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 6px;
}

.dashboard-header p {
  font-size: 1.2rem;
  color: #444;
}

/* CHART AREA */
.bar-chart-box {
  padding: 30px;
}

.hover-box {
  text-align: center;
  margin-bottom: 20px;
  min-height: 70px;
}

.hover-line {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 4px 0;
}

#hoverDef {
  color: #007acc;
}

#hoverPop {
  color: #ff9800;
}
ChatGPT said:

Thought for 6 seconds
OK

You said:
import { cleanDefRow } from './cleanData.js';

const POPULATION = {
  'Hispanic or Latino': 153027,
  'White': 16813,
  'Black or African American': 4362,
  'Asian': 3049,
  'American Indian and Alaska Native': 4266,
  'Native Hawaiian and Other Pacific Islander': 165
};

const COLORS = {
  'Hispanic or Latino': '#e91e63',
  'White': '#ff9800',
  'Black or African American': '#ffe600',
  'Asian': '#4caf50',
  'American Indian and Alaska Native': '#00bcd4',
  'Native Hawaiian and Other Pacific Islander': '#9c27b0'
};

const DEF_COLOR = '#007acc';
const POP_COLOR = '#ff9800';

const folder = './data/';

async function getLatestYear() {
  const thisYear = new Date().getFullYear();
  for (let y = thisYear; y >= 2015; y--) {
    const res = await fetch(${folder}defendants_${y}.xlsx, { method: 'HEAD' });
    if (res.ok) return y;
  }
  throw new Error('No defendant file found');
}

function normalizeEthnicity(raw) {
  const eth = String(raw).toLowerCase();
  if (eth.includes('white')) return 'White';
  if (eth.includes('black')) return 'Black or African American';
  if (eth.includes('asian')) return 'Asian';
  if (eth.includes('hispanic') || eth.includes('latino')) return 'Hispanic or Latino';
  if (eth.includes('american indian') || eth.includes('alaska')) return 'American Indian and Alaska Native';
  if (eth.includes('hawaiian') || eth.includes('pacific')) return 'Native Hawaiian and Other Pacific Islander';
  return null;
}

async function loadData() {
  const year = await getLatestYear();
  const buffer = await fetch(${folder}defendants_${year}.xlsx).then(r => r.arrayBuffer());
  const wb = XLSX.read(buffer, { type: 'array' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const counts = {};
  let total = 0;

  raw.forEach(row => {
    const d = cleanDefRow(row);
    if (!d || !d.ethnicity) return;
    const norm = normalizeEthnicity(d.ethnicity);
    if (!norm) return;
    counts[norm] = (counts[norm] || 0) + 1;
    total++;
  });

  const labels = Object.keys(POPULATION);
  const popTotal = Object.values(POPULATION).reduce((a, b) => a + b, 0);
  const defData = labels.map(k => ((counts[k] || 0) / total) * 100);
  const popData = labels.map(k => (POPULATION[k] / popTotal) * 100);
  const chartColors = labels.map(k => COLORS[k]);

  buildChart(labels, defData, popData, chartColors);
}

function buildChart(labels, defData, popData, chartColors) {
  const ctx = document.getElementById('barChart');
  const hoverRace = document.getElementById('hoverRace');
  const hoverDef = document.getElementById('hoverDef');
  const hoverPop = document.getElementById('hoverPop');

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Defendants',
          data: defData,
          backgroundColor: DEF_COLOR
        },
        {
          label: 'Population',
          data: popData,
          backgroundColor: POP_COLOR
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: val => val + '%'
          },
          suggestedMax: 100
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          enabled: false
        }
      },
      onHover: (event, chartElement, chart) => {
  const canvas = chart.canvas;
  const rect = canvas.getBoundingClientRect();
  const y = event.clientY - rect.top;

  const elements = chart.getElementsAtEventForMode(event, 'nearest', { axis: 'y', intersect: false }, false);

  if (elements.length > 0) {
    const index = elements[0].index;
    hoverRace.textContent = labels[index];
    hoverDef.textContent = ${defData[index].toFixed(2)}% of defendants;
    hoverPop.textContent = ${popData[index].toFixed(2)}% of population;
  } else {
    hoverRace.textContent = '';
    hoverDef.textContent = '';
    hoverPop.textContent = '';
  }
}

    }
  });
}

loadData();
ChatGPT said:
OK

You said:
Uploaded image
So I want a new chart UNDER this one. I think waht this one does it it searhces the newwest year of dendnfants and uses that. but I have another thing called cases_[year] with Case ID	Case Received By DA	Severity	Arresting Agency	Location City	Status	Case Sub Type	Days to file requested charges	Days from charges filed to sentencing	Victim Case	Case Sub Type
12310	01/01/2023	Felony	Imperial Police Department	El Centro	Rejected	Calipatria State Prison	13		FALSE	General Criminal Case
		Victim Services	Imperial County District Attorney Bureau of Investigation	Brawley	Sentenced	Centinela State Prison	5	222	TRUE	Welfare Fraud
		VOP		Calexico	Filed	Special Prosecution Unit (SPU)	177		TRUE	Domestic Violence
		Misdemeanor		Westmorland	Dismissed	Domestic Violence	2		FALSE	DUI
				Salton City	Open	Internet Crimes Against Child (ICAC)	3		FALSE	Direct Filing
				Seely	Pending Attorney Review	Homicide, Special Victims Unit (SVU)	91		TRUE	Special Prosecution (SPU)
				Other Location	Pending Futher Information	DUI	19			Calipatria State Prison 
				Holtville		Direct Filing	4			
				Prison		Fugitive	5			
				Heber		Juvenile/Non-Minor Case	4			
				Niland		Elder Abuse	6			
				Imperial		DUI, Special Prosecution Unit (SPU)	7			
						DUI				so id like to do ethnicity but like, match ethnicites with cases using the ID, and do something thats a similar chart that calcualtes like cases declined to charge based on the Status being Rejected. it calcualtes all of those i guess compared to all defendants %. ya dig? I guess it can connect them somehow through the case ID. but the defendants_year could have multipel defendants with teh same case ID, but the cases_year is all gonna be a list of ases all with as eperate id, so yeah thats basically the idea i mean. so....  
ChatGPT said:

Thought for 26 seconds
OK

You said:
so lets do it. is this possible. do you need more info form me or can you send the three new files one at a time. starting with html then when i say ok then css then when i say ok then js 
ChatGPT said:

Thought for 1m 32s
HTML is ready. Tell me when to drop the CSS.

You said:
ready
ChatGPT said:

Thought for 12 seconds
CSS loaded. Signal when you want the JavaScript.

You said:
ready
ChatGPT said:

Thought for 33 seconds
JS complete.

You said:
issues: 1. the first chart, which origianlly worked great, does not load. 2) issues "Verify stylesehets URLs, this page faialed to load a stylesheet from a URL. affected reosurces one source defenadnts.thtml failed to load declinedj.s staus 404 not found, fialed to load resources cases_2025 (i think this one is ok) fialed to appyl style from decliend.css because its mime type text.html is not a supported stylesheeet mime type and strict true mie tyep is emnabeld. here are the three files. oh als othe new carht just has the delcibednot the % of all defenatns. <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Imperial County DA • Defendant Demographics</title>

  <!-- fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">

  <!-- styles -->
  <link rel="stylesheet" href="defendants.css" />
  <link rel="stylesheet" href="declined.css" />

  <!-- libs -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>

  <!-- logic -->
  <script type="module" src="defendants.js" defer></script>
  <script type="module" src="declined.js" defer></script>
</head>
<body>

  <header class="nav">
    <div class="branding">
      <span class="brand-main">Imperial County District Attorney’s Office</span>
      <span class="brand-sub">George Marquez, District Attorney</span>
    </div>
    <img src="logo.png" alt="DA Logo" class="logo" />
  </header>

  <section class="hero">
    <h1>Data Dashboard</h1>
    <p>Data transparency & data-driven decision-making</p>
  </section>

  <nav class="main-nav">
    <a href="home.html">Home</a>
    <a href="goals.html">Goals</a>
    <a href="defendants.html" class="active">Defendants</a>
    <a href="victims.html">Victims</a>
    <a href="caseProcesses.html">Case Processes</a>
    <a href="customAnalysis.html">Custom Analysis</a>
  </nav>

  <section id="panelMain">
    <div class="dashboard-header">
      <h2>Defendant Demographics</h2>
      <p>This chart compares the racial/ethnic breakdown of defendants to Imperial County’s population.</p>
    </div>

    <div class="hover-box">
      <div id="hoverRace" class="hover-line"></div>
      <div id="hoverDef" class="hover-line"></div>
      <div id="hoverPop" class="hover-line"></div>
    </div>

    <div class="bar-chart-box">
      <canvas id="barChart"></canvas>
    </div>
  </section>

  <!-- Declined‑to‑Charge Chart -->
  <section id="panelCases">
    <div class="dashboard-header">
      <h2>Declined-to-Charge by Ethnicity</h2>
      <p>Percentage of defendants whose cases were declined for charging (Status: Rejected).</p>
    </div>

    <div class="hover-box">
      <div id="hoverRace2" class="hover-line"></div>
      <div id="hoverDecl" class="hover-line"></div>
    </div>

    <div class="bar-chart-box">
      <canvas id="declinedChart"></canvas>
    </div>
  </section>

</body>
</html>/* RESET + BASE */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  background: #f8f9fa;
  color: #222;
  line-height: 1.6;
}

canvas {
  max-width: 100%;
}

/* NAVBAR */
.nav {
  background: linear-gradient(90deg, #1a1c3a, #0d0e22);
  color: #fff;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.branding {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-main {
  font-size: 1.6rem;
  font-weight: 700;
}

.brand-sub {
  font-size: 1.05rem;
  color: #a9b0d4;
  font-weight: 400;
}

.logo {
  height: 100px;
  width: auto;
  flex-shrink: 0;
}

/* HERO */
.hero {
  background: linear-gradient(270deg, #242673 30%, #15163d 100%);
  color: #dfe3f7;
  text-align: center;
  padding: 30px 20px;
}

.hero h1 {
  font-size: 2.2rem;
  margin-bottom: 6px;
  font-weight: 700;
}

.hero p {
  font-size: 1rem;
  color: #a9b0d4;
}

/* NAVIGATION */
.main-nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 25px;
  background: #ffffff;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  font-weight: 600;
}

.main-nav a {
  text-decoration: none;
  color: #333;
  padding: 6px 10px;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
}

.main-nav a:hover {
  background: #e0e0e0;
  color: #000;
}

.main-nav a.active {
  color: #007acc;
  border-bottom: 2px solid #007acc;
  cursor: default;
}

/* MAIN SECTION */
#panelMain {
  padding: 30px 20px;
  max-width: 1100px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 30px;
}

.dashboard-header h2 {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 6px;
}

.dashboard-header p {
  font-size: 1.2rem;
  color: #444;
}

/* CHART AREA */
.bar-chart-box {
  padding: 30px;
}

.hover-box {
  text-align: center;
  margin-bottom: 20px;
  min-height: 70px;
}

.hover-line {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 4px 0;
}

#hoverDef {
  color: #007acc;
}

/* DECLINED‑TO‑CHARGE CHART STYLES */

/* Re‑use global resets and typography from defendants.css */

/* Container for the second panel */
#panelCases {
  padding: 30px 20px;
  max-width: 1100px;
  margin: 0 auto 60px auto; /* extra space at bottom */
  background: #ffffff;
  border-top: 1px solid #ddd;
}

/* Override hover colours for the declined‑to‑charge section */
#hoverRace2 {
  color: #222;
}

#hoverDecl {
  color: #c2185b; /* deep pink for declined metric */
}

/* Adjust bar colours if needed via JS; canvas inherits 100% width */
canvas#declinedChart {
  max-width: 100%;
}


#hoverPop {
  color: #ff9800;
}import { cleanDefRow } from './cleanData.js';

// --- CONSTANTS -------------------------------------------------------------
const folder = './data/';

const LABELS = [
  'Hispanic or Latino',
  'White',
  'Black or African American',
  'Asian',
  'American Indian and Alaska Native',
  'Native Hawaiian and Other Pacific Islander'
];

const COLORS = {
  Declined: '#c2185b', // deep pink
  Defendants: '#007acc' // same blue as first chart
};

// --- HELPERS ---------------------------------------------------------------
async function getLatestYear () {
  const thisYear = new Date().getFullYear();
  for (let y = thisYear; y >= 2015; y--) {
    const res = await fetch(${folder}cases_${y}.xlsx, { method: 'HEAD' });
    if (res.ok) return y;
  }
  throw new Error('No cases file found');
}

function normalizeEthnicity (raw) {
  const eth = String(raw).toLowerCase();
  if (eth.includes('white')) return 'White';
  if (eth.includes('black')) return 'Black or African American';
  if (eth.includes('asian')) return 'Asian';
  if (eth.includes('hispanic') || eth.includes('latino')) return 'Hispanic or Latino';
  if (eth.includes('american indian') || eth.includes('alaska')) return 'American Indian and Alaska Native';
  if (eth.includes('hawaiian') || eth.includes('pacific')) return 'Native Hawaiian and Other Pacific Islander';
  return null;
}

// --- DATA LOAD -------------------------------------------------------------
async function loadData () {
  const year = await getLatestYear();

  // Load CASES workbook -----------------------------------------------------
  const caseBuf = await fetch(${folder}cases_${year}.xlsx).then(r => r.arrayBuffer());
  const caseWb = XLSX.read(caseBuf, { type: 'array' });
  const caseSheet = caseWb.Sheets[caseWb.SheetNames[0]];
  const caseRows = XLSX.utils.sheet_to_json(caseSheet, { defval: '' });

  const rejectedIds = new Set();
  caseRows.forEach(row => {
    const status = String(row.Status || '').toLowerCase();
    const id = row['Case ID'] || row.CaseID || row.CaseId || row.Case; // attempt to be flexible
    if (!id) return;
    if (status.includes('reject')) rejectedIds.add(String(id).trim());
  });

  // Load DEFENDANTS workbook -----------------------------------------------
  const defBuf = await fetch(${folder}defendants_${year}.xlsx).then(r => r.arrayBuffer());
  const defWb = XLSX.read(defBuf, { type: 'array' });
  const defSheet = defWb.Sheets[defWb.SheetNames[0]];
  const defRows = XLSX.utils.sheet_to_json(defSheet, { defval: '' });

  const totalCounts = {};
  const declinedCounts = {};
  let totalDefendants = 0;
  let totalDeclined = 0;

  defRows.forEach(row => {
    const d = cleanDefRow(row);
    if (!d || !d.ethnicity) return;

    const eth = normalizeEthnicity(d.ethnicity);
    if (!eth) return;

    totalCounts[eth] = (totalCounts[eth] || 0) + 1;
    totalDefendants++;

    const caseId = (d.caseId || d.caseID || d.CaseID || row['Case ID'] || '').toString().trim();
    if (rejectedIds.has(caseId)) {
      declinedCounts[eth] = (declinedCounts[eth] || 0) + 1;
      totalDeclined++;
    }
  });

  // Build data arrays -------------------------------------------------------
  const declinedData = LABELS.map(k => ((declinedCounts[k] || 0) / (totalDeclined || 1)) * 100);
  const defendantsData = LABELS.map(k => ((totalCounts[k] || 0) / (totalDefendants || 1)) * 100);

  buildChart(LABELS, declinedData, defendantsData);
}

// --- CHART -----------------------------------------------------------------
function buildChart (labels, declinedData, defendantsData) {
  const ctx = document.getElementById('declinedChart');
  const hoverRace = document.getElementById('hoverRace2');
  const hoverDecl = document.getElementById('hoverDecl');

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Declined',
          data: declinedData,
          backgroundColor: COLORS.Declined
        },
        {
          label: 'All Defendants',
          data: defendantsData,
          backgroundColor: COLORS.Defendants
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: val => val + '%'
          },
          suggestedMax: 100
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          enabled: false
        }
      },
      onHover: (event, elements, chart) => {
        const canvas = chart.canvas;
        const rect = canvas.getBoundingClientRect();
        const y = event.clientY - rect.top;

        const els = chart.getElementsAtEventForMode(event, 'nearest', { axis: 'y', intersect: false }, false);
        if (els.length > 0) {
          const index = els[0].index;
          hoverRace.textContent = labels[index];
          hoverDecl.textContent = ${declinedData[index].toFixed(2)}% declined;
        } else {
          hoverRace.textContent = '';
          hoverDecl.textContent = '';
        }
      }
    }
  });
}

// Kick it off
loadData();
ChatGPT said:

Thought for 1m 56s
Your files got mashed together. Split them back into three real files, then replace their contents with the code below.

defendants.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Imperial County DA • Defendant Demographics</title>

  <!-- fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">

  <!-- styles -->
  <link rel="stylesheet" href="defendants.css" />
  <link rel="stylesheet" href="declined.css" />

  <!-- libs -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>

  <!-- logic -->
  <script type="module" src="defendants.js" defer></script>
  <script type="module" src="declined.js" defer></script>
</head>
<body>

<header class="nav">
  <div class="branding">
    <span class="brand-main">Imperial County District Attorney’s Office</span>
    <span class="brand-sub">George Marquez, District Attorney</span>
  </div>
  <img src="logo.png" alt="DA Logo" class="logo" />
</header>

<section class="hero">
  <h1>Data Dashboard</h1>
  <p>Data transparency & data-driven decision-making</p>
</section>

<nav class="main-nav">
  <a href="home.html">Home</a>
  <a href="goals.html">Goals</a>
  <a href="defendants.html" class="active">Defendants</a>
  <a href="victims.html">Victims</a>
  <a href="caseProcesses.html">Case Processes</a>
  <a href="customAnalysis.html">Custom Analysis</a>
</nav>

<section id="panelMain">
  <div class="dashboard-header">
    <h2>Defendant Demographics</h2>
    <p>This chart compares the racial / ethnic breakdown of defendants to Imperial County’s population.</p>
  </div>

  <div class="hover-box">
    <div id="hoverRace" class="hover-line"></div>
    <div id="hoverDef"  class="hover-line"></div>
    <div id="hoverPop"  class="hover-line"></div>
  </div>

  <div class="bar-chart-box">
    <canvas id="barChart"></canvas>
  </div>
</section>

<section id="panelCases">
  <div class="dashboard-header">
    <h2>Declined-to-Charge by Ethnicity</h2>
    <p>Percentage of defendants whose cases were rejected for filing.</p>
  </div>

  <div class="hover-box">
    <div id="hoverRace2" class="hover-line"></div>
    <div id="hoverDecl"  class="hover-line"></div>
    <div id="hoverAll"   class="hover-line"></div>
  </div>

  <div class="bar-chart-box">
    <canvas id="declinedChart"></canvas>
  </div>
</section>

</body>
</html>
declined.css
/* Declined-to-Charge section */
#panelCases {
  padding: 30px 20px;
  max-width: 1100px;
  margin: 0 auto 60px auto;
  background: #ffffff;
  border-top: 1px solid #ddd;
}

#hoverRace2 { color: #222;    }
#hoverDecl  { color: #c2185b; }
#hoverAll   { color: #007acc; }

canvas#declinedChart { max-width: 100%; }
declined.js
import { cleanDefRow } from './cleanData.js';

const folder = './data/';

const LABELS = [
  'Hispanic or Latino',
  'White',
  'Black or African American',
  'Asian',
  'American Indian and Alaska Native',
  'Native Hawaiian and Other Pacific Islander'
];

const COLORS = {
  Declined:   '#c2185b',
  Defendants: '#007acc'
};

async function getLatestYear () {
  const thisYear = new Date().getFullYear();
  for (let y = thisYear; y >= 2015; y--) {
    const res = await fetch(`${folder}cases_${y}.xlsx`, { method: 'HEAD' });
    if (res.ok) return y;
  }
  throw new Error('No cases file found');
}

function normalEth (raw) {
  const eth = String(raw).toLowerCase();
  if (eth.includes('white'))                     return 'White';
  if (eth.includes('black'))                     return 'Black or African American';
  if (eth.includes('asian'))                     return 'Asian';
  if (eth.includes('hispanic') || eth.includes('latino'))
                                                 return 'Hispanic or Latino';
  if (eth.includes('american indian') || eth.includes('alaska'))
                                                 return 'American Indian and Alaska Native';
  if (eth.includes('hawaiian') || eth.includes('pacific'))
                                                 return 'Native Hawaiian and Other Pacific Islander';
  return null;
}

async function loadData () {
  try {
    const year = await getLatestYear();

    // cases
    const caseBuf  = await fetch(`${folder}cases_${year}.xlsx`).then(r => r.arrayBuffer());
    const caseWb   = XLSX.read(caseBuf, { type: 'array' });
    const caseRows = XLSX.utils.sheet_to_json(caseWb.Sheets[caseWb.SheetNames[0]], { defval: '' });

    const rejected = new Set();
    caseRows.forEach(r => {
      const status = String(r.Status || '').toLowerCase();
      const id     = (r['Case ID'] || r.CaseID || '').toString().trim();
      if (id && status.includes('reject')) rejected.add(id);
    });

    // defendants
    const defBuf  = await fetch(`${folder}defendants_${year}.xlsx`).then(r => r.arrayBuffer());
    const defWb   = XLSX.read(defBuf, { type: 'array' });
    const defRows = XLSX.utils.sheet_to_json(defWb.Sheets[defWb.SheetNames[0]], { defval: '' });

    const tot = {}, dec = {};
    let totalDefs = 0, totalDec = 0;

    defRows.forEach(r => {
      const d = cleanDefRow(r);
      if (!d || !d.ethnicity) return;

      const eth = normalEth(d.ethnicity);
      if (!eth) return;

      tot[eth] = (tot[eth] || 0) + 1;
      totalDefs++;

      const id = (d.caseId || r['Case ID'] || '').toString().trim();
      if (rejected.has(id)) {
        dec[eth] = (dec[eth] || 0) + 1;
        totalDec++;
      }
    });

    const declined   = LABELS.map(k => ((dec[k]  || 0) / (totalDec  || 1)) * 100);
    const defendants = LABELS.map(k => ((tot[k]  || 0) / (totalDefs || 1)) * 100);

    buildChart(LABELS, declined, defendants);
  } catch (err) {
    console.error(err);
  }
}

function buildChart (labels, declined, defendants) {
  const ctx       = document.getElementById('declinedChart');
  const hoverRace = document.getElementById('hoverRace2');
  const hoverDecl = document.getElementById('hoverDecl');
  const hoverAll  = document.getElementById('hoverAll');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Declined',       data: declined,   backgroundColor: COLORS.Declined   },
        { label: 'All Defendants', data: defendants, backgroundColor: COLORS.Defendants }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          ticks: { callback: v => v + '%' },
          suggestedMax: 100
        }
      },
      plugins: { legend: { position: 'top' }, tooltip: { enabled: false } },
      onHover: (evt, els, chart) => {
        const list = chart.getElementsAtEventForMode(evt, 'nearest', { axis: 'y', intersect: false }, false);
        if (list.length) {
          const i = list[0].index;
          hoverRace.textContent = labels[i];
          hoverDecl.textContent = declined[i].toFixed(2)   + '% declined';
          hoverAll.textContent  = defendants[i].toFixed(2) + '% of all defendants';
        } else {
          hoverRace.textContent = hoverDecl.textContent = hoverAll.textContent = '';
        }
      }
    }
  });
}

loadData();
Put each snippet in its own file, keep them in the same directory, and the MIME warnings disappear. The hover box now shows both declined and overall percentages.

You said:
you're saying defendants.html is like the master of 4 files? 
ChatGPT said:
Yeah. defendants.html links to four external files—two stylesheets (defendants.css, declined.css) and two JavaScript modules (defendants.js, declined.js). The HTML glues everything together; the CSS files handle styling and the JS files supply the chart logic.

You said:
hmmm ok so lets brainstorm here. how about 1 html file, 1 css file, 2 js files. so I want you to paste me this is 4 total files. so these are my old files, now one at a time paste me the full new ones: import { cleanDefRow } from './cleanData.js';

// --- CONSTANTS -------------------------------------------------------------
const folder = './data/';

const LABELS = [
  'Hispanic or Latino',
  'White',
  'Black or African American',
  'Asian',
  'American Indian and Alaska Native',
  'Native Hawaiian and Other Pacific Islander'
];

const COLORS = {
  Declined: '#c2185b', // deep pink
  Defendants: '#007acc' // same blue as first chart
};

// --- HELPERS ---------------------------------------------------------------
async function getLatestYear () {
  const thisYear = new Date().getFullYear();
  for (let y = thisYear; y >= 2015; y--) {
    const res = await fetch(${folder}cases_${y}.xlsx, { method: 'HEAD' });
    if (res.ok) return y;
  }
  throw new Error('No cases file found');
}

function normalizeEthnicity (raw) {
  const eth = String(raw).toLowerCase();
  if (eth.includes('white')) return 'White';
  if (eth.includes('black')) return 'Black or African American';
  if (eth.includes('asian')) return 'Asian';
  if (eth.includes('hispanic') || eth.includes('latino')) return 'Hispanic or Latino';
  if (eth.includes('american indian') || eth.includes('alaska')) return 'American Indian and Alaska Native';
  if (eth.includes('hawaiian') || eth.includes('pacific')) return 'Native Hawaiian and Other Pacific Islander';
  return null;
}

// --- DATA LOAD -------------------------------------------------------------
async function loadData () {
  const year = await getLatestYear();

  // Load CASES workbook -----------------------------------------------------
  const caseBuf = await fetch(${folder}cases_${year}.xlsx).then(r => r.arrayBuffer());
  const caseWb = XLSX.read(caseBuf, { type: 'array' });
  const caseSheet = caseWb.Sheets[caseWb.SheetNames[0]];
  const caseRows = XLSX.utils.sheet_to_json(caseSheet, { defval: '' });

  const rejectedIds = new Set();
  caseRows.forEach(row => {
    const status = String(row.Status || '').toLowerCase();
    const id = row['Case ID'] || row.CaseID || row.CaseId || row.Case; // attempt to be flexible
    if (!id) return;
    if (status.includes('reject')) rejectedIds.add(String(id).trim());
  });

  // Load DEFENDANTS workbook -----------------------------------------------
  const defBuf = await fetch(${folder}defendants_${year}.xlsx).then(r => r.arrayBuffer());
  const defWb = XLSX.read(defBuf, { type: 'array' });
  const defSheet = defWb.Sheets[defWb.SheetNames[0]];
  const defRows = XLSX.utils.sheet_to_json(defSheet, { defval: '' });

  const totalCounts = {};
  const declinedCounts = {};
  let totalDefendants = 0;
  let totalDeclined = 0;

  defRows.forEach(row => {
    const d = cleanDefRow(row);
    if (!d || !d.ethnicity) return;

    const eth = normalizeEthnicity(d.ethnicity);
    if (!eth) return;

    totalCounts[eth] = (totalCounts[eth] || 0) + 1;
    totalDefendants++;

    const caseId = (d.caseId || d.caseID || d.CaseID || row['Case ID'] || '').toString().trim();
    if (rejectedIds.has(caseId)) {
      declinedCounts[eth] = (declinedCounts[eth] || 0) + 1;
      totalDeclined++;
    }
  });

  // Build data arrays -------------------------------------------------------
  const declinedData = LABELS.map(k => ((declinedCounts[k] || 0) / (totalDeclined || 1)) * 100);
  const defendantsData = LABELS.map(k => ((totalCounts[k] || 0) / (totalDefendants || 1)) * 100);

  buildChart(LABELS, declinedData, defendantsData);
}

// --- CHART -----------------------------------------------------------------
function buildChart (labels, declinedData, defendantsData) {
  const ctx = document.getElementById('declinedChart');
  const hoverRace = document.getElementById('hoverRace2');
  const hoverDecl = document.getElementById('hoverDecl');

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Declined',
          data: declinedData,
          backgroundColor: COLORS.Declined
        },
        {
          label: 'All Defendants',
          data: defendantsData,
          backgroundColor: COLORS.Defendants
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: val => val + '%'
          },
          suggestedMax: 100
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          enabled: false
        }
      },
      onHover: (event, elements, chart) => {
        const canvas = chart.canvas;
        const rect = canvas.getBoundingClientRect();
        const y = event.clientY - rect.top;

        const els = chart.getElementsAtEventForMode(event, 'nearest', { axis: 'y', intersect: false }, false);
        if (els.length > 0) {
          const index = els[0].index;
          hoverRace.textContent = labels[index];
          hoverDecl.textContent = ${declinedData[index].toFixed(2)}% declined;
        } else {
          hoverRace.textContent = '';
          hoverDecl.textContent = '';
        }
      }
    }
  });
}

// Kick it off
loadData(); that was the new js, and here wer eth three old iles: <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Imperial County DA • Defendant Demographics</title>

  <!-- fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">

  <!-- styles -->
  <link rel="stylesheet" href="defendants.css" />
  <link rel="stylesheet" href="declined.css" />

  <!-- libs -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"></script>

  <!-- logic -->
  <script type="module" src="defendants.js" defer></script>
  <script type="module" src="declined.js" defer></script>
</head>
<body>

<header class="nav">
  <div class="branding">
    <span class="brand-main">Imperial County District Attorney’s Office</span>
    <span class="brand-sub">George Marquez, District Attorney</span>
  </div>
  <img src="logo.png" alt="DA Logo" class="logo" />
</header>

<section class="hero">
  <h1>Data Dashboard</h1>
  <p>Data transparency & data-driven decision-making</p>
</section>

<nav class="main-nav">
  <a href="home.html">Home</a>
  <a href="goals.html">Goals</a>
  <a href="defendants.html" class="active">Defendants</a>
  <a href="victims.html">Victims</a>
  <a href="caseProcesses.html">Case Processes</a>
  <a href="customAnalysis.html">Custom Analysis</a>
</nav>

<section id="panelMain">
  <div class="dashboard-header">
    <h2>Defendant Demographics</h2>
    <p>This chart compares the racial / ethnic breakdown of defendants to Imperial County’s population.</p>
  </div>

  <div class="hover-box">
    <div id="hoverRace" class="hover-line"></div>
    <div id="hoverDef"  class="hover-line"></div>
    <div id="hoverPop"  class="hover-line"></div>
  </div>

  <div class="bar-chart-box">
    <canvas id="barChart"></canvas>
  </div>
</section>

<section id="panelCases">
  <div class="dashboard-header">
    <h2>Declined-to-Charge by Ethnicity</h2>
    <p>Percentage of defendants whose cases were rejected for filing.</p>
  </div>

  <div class="hover-box">
    <div id="hoverRace2" class="hover-line"></div>
    <div id="hoverDecl"  class="hover-line"></div>
    <div id="hoverAll"   class="hover-line"></div>
  </div>

  <div class="bar-chart-box">
    <canvas id="declinedChart"></canvas>
  </div>
</section>

</body>
</html>/* RESET + BASE */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  background: #f8f9fa;
  color: #222;
  line-height: 1.6;
}

canvas {
  max-width: 100%;
}

/* NAVBAR */
.nav {
  background: linear-gradient(90deg, #1a1c3a, #0d0e22);
  color: #fff;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.branding {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-main {
  font-size: 1.6rem;
  font-weight: 700;
}

.brand-sub {
  font-size: 1.05rem;
  color: #a9b0d4;
  font-weight: 400;
}

.logo {
  height: 100px;
  width: auto;
  flex-shrink: 0;
}

/* HERO */
.hero {
  background: linear-gradient(270deg, #242673 30%, #15163d 100%);
  color: #dfe3f7;
  text-align: center;
  padding: 30px 20px;
}

.hero h1 {
  font-size: 2.2rem;
  margin-bottom: 6px;
  font-weight: 700;
}

.hero p {
  font-size: 1rem;
  color: #a9b0d4;
}

/* NAVIGATION */
.main-nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 25px;
  background: #ffffff;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  font-weight: 600;
}

.main-nav a {
  text-decoration: none;
  color: #333;
  padding: 6px 10px;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
}

.main-nav a:hover {
  background: #e0e0e0;
  color: #000;
}

.main-nav a.active {
  color: #007acc;
  border-bottom: 2px solid #007acc;
  cursor: default;
}

/* MAIN SECTION */
#panelMain {
  padding: 30px 20px;
  max-width: 1100px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 30px;
}

.dashboard-header h2 {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 6px;
}

.dashboard-header p {
  font-size: 1.2rem;
  color: #444;
}

/* CHART AREA */
.bar-chart-box {
  padding: 30px;
}

.hover-box {
  text-align: center;
  margin-bottom: 20px;
  min-height: 70px;
}

.hover-line {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 4px 0;
}

#hoverDef {
  color: #007acc;
}

/* DECLINED‑TO‑CHARGE CHART STYLES */

/* Re‑use global resets and typography from defendants.css */

/* Container for the second panel */
#panelCases {
  padding: 30px 20px;
  max-width: 1100px;
  margin: 0 auto 60px auto; /* extra space at bottom */
  background: #ffffff;
  border-top: 1px solid #ddd;
}

/* Override hover colours for the declined‑to‑charge section */
#hoverRace2 {
  color: #222;
}

#hoverDecl {
  color: #c2185b; /* deep pink for declined metric */
}

/* Adjust bar colours if needed via JS; canvas inherits 100% width */
canvas#declinedChart {
  max-width: 100%;
}


#hoverPop {
  color: #ff9800;
}import { cleanDefRow } from './cleanData.js';

// --- CONSTANTS -------------------------------------------------------------
const folder = './data/';

const LABELS = [
  'Hispanic or Latino',
  'White',
  'Black or African American',
  'Asian',
  'American Indian and Alaska Native',
  'Native Hawaiian and Other Pacific Islander'
];

const COLORS = {
  Declined: '#c2185b', // deep pink
  Defendants: '#007acc' // same blue as first chart
};

// --- HELPERS ---------------------------------------------------------------
async function getLatestYear () {
  const thisYear = new Date().getFullYear();
  for (let y = thisYear; y >= 2015; y--) {
    const res = await fetch(${folder}cases_${y}.xlsx, { method: 'HEAD' });
    if (res.ok) return y;
  }
  throw new Error('No cases file found');
}

function normalizeEthnicity (raw) {
  const eth = String(raw).toLowerCase();
  if (eth.includes('white')) return 'White';
  if (eth.includes('black')) return 'Black or African American';
  if (eth.includes('asian')) return 'Asian';
  if (eth.includes('hispanic') || eth.includes('latino')) return 'Hispanic or Latino';
  if (eth.includes('american indian') || eth.includes('alaska')) return 'American Indian and Alaska Native';
  if (eth.includes('hawaiian') || eth.includes('pacific')) return 'Native Hawaiian and Other Pacific Islander';
  return null;
}

// --- DATA LOAD -------------------------------------------------------------
async function loadData () {
  const year = await getLatestYear();

  // Load CASES workbook -----------------------------------------------------
  const caseBuf = await fetch(${folder}cases_${year}.xlsx).then(r => r.arrayBuffer());
  const caseWb = XLSX.read(caseBuf, { type: 'array' });
  const caseSheet = caseWb.Sheets[caseWb.SheetNames[0]];
  const caseRows = XLSX.utils.sheet_to_json(caseSheet, { defval: '' });

  const rejectedIds = new Set();
  caseRows.forEach(row => {
    const status = String(row.Status || '').toLowerCase();
    const id = row['Case ID'] || row.CaseID || row.CaseId || row.Case; // attempt to be flexible
    if (!id) return;
    if (status.includes('reject')) rejectedIds.add(String(id).trim());
  });

  // Load DEFENDANTS workbook -----------------------------------------------
  const defBuf = await fetch(${folder}defendants_${year}.xlsx).then(r => r.arrayBuffer());
  const defWb = XLSX.read(defBuf, { type: 'array' });
  const defSheet = defWb.Sheets[defWb.SheetNames[0]];
  const defRows = XLSX.utils.sheet_to_json(defSheet, { defval: '' });

  const totalCounts = {};
  const declinedCounts = {};
  let totalDefendants = 0;
  let totalDeclined = 0;

  defRows.forEach(row => {
    const d = cleanDefRow(row);
    if (!d || !d.ethnicity) return;

    const eth = normalizeEthnicity(d.ethnicity);
    if (!eth) return;

    totalCounts[eth] = (totalCounts[eth] || 0) + 1;
    totalDefendants++;

    const caseId = (d.caseId || d.caseID || d.CaseID || row['Case ID'] || '').toString().trim();
    if (rejectedIds.has(caseId)) {
      declinedCounts[eth] = (declinedCounts[eth] || 0) + 1;
      totalDeclined++;
    }
  });

  // Build data arrays -------------------------------------------------------
  const declinedData = LABELS.map(k => ((declinedCounts[k] || 0) / (totalDeclined || 1)) * 100);
  const defendantsData = LABELS.map(k => ((totalCounts[k] || 0) / (totalDefendants || 1)) * 100);

  buildChart(LABELS, declinedData, defendantsData);
}

// --- CHART -----------------------------------------------------------------
function buildChart (labels, declinedData, defendantsData) {
  const ctx = document.getElementById('declinedChart');
  const hoverRace = document.getElementById('hoverRace2');
  const hoverDecl = document.getElementById('hoverDecl');

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Declined',
          data: declinedData,
          backgroundColor: COLORS.Declined
        },
        {
          label: 'All Defendants',
          data: defendantsData,
          backgroundColor: COLORS.Defendants
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: val => val + '%'
          },
          suggestedMax: 100
        }
      },
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          enabled: false
        }
      },
      onHover: (event, elements, chart) => {
        const canvas = chart.canvas;
        const rect = canvas.getBoundingClientRect();
        const y = event.clientY - rect.top;

        const els = chart.getElementsAtEventForMode(event, 'nearest', { axis: 'y', intersect: false }, false);
        if (els.length > 0) {
          const index = els[0].index;
          hoverRace.textContent = labels[index];
          hoverDecl.textContent = ${declinedData[index].toFixed(2)}% declined;
        } else {
          hoverRace.textContent = '';
          hoverDecl.textContent = '';
        }
      }
    }
  });
}

// Kick it off
loadData(); 
ChatGPT said:

Thought for 46 seconds
HTML updated. Say “ok” and I’ll drop the combined CSS file.

You said:
ok so just btw the name of the 4 files is defendants.html defendants.css defendants.js and declined.js yeah? Actually can we do it so that its called defendantsDeclined.js ? 
ChatGPT said:

Thought for 23 seconds
Yep. We’ll use these four files:

defendants.html

defendants.css

defendants.js

defendantsDeclined.js

The HTML will link to the CSS plus both JS modules. Tell me when you want the updated HTML.

You said:
ready
ChatGPT said:

Thought for 23 seconds
HTML now points to defendants.css, defendants.js, and defendantsDeclined.js. Let me know when you want the updated JS file contents.

You said:
css then 1 js then the other js i have the html so one a ta time 
ChatGPT said:

Thought for 11 seconds
defendants.css

/* RESET + BASE */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  background: #f8f9fa;
  color: #222;
  line-height: 1.6;
}

canvas {
  max-width: 100%;
}

/* NAVBAR */
.nav {
  background: linear-gradient(90deg, #1a1c3a, #0d0e22);
  color: #fff;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.branding {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.brand-main {
  font-size: 1.6rem;
  font-weight: 700;
}

.brand-sub {
  font-size: 1.05rem;
  color: #a9b0d4;
  font-weight: 400;
}

.logo {
  height: 100px;
  width: auto;
  flex-shrink: 0;
}

/* HERO */
.hero {
  background: linear-gradient(270deg, #242673 30%, #15163d 100%);
  color: #dfe3f7;
  text-align: center;
  padding: 30px 20px;
}

.hero h1 {
  font-size: 2.2rem;
  margin-bottom: 6px;
  font-weight: 700;
}

.hero p {
  font-size: 1rem;
  color: #a9b0d4;
}

/* NAVIGATION */
.main-nav {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 25px;
  background: #ffffff;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
  font-weight: 600;
}

.main-nav a {
  text-decoration: none;
  color: #333;
  padding: 6px 10px;
  border-radius: 4px;
  transition: background 0.2s, color 0.2s;
}

.main-nav a:hover {
  background: #e0e0e0;
  color: #000;
}

.main-nav a.active {
  color: #007acc;
  border-bottom: 2px solid #007acc;
  cursor: default;
}

/* MAIN SECTION */
#panelMain {
  padding: 30px 20px;
  max-width: 1100px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 30px;
}

.dashboard-header h2 {
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 6px;
}

.dashboard-header p {
  font-size: 1.2rem;
  color: #444;
}

/* CHART AREA */
.bar-chart-box {
  padding: 30px;
}

.hover-box {
  text-align: center;
  margin-bottom: 20px;
  min-height: 70px;
}

.hover-line {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 4px 0;
}

#hoverDef {
  color: #007acc;
}

#hoverPop {
  color: #ff9800;
}

/* DECLINED-TO-CHARGE SECTION */
#panelCases {
  padding: 30px 20px;
  max-width: 1100px;
  margin: 0 auto 60px auto;
  background: #ffffff;
  border-top: 1px solid #ddd;
}

#hoverRace2 { color: #222;    }
#hoverDecl  { color: #c2185b; }
#hoverAll   { color: #007acc; }

canvas#declinedChart {
  max-width: 100%;
}
You said:
ok
ChatGPT said:

Thought for 12 seconds
defendants.js posted. Say “ok” and I’ll drop defendantsDeclined.js.

You said:
ok
ChatGPT said:

Thought for 41 seconds
defendantsDeclined.js posted. All four files are ready.

You said:
errir cabacs us akrady in use hart iwth 0 must be destoryed defore dedfantsDecliend.js can be resued at new Tn chart.js at buildChart defednatsdecliend.js at loadData defednatnsdecleind.js 
ChatGPT said:

Thought for 29 seconds
Fixed it. The declined-chart code now wipes any prior chart instance before creating a new one, so the “canvas already in use” error disappears.

You said:
so which one do i updated
ChatGPT said:


No file chosenNo file chosen
ChatGPT can make mistakes. Check important info.


Defendants
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
101
102
103
104
105
106
107
108
109
110
111
112
113
114
115
116
117
118
119
120
121
122
123
124
125
126
127
128
129
130
131
132
133
134
135
136
137
138
139
140
async function loadData () {
  try {
    const year = await findLatestYear('cases');

    // CASES ---------------------------------------------------------------
    const casesBuf  = await fetch(`${DATA_FOLDER}cases_${year}.xlsx`).then(r => r.arrayBuffer());
    const casesWb   = XLSX.read(casesBuf, { type: 'array' });
    const caseRows  = XLSX.utils.sheet_to_json(casesWb.Sheets[casesWb.SheetNames[0]], { defval: '' });

    const rejected = new Set();
    caseRows.forEach(r => {
      const status = String(r.Status || '').toLowerCase();
      const id     = (r['Case ID'] || r.CaseID || '').toString().trim();
      if (id && status.includes('reject')) rejected.add(id);
    });

    // DEFENDANTS ----------------------------------------------------------
    const defYear  = await findLatestYear('defendants');
    const defBuf   = await fetch(`${DATA_FOLDER}defendants_${defYear}.xlsx`).then(r => r.arrayBuffer());
    const defWb    = XLSX.read(defBuf, { type: 'array' });
    const defRows  = XLSX.utils.sheet_to_json(defWb.Sheets[defWb.SheetNames[0]], { defval: '' });

    const totals   = {}; // overall defendants
    const declined = {}; // declined‑to‑charge
    let totalsN = 0;
    let declinedN = 0;

    defRows.forEach(r => {
      const d = cleanDefRow(r);
      if (!d || !d.ethnicity) return;

      const eth = normalEthnicity(d.ethnicity);
      if (!eth) return;

      totals[eth] = (totals[eth] || 0) + 1;
      totalsN++;

      const id = (d.caseId || r['Case ID'] || '').toString().trim();
      if (rejected.has(id)) {
        declined[eth] = (declined[eth] || 0) + 1;
        declinedN++;
      }
    });

    const declinedData   = LABELS.map(k => ((declined[k] || 0) / (declinedN || 1)) * 100);
    const defendantsData = LABELS.map(k => ((totals[k]   || 0) / (totalsN   || 1)) * 100);

    buildChart(LABELS, declinedData, defendantsData);
  } catch (err) {
    console.error(err);
  }
}

// ---------------------------------------------------------------------------
// CHART
// ---------------------------------------------------------------------------
function buildChart (labels, declinedData, defendantsData) {
  const ctx       = document.getElementById('declinedChart');
  const hoverRace = document.getElementById('hoverRace2');
  const hoverDecl = document.getElementById('hoverDecl');
  const hoverAll  = document.getElementById('hoverAll');

  // Destroy any existing chart on this canvas to avoid "canvas already in use" error
  const existing = Chart.getChart(ctx);
  if (existing) existing.destroy();

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Declined',       data: declinedData,   backgroundColor: COLORS.Declined },
        { label: 'All Defendants', data: defendantsData, backgroundColor: COLORS.Defendants }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          ticks: { callback: v => v + '%' },
          suggestedMax: 100
        }
      },
      plugins: { legend: { position: 'top' }, tooltip: { enabled: false } },
      onHover: (evt, els, chart) => {
        const list = chart.getElementsAtEventForMode(evt, 'nearest', { axis: 'y', intersect: false }, false);
        if (list.length) {
          const i = list[0].index;
ChatGPT is generating a response...
