import isEmpty from 'lodash/isEmpty'
export default function transferValidation(data) {
    let errors = {}
    if (!data.assetVal || !data.toSite || !data.siteVal) {
        errors = `All Fields are require`
    } else if(!data.assetVal){
        errors = `You have not selected asset`
    } else if(data.toSite === data.siteVal){
        errors = `Sorry you have selected same site`
    } 

    return {
        isValid: isEmpty(errors),
        errors
    }

}