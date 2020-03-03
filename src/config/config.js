export const BASE_URL = `https://wts.cs-satms.com`;
export const PORT = 8443;
export const SITES_API = `api/sites`;
export const REGIONS_API = `api/regions`;
export const DEVICES_API = `api/devices`;
export const ALERTS_API = `api/alerts`;
export const token = localStorage.getItem('accessToken');
export const headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token};
export const ASSET_API = `api/assets`
export const TRANSFER_ASSET = `assets_transfer?asset_id=&site_id=`
export const ASSET_BY_SITE = `assets_states_report_by_site_id?site_id=`
export const LOGIN = `o/token`
export const CLIENT_SECRET = "bm1Tjsd3awm3k3ZilIsOB3Qz1QbKOrnFfzxUvLgGtjGDswIzK5T7djRTVYNcO3nXOtacq3RtKwM2i8dZBxtkw1Onw3jcj9GVDZUuJ0MPpZJ7CgrWvOKsRu50bJHBpfSn";
export const CLIENT_ID = "3pXWuFFg18vj3SL46WDCpZ14tFC1Xl9ousG8Z4lu";
export const ReportAPI = `alerts_reporting`

var date = new Date()
var day = date.getDate()
var month =date.getMonth()
var year = date.getFullYear()
export const maxdate = year+'-'+month+'-'+day