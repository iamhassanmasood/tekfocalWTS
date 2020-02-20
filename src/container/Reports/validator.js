import isEmpty from 'lodash/isEmpty'
export default function ReportValidation(data) {
    let errors = {}
    if (!data.siteValue || !data.assetValue ||!data.toDate ||!data.fromDate) {
        errors = `Please Fill All Fields Are Required!!`
    } else if(data.fromDate>data.toDate){
        errors = `Please insert valid date`
    }
    return {
        errors,
        isValid: isEmpty(errors),
    }

}