function openInNewTab(url) {
    const win = window.open(url, '_blank');
    if (win) win.focus();
    else alert('Please allow popups for this website.');
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-switch');
    btn.addEventListener('click', () => {
      const html = document.documentElement;
      const isLight = html.getAttribute('data-theme') === 'light';
      html.setAttribute('data-theme', isLight ? 'dark' : 'light');
      btn.textContent = isLight ? '☀️' : '🌙';
    });
  });
  
 
  function buildQuery(topic, board, level, qtype) {
    const boardTags = {
      oxford:  '"Oxford AQA"',
      cie:     '"CIE"',
      edexcel: '"Edexcel"'
    };
    
    let parts = [
      'site:savemyexams.com',
      'filetype:pdf',
      `"${topic}"`
    ];
  
    if (qtype === 'Notes') {
      parts.push('-"Multiple Choice Questions" -"Theory questions"');
    }
    else if (qtype === 'MCQ') {
      parts.push('"Multiple Choice Questions"');
      parts.push('-"Theory questions"');
    }
    else if (qtype === 'Theory') {
      parts.push('"Theory questions"');
      parts.push('-"Multiple Choice Questions"');
    }
  
    parts.push('-"Time Allowed"');
    parts.push('-"Score"');
  
    parts.push(`"${level}"`);
    parts.push(boardTags[board]);
  
    return parts.join(' ');
  }
  
  function handleFind(event) {
    event.preventDefault();
  
    const topic = document.getElementById('topic').value.trim();
    const board =  document.getElementById('board').value;
    const level =  document.getElementById('level').value;
    const qtype =  document.getElementById('qtype').value;
  
    if (!topic) return alert('Please enter a topic.');
    if (!board) return alert('Please choose a board.');
    if (!level) return alert('Please choose a level.');
    if (!qtype) return alert('Please choose a question type.');
  
    const query = buildQuery(topic, board, level, qtype);
    const url   = 'https://www.google.com/search?q=' + encodeURIComponent(query);
    openInNewTab(url);
  }
  