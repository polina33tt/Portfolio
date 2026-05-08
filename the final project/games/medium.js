window.mountGame = function(container) {
    container.innerHTML = `
        <div style="text-align:center; color:#f0f2fc;">
            <h2 style="color:#05d9e8; margin-bottom:15px;">🔲 2048</h2>
            <div style="margin-bottom:15px; font-size:1.1rem;">
                Счёт: <strong id="g2048Score" style="color:#ff2a6d;">0</strong>
            </div>
            <div id="board2048" style="
                display:grid;
                grid-template-columns:repeat(4, 80px);
                gap:8px;
                background:rgba(0,0,0,0.4);
                padding:12px;
                border-radius:16px;
                width:fit-content;
                margin:0 auto;
                border:2px solid #05d9e8;
            "></div>
            <p style="margin-top:15px; color:#a0a7c6;">Используйте стрелки ⬆️ ⬇️ ⬅️ ➡️</p>
            <button id="reset2048" class="btn secondary" style="margin-top:10px;">🔄 Заново</button>
        </div>
    `;

    const board = container.querySelector('#board2048');
    const scoreEl = container.querySelector('#g2048Score');
    const resetBtn = container.querySelector('#reset2048');

    let grid = [], score = 0;
    const colors = {
        2: '#05d9e8', 4: '#00b8d4', 8: '#ff2a6d', 16: '#e91e63',
        32: '#b300ff', 64: '#9c27b0', 128: '#ffd700', 256: '#ff9800',
        512: '#4caf50', 1024: '#00e676', 2048: '#fff'
    };

    function init() {
        grid = Array(4).fill().map(() => Array(4).fill(0));
        score = 0;
        addTile(); addTile();
        render();
    }

    function addTile() {
        const empty = [];
        for (let i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                if (grid[i][j] === 0) empty.push([i, j]);
        if (empty.length === 0) return;
        const [r, c] = empty[Math.floor(Math.random() * empty.length)];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    function render() {
        board.innerHTML = '';
        scoreEl.textContent = score;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const cell = document.createElement('div');
                const v = grid[i][j];
                cell.style.cssText = `
                    width:80px;
                    height:80px;
                    background:${v ? colors[v] || '#fff' : 'rgba(255,255,255,0.05)'};
                    border-radius:10px;
                    display:grid;
                    place-items:center;
                    font-size:${v >= 1000 ? '20px' : '26px'};
                    font-weight:bold;
                    color:${v >= 8 ? '#fff' : '#0a0c1a'};
                    box-shadow:${v ? `0 0 10px ${colors[v]}` : 'none'};
                    transition:0.15s;
                `;
                cell.textContent = v || '';
                board.appendChild(cell);
            }
        }
    }

    function slide(row) {
        let arr = row.filter(v => v);
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                score += arr[i];
                arr[i + 1] = 0;
            }
        }
        arr = arr.filter(v => v);
        while (arr.length < 4) arr.push(0);
        return arr;
    }

    function move(dir) {
        let moved = false;
        const old = JSON.stringify(grid);
        if (dir === 'left') grid = grid.map(r => slide(r));
        if (dir === 'right') grid = grid.map(r => slide(r.reverse()).reverse());
        if (dir === 'up') {
            for (let c = 0; c < 4; c++) {
                let col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
                col = slide(col);
                for (let r = 0; r < 4; r++) grid[r][c] = col[r];
            }
        }
        if (dir === 'down') {
            for (let c = 0; c < 4; c++) {
                let col = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
                col = slide(col.reverse()).reverse();
                for (let r = 0; r < 4; r++) grid[r][c] = col[r];
            }
        }
        if (JSON.stringify(grid) !== old) {
            addTile();
            render();
        }
    }

    const handler = (e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); move('left'); }
        if (e.key === 'ArrowRight') { e.preventDefault(); move('right'); }
        if (e.key === 'ArrowUp') { e.preventDefault(); move('up'); }
        if (e.key === 'ArrowDown') { e.preventDefault(); move('down'); }
    };
    document.addEventListener('keydown', handler);

    resetBtn.onclick = init;
    init();
};