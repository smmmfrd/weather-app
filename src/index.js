function importAllImages(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

import './index.css';

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
 
const images = importAllImages(require.context('./images', false, /\.(png|jpe?g|svg)$/));
const content = document.querySelector('#content');

async function getWeather(location){
    var response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=4cdf9b1699a7b1a192527fe2c3641e33`);
    var data = await response.json();
    buildPage(data);
}

function buildExtra(name, value){
    let div = document.createElement('div');

    let nameDisplay = document.createElement('p');
    nameDisplay.textContent = name;
    div.appendChild(nameDisplay);

    let valueDisplay = document.createElement('h1');
    valueDisplay.textContent = value;
    div.appendChild(valueDisplay);

    return div;
}

function convertTemp(temp){
    return (temp - 273.15).toFixed(1);
}

function buildPage(data){
    // Input
    let input = document.createElement('div');
    input.id = 'input';

    let textBox = document.createElement('input');
    textBox.type = 'text';
    input.appendChild(textBox);

    content.appendChild(input);

    // Display
    let display = document.createElement('div');
    display.id = 'display';

    let weatherType = document.createElement('h2');
    weatherType.textContent = `${data.weather[0].main}`;
    display.appendChild(weatherType);

    let location = document.createElement('h3');
    location.textContent = data.name;
    display.appendChild(location);

    let date = document.createElement('p');
    let currentDate = new Date();
    date.textContent = `${weekday[currentDate.getDay()]}, ${months[currentDate.getMonth()]} ${currentDate.getDate()} ${currentDate.getFullYear()}`;
    display.appendChild(date);

    let temp = document.createElement('h1');
    temp.innerHTML = `${convertTemp(data.main.temp)} °C`;
    display.appendChild(temp);

    let weatherIcon = document.createElement('img');
    weatherIcon.style = "height: 250px; width: 250px;";
    weatherIcon.src = images['day-sunny.svg'];
    display.appendChild(weatherIcon);

    content.appendChild(display);

    // Extras
    let extras = document.createElement('div');
    extras.id = 'extras';

    let feelsLike = buildExtra('Feels Like', `${convertTemp(data.main.feels_like)} °C`);
    extras.appendChild(feelsLike);

    let humidity = buildExtra('Humidity', `${data.main.humidity}%`);
    extras.appendChild(humidity);

    let wind = buildExtra('Wind Speed', `${data.wind.speed} mph`);
    extras.appendChild(wind);

    content.appendChild(extras);
}

getWeather('riverside, ca').catch(err => {
    console.log(err);
});