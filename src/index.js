import './index.css';

async function getWeather(){
    var response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=4cdf9b1699a7b1a192527fe2c3641e33');
    var data = await response.json();
    console.log(data);
}

getWeather().catch(err => {
    console.log(err);
});