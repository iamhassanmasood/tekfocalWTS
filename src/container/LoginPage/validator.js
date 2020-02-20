import isEmpty from 'lodash/isEmpty'
export default function loginValidation(data) {
    let errors = {}
    if (!data.username || !data.password) {
        errors = `Please enter valid Username and Password`
    }

    return {
        isValid: isEmpty(errors),
        errors
    }

}