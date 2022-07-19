import './index.css';

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const content = document.querySelector('#content');

var usingCelsius = true;

async function getWeather(location){
    var response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=4cdf9b1699a7b1a192527fe2c3641e33`);

    if(response.status === 404){
        displayError(true);
    } else {
        var data = await response.json();
        buildPage(data);
        displayError(false);
    }
    
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
    var convertedToCelsius = temp - 273.15;
    return (usingCelsius ? convertedToCelsius : convertedToCelsius * 1.8 + 32).toFixed(1);
}

function buildPage(data){
    while(content.firstChild){
        content.removeChild(content.firstChild);
    }

    // Input
    let input = document.createElement('div');
    input.id = 'input';

    let textBox = document.createElement('input');
    textBox.type = 'text';

    textBox.addEventListener('keydown', (event) =>{
        if(event.key === 'Enter'){
            if(textBox.value.length > 2){
                getWeather(textBox.value);
            }
        }
    });

    input.appendChild(textBox);

    let errorDisplay = document.createElement('p');
    errorDisplay.id = 'error-display';
    errorDisplay.textContent = 'Location not found. Please enter a valid "City", "City, State", or "City, Country"';
    errorDisplay.style.display = 'none';
    input.appendChild(errorDisplay);

    let conversionButton = document.createElement('button');
    conversionButton.textContent = `Display in ${usingCelsius ? 'F' : 'C'}`
    conversionButton.addEventListener('click', () => {
        usingCelsius = !usingCelsius;
        buildPage(data);
    });
    input.appendChild(conversionButton);

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
    temp.innerHTML = `${convertTemp(data.main.temp)} °${usingCelsius ? 'C' : 'F'}`;
    display.appendChild(temp);

    let weatherIcon = document.createElement('img');
    weatherIcon.style = "height: 200px; width: 200px;";
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    display.appendChild(weatherIcon);

    content.appendChild(display);

    // Extras
    let extras = document.createElement('div');
    extras.id = 'extras';

    let feelsLike = buildExtra('Feels Like', `${convertTemp(data.main.feels_like)} °${usingCelsius ? 'C' : 'F'}`);
    extras.appendChild(feelsLike);

    let humidity = buildExtra('Humidity', `${data.main.humidity}%`);
    extras.appendChild(humidity);

    let wind = buildExtra('Wind Speed', `${data.wind.speed} mph`);
    extras.appendChild(wind);

    content.appendChild(extras);
}

function displayError(show){
    document.getElementById('error-display').style.display = show ? 'block' : 'none';
}

getWeather('riverside, ca');