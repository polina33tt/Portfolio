window.mountGame = function(container) {
    container.innerHTML = `
        <div style="text-align:center; color:#f0f2fc;">
            <h2 style="color:#05d9e8; margin-bottom:15px;">🚀 Космический стрелок</h2>
            <div style="display:flex; justify-content:space-around; margin-bottom:15px; font-size:1.2rem;">
                <div>⏱ Время: <strong id="timer" style="color:#ff2a6d;">15</strong>с</div>
                <div>💥 Очки: <strong id="score" style="color:#05d9e8;">0</strong></div>
            </div>
            <div id="gameField" style="
                position:relative;
                width:100%;
                height:400px;
                background:radial-gradient(circle, #1a1f3a, #0a0c1a);
                border:2px solid #05d9e8;
                border-radius:16px;
                overflow:hidden;
                cursor:crosshair;
                box-shadow:0 0 20px rgba(5,217,232,0.3);
            "></div>
            <button id="startBtn" class="btn primary" style="margin-top:15px;">▶ Старт</button>
            <p id="status" style="margin-top:15px; color:#a0a7c6; min-height:24px;"></p>
        </div>
    `;

    const field = container.querySelector('#gameField');
    const timerEl = container.querySelector('#timer');
    const scoreEl = container.querySelector('#score');
    const startBtn = container.querySelector('#startBtn');
    const status = container.querySelector('#status');

    let score = 0, time = 15, gameTimer, spawnTimer, isPlaying = false;

    function spawnAsteroid() {
        const asteroid = document.createElement('div');
        const size = 30 + Math.random() * 30;
        asteroid.textContent = '☄️';
        asteroid.style.cssText = `
            position:absolute;
            left:${Math.random() * (field.clientWidth - size)}px;
            top:${Math.random() * (field.clientHeight - size)}px;
            font-size:${size}px;
            cursor:pointer;
            user-select:none;
            transition:transform 0.1s;
        `;
        asteroid.onclick = (e) => {
            e.stopPropagation();
            score++;
            scoreEl.textContent = score;
            asteroid.style.transform = 'scale(1.5)';
            asteroid.style.opacity = '0';
            setTimeout(() => asteroid.remove(), 100);
        };
        field.appendChild(asteroid);
        setTimeout(() => asteroid.remove(), 2000);
    }

    function startGame() {
        if (isPlaying) return;
        isPlaying = true;
        score = 0; time = 15;
        scoreEl.textContent = 0;
        timerEl.textContent = 15;
        status.textContent = '';
        field.innerHTML = '';
        startBtn.disabled = true;

        spawnTimer = setInterval(spawnAsteroid, 600);
        gameTimer = setInterval(() => {
            time--;
            timerEl.textContent = time;
            if (time <= 0) endGame();
        }, 1000);
    }

    function endGame() {
        clearInterval(gameTimer);
        clearInterval(spawnTimer);
        isPlaying = false;
        startBtn.disabled = false;
        status.innerHTML = `🏆 Игра окончена! Ваш результат: <strong style="color:#ff2a6d;">${score}</strong> астероидов`;
    }

    startBtn.onclick = startGame;
};