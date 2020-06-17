
import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { geoService } from './services/geo-service.js'
import { utilService } from './services/util-service.js'
locService.getLocs()
    .then(locs => console.log('locs', locs))

window.onload = () => {

    const lat = utilService.getParameterByName(lat)
    const lng = utilService.getParameterByName(lng)
    // if (!lat || !lng) mapService.initMap()
    mapService.initMap(lat, lng)

        .then(() => {

            mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(console.log('INIT MAP ERROR'));

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
            let lat = coords.results[0].geometry.location.lat
            let lng = coords.results[0].geometry.location.lng
            mapService.panTo(lat, lng)
            const elHdr = document.querySelector('.location-display');
            elHdr.innerText = coords.results[0].formatted_address;
            elHdr.id = `${lat}-${lng}`;
        })
        .catch(err => console.log(`Please enter a valid Address`))
})

document.querySelector('.save-location').addEventListener('click', () => {
    const pos = document.querySelector('.location-display').id.split('-')
    const [lat, lng] = pos
    utilService.copyToClipboard(`https://frankos333.github.io/JustTravel/index.html?lat=${lat}&lng=${lng}`)
})





