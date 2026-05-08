const STORAGE = { theme: 'procrastiplay-theme', favs: 'procrastiplay-favs' };
const get = (key, def) => { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } };
const set = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const getTheme = () => get(STORAGE.theme, 'dark');
const setTheme = t => set(STORAGE.theme, t);
const getFavs = () => get(STORAGE.favs, []);
const toggleFav = id => { let f = getFavs(); f.includes(id) ? f = f.filter(i => i !== id) : f.push(id); set(STORAGE.favs, f); return f; };
const isFav = id => getFavs().includes(id);

const applyTheme = t => {
    document.documentElement.setAttribute('data-theme', t);
    const btn = document.querySelector('#themeToggle');
    if (btn) btn.textContent = t === 'dark' ? '🌙' : '☀️';
};
const initTheme = () => {
    applyTheme(getTheme());
    const btn = document.getElementById('themeToggle');
    if (btn) btn.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = cur === 'dark' ? 'light' : 'dark';
        applyTheme(next); setTheme(next);
    });
};

const GAMES = [
    { id:"space-clicker", title:"Космический стрелок", difficulty:"easy", file:"easy1", icon:"🚀", category:"Реакция", desc:"Сбивай астероиды за 15 секунд.", rules:["Кликай на астероиды","Время ограничено"], hints:["setInterval"], skills:["таймеры"] },
    { id:"color-memory", title:"Цветная память", difficulty:"easy", file:"easy2", icon:"🎨", category:"Память", desc:"Запомни последовательность цветов.", rules:["Повторяй порядок","Каждый раунд сложнее"], hints:["массивы"], skills:["запоминание"] },
    { id:"game2048", title:"Пятнашки", difficulty:"medium", file:"medium", icon:"🔲", category:"Головоломка", desc:"Собери плитки по порядку.", rules:["Перемещай плитки к пустой"], hints:["сетка"], skills:["логика"] },
    { id:"minesweeper", title:"Сапёр", difficulty:"hard", file:"hard", icon:"💣", category:"Логика", desc:"Найди все мины.", rules:["Не наступай на мину","Цифры подсказывают"], hints:["рекурсия"], skills:["алгоритмы"] }
];


if (document.getElementById('catalogGrid')) {
    const grid = document.getElementById('catalogGrid');
    const totalSpan = document.getElementById('totalCount');
    const visibleSpan = document.getElementById('visibleCount');
    const search = document.getElementById('searchInput');
    const favOnly = document.getElementById('favoritesOnly');
    const resetBtn = document.getElementById('resetFiltersBtn');
    const sortTitle = document.getElementById('sortTitleBtn');
    const sortDiff = document.getElementById('sortDiffBtn');
    let curDiff = 'all', curSort = 'default';
    const chips = document.querySelectorAll('[data-diff]');
    const setActive = v => chips.forEach(c => c.dataset.diff === v ? c.classList.add('active') : c.classList.remove('active'));
    chips.forEach(c => c.addEventListener('click', () => { curDiff = c.dataset.diff; setActive(curDiff); render(); }));
    if (sortTitle) sortTitle.addEventListener('click', () => { curSort = 'title'; render(); });
    if (sortDiff) sortDiff.addEventListener('click', () => { curSort = 'difficulty'; render(); });
    const sortGames = arr => {
        const copy = [...arr];
        if (curSort === 'title') return copy.sort((a,b) => a.title.localeCompare(b.title));
        if (curSort === 'difficulty') { const o = { easy:1, medium:2, hard:3 }; return copy.sort((a,b) => o[a.difficulty] - o[b.difficulty]); }
        return copy;
    };
    const render = () => {
        const term = search ? search.value.toLowerCase() : '';
        let filtered = GAMES.filter(g => {
            const mSearch = g.title.toLowerCase().includes(term) || g.desc.toLowerCase().includes(term);
            const mDiff = curDiff === 'all' || g.difficulty === curDiff;
            const mFav = !favOnly.checked || isFav(g.id);
            return mSearch && mDiff && mFav;
        });
        filtered = sortGames(filtered);
        grid.innerHTML = '';
        filtered.forEach(g => {
            const card = document.createElement('div'); card.className = 'game-card';
            card.innerHTML = `
                <div class="game-card-header">
                    <div class="game-icon">${g.icon}</div>
                    <div class="game-badges"><span class="badge">${g.category || 'Игра'}</span></div>
                </div>
                <h3>${g.title}</h3>
                <p>${g.desc}</p>
                <div class="game-card-footer">
                    <a href="game.html?id=${g.id}" class="btn primary">Открыть</a>
                    <button class="btn secondary fav-btn" data-id="${g.id}">${isFav(g.id) ? '★' : '☆'}</button>
                </div>
            `;
            card.querySelector('.fav-btn').addEventListener('click', (e) => { e.stopPropagation(); toggleFav(g.id); render(); });
            grid.appendChild(card);
        });
        if (totalSpan) totalSpan.textContent = GAMES.length;
        if (visibleSpan) visibleSpan.textContent = filtered.length;
    };
    if (resetBtn) resetBtn.addEventListener('click', () => { if(search) search.value=''; curDiff='all'; setActive('all'); curSort='default'; if(favOnly) favOnly.checked=false; render(); });
    if (search) search.addEventListener('input', render);
    if (favOnly) favOnly.addEventListener('change', render);
    render();
}


if (document.getElementById('gameMount')) {
    const mount = document.getElementById('gameMount');
    const restart = document.getElementById('restartGameBtn');
    const favBtn = document.getElementById('favoriteGameBtn');
    const id = new URLSearchParams(location.search).get('id');
    const game = GAMES.find(g => g.id === id);
    if (!game) mount.innerHTML = '<p>❌ Игра не найдена</p>';
    else {
        document.title = `${game.title} — ProcrastiPlay`;
        const header = document.getElementById('gameHeader');
        if (header) header.innerHTML = `<div><div class="game-badges"></div><h1>${game.icon} ${game.title}</h1><p>${game.desc}</p></div>`;
        const rulesDiv = document.getElementById('rulesBlock');
        if (rulesDiv && game.rules) rulesDiv.innerHTML = `<ul>${game.rules.map(r => `<li>${r}</li>`).join('')}</ul>`;
        const hintsDiv = document.getElementById('implementationHints');
        if (hintsDiv && game.hints) hintsDiv.innerHTML = `<ul>${game.hints.map(h => `<li>${h}</li>`).join('')}</ul>`;
        const skillsDiv = document.getElementById('skillsBlock');
        if (skillsDiv && game.skills) skillsDiv.innerHTML = `<ul>${game.skills.map(s => `<li>${s}</li>`).join('')}</ul>`;
        const updateFav = () => { if (favBtn) favBtn.textContent = isFav(game.id) ? 'Убрать из избранного' : 'В избранное'; };
        updateFav();
        if (favBtn) favBtn.onclick = () => { toggleFav(game.id); updateFav(); };

        
        const script = document.createElement('script');
        script.src = `games/${game.file}.js`;
        script.onload = () => {
            if (typeof window.mountGame === 'function') {
                window.mountGame(mount);
                if (restart) restart.onclick = () => { mount.innerHTML = ''; window.mountGame(mount); };
            } else {
                mount.innerHTML = '<p>❌ Ошибка: игра не экспортирует mountGame</p>';
            }
        };
        script.onerror = () => {
            mount.innerHTML = `<p>❌ Не удалось загрузить файл games/${game.file}.js. Проверьте путь и наличие файла.</p>`;
        };
        document.head.appendChild(script);
    }
}

initTheme();