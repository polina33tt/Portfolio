window.mountGame = function(container) {
    container.innerHTML = `
        <div style="text-align:center; color:#f0f2fc;">
            <h2 style="color:#05d9e8; margin-bottom:15px;">🎨 Цветная память</h2>
            <div style="margin-bottom:15px; font-size:1.1rem;">
                Раунд: <strong id="round" style="color:#ff2a6d;">1</strong> | 
                Счёт: <strong id="memScore" style="color:#05d9e8;">0</strong>
            </div>
            <div id="memField" style="
                display:grid;
                grid-template-columns:repeat(2, 1fr);
                gap:15px;
                max-width:320px;
                margin:0 auto 20px;
            "></div>
            <button id="memStart" class="btn primary">▶ Начать</button>
            <p id="memStatus" style="margin-top:15px; color:#a0a7c6; min-height:24px;"></p>
        </div>
    `;

    const colors = ['#ff2a6d', '#05d9e8', '#b300ff', '#ffd700'];
    const field = container.querySelector('#memField');
    const roundEl = container.querySelector('#round');
    const scoreEl = container.querySelector('#memScore');
    const startBtn = container.querySelector('#memStart');
    const status = container.querySelector('#memStatus');

    let sequence = [], userIdx = 0, round = 1, score = 0, canClick = false;
    const cells = [];

    colors.forEach((color, i) => {
        const cell = document.createElement('div');
        cell.style.cssText = `
            width:140px;
            height:140px;
            background:${color};
            border-radius:18px;
            cursor:pointer;
            opacity:0.4;
            transition:opacity 0.2s, transform 0.1s;
            box-shadow:0 0 15px ${color};
        `;
        cell.onclick = () => {
            if (!canClick) return;
            flash(i);
            if (sequence[userIdx] === i) {
                userIdx++;
                if (userIdx === sequence.length) {
                    score += round * 10;
                    scoreEl.textContent = score;
                    canClick = false;
                    status.textContent = '✅ Верно! Следующий раунд...';
                    setTimeout(nextRound, 1200);
                }
            } else {
                canClick = false;
                status.innerHTML = `❌ Ошибка! Финальный счёт: <strong style="color:#ff2a6d;">${score}</strong>`;
                startBtn.disabled = false;
            }
        };
        field.appendChild(cell);
        cells.push(cell);
    });

    function flash(i) {
        cells[i].style.opacity = '1';
        cells[i].style.transform = 'scale(1.05)';
        setTimeout(() => {
            cells[i].style.opacity = '0.4';
            cells[i].style.transform = 'scale(1)';
        }, 400);
    }

    async function showSequence() {
        canClick = false;
        status.textContent = '👀 Запоминайте...';
        await new Promise(r => setTimeout(r, 600));
        for (let n of sequence) {
            flash(n);
            await new Promise(r => setTimeout(r, 700));
        }
        canClick = true;
        userIdx = 0;
        status.textContent = '🎯 Ваш ход!';
    }

    function nextRound() {
        round++;
        roundEl.textContent = round;
        sequence.push(Math.floor(Math.random() * 4));
        showSequence();
    }

    startBtn.onclick = () => {
        sequence = [Math.floor(Math.random() * 4)];
        round = 1; score = 0; userIdx = 0;
        roundEl.textContent = 1;
        scoreEl.textContent = 0;
        startBtn.disabled = true;
        showSequence();
    };
};