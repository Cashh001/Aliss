const pinata = document.getElementById('pinata');
const message = document.getElementById('message');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let clickCount = 0;
let clickTimeout;
let exploded = false;

pinata.addEventListener('click', () => {
  if (exploded) return;

  clickCount++;

  pinata.classList.add('shake');
  setTimeout(() => pinata.classList.remove('shake'), 500);

  clearTimeout(clickTimeout);

  if (clickCount >= 5) {
    explodePinata();
    clickCount = 0;
  } else {
    clickTimeout = setTimeout(() => {
      clickCount = 0;
    }, 1000);
  }
});

function explodePinata() {
  exploded = true;
  pinata.style.display = 'none';
  message.classList.add('show');
  runConfetti();
}

function runConfetti() {
  const confettiCount = 100;
  const confettis = [];

  for (let i = 0; i < confettiCount; i++) {
    confettis.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      speedY: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 - 5,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettis.forEach(c => {
      ctx.save();
      ctx.fillStyle = c.color;
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
      ctx.restore();

      c.y += c.speedY;
      c.rotation += c.rotationSpeed;

      if (c.y > canvas.height) {
        c.y = -c.size;
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
}
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.pointerEvents = 'none';
resizeCanvas();


function fadeOutCanvas(duration = 1000) {
  let opacity = 1;
  const step = 16 / duration;
  function fade() {
    opacity -= step;
    if (opacity <= 0) {
      canvas.style.opacity = '0';
      canvas.style.pointerEvents = 'none';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      canvas.style.opacity = opacity.toString();
      requestAnimationFrame(fade);
    }
  }
  fade();
}

const originalRunConfetti = runConfetti;
runConfetti = function() {
  originalRunConfetti();
  setTimeout(() => {
    fadeOutCanvas(1000);
    // Show the button after confetti fades out
    setTimeout(() => {
      const btn = document.createElement('button');
      btn.textContent = 'Далее';
      btn.style.opacity = '0';
      btn.style.transition = 'opacity 0.5s';
      btn.className = 'next-btn';
      message.appendChild(btn);
      setTimeout(() => { btn.style.opacity = '1'; }, 50);

      btn.addEventListener('click', () => {
  // Сдвигаем сообщение вверх (опционально)
  message.style.transition = 'transform 0.7s cubic-bezier(.4,2,.6,1)';
  message.style.transform = 'translateY(-80px)';

  btn.style.pointerEvents = 'none';

  setTimeout(() => {
    const extra = document.createElement('div');
    extra.className = 'extra-text';
    extra.style.marginTop = '20px';
    extra.style.opacity = '0';
    extra.style.transition = 'opacity 0.7s ease';
    extra.textContent = 'Здесь появится дополнительный текст.';

    message.appendChild(extra);

    setTimeout(() => {
      extra.style.opacity = '1';
    }, 50);
  }, 700);
    });
    }, 50);
  }, 1000);
};