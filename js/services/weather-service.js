'use strict';

export const weatherService = {
    getWeather
}


function getWeather({latitude, longitude}) {
    return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=84212711cf97e358b82730a3c4f6a10b`)
        .then(weather => weather.json());
}





