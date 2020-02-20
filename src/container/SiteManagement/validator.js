import isEmpty from 'lodash/isEmpty'
export default function siteValidation(data) {
    let errors = {}
    if (!data.site_id || !data.site_name || !data.lat_lng || !data.region || !data.device ) {
        errors = `All Fields are required`
    } else if(!data.lat_lng.match(/([0-9.-]+).+?([0-9.-]+)/)){
        errors = "Please insert valid latitude and longitude"
    }

    return {
        errors,
        isValid: isEmpty(errors),
    }

}