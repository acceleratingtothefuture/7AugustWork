import { cleanDefRow } from './cleanData.js';

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
    const res = await fetch(`${folder}cases_${y}.xlsx`, { method: 'HEAD' });
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
  const caseBuf = await fetch(`${folder}cases_${year}.xlsx`).then(r => r.arrayBuffer());
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
  const defBuf = await fetch(`${folder}defendants_${year}.xlsx`).then(r => r.arrayBuffer());
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
          hoverDecl.textContent = `${declinedData[index].toFixed(2)}% declined`;
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
