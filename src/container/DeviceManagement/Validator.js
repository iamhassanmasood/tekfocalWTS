import isEmpty from 'lodash/isEmpty'
export default function deviceValidation(data) {
    let errors = {}
    if (!data.device_id || !data.api_key|| !data.device_name) {
        errors = `All Fields are Required`
    }

    return {
        isValid: isEmpty(errors),
        errors
    }

}