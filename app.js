let banner = document.querySelector('.banner');
let canvas = document.getElementById('dotsCanvas');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
let ctx = canvas.getContext('2d');

// 🌗 Detect color based on theme
function getDotColor() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  return isDark ? '#ffffff' : '#000000';
}

// ❌ Calculate safe bubble around the footer
const footer = document.querySelector('.site-footer');
const footerRect = footer.getBoundingClientRect();
const bannerRect = banner.getBoundingClientRect();
const footerTop = footerRect.top + window.scrollY - bannerRect.top;
const footerBottom = footerTop + footerRect.height;
const paddingAroundFooter = 60; // 🚫 no dots within this much above/below

// 🎯 Generate dots, avoiding the footer zone
let dots = [];
for (let i = 0; i < 50; i++) {
  let x = Math.floor(Math.random() * canvas.width);
  let y;

  do {
    y = Math.floor(Math.random() * canvas.height);
    // 🔁 Try again if it's too close to the footer vertically
  } while (y > (footerTop - paddingAroundFooter) && y < (footerBottom + paddingAroundFooter));

  dots.push({
    x,
    y,
    size: Math.random() * 3 + 5,
    color: getDotColor()
  });
}

// 🖼 Draw dots only
const drawDotsOnly = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dots.forEach(dot => {
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
    ctx.fill();
  });
};

drawDotsOnly();

// 🧠 Smart lines: only draw on real mouse (not touch)
document.addEventListener('mousemove', event => {
  if (window.matchMedia('(pointer: fine)').matches) {
    drawDotsOnly();
    let mouse = {
      x: event.pageX - banner.getBoundingClientRect().left,
      y: event.pageY - banner.getBoundingClientRect().top
    };

    dots.forEach(dot => {
      let distance = Math.sqrt((mouse.x - dot.x) ** 2 + (mouse.y - dot.y) ** 2);
      if (distance < 300) {
        ctx.strokeStyle = dot.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dot.x, dot.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }
    });
  }
});

// 🧼 Clear lines on exit
window.addEventListener('mouseout', event => {
  if (!event.relatedTarget || event.relatedTarget.nodeName === 'HTML') {
    drawDotsOnly();
  }
});

// 🔁 Update dot colors on theme switch
window.updateDotColors = function () {
  dots.forEach(dot => {
    dot.color = getDotColor();
  });
  drawDotsOnly();
};

let topicsData = [];

let topicsLoaded = fetch('topics.json')
  .then(res => res.json())
  .then(data => {
    topicsData = data.filter(entry => entry.topic && entry.link);
      console.log("Loaded topics:", topicsData);
  })
  .catch(err => console.error("Failed to load topics database:", err));

function handleFind(event) {
  event.preventDefault();

  const input = document.getElementById("topic").value.trim().toLowerCase();
  const resultBox = document.querySelector(".form-box");

  // Remove previous result
  const oldResult = document.getElementById("topic-link");
  if (oldResult) oldResult.remove();

  const match = topicsData.find(entry =>
    entry.topic.toLowerCase().trim() === input
  );

  if (match) {
    // Open PDF in new tab immediately
    window.open(match.link, '_blank');

    // Optionally, show a small message to confirm
    const result = document.createElement("p");
    result.id = "topic-link";
    result.textContent = `Opening PDF for "${match.topic}"...`;
    resultBox.appendChild(result);

  } else {
    const result = document.createElement("p");
    result.id = "topic-link";
    result.textContent = "No match found. Try another spelling or phrasing.";
    resultBox.appendChild(result);
  }
}
document.getElementById('topicForm').addEventListener('submit', handleFind);
