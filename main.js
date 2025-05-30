function openInNewTab(url) {
  const win = window.open(url, '_blank');
  if (win) win.focus();
  else alert('Please allow popups for this website.');
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('theme-switch');
  if (!btn) {
    console.error('🌙 Theme switch button not found.');
    return;
  }

  btn.addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    btn.textContent = newTheme === 'dark' ? '☀️' : '🌙';

    console.log(`🔁 Theme toggled to: ${newTheme}`);
    if (window.updateDotColors) window.updateDotColors();
  });
});

// Load topics.json
let topicsData = [];

fetch('topics.json')
  .then(res => res.json())
  .then(data => {
    topicsData = data.filter(entry => entry.topic && entry.link);
    console.log("✅ Topics loaded:", topicsData);
  })
  .catch(err => console.error("❌ Failed to load topics.json:", err));

function buildQuery(topic, board, level, qtype) {
  const boardTags = {
    oxford: '"Oxford AQA"',
    cie: '"CIE"',
    edexcel: '"Edexcel"'
  };

  let query = `site:savemyexams.com filetype:pdf "${topic}" -"Time Allowed" -"Score"`;

  if (qtype === 'Notes') {
    query += ' -"Multiple Choice Questions"';
  } else if (qtype === 'MCQ') {
    query += ' "Multiple Choice Questions"';
  } else if (qtype === 'Theory') {
    query += ' -"Multiple Choice Questions" "Theory Questions"';
  }

  if (level) query += ` "${level}"`;
  if (board && boardTags[board]) query += ` ${boardTags[board]}`;

  return query;
}

function handleFind(event) {
  event.preventDefault();

  const topic = document.getElementById('topic').value.trim();
  const board = document.getElementById('board').value;
  const level = document.getElementById('level').value;
  const qtype = document.getElementById('qtype').value;

  if (!topic) return alert('Please enter a topic.');
  if (!board) return alert('Please choose a board.');
  if (!level) return alert('Please choose a level.');
  if (!qtype) return alert('Please choose a question type.');

  const match = topicsData.find(entry =>
    entry.topic.toLowerCase().trim() === topic.toLowerCase()
  );

  if (match) {
    console.log(`📄 Matched topic found: ${match.topic}`);
    openInNewTab(match.link);
  } else {
    const query = buildQuery(topic, board, level, qtype);
    console.log(`🔍 No match — using fallback query: ${query}`);
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(query);
    openInNewTab(url);
  }
}

document.getElementById('topicForm').addEventListener('submit', handleFind);
