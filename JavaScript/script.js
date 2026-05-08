
const projectTitle = "Прогноз погод";
const projectDescription = "Веб-приложение для отображения текущей погоды";
const projectTheme = "Погода";
const projectAuthor = "Студент группы Вд-4-23";
const projectYear = 2026;
const projectVersion = "2";
const isFinished = true;
const isActive = false;
const hasError = true;
const cities = [ "Moscow", "London", "Paris", "Berlin", "Tokyo",];

console.log(projectTitle);
console.log(projectDescription);
console.log(projectTheme);
console.log(projectAuthor);
console.log(projectYear);
console.log(isFinished);
console.log(projectVersion);
console.log(cities);
console.log(cities.length);
console.log(cities[0]);



for (let i = 0; i < cities.length; i++) {
    console.log("Город [" + i + "]:", cities[i]);
}


const API_KEY      = "e8c54a17bdcfdae34d0fd69d3e37ecb8";
const CURRENT_URL  = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";


const titleElement       = document.querySelector("#projectTitle");
const descriptionElement = document.querySelector("#projectDescription");
const themeElement       = document.querySelector("#projectTheme");
const authorElement      = document.querySelector("#projectAuthor");
const yearElement        = document.querySelector("#projectYear");
const statusElement      = document.querySelector("#projectStatus");
const versionElement     = document.querySelector("#versionElement");
const detailsElement     = document.querySelector("#projectDetails");
const infoElement        = document.querySelector("#infoElement");
const warningElement     = document.querySelector("#warningMessage");

const citySelect        = document.querySelector("#citySelect");
const fetchBtn          = document.querySelector("#fetchBtn");
const currentWeatherDiv = document.querySelector("#currentWeather");
const forecastResult    = document.querySelector("#forecastResult");
const themeToggle       = document.querySelector("#themeToggle");
const loadingBar        = document.querySelector("#loadingBar");
const barInner          = document.querySelector("#barInner");


function renderProjectInfo() {
    titleElement.textContent       = projectTitle;
    descriptionElement.textContent = projectDescription;
    themeElement.textContent       = projectTheme;
    authorElement.textContent      = projectAuthor;
    yearElement.textContent        = projectYear;

    if (projectVersion === "1.0") {
        versionElement.textContent = "Первая версия";
    } else {
        versionElement.textContent = projectVersion;
    }
}

function getProjectStatusText(hasError, isActive, isFinished) {
    if (hasError === true) {
        return "Ошибка в работе проекта";
    } else if (isActive === true && isFinished === true) {
        return "Некорректное состояние проекта";
    } else if (isFinished === true) {
        return "Проект завершён";
    } else if (isActive === true) {
        return "Проект активен";
    } else {
        return "Проект находится в разработке";
    }
}

function getProjectVersionText(version) {
    if (version < 1) {
        return "Версия проекта: тестовая";
    } else if (version < 1.5) {
        return "Версия проекта: базовая";
    } else if (version < 2) {
        return "Версия проекта: улучшенная";
    } else {
        return "Версия проекта: продвинутая";
    }
}

function updateInterfaceVisibility() {
    if (hasError === true) {
        detailsElement.style.display = "none";
        warningElement.style.display = "block";
    } else {
        detailsElement.style.display = "block";
        warningElement.style.display = "none";
    }
}

function updateProject() {
    renderProjectInfo();

    statusElement.textContent = getProjectStatusText(
        hasError,
        isActive,
        isFinished
    );

    infoElement.textContent = getProjectVersionText(projectVersion);

    updateInterfaceVisibility();
}


updateProject();


function populateSelect() {
    citySelect.innerHTML = "";

    for (let i = 0; i < cities.length; i++) {
        const option = document.createElement("option");
        option.value       = cities[i];
        option.textContent = cities[i];
        citySelect.appendChild(option);
    }
}

populateSelect();


function showLoading() {
    loadingBar.classList.add("active");
    barInner.style.width = "0%";
    let w = 0;
    const interval = setInterval(function () {
        w += 5;
        barInner.style.width = w + "%";
        if (w >= 90) clearInterval(interval);
    }, 60);
    return interval;
}

function hideLoading(interval) {
    clearInterval(interval);
    barInner.style.width = "100%";
    setTimeout(function () {
        loadingBar.classList.remove("active");
        barInner.style.width = "0%";
    }, 400);
}


function displayWeather(data) {
    const iconUrl =
        "https://openweathermap.org/img/wn/" +
        data.weather[0].icon +
        "@2x.png";

    currentWeatherDiv.innerHTML =
        '<div class="current-card">' +
            '<div class="city-name">' + data.name + '</div>' +
            '<img class="weather-icon" src="' + iconUrl + '" alt="weather">' +
            '<div class="temp">🌡 ' + data.main.temp.toFixed(2) + '°C</div>' +
            '<div class="desc">' + data.weather[0].description + '</div>' +
            '<div class="wind">💨 ' + data.wind.speed + ' м/с</div>' +
        '</div>';
}

function loadWeather(city) {
    const url =
        CURRENT_URL +
        "?q=" + city +
        "&appid=" + API_KEY +
        "&units=metric" +
        "&lang=ru";

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Текущая погода:", data);
            displayWeather(data);
        })
        .catch(function (error) {
            currentWeatherDiv.innerHTML =
                '<p class="error">Ошибка: ' + error.message + '</p>';
        });
}


function displayForecast(data) {
    forecastResult.innerHTML = "";

    const grid = document.createElement("div");
    grid.className = "forecast-grid";

    for (let i = 0; i < data.list.length && i < 40; i += 8) {
        const item = data.list[i];
        const date = item.dt_txt.split(" ")[0];
        const iconUrl =
            "https://openweathermap.org/img/wn/" +
            item.weather[0].icon +
            "@2x.png";

        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML =
            '<div class="fc-date">' + date + '</div>' +
            '<img class="weather-icon" src="' + iconUrl + '" alt="weather">' +
            '<div class="fc-temp">' + item.main.temp.toFixed(2) + '°C</div>' +
            '<div class="fc-desc">' + item.weather[0].description + '</div>';

        grid.appendChild(card);
    }

    forecastResult.appendChild(grid);
}

function loadForecast(city) {
    const url = FORECAST_URL +
        "?q=" + city +
        "&appid=" + API_KEY +
        "&units=metric" +
        "&lang=ru";

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Прогноз:", data);
            displayForecast(data);
        })
        .catch(function (error) {
            forecastResult.innerHTML =
                '<p class="error">Ошибка: ' + error.message + '</p>';
        });
}


fetchBtn.addEventListener("click", function () {
    const city = citySelect.value;
    const loadInterval = showLoading();

    loadWeather(city);
    loadForecast(city);

    setTimeout(function () {
        hideLoading(loadInterval);
    }, 1500);
});


const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeToggle.checked = true;
}

themeToggle.addEventListener("change", function () {
    if (themeToggle.checked) {
        document.body.classList.add("dark-theme");
        localStorage.setItem("theme", "dark");
    } else {
        document.body.classList.remove("dark-theme");
        localStorage.setItem("theme", "light");
    }
});