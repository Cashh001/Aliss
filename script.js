document.addEventListener('DOMContentLoaded', () => {
    const pinata = document.getElementById('pinata');
    const clickHint = document.getElementById('clickHint');
    const message = document.getElementById('message');
    const nextBtn = document.getElementById('nextBtn');
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');

    let clickCount = 0;
    let clickTimeout;
    let isExploded = false;
    let confettiAnimationId = null;
    let particles = [];

    // Настройка canvas
    function setupCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setupCanvas();
    window.addEventListener('resize', setupCanvas);

    // Обработчик кликов
    pinata.addEventListener('click', () => {
        if (isExploded) return;

        clickCount++;

        // Анимация тряски
        pinata.style.animation = 'none';
        void pinata.offsetWidth;
        pinata.style.animation = 'shake 0.5s';

        clearTimeout(clickTimeout);

        if (clickCount >= 5) {
            explodePinata();
        } else {
            clickTimeout = setTimeout(() => {
                clickCount = 0;
            }, 1000);
        }
    });

    // Взрыв пиньяты
    function explodePinata() {
        isExploded = true;
        pinata.style.opacity = '0';
        clickHint.style.opacity = '0';

        setTimeout(() => {
            message.classList.add('show');
            initConfetti();
            animateConfetti();
        }, 300);
    }

    // Инициализация конфетти
    function initConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff9900', '#ff66cc'];

        for (let i = 0; i < 200; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: -Math.random() * canvas.height,
                size: Math.random() * 12 + 6,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 4 + 3,
                angle: Math.random() * Math.PI * 2,
                rotation: Math.random() * 0.3 - 0.15,
                shape: Math.floor(Math.random() * 3)
            });
        }
    }

    // Анимация конфетти
    function animateConfetti() {
        if (confettiAnimationId) {
            cancelAnimationFrame(confettiAnimationId);
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (Math.random() < 0.4) {
                const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff9900', '#ff66cc'];
                particles.push({
                    x: Math.random() * canvas.width,
                    y: -10,
                    size: Math.random() * 12 + 6,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    speed: Math.random() * 4 + 3,
                    angle: Math.random() * Math.PI * 2,
                    rotation: Math.random() * 0.3 - 0.15,
                    shape: Math.floor(Math.random() * 3)
                });
            }

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.fillStyle = p.color;

                switch (p.shape) {
                    case 0: // Квадрат
                        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                        break;
                    case 1: // Круг
                        ctx.beginPath();
                        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                        ctx.fill();
                        break;
                    case 2: // Сердце
                        ctx.beginPath();
                        ctx.moveTo(0, -p.size / 3);
                        ctx.bezierCurveTo(
                            p.size / 2, -p.size / 2,
                            p.size / 2, p.size / 4,
                            0, p.size / 2
                        );
                        ctx.bezierCurveTo(
                            -p.size / 2, p.size / 4,
                            -p.size / 2, -p.size / 2,
                            0, -p.size / 3
                        );
                        ctx.fill();
                        break;
                }

                ctx.restore();

                p.y += p.speed;
                p.x += Math.sin(p.y * 0.01 + p.angle) * 2;
                p.angle += p.rotation;

                if (p.y > canvas.height + 50) {
                    particles.splice(i, 1);
                    i--;
                }
            }

            if (particles.length > 400) {
                particles = particles.slice(100);
            }

            confettiAnimationId = requestAnimationFrame(animate);
        }

        animate();
    }

    // Кнопка "Далее" и шаги
    nextBtn.addEventListener('click', () => {
        const steps = [
            `
            <h2>Спасибо большое тебе!</h2>
            <p>За доброе, не сухое общение!</p>
            <p>За поддержку в нужные моменты!</p>
            <p>За 3304 кружков/голосовых сообщений!</p>
            `,
            `
            <h2>Я желаю тебе!</h2>
            <p>Делать всё, что захочешь!</p>
            <p>Набей татуировку если хочешь, заведи собаку Роа, кошечек Аврору и Афину в дальнейшем!</p>
            <p>Пускай у тебя будет больше свободного времени, чтобы играть в Sims 4, Roblox ферму!</p>
            <p>Чтобы меньше плохих дней и меньше разочарований в жизни было!</p>
            <p>А главное, чтобы этот день прошел отлично!</p>
            `,
            `
            <h2>Я горжусь тобой!</h2>
            <p>За то, что ты не зацикливаешься на плохом!</p>
            <p>За то, что ты сдала экзамены!</p>
            <p>И конечно же за то, что ты умная и веселая!</p>
            `
        ];
        let currentStep = 0;

        function renderStep(index) {
            message.innerHTML = `
                ${steps[index]}
                <button class="btn" id="nextStepBtn">Далее</button>
            `;
            document.getElementById('nextStepBtn').addEventListener('click', () => {
                currentStep++;
                if (currentStep < steps.length) {
                    renderStep(currentStep);
                } else {
                    message.innerHTML = `
                        <h2>На этом всё!</h2>
                        <p>С Днем Рождения ещё раз, Алиса!!!</p>
                        <button class="btn" id="restartBtn">Еще раз?</button>
                    `;
                    document.getElementById('restartBtn').addEventListener('click', () => {
                        location.reload();
                    });
                }
            });
        }

        message.style.transform = 'translate(-50%, -50%) scale(1.1)';
        message.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
        setTimeout(() => {
            renderStep(currentStep);
            message.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 300);
    });
});
