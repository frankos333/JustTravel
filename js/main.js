
import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { geoService } from './services/geo-service.js'
import { utilService } from './services/util-service.js'
import { weatherService } from './services/weather-service.js'

locService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    locService.getPosition()
        .then(pos => {
            const lat = (!utilService.getParameterByName('lat')) ? pos.coords.latitude : parseInt(utilService.getParameterByName('lat'))
            const lng = (!utilService.getParameterByName('lng')) ? pos.coords.longitude : parseInt(utilService.getParameterByName('lng'))
            mapService.initMap(lat, lng)
                .then(() => {
                    mapService.addMarker({ lat, lng });
                    geoService.getGeoByLocation(lat, lng)
                        .then(coords => {
                            const elHdr = document.querySelector('.location-display');
                            elHdr.innerText = coords.results[0].formatted_address;
                            elHdr.id = `${lat}-${lng}`;
                        })
                })
                .catch(console.log('INIT MAP ERROR'));
        })
    locService.getPosition()
        .then(pos => pos)
        .then(pos => {
            weatherService.getWeather(pos.coords)
                .then(forecast => renderWeather(forecast))
        })
}

document.querySelector('.my-location button').addEventListener('click', () => {
    locService.getPosition()
        .then(pos => {
            mapService.panTo(pos.coords.latitude, pos.coords.longitude);
            geoService.getGeoByLocation(pos.coords.latitude, pos.coords.longitude)
                .then(coords => {
                    const elHdr = document.querySelector('.location-display');
                    elHdr.innerText = coords.results[0].formatted_address;
                    elHdr.id = `${lat}-${lng}`;
                })
            weatherService.getWeather(pos.coords)
                .then(forecast => renderWeather(forecast))
        })
})

document.querySelector('.search-btn').addEventListener('click', () => {
    let elAddress = document.querySelector('[name=location-input]')
    let address = document.querySelector('[name=location-input]').value
    if (!address) elAddress.placeholder = 'Please enter an adress'
    const joinedAdd = address.split(' ').join('+')
    geoService.getGeo(joinedAdd)
        .then(coords => {
            let lat = coords.results[0].geometry.location.lat
            let lng = coords.results[0].geometry.location.lng
            mapService.panTo(lat, lng)
            const elHdr = document.querySelector('.location-display');
            elHdr.innerText = coords.results[0].formatted_address;
            elHdr.id = `${lat}-${lng}`;

            var pos = { latitude: lat, longitude: lng }
            weatherService.getWeather(pos)
                .then(forecast => renderWeather(forecast))
        })
        .catch(err => console.log(`Please enter a valid Address`))


})

document.querySelector('.save-location').addEventListener('click', () => {
    const pos = document.querySelector('.location-display').id.split('-')
    const [lat, lng] = pos
    utilService.copyToClipboard(`https://frankos333.github.io/JustTravel/index.html?lat=${lat}&lng=${lng}`)
})



function renderWeather(forecast) {
    console.log('forecast:', forecast)
    let mainTemp = utilService.turnKelvinToCelsius(forecast.main.temp) + '℃';
    let minMaxTemp = utilService.turnKelvinToCelsius(forecast.main.temp_min) + ' to ' + utilService.turnKelvinToCelsius(forecast.main.temp_max) + ' ℃'
    let location = forecast.name + ', ' + forecast.sys.country;
    let desc = forecast.weather[0].description;
    let wind = 'wind: ' + forecast.wind.speed + ' m/s';
    const elForecast = document.querySelector('.forecast-container');
    elForecast.innerHTML = `
    <h3>Weather Today</h3>
    <img class="icon" src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" />
    <p> ${location} <img class="flag" src="https://www.countryflags.io/${forecast.sys.country}/shiny/64.png">  ${desc} </p>
    <p> <span>${mainTemp}</span> temperature from ${minMaxTemp}, ${wind} </p>
    `
}

