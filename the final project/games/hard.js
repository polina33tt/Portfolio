window.mountGame = function(container) {
    container.innerHTML = `
        <div style="text-align:center; color:#f0f2fc;">
            <h2 style="color:#05d9e8; margin-bottom:15px;">💣 Сапёр</h2>
            <div style="margin-bottom:15px; font-size:1.1rem;">
                💣 Мин: <strong id="mineCount" style="color:#ff2a6d;">10</strong> | 
                Статус: <strong id="mineStatus" style="color:#05d9e8;">Игра идёт</strong>
            </div>
            <div id="mineBoard" style="
                display:grid;
                grid-template-columns:repeat(9, 35px);
                gap:3px;
                background:rgba(0,0,0,0.4);
                padding:12px;
                border-radius:16px;
                width:fit-content;
                margin:0 auto;
                border:2px solid #05d9e8;
            "></div>
            <p style="margin-top:15px; color:#a0a7c6;">ЛКМ — открыть, ПКМ — флажок 🚩</p>
            <button id="resetMine" class="btn secondary" style="margin-top:10px;">🔄 Новая игра</button>
        </div>
    `;

    const board = container.querySelector('#mineBoard');
    const mineCountEl = container.querySelector('#mineCount');
    const statusEl = container.querySelector('#mineStatus');
    const resetBtn = container.querySelector('#resetMine');

    const SIZE = 9, MINES = 10;
    let grid = [], opened = [], flagged = [], gameOver = false;

    function init() {
        gameOver = false;
        statusEl.textContent = 'Игра идёт';
        statusEl.style.color = '#05d9e8';
        grid = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
        opened = Array(SIZE).fill().map(() => Array(SIZE).fill(false));
        flagged = Array(SIZE).fill().map(() => Array(SIZE).fill(false));

        let placed = 0;
        while (placed < MINES) {
            const r = Math.floor(Math.random() * SIZE);
            const c = Math.floor(Math.random() * SIZE);
            if (grid[r][c] !== -1) {
                grid[r][c] = -1;
                placed++;
            }
        }
        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                if (grid[r][c] === -1) continue;
                let count = 0;
                for (let dr = -1; dr <= 1; dr++)
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr, nc = c + dc;
                        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && grid[nr][nc] === -1) count++;
                    }
                grid[r][c] = count;
            }
        }
        mineCountEl.textContent = MINES;
        render();
    }

    function open(r, c) {
        if (gameOver || opened[r][c] || flagged[r][c]) return;
        opened[r][c] = true;
        if (grid[r][c] === -1) {
            gameOver = true;
            statusEl.textContent = '💥 Взрыв!';
            statusEl.style.color = '#ff2a6d';
            for (let i = 0; i < SIZE; i++)
                for (let j = 0; j < SIZE; j++)
                    if (grid[i][j] === -1) opened[i][j] = true;
        } else if (grid[r][c] === 0) {
            for (let dr = -1; dr <= 1; dr++)
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr, nc = c + dc;
                    if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) open(nr, nc);
                }
        }
        checkWin();
        render();
    }

    function checkWin() {
        let count = 0;
        for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < SIZE; c++)
                if (opened[r][c] && grid[r][c] !== -1) count++;
        if (count === SIZE * SIZE - MINES) {
            gameOver = true;
            statusEl.textContent = '🏆 Победа!';
            statusEl.style.color = '#05d9e8';
        }
    }

    function render() {
        board.innerHTML = '';
        const colors = ['', '#05d9e8', '#4caf50', '#ff2a6d', '#b300ff', '#ff9800', '#e91e63', '#9c27b0', '#ffd700'];
        for (let r = 0; r < SIZE; r++) {
            for (let c = 0; c < SIZE; c++) {
                const cell = document.createElement('div');
                const isOpen = opened[r][c];
                const isFlag = flagged[r][c];
                const v = grid[r][c];
                cell.style.cssText = `
                    width:35px; height:35px;
                    background:${isOpen ? 'rgba(255,255,255,0.08)' : 'rgba(5,217,232,0.15)'};
                    border:1px solid ${isOpen ? 'rgba(5,217,232,0.2)' : '#05d9e8'};
                    border-radius:5px;
                    display:grid;
                    place-items:center;
                    cursor:pointer;
                    font-weight:bold;
                    font-size:14px;
                    color:${colors[v] || '#f0f2fc'};
                    user-select:none;
                `;
                if (isOpen) {
                    if (v === -1) cell.textContent = '💣';
                    else if (v > 0) cell.textContent = v;
                } else if (isFlag) {
                    cell.textContent = '🚩';
                }
                cell.onclick = () => open(r, c);
                cell.oncontextmenu = (e) => {
                    e.preventDefault();
                    if (!gameOver && !opened[r][c]) {
                        flagged[r][c] = !flagged[r][c];
                        render();
                    }
                };
                board.appendChild(cell);
            }
        }
    }

    resetBtn.onclick = init;
    init();
};