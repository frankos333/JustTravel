console.log('Main!');

import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { geoService } from './services/geo-service.js'

locService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {
    mapService.initMap()
        .then(() => {

            mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

    locService.getPosition()
        .then(pos => {

            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

document.querySelector('.my-location button').addEventListener('click', () => {
    locService.getPosition()
        .then(pos => {
            mapService.panTo(pos.coords.latitude, pos.coords.longitude);
        })
})

document.querySelector('.search-btn').addEventListener('click', () => {
    let elAddress = document.querySelector('[name=location-input]')
    let address = document.querySelector('[name=location-input]').value
    if (!address) elAddress.placeholder = 'Please enter an adress'
    const joinedAdd = address.split(' ').join('+')
    const ansPrm = geoService.getGeo(joinedAdd)
        .then(coords => {
            mapService.panTo(coords.results[0].geometry.location.lat, coords.results[0].geometry.location.lng)
        })
        .catch(err => console.log(`Please enter a valid Address`))
})
