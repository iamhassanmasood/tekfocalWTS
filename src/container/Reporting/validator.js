import isEmpty from 'lodash/isEmpty'
export default function ReportValidation(data) {
    let errors = {}
    if (!data.siteValue ) {
        errors = `Please select a site!`
    } else if(!data.timeperiod){
        errors = `Please check required period`
    } else if(data.timeperiod==='daily' && !data.date ){
        errors = `Please choose Date`
    } else if (data.timeperiod==='weekly' && !data.week){
        errors = `Please choose a week`
    } else if(data.timeperiod==='monthly' && !data.month){
        errors = `Please choose a month`
    }
    return {
        errors,
        isValid: isEmpty(errors),
    }
}
