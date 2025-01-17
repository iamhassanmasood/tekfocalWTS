import React, { Fragment, Component } from 'react'
import MarkerIcon from '../../assets/icon/map_icon.png'
import {BASE_URL, PORT, SITES_API, ASSET_BY_SITE, ALERTS_API, REGIONS_API, DEVICES_API} from '../../config/config.js'
import axios from 'axios'
import Chart from 'react-apexcharts'
import {BoxWrapper, TableWrapper, TabTitle, BoxWrapperM, mapStyles, Wrapper, TabWrapper, ChartWrapper} from './styled-component';
import PieChartIcon from '@material-ui/icons/PieChart';
import EqualizerIcon from '@material-ui/icons/Equalizer';import MapIcon from '@material-ui/icons/Map';
import './Table.css'; import InfoIcon from '@material-ui/icons/Info';
import RegisteredUnDiscoverd from '../../assets/images/Registered-Undiscovered.PNG'
import RegisteredDiscoverd from '../../assets/images/Registered-Discovered.PNG'
import UnAuthorized from '../../assets/images/Unauthorized-Entry.PNG'
import Stolen from '../../assets/images/Stolen.PNG'
import InTransit from '../../assets/images/In-Transit.PNG'
import TablePagination from '@material-ui/core/TablePagination';
import Alerticon from '@material-ui/icons/Notifications';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { compose, withProps} from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps"
import { Redirect } from "react-router-dom";
import Loading from '../../container/Loading/Loading';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';


const MapWithAMarker = compose( withProps({
    googleMapURL:"https://maps.googleapis.com/maps/api/js?key=AIzaSyCHZV-ToxlUuJbLbuMNb7NrWhZYTgfT0L8",
    loadingElement: <div style={{ height: "100%" }} />,
    containerElement: <div style={{ height: "368px" }} />,
    mapElement: <div style={{ height: "100%" }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => {
    if(!props.lat){
        return (
        <GoogleMap defaultOptions={{ styles: mapStyles }} defaultZoom={4} center={{ lat:23.6260333, lng:-102.5375005 }}>
            {/* <Marker position={{ lat:latit, lng:longit }}/> */}
        </GoogleMap>
        )} else{
        var latit = props.lat;
        var longit = props.lng;
            return (
            <GoogleMap ref={props.onMapLoad} onClick={props.onMapClick} defaultOptions={{ styles: mapStyles }} zoom={10} center={{ lat:latit, lng:longit }}>
                <Marker  icon={MarkerIcon} position={{ lat:latit, lng:longit }}/>
            </GoogleMap>
            )
        }
    })
export default class SelectComponent extends Component{ 
    _isMounted = false;
        constructor(props) {
        super(props);
        this.state={
            siteData: [],
            site:'', 
            rowsPerPag: 3,
            pag: 0,
            assetData: [],
            Alertdata: [],
            count:undefined,
            deviceData: [],
            regionData: [],
            asset: '',
            ID: 'ABC',
            flag:true, ua_asset_name:undefined, ua_site_name:undefined,
            dict: [],
            dictRU: [],
            dictRD: [],
            dictStolen: [],
            dictIntransit: [],

            options: {
            labels: ['Registered Undiscovered', 'Registered Discovered', 'UnAuthorized Entry',  'Stolen', 'In Transit'],
            colors: ["#0992e1",  "#fd3550", '#7f8281',  "#1e5aa0", "#fb551d",],
            legend: {
              position: 'bottom',
              labels: {
                  colors: 'white',
                  useSeriesColors: false
              },
            },
            responsive: [{
              breakpoint: undefined,
              options: {
                chart: {
                    sparkline: {
                        enabled: false
                  }
                }
              }
            }]
          },
            dataBySiteId: [],
            dataOfAssetStats: [],
            lat:undefined, 
            lng: undefined,
            latlng:[],
            ws:null,
            wss:null,
            redirect:false,
            done:false,
            loading:false,  
            toast:undefined,
            registeredUnDiscoveredModalState:false,        
            registeredDiscoveredModalState:false,        
            unauthModalState:false,        
            stolenModalState:false,        
            inTransitModalState:false        
        }
    }

    componentDidMount() {
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        this.setState({done:true})
        this.connect();
        this.connectAlert();
        axios.get(`${BASE_URL}:${PORT}/${SITES_API}/`, {headers})
        .then(res=> {
            if (res.status===200) {
               this.setState({ siteData : res.data.results, done:false})
               }
             })
        .catch(err =>  {
            if (err.response.data.detail === "Authentication credentials were not provided.") {
                localStorage.removeItem('accessToken');
                this.setState({redirect:true})
              } else return err
        })

        axios.get(`${BASE_URL}:${PORT}/${REGIONS_API}/`, {headers})
        .then(res=> {
        if (res.status===200) {
            this.setState({
                regionData: res.data.results,
                done:false
            })
          }
        })
        .catch(err => err)

        axios.get(`${BASE_URL}:${PORT}/${DEVICES_API}/`, {headers})
        .then(res=> {
            this.setState({loading:true})
        if (res.status===200) {
            this.setState({
                deviceData: res.data.results,
                loading:false
            })
          }
        })
        .catch(err => err)
        axios.get(`${BASE_URL}:${PORT}/${ALERTS_API}/?limit=1&offset=0`, {headers})
        .then(res=> {
            this.setState({count:res.data.count})
            var offset = this.state.count-100; 
        axios.get(`${BASE_URL}:${PORT}/${ALERTS_API}/?limit=100&offset=${offset}`, {headers})
        .then(res=> {
            if (res.status === 200) {
                var arr = res.data.results;
                var Alertdata = []
                for(var i=0; i<arr.length; i++){
                Alertdata.push({ event: arr[i].event, asset:arr[i].asset, site:arr[i].site, timestamp: arr[i].timestamp })
            }
           this.setState({
            Alertdata: Alertdata.sort((a, b)=> b.timestamp-a.timestamp),
           })
          }
        }).catch(err=> err)})
    }
    timeout = 250;

    connect = () => {
        var ws = new WebSocket(`wss://wts.cs-satms.com:8443/ws/api/states/`);
        let that = this;
        var connectInterval;
        ws.onopen = () => {
            this.setState({ ws: ws });
            that.timeout = 250;
            clearTimeout(connectInterval);
        };
        ws.onclose = e => {

            that.timeout = that.timeout + that.timeout;
            connectInterval = setTimeout(this.check, Math.min(10000, that.timeout));
        };

        ws.onerror = err => ws.close()

        ws.onmessage = e=>{
            if (e.data) {
                var data = JSON.parse(e.data);
            }

            if(this.state.assetData.length > 0){
            var index = this.state.assetData.findIndex(x => x[1] === data.message.split(",")[0]);
            
            var items = [...this.state.assetData];
            var item = {...items[index]};
    
            item[5]=data.message.split(",")[2];
            item[6]=data.message.split(",")[3];
            item[7]=data.message.split(",")[4];
            item[9]=data.message.split(",")[6];
            items[index] = item;
            this.setState({
                assetData:items
            })
          }    
        }

    };

    check = () => {
        const { ws } = this.state;
        if (!ws || ws.readyState === WebSocket.CLOSED) this.connect();
    };

    connectAlert = () => {
        var wss = new WebSocket(`wss://wts.cs-satms.com:8443/ws/api/alerts/`);
        let that = this;
        var connectInterval;
        wss.onopen = () => {
            this.setState({ wss: wss });
            that.timeout = 250;
            clearTimeout(connectInterval);
        };
        wss.onclose = e => {
            that.timeout = that.timeout + that.timeout;
            connectInterval = setTimeout(this.checkAlert, Math.min(10000, that.timeout));
        };

        wss.onerror = err => wss.close();

        wss.onmessage = e=>{
            if (e.data) {
                var data = JSON.parse(e.data);
            }
            var alertMessage = data.message;

            console.log(data.message, 'This is alert')

            if(alertMessage.length>0){
                var toastmessage;
                var {Alertdata} = this.state;
                Alertdata.unshift({asset:{ name: alertMessage.split(',')[0]}, event:alertMessage.split(',')[1], site:{name: alertMessage.split(',')[2]}, timestamp:alertMessage.split(',')[3]})
                this.setState({Alertdata})

                    if(alertMessage.split(',')[1] === "Link Up" || alertMessage.split(',')[1] === "Link Down" ){
                        toastmessage = alertMessage.split(',')[2]+' is '+ alertMessage.split(',')[1]
                        this.setState({Alertdata, toast:toastmessage})
                    }
                    else{
                        toastmessage = alertMessage.split(',')[0]+' is '+ alertMessage.split(',')[1]
                        this.setState({Alertdata, toast:toastmessage})
                    }
                    if(alertMessage.split(',')[1] === "Registered Undiscovered" ){
                        this.setState({flag:false})
                        const dictionaryDataRU = [...this.state.dictRU]
                        dictionaryDataRU.push({asset_name:  alertMessage.split(',')[0],site_name: alertMessage.split(',')[2], status:'Registered Undiscovered'})
                        this.setState({dictRU:dictionaryDataRU})
                    }
                    if(alertMessage.split(',')[1] === "Registered Discovered" ){
                        this.setState({flag:false})
                        const dictionaryDataRD = [...this.state.dictRD]
                        dictionaryDataRD.push({asset_name:  alertMessage.split(',')[0],site_name: alertMessage.split(',')[2], status:'Registered Discovered'})
                        this.setState({dictRD:dictionaryDataRD})
                    }
                    if(alertMessage.split(',')[1] === "Unauthorized " ){
                        this.setState({flag:false})
                        const dictionaryData = [...this.state.dict]
                        dictionaryData.push({asset_name:  alertMessage.split(',')[0],site_name: alertMessage.split(',')[2], status:'Unauthorized'})
                        this.setState({dict:dictionaryData})
                    }
                    if(alertMessage.split(',')[1] === "Stolen" ){
                        this.setState({flag:false})
                        const dictionaryDataStolen = [...this.state.dictStolen]
                        dictionaryDataStolen.push({asset_name:  alertMessage.split(',')[0],site_name: alertMessage.split(',')[2], status:'Stolen'})
                        this.setState({dictStolen:dictionaryDataStolen})
                    }
                    if(alertMessage.split(',')[1] === "Intransit " ){
                        this.setState({flag:false})
                        const dictionaryDataIntransit = [...this.state.dictIntransit]
                        dictionaryDataIntransit.push({asset_name:  alertMessage.split(',')[0],site_name: alertMessage.split(',')[2], status:'Intransit'})
                        this.setState({dictIntransit:dictionaryDataIntransit})
                    }
                   

                if(this.state.toast){
                    toast.error(this.state.toast)
                }
                setTimeout(()=> this.setState({toast:undefined}), 0)
            }
          }
    };

    checkAlert = () => {
        const { wss } = this.state;
        if (!wss || wss.readyState === WebSocket.CLOSED) this.connect();
    };
    

    handleChangePag = (event, newPage) => {
        this.setState({pag: newPage});
      }
    
    handleChangeRowsPerPag = event => {
        this.setState({rowsPerPag: +event.target.value, pag: 0});
      }

    handleSite=()=>{
        var e = document.getElementById("sitee");
        var result = e.options[e.selectedIndex].value;
        this.setState({
            site:result,
            asset:'',
        })
        this.handleAsset(result);
      }
        
    handleAsset=(id)=>{
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        axios.get(`${BASE_URL}:${PORT}/${ASSET_BY_SITE}${id}`, {headers})
        .then(res=> {
            if (res.status===200) {
                this.setState({
                    assetData : res.data,
                 })
                }
            })
        .catch(err =>err)

        /**site data by Site id */
        axios.get(`${BASE_URL}:${PORT}/${SITES_API}/${id}/`, {headers})
        .then(res=> {
            this.setState({
                dataBySiteId : res.data,
                }) 
                if (this.state.dataBySiteId.length !== 0){
                    var latitude = parseFloat(this.state.dataBySiteId.lat_lng.split(',')[0]);
                    var longitude = parseFloat(this.state.dataBySiteId.lat_lng.split(',')[1]);
                    this.setState({
                        lat:latitude,
                        lng: longitude
                    })
                }
            })
        .catch(err =>err)
      }
    handleAst=()=>{
        var e = document.getElementById("assete");
        var result = e.options[e.selectedIndex].value;
            this.setState({
                asset:result
            })
      }

      shouldComponentUpdate(nextProps, nextState) {
        if(this.state.toast !== nextState.toast) {
            return false
       }
       return true
     }

     timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var time = date +'-'+ month + '-'+ year + ' ' + hour + ':' + min;
        return time;
      }

      toggleRegisteredUnDiscoveredModal(){
          this.setState({
            registeredUnDiscoveredModalState:true
          })
      }
      toggleRegisteredDiscoveredModal(){
          this.setState({
            registeredDiscoveredModalState:true
          })
      }
      toggleUnAuthModal(){
          this.setState({
            unauthModalState:true
          })
      }
      toggleStolenModal(){
          this.setState({
            stolenModalState:true
          })
      }
      toggleInTransitModal(){
          this.setState({
            inTransitModalState:true
          })
      }
    

    render() {

        const {siteData, site, assetData, Alertdata, asset, dataBySiteId, pag, rowsPerPag, done, loading, unauthModalState, flag} = this.state;
        const sites = siteData.map((site, i)=>(
            <option id="sitenamefromid" key= {i} value={site.id}> {site.site_name} </option>))
        const assets = assetData.map((ast, i)=>(
            <option key={i} value={ast[10]}>{ast[1]}</option>))
            
        var arr = [];
        let assetStatsArr = arr.concat(this.state.assetData);
         for(let i=0; i<assetStatsArr.length; i++){
             arr.unshift({battery: assetStatsArr[i][5], temp:assetStatsArr[i][6], motion:assetStatsArr[i][7], type:assetStatsArr[i][9].replace("_"," ").toUpperCase()})
            }
            var finalArray = []
            for(var i=0; i<assetStatsArr.length; i++){
                finalArray.push(assetStatsArr[i][9])
            }
            let ru = finalArray.filter(item=> item==="registered_undiscovered" )
            let rd = finalArray.filter(item=> item==="registered_discovered" )
            let st = finalArray.filter(item=> item==="stolen" )
            let it = finalArray.filter(item=> item==="intransit" )
            let ua = finalArray.filter(item=> item==="unauthorized")
            let finalPie = [ru.length, rd.length, ua.length, st.length, it.length]
        
        var AssetInfoArr = [];
          for(let i=0; i<assetStatsArr.length; i++){
            AssetInfoArr.unshift({
                asset_id: assetStatsArr[i][0], asset :assetStatsArr[i][1], 
                asset_brand:assetStatsArr[i][2], asset_owner_name: assetStatsArr[i][3], 
                asset_owner_type :assetStatsArr[i][4],battery:assetStatsArr[i][5], 
                temperature:assetStatsArr[i][6], motion:assetStatsArr[i][7], 
                timestamp:assetStatsArr[i][8], type:assetStatsArr[i][9], id:assetStatsArr[i][10] })
           }
        var index = AssetInfoArr.findIndex(x => x.id === parseInt(this.state.asset) );
        var idof = AssetInfoArr[index];
        var timeNow;
        if(!dataBySiteId.timestamp){
            timeNow = '';
           } else{      
            timeNow = this.timeConverter(dataBySiteId.timestamp);
           }
        var AssetTimeNow;
        if(!dataBySiteId.timestamp){
            timeNow = '';
        } else{      
            AssetTimeNow = this.timeConverter(dataBySiteId.timestamp);
        }
        var rName = this.state.regionData[this.state.regionData.findIndex(x => x.id=== parseInt(dataBySiteId.region))]
        if(rName){
            var region_name = rName.region_name;
        }
        var dName = this.state.deviceData[this.state.deviceData.findIndex(x => x.id=== parseInt(dataBySiteId.device))]
        if(dName){
            var device_name = dName.device_name;
        }
        
        const rowsAlert = Alertdata.slice(pag * rowsPerPag, pag * rowsPerPag + rowsPerPag).map((alert, i)=>{
            var AlertTimeNow;
            if(!alert.timestamp){
                AlertTimeNow = '';
            } else{      
                AlertTimeNow = this.timeConverter(alert.timestamp);
            }

        return <tr key={i}>
            <td>{i+1+rowsPerPag*pag}</td>
            <td>{alert.event}</td>
            {alert.site? <td>{alert.site.name}</td>:<td>-</td>}
            {alert.asset? <td>{alert.asset.name}</td>:<td>-</td>}
            <td>{AlertTimeNow}</td>
        </tr>
        })

        if(this.state.redirect){
            return <Redirect to='/login'/>
        }
        let RegisteredUnDiscoveredArray =[];
        for(let i=0; i<assetStatsArr.length; i++){
            if(assetStatsArr[i][9] === "unauthorized"){
                RegisteredUnDiscoveredArray.push({asset_id: assetStatsArr[i][0], asset_name: assetStatsArr[i][1], site: '-', type: assetStatsArr[i][9]})
            }
            
        }
        

        var rumod = RegisteredUnDiscoveredArray.map((item, i)=> <tr key={i}>
            <td>{item.asset_id}</td>
            <td>{item.asset_name}</td>
            <td>{item.site}</td>
            <td>{item.type}</td>
        </tr>)


        let RegisteredDiscoveredArray =[];
        for(let i=0; i<assetStatsArr.length; i++){
            if(assetStatsArr[i][9] === "unauthorized"){
                RegisteredDiscoveredArray.push({asset_id: assetStatsArr[i][0], asset_name: assetStatsArr[i][1], site: '-', type: assetStatsArr[i][9]})
            }
            
        }
        
        var rdmod = RegisteredDiscoveredArray.map((item, i)=> <tr key={i}>
            <td>{item.asset_id}</td>
            <td>{item.asset_name}</td>
            <td>{item.site}</td>
            <td>{item.type}</td>
        </tr>)
        let unAuthArray =[];
        for(let i=0; i<assetStatsArr.length; i++){
            if(assetStatsArr[i][9] === "unauthorized"){
                unAuthArray.push({asset_id: assetStatsArr[i][0], asset_name: assetStatsArr[i][1], site: '-', type: assetStatsArr[i][9]})
            }
            
        }

        var unauthmod = unAuthArray.map((item, i)=> <tr key={i}>
            <td>{item.asset_id}</td>
            <td>{item.asset_name}</td>
            <td>{item.site}</td>
            <td>{item.type}</td>
        </tr>)

        let stolenArray =[];
        for(let i=0; i<assetStatsArr.length; i++){
            if(assetStatsArr[i][9] === "unauthorized"){
                stolenArray.push({asset_id: assetStatsArr[i][0], asset_name: assetStatsArr[i][1], site: '-', type: assetStatsArr[i][9]})
            }
            
        }
        
        var stolenmod = stolenArray.map((item, i)=> <tr key={i}>
            <td>{item.asset_id}</td>
            <td>{item.asset_name}</td>
            <td>{item.site}</td>
            <td>{item.type}</td>
        </tr>)

        let inTransitArray =[];
        for(let i=0; i<assetStatsArr.length; i++){
            if(assetStatsArr[i][9] === "unauthorized"){
                inTransitArray.push({asset_id: assetStatsArr[i][0], asset_name: assetStatsArr[i][1], site: '-', type: assetStatsArr[i][9]})
            }
            
        }
        
        var itmod = inTransitArray.map((item, i)=> <tr key={i}>
            <td>{item.asset_id}</td>
            <td>{item.asset_name}</td>
            <td>{item.site}</td>
            <td>{item.type}</td>
        </tr>)

        return (
            <Fragment>
            {done?<Loading/>: 
                <Fragment>
                    <Wrapper className="col-lg-12">
                        <Wrapper className="row">
                            <Wrapper className="col-lg-6 ">
                                <Wrapper className="apna-box">
                                    <select id="sitee" className="form-control" name ="siteId" value={site} onChange={this.handleSite}>
                                        <option className="brave" value="" disabled defaultValue>Select Site</option>
                                        {sites}
                                    </select>
                                </Wrapper>
                            </Wrapper>
                            <Wrapper className="col-lg-6 ">
                                <Wrapper className="apna-box">
                                    {!site ?  <select style={{color:'gray'}} id="assete" className="form-control" name ="siteId" disabled value={asset}>
                                        <option  className="brave" value="" disabled defaultValue>Please Select A Site</option>
                                        {assets} </select> :loading ? <select style={{color:'gray'}} id="assete" disabled className="form-control" name ="siteId" value={asset}>
                                        <option  className="brave" value="" disabled defaultValue>Loading.... </option>
                                        {assets}</select>:assetData.length === 0 ?  <select style={{color:'gray'}} id="assete" disabled className="form-control" name ="siteId" value={asset}>
                                        <option  className="brave" value="" disabled defaultValue>Selected site has no asset </option>
                                        {assets}</select> : <select id="assete" className="form-control" name ="siteId" value={asset} onChange={this.handleAst}>
                                        <option  className="brave" value="" disabled defaultValue>Select Asset </option>
                                        {assets}
                                    </select>}
                                </Wrapper>
                            </Wrapper>
                        </Wrapper>
                    </Wrapper>

                    <Wrapper className="col-lg-12">
                        <Wrapper className="adjustment">
                            {site?<main className="mycards">
                                <Wrapper className="mycontent" onClick={this.toggleRegisteredUnDiscoveredModal.bind(this)} style={{cursor:'pointer'}}>
                                    <Wrapper className="col-sm-8"><h1 style={{color:'#0992e1'}}>{ru.length}</h1><span><p style={{fontSize:'14px'}}>Registered Undiscovered</p></span></Wrapper>
                                    <Wrapper className="col-sm-4"><img alt={"Registered Undiscovered"} src ={RegisteredUnDiscoverd}/></Wrapper>
                                </Wrapper>

                                <Wrapper className="mycontent" onClick={this.toggleRegisteredDiscoveredModal.bind(this)} style={{cursor:'pointer'}}>
                                    <Wrapper className="col-sm-8"><h1 style={{color:'#fd3550'}}>{rd.length}</h1><span><p style={{fontSize:'14px'}}>Registered Discovered</p></span></Wrapper>
                                    <Wrapper className="col-sm-4"><img alt={"Registered Discovered"} src ={RegisteredDiscoverd}/></Wrapper>
                                </Wrapper>
                                
                                
                                <Wrapper className="mycontent" onClick={this.toggleUnAuthModal.bind(this)} style={{cursor:'pointer'}}>    
                                    <Wrapper className="col-sm-8"><h1 style={{color:'#7f8281'}}>{ua.length}</h1><span><p style={{fontSize:'14px'}}>UnAuthorized Entry</p></span></Wrapper>
                                    <Wrapper className="col-sm-4"><img alt={"UnAuthorized Entry"} src ={UnAuthorized}/></Wrapper>
                                </Wrapper>

                                <Wrapper className="mycontent" onClick={this.toggleStolenModal.bind(this)} style={{cursor:'pointer'}}>
                                    <Wrapper className="col-sm-8"><h1 style={{color:'#1e5aa0'}}>{st.length}</h1><span><p style={{fontSize:'14px'}}>Stolen</p></span></Wrapper>
                                    <Wrapper className="col-sm-4"><img alt={"Stolen"} src ={Stolen}/></Wrapper>
                                </Wrapper>
                                
                                
                                <Wrapper className="mycontent" onClick={this.toggleInTransitModal.bind(this)} style={{cursor:'pointer'}}>
                                    <Wrapper className="col-sm-8"><h1 style={{color:'#fb551d'}}>{it.length}</h1><span><p style={{fontSize:'14px'}}>In Transit</p></span></Wrapper>
                                    <Wrapper className="col-sm-4"><img alt={"In Transit"} src ={InTransit}/></Wrapper>
                                </Wrapper>

                            </main>:

                            <main className="mycards">
                                <Wrapper className="mycontent">
                                    <Wrapper className="col-sm-8"><h1 style={{color:'#0992e1'}}>{ru.length}</h1><span><p style={{fontSize:'14px'}}>Registered Undiscovered</p></span></Wrapper>
                                    <Wrapper className="col-sm-4"><img alt={"Registered Undiscovered"} src ={RegisteredUnDiscoverd}/></Wrapper>
                                </Wrapper>

                                <Wrapper className="mycontent">
                                    <Wrapper className="col-sm-8"><h1 style={{color:'#fd3550'}}>{rd.length}</h1><span><p style={{fontSize:'14px'}}>Registered Discovered</p></span></Wrapper>
                                    <Wrapper className="col-sm-4"><img alt={"Registered Discovered"} src ={RegisteredDiscoverd}/></Wrapper>
                                </Wrapper>

                                <Wrapper className="mycontent">    
                                    <Wrapper className="col-sm-8"><h1 style={{color:'#7f8281'}}>{ua.length}</h1><span><p style={{fontSize:'14px'}}>UnAuthorized Entry</p></span></Wrapper>
                                    <Wrapper className="col-sm-4"><img alt={"UnAuthorized Entry"} src ={UnAuthorized}/></Wrapper>
                                </Wrapper>
                                
                                
                                <Wrapper className="mycontent">
                                    <Wrapper className="col-sm-8"><h1 style={{color:'#1e5aa0'}}>{st.length}</h1><span><p style={{fontSize:'14px'}}>Stolen</p></span></Wrapper>
                                    <Wrapper className="col-sm-4"><img alt={"Stolen"} src ={Stolen}/></Wrapper>
                                </Wrapper>
                                
                                
                                <Wrapper className="mycontent">
                                    <Wrapper className="col-sm-8"><h1 style={{color:'#fb551d'}}>{it.length}</h1><span><p style={{fontSize:'14px'}}>In Transit</p></span></Wrapper>
                                    <Wrapper className="col-sm-4"><img alt={"In Transit"} src ={InTransit}/></Wrapper>
                                </Wrapper>
                            </main>}
                        </Wrapper>
                    </Wrapper>

                    <Wrapper className="col-lg-12">
                        <Wrapper className="row">
                            <Wrapper className="col-lg-8">
                                <BoxWrapperM className="apna-box">
                                    <ChartWrapper>
                                        <MapIcon  fontSize="small" /><TabTitle>Site Location</TabTitle>
                                    </ChartWrapper>
                                    <Wrapper>
                                    <MapWithAMarker
                                        isMarkerShown
                                        lat = {this.state.lat}
                                        lng = {this.state.lng}
    
                                    />
                                    </Wrapper>
                                </BoxWrapperM>
                            </Wrapper>

                            <TableWrapper className="col-lg-4">
                                <BoxWrapperM className="apna-box" >
                                    <ChartWrapper><PieChartIcon fontSize="small" /><TabTitle>Site Summary</TabTitle></ChartWrapper>
                                    <Chart options={this.state.options}  
                                        series={finalPie} type="pie" width={`100%`} height={400}  />
                                </BoxWrapperM>
                            </TableWrapper>
                        </Wrapper>
                    </Wrapper>

                    <Wrapper className="col-lg-12">
                        <BoxWrapper className="apna-box">
                            <TabWrapper>
                                <InfoIcon fontSize="small" />
                                <TabTitle>Site Information</TabTitle>
                            </TabWrapper>
                                <table className="apna-table">
                                    <thead>
                                        <tr>
                                            <th>Site Id</th>
                                            <th>Site Name</th>
                                            <th>Location</th>
                                            <th>Region</th>
                                            <th>Device</th>
                                            <th>Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataBySiteId.length<1 ?undefined:  <tr>
                                            <td>{dataBySiteId.site_id}</td>
                                            <td>{dataBySiteId.site_name}</td>
                                            <td>{dataBySiteId.lat_lng}</td>
                                            <td>{region_name}</td>
                                            <td>{device_name}</td>
                                            <td>{timeNow}</td>
                                        </tr>}
                                    </tbody>
                                </table>
                        </BoxWrapper>
                                {dataBySiteId.length === 0 ? <p className="flexi" style={{color:'red'}}> No Site Selected</p>: ""}
                    </Wrapper>

                    <Wrapper className="col-lg-12">
                        <Wrapper className="row">
                            <TableWrapper className="col-lg-6">
                                <BoxWrapper className="apna-box">
                                    <TabWrapper>
                                        <EqualizerIcon fontSize="small" />
                                        <TabTitle>Asset State
                                        </TabTitle>
                                    </TabWrapper>
                                    <table className= "apna-table">
                                        <thead>
                                            <tr>
                                                <th>Battery</th>
                                                <th>Temperature</th>
                                                <th>Motion</th>
                                                <th>State</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(index>=0)? <tr>
                                                {parseInt(idof.battery)===0XFF? <td>N/A</td>:<td>{idof.battery}%</td>}
                                                {parseInt(idof.temperature)===0XFFFF? <td>N/A</td>:<td>{idof.temperature}°C</td>}
                                                {parseInt(idof.motion)===0XF? <td>N/A</td>: parseInt(idof.motion) === 0? <td>No</td>:<td>Yes</td>}
                                                <td>{idof.type.replace("_"," ").toUpperCase()}</td>
                                            </tr>:undefined}
                                        </tbody>
                                    </table>
                                </BoxWrapper>
                            </TableWrapper>
                            <TableWrapper className="col-lg-6">
                                <BoxWrapper className="apna-box">
                                    <TabWrapper>
                                        <InfoIcon fontSize="small" />
                                        <TabTitle>Asset Information</TabTitle>
                                    </TabWrapper>
                                    <table className= "apna-table">
                                        <thead>
                                        <tr>
                                            <th>Asset Id</th>
                                            <th>Asset Name</th>
                                            <th>Created At</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            {(index>=0)? <tr>
                                                <td>{idof.asset_id}</td>
                                                <td>{idof.asset}</td>
                                                <td>{AssetTimeNow}</td>
                                            </tr>:undefined}
                                        </tbody>
                                    </table>
                                </BoxWrapper>
                            </TableWrapper>
                        </Wrapper>
                        {!asset ? <p className="flexi" style={{color:'red'}}> No Asset Selected</p>: ""}
                    </Wrapper>
                    
                    <Wrapper className="col-lg-12">
                        <BoxWrapper className="apna-box">
                            <TabWrapper>
                                <Alerticon fontSize="small" />
                                <TabTitle>Alerts</TabTitle>
                            </TabWrapper>
                            <table className= "apna-table">
                                <thead>
                                    <tr>
                                        <th style={{width:'10%'}}>Sr#</th>
                                        <th style={{width:'25%'}}>Event</th>
                                        <th style={{width:'20%'}}>Site</th>
                                        <th style={{width:'20%'}}>Asset</th>
                                        <th style={{width:'25%'}}>Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rowsAlert}
                                </tbody>
                            </table>
                                {Alertdata.length>3 ?<TablePagination 
                                style={{ color:'white',  backgroundColor:'#1b1b1b'}}
                                rowsPerPageOptions={[3, 5, 10, 15]}
                                component="div"
                                count={Alertdata.length}
                                rowsPerPage={rowsPerPag}
                                page={this.state.pag}
                                onChangePage={this.handleChangePag}
                                onChangeRowsPerPage={this.handleChangeRowsPerPag}
                                labelRowsPerPage={'Alerts'}
                                />:''}
                        </BoxWrapper>
                    </Wrapper>
                    <ToastContainer position="top-right"
                        autoClose={5000}
                        hideProgressBar
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnVisibilityChange
                        draggable
                        pauseOnHover/>
                    <Wrapper className="col-lg-12">
                        <Wrapper className='toxt'>
                            <footer>© 2020 Cellsenal, All rights reserved</footer>
                        </Wrapper>
                    </Wrapper>

                    <Modal isOpen={this.state.registeredUnDiscoveredModalState} toggle={this.toggleRegisteredUnDiscoveredModal} backdrop={false} size='lg'>
                        <ModalHeader  toggle={()=>this.setState({registeredUnDiscoveredModalState:false})}> Registered UnDiscoverd Assets </ModalHeader>
                        <ModalBody> 
                            {unAuthArray.length===0?<p style={{color:'red', fontWeight:'bold'}}> No Registered UnDiscoverd Asset Available</p>:''}
                                    {unAuthArray.length!==0? <table className= "new-table border">
                                        <thead>
                                            <tr>
                                                <th  style={{width:'15%'}}>Asset Id</th>
                                                <th style={{width:'20%'}}>Asset Name</th>
                                                <th style={{width:'20%'}}>Site</th>
                                                <th style={{width:'35%'}}>States</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {unauthmod}
                                        </tbody>
                                    </table>:undefined}
                        </ModalBody>                    
                    </Modal>
                    <Modal isOpen={this.state.registeredDiscoveredModalState} toggle={this.toggleRegisteredDiscoveredModal} backdrop={false} size='lg'>
                    <ModalHeader  toggle={()=>this.setState({registeredDiscoveredModalState:false})}> Registered Discoverd Assets </ModalHeader>
                        <ModalBody> 
                            {RegisteredDiscoveredArray.length===0?<p style={{color:'red', fontWeight:'bold'}}> No Registered Discoverd Asset Available</p>:''}
                                    {RegisteredDiscoveredArray.length!==0? <table className= "new-table border">
                                        <thead>
                                            <tr>
                                                <th  style={{width:'15%'}}>Asset Id</th>
                                                <th style={{width:'20%'}}>Asset Name</th>
                                                <th style={{width:'20%'}}>Site</th>
                                                <th style={{width:'35%'}}>States</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rdmod}
                                        </tbody>
                                    </table>:undefined}
                        </ModalBody>                       
                    </Modal>

                    <Modal isOpen={unauthModalState} toggle={this.toggleUnAuthModal} backdrop={false} size='lg'>
                    <ModalHeader  toggle={()=>this.setState({unauthModalState:false})}> UnAuthorized Assets </ModalHeader>
                        <ModalBody> 
                            {unAuthArray.length===0?<p style={{color:'red', fontWeight:'bold'}}> No UnAuthorized Asset Available</p>:''}
                                    {unAuthArray.length!==0? <table className= "new-table border">
                                        <thead>
                                            <tr>
                                                <th  style={{width:'15%'}}>Asset Id</th>
                                                <th style={{width:'20%'}}>Asset Name</th>
                                                <th style={{width:'20%'}}>Site</th>
                                                <th style={{width:'35%'}}>States</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {unauthmod}
                                        </tbody>
                                    </table>:undefined}
                        </ModalBody>                    
                    </Modal>

                    <Modal isOpen={this.state.stolenModalState} toggle={this.toggleStolenModal} backdrop={false} size='lg'>
                        <ModalHeader  toggle={()=>this.setState({stolenModalState:false})}> Stolen Assets </ModalHeader>
                        <ModalBody> 
                            {stolenArray.length===0?<p style={{color:'red', fontWeight:'bold'}}> No Stolen Asset Available</p>:''}
                                    {stolenArray.length!==0? <table className= "new-table border">
                                        <thead>
                                            <tr>
                                                <th  style={{width:'15%'}}>Asset Id</th>
                                                <th style={{width:'20%'}}>Asset Name</th>
                                                <th style={{width:'20%'}}>Site</th>
                                                <th style={{width:'35%'}}>States</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stolenmod}
                                        </tbody>
                                    </table>:undefined}
                        </ModalBody>                    
                    </Modal>
                    <Modal isOpen={this.state.inTransitModalState} toggle={this.toggleInTransitModal} backdrop={false} size='lg'>
                        <ModalHeader  toggle={()=>this.setState({inTransitModalState:false})}> InTransit Assets </ModalHeader>
                        <ModalBody> 
                            {unAuthArray.length===0?<p style={{color:'red', fontWeight:'bold'}}> No InTransit Asset Available</p>:''}
                                    {unAuthArray.length!==0? <table className= "new-table border">
                                        <thead>
                                            <tr>
                                                <th  style={{width:'15%'}}>Asset Id</th>
                                                <th style={{width:'20%'}}>Asset Name</th>
                                                <th style={{width:'20%'}}>Site</th>
                                                <th style={{width:'35%'}}>States</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {unauthmod}
                                        </tbody>
                                    </table>:undefined}
                        </ModalBody>                    
                    </Modal>

                </Fragment>}
            </Fragment>
        )
    }
}

