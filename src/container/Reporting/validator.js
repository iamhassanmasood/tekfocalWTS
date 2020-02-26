import isEmpty from 'lodash/isEmpty'
export default function ReportValidation(data) {
    let errors = {}
    if (!data.siteValue ||!data.fromDate ||!data.options) {
        errors = `Please Fill All Fields Are Required!!`
    } 
    return {
        errors,
        isValid: isEmpty(errors),
    }

}