'use strict'
export const geoService = {
    getGeo
}

function getGeo(address) {
    var addPrm = fetch(`https://maps.googleapis.com/maps/api/geocode/json?&address=${address}&key=AIzaSyB6VnvgD2vcWlBcPoKJUvF1bAdMbdQo25M`)
        .then(coords => coords.json())
    return Promise.resolve(addPrm)
}