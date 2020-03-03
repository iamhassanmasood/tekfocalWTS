import isEmpty from 'lodash/isEmpty'
export default function ReportValidation(data) {
    let errors = {}
    if (!data.siteValue ||!data.timeperiod ||(data.timeperiod==='daily' && !data.date) ||(data.timeperiod==='weekly' && !data.week)|| (data.timeperiod==='monthly' && !data.month)) {
        errors = `Please Fill All Requirements!!`
    }
    return {
        errors,
        isValid: isEmpty(errors),
    }
}
