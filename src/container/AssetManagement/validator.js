import isEmpty from 'lodash/isEmpty'
export default function assetValidation(data) {
    let errors = {}
    if (!data.asset_id || !data.asset_name || !data.asset_brand || !data.asset_owner_name || !data.asset_owner_type || !data.site) {
        errors = `All Fields are Required`
    }

    return {
        isValid: isEmpty(errors),
        errors
    }

}