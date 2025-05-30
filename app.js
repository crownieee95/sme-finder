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
