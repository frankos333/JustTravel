'use strict';

export const weatherService = {
    getWeather
}


function getWeather({latitude, longitude}) {
    return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=8519f17bd88c6fddc42c03e6ce32f705`)
        .then(weather => weather.json());
}





