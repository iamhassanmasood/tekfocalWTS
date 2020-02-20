import React, { Fragment, Component } from 'react'
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';import Button from '@material-ui/core/Button'; import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add'
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import Fab from '@material-ui/core/Fab'; import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import TablePagination from '@material-ui/core/TablePagination';
import {Wrapper, Table, TableRow, TableBody, TableData, TableHead, TableHeadings, HeadingTag, Break} from '../Dashboard/StyledCompo';
import {BASE_URL, PORT, SITES_API, REGIONS_API, DEVICES_API} from '../../config/config'
import axios from 'axios'
import siteValidation from './validator'
import Loading from '../Loading/Loading';
import { Redirect } from "react-router-dom";

var token = localStorage.getItem('accessToken');
var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
export default class SiteManagementComponent extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = { 
            data: [],
            deviceData: [],
            regionData: [],
            openaddmodal:false,
            isOpen:false,
            opendeleteModal:false,
            backdrop: true,
            site_id: "",
            site_name:'',
            lat_lng:'',
            region:'',
            device:'',
            page: 0,
            rowsPerPage: 10,
            timestamp: Math.floor(Date.now()/1000),
            id: "",
            delId: '',
            isSubmitted: false,
            errors: undefined,
            done: false,
            redirect:false  
        }
      }

    removerow = () => {
        this._isMounted = true;
        var index = this.state.delId;
        let data = this.state.data.filter(row => row.id !== index) 
        axios.delete(`${BASE_URL}:${PORT}/${SITES_API}/${this.state.delId}/`, {headers}).then(res=>{
            this.setState({ done: true })
            if(res.status === 204){
                this.setState({data, done:false})
            }
          
        }).catch(err =>  {
            if (err.response.data.detail === "Authentication credentials were not provided.") {
                    localStorage.removeItem('accessToken');
                    this.setState({redirect:true})
              }
            })        
      }

    openEditModal= (id, si, sn, lal, rg, dev)=>{
        const currentState = !this.state.isOpen
        this.setState({
            isOpen: currentState,
            id: id,
            site_id:si,
            site_name:sn,
            lat_lng: lal,
            region: rg,
            device: dev,
            errors:undefined
        })
      }

   async componentDidMount() {
        this._isMounted = true;
        this.getRegion();
        this.getDevice();
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        await axios.get(`${BASE_URL}:${PORT}/${SITES_API}/`, {headers})
        .then(res=> {
            this.setState({ done: true }) 
        if (res.status === 200) {
           this.setState({
               data: res.data.results.reverse(),
           })
          }
         })
         .catch(err =>  {
            if (err.response.data.detail === "Authentication credentials were not provided.") {
                localStorage.removeItem('accessToken');
                this.setState({redirect:true})
              }
            })
      }

    componentWillUnmount() {
        this._isMounted = false;
      }
    getRegion=()=>{
        axios.get(`${BASE_URL}:${PORT}/${REGIONS_API}/`, {headers})
        .then(res=> {
        if (res.status === 200) {
            this.setState({
                regionData: res.data.results
            })
          }
        })
        .catch(err => err)
    }

    getDevice=()=>{
        axios.get(`${BASE_URL}:${PORT}/${DEVICES_API}/`, {headers})
        .then(res=> {
        if (res.status === 200) {
            this.setState({
                deviceData: res.data.results,
            })
          }
        })
        .catch(err => err)
    }

    handleAddSubmit(e) {  
        e.preventDefault();
        this.setState({ isSubmitted: true, errors:undefined });
        const { isValid, errors } = siteValidation(this.state);
        if (!isValid) {
          this.setState({ errors, isSubmitted: false });
          return false;
        } else {
        let body = "site_id="+this.state.site_id+"&site_name="+this.state.site_name+"&lat_lng="+this.state.lat_lng+"&region="+this.state.region+"&device="+
        this.state.device+"&timestamp="+this.state.timestamp;
        axios.post(`${BASE_URL}:${PORT}/${SITES_API}/`, body,  {headers})
        .then(res=> {
            if(res.status === 201){
                this.setState({
                    isSubmitted: true,
                    openaddmodal:false,
                })
            this.componentDidMount()
          }
        })
        .catch(err=> {
            if(err.response.data.site_id){
                this.setState({ errors: "Oops! Site ID already exists ", isSubmitted: false })
            } else if (err.response.data.site_name){
                this.setState({  errors: "Oops! Site Name already exists ", isSubmitted: false })
            } else if(err.response.data.device){
               this.setState({ errors: "Oops! This device already exists ", isSubmitted: false })
            }
          }
        )}
      }
    
    handleEditSubmit(e){
        e.preventDefault();
        this.setState({ isSubmitted: true, errors:undefined });
        const { isValid, errors } = siteValidation(this.state);
        if (!isValid) {
          this.setState({ errors, isSubmitted: false });
          return false;
        } else {
        let body = "site_id="+this.state.site_id+"&site_name="+this.state.site_name+"&lat_lng="+this.state.lat_lng+"&region="+this.state.region+"&device="+
        this.state.device+"&timestamp="+this.state.timestamp;
        axios.put(`${BASE_URL}:${PORT}/${SITES_API}/${this.state.id}/`, body,  {headers})
        .then(res=> {
            if(res.status=== 200){
                this.setState({
                    isSubmitted: true,
                    isOpen:false,
                })
                this.componentDidMount();
            }
        })
        .catch(err=> {
            if(err.response.data.site_id){
            this.setState({ errors: "Oops! Site ID already exists ", isSubmitted: false })
            } else if (err.response.data.site_name){
            this.setState({  errors: "Oops! Site Name already exists ", isSubmitted: false })
            } else if(err.response.data.device){ 
           this.setState({ errors: "Oops! This device already exists ", isSubmitted: false })
            }
        })
      }
    }
    handleEmpty=()=>{
        this.setState({
            site_id: "",
            site_name:'',
            lat_lng:'',
            region:'',
            device:'',
        })
    }

    openAddModal=()=>{
        this.handleEmpty();
        const currentState = !this.state.openaddmodal
        this.setState({
            openaddmodal: currentState,
            errors:undefined
        })
      }

    handleChange = (e) =>{
        let name = e.target.name;
        let val = e.target.value;
        var k = e ? e.which : window.event.keyCode;
        if (k === 32) return false;
        this.setState({[name]: val, errors:""});
      }
    handleChangeLatLng = (e) =>{
        let val = e.target.value;
        var k = e ? e.which : window.event.keyCode;
        if (k === 32) return false;
        var comma = val.includes(',')
        if(!comma){
            this.setState({
                errors:"Please insert valid lat long, i.e 76,34"
            })} 
        if(comma){
            this.setState({
                errors:""
            })}
        var space = val.includes(' ')
        if(space){
            this.setState({
                errors:"No Space allow in lat long, i.e 76,34"
            }) 
        }
        this.setState({lat_lng: val});
    }
    handleChangeRegion = ()=>{
        var e = document.getElementById("region");
        var result = e.options[e.selectedIndex].value;
        this.setState({
            region:result, errors:""
        })
      }
    handleChangeDevice = ()=>{
        var e = document.getElementById("device");
        var result = e.options[e.selectedIndex].value;
        this.setState({
            device:result, errors:""
        })
      }

    handleChangePage = (event, newPage) => {
        this.setState({page: newPage});
      }

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: +event.target.value, page: 0});
      };

    toggleDeleteModal = (id)=>{
        const currentState = this.state.opendeleteModal;
        this.setState({ opendeleteModal: !currentState, delId:id})
      }
    timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date +' '+ month + ' '+ year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
      }

    render(){
        const {site_name, site_id, id, lat_lng, region, device, isOpen, data, openaddmodal, page, rowsPerPage, opendeleteModal, regionData, deviceData, errors } = this.state;  
        if(this.state.redirect){
            return <Redirect to='/login'/>
        }
        return (
            <Fragment>            
                <Break/>           
                    <Wrapper className="col-lg-12 boxtt">
                        <HeadingTag> Site Management </HeadingTag>
                    {!this.state.done ? (<Fragment><Break/><Break/><Loading/></Fragment>): (
                    <Table className='new-table'>
                        <TableHead>
                            <TableRow>
                                <TableHeadings>Sr#</TableHeadings>
                                <TableHeadings>Site Id</TableHeadings>
                                <TableHeadings>Site Name</TableHeadings>
                                <TableHeadings>Location</TableHeadings>
                                <TableHeadings>Region</TableHeadings>
                                <TableHeadings>Device</TableHeadings>
                                <TableHeadings>Created At</TableHeadings>
                                <TableHeadings>Actions</TableHeadings>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).reverse().map((rowData, i )=> {
                            var rName = this.state.regionData[this.state.regionData.findIndex(x => x.id===parseInt(rowData.region))]
                            if(rName){
                                var region_name = rName.region_name;
                            }
                            var dName = this.state.deviceData[this.state.deviceData.findIndex(x => x.id===parseInt(rowData.device))]
                            if(dName){
                                var device_name = dName.device_name;
                            }
                            var timeNow = this.timeConverter(rowData.timestamp)
                            return <TableRow tabIndex={-1} key={i}>
                                <TableData>{i+1}</TableData>
                                <TableData>{rowData.site_id}</TableData>
                                <TableData>{rowData.site_name}</TableData>
                                <TableData>{rowData.lat_lng}</TableData>
                                <TableData>{region_name}</TableData>
                                <TableData>{device_name}</TableData>    
                                <TableData>{timeNow}</TableData>    
                                <TableData>
                                    <IconButton style={{color: "white"}}  onClick={this.openEditModal.bind(this, rowData.id, rowData.site_id, rowData.site_name, rowData.lat_lng, rowData.region, rowData.device)} ><EditIcon fontSize="small"/></IconButton>
                                    <IconButton style ={{color: "white"}} 
                                        onClick={this.toggleDeleteModal.bind(this, rowData.id)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                    <Modal  style ={{color: "black"}} isOpen={opendeleteModal} toggle={this.toggleDeleteModal}  backdrop={false}>
                                        <ModalHeader toggle={()=>this.setState({opendeleteModal:false})}>  Delete Site <DeleteForeverIcon /></ModalHeader>
                                        <ModalBody>Are you want to delete this Site ? </ModalBody>
                                        <ModalFooter>
                                        <Button  type ="submit" size="small" variant="outlined" color="secondary" onClick={() => {
                                                this.setState({opendeleteModal:false})
                                                this.removerow(rowData.id)}}><DeleteIcon />Delete</Button >
                                                <span></span>
                                        <Button  type ="submit" size="small" variant="outlined" color="primary" onClick={()=>this.setState({opendeleteModal:false})}><CancelIcon />Cancel</Button >
                                        </ModalFooter>
                                    </Modal>
                                </TableData>
                        </TableRow>
                        
                        })}
                        </TableBody>
                    </Table>
                    )}
                    {data.length>10 ? <TablePagination 
                        style={{ color:'white',  backgroundColor:'#1b1b1b'}}
                        rowsPerPageOptions={[3, 10, 20, 100]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        labelRowsPerPage={'Sites Per Page'}
                    />:""}
                        <Break/>
                    </Wrapper>
                    {/* Modal for edit  */}
                    
                        <Modal  isOpen={isOpen} toggle={this.openEditModal}  backdrop={false}>
                            <ModalHeader toggle={()=>this.setState({isOpen:false})}>Edit Site</ModalHeader>
                            <ModalBody>
                                <form className="form-group">

                                    <Wrapper className="form-group">
                                        <label>Site ID <span className="asterisk_input"/> </label>
                                        <input type="text" name="site_id" className="form-control" value={site_id} disabled={true} placeholder={id}/>
                                    </Wrapper>

                                    <Wrapper className="form-group">
                                        <label htmlFor="site_name">Site Name <span className="asterisk_input"/> </label>
                                        <input type="text" name ="site_name" className="form-control" value={site_name} onChange={this.handleChange} placeholder="Site Name"/>
                                    </Wrapper>

                                    <Wrapper className="form-group">
                                        <label htmlFor="lat_lng">Lat,Lng <span className="asterisk_input"/> </label>
                                        <input type="text" className="form-control" name ="lat_lng" value={lat_lng.trim()} onChange={this.handleChange} placeholder="Latitude, Longitude"/>
                                    </Wrapper>

                                    <Wrapper className="form-group">
                                        <label htmlFor="region">Region <span className="asterisk_input"/> </label>
                                        <select className="form-control" name ="region" id="region" value={region} onChange={this.handleChangeRegion} placeholder="Region" >
                                            <option  className="brave" value="" disabled defaultValue>Select Region</option>
                                            {regionData.map((reg, i)=> (
                                            <option key={i} value={reg.id}> {reg.region_name} </option>))}
                                        </select>
                                    </Wrapper>

                                    <Wrapper className="form-group">
                                        <label htmlFor="Device">Device <span className="asterisk_input"/> </label>
                                        <select className="form-control" name ="device" id="device" value={device} onChange={this.handleChangeDevice} placeholder="Device" >
                                            <option  className="brave" value="" disabled defaultValue>Select Device</option>
                                            {deviceData.map((dev, i)=> (
                                            <option key={i} value={dev.id}> {dev.device_name} </option>))}
                                        </select>
                                    </Wrapper>
                                    <Button className="form-group col-lg-12 flexi" onClick={this.handleEditSubmit.bind(this)} type ="submit" size="large" variant="contained" color="primary" aria-label="add"> Done</Button>
                                    {errors ? <span style={{color: 'red', margin:"auto" , fontSize:'12px'}}>{errors}</span>: ""}
                                </form>
                            </ModalBody>
                        </Modal>

                    {/**Add New Site */}

                    <Modal style ={{color: "black"}} isOpen={openaddmodal} toggle={this.openAddModal}  backdrop={false}>
                        <ModalHeader toggle={this.openAddModal}>Add New Site</ModalHeader>
                        <ModalBody>
                            <form className="form-group">

                                <Wrapper className="form-group">
                                    <label htmlFor="site_id">Site ID <span className="asterisk_input"/> </label>
                                    <input type="text" name ="site_id" className="form-control" value={site_id.trim()} onChange={this.handleChange} placeholder="Site ID"/>
                                </Wrapper>
                                <Wrapper className="form-group">
                                    <label>Site Name <span className="asterisk_input"/> </label>
                                    <input type="text" name ="site_name" className="form-control" value={site_name} onChange={this.handleChange} placeholder="Site Name"/>
                                </Wrapper>

                                <Wrapper className="form-group">
                                    <label htmlFor="lat_lng">Lat,Lng <span className="asterisk_input"/> </label>
                                    <input type="text" className="form-control" name ="lat_lng" value={lat_lng.trim()} onChange={this.handleChange} placeholder="Latitude, Longitude"/>
                                </Wrapper>

                                <Wrapper className="form-group">
                                    <label htmlFor="region">Region <span className="asterisk_input"/> </label>
                                    <select className="form-control" name ="region" id="region" value={region} onChange={this.handleChangeRegion} placeholder="Region" >
                                        <option  className="brave" value="" disabled defaultValue>Select Region</option>
                                        {regionData.map((reg, i)=> (
                                        <option key={i} value={reg.id}> {reg.region_name} </option>))}
                                    </select>
                                </Wrapper>

                                <Wrapper className="form-group">
                                    <label htmlFor="device">Device <span className="asterisk_input"/> </label>
                                    <select className="form-control" name ="device" id="device" value={device} onChange={this.handleChangeDevice} placeholder="Device" >
                                        <option  className="brave" value="" disabled defaultValue>Select Device</option>
                                        {deviceData.map((dev, i)=> (
                                        <option key={i} value={dev.id}> {dev.device_name} </option>))}
                                    </select>
                                </Wrapper>
                                <Button 
                                    className="form-group col-lg-12 flexi" onClick={this.handleAddSubmit.bind(this)} 
                                    type ="submit" size="medium" variant="contained" color="primary" aria-label="add"> <AddIcon />ADD SITE</Button>
                                {errors ? <span style={{color: 'red', margin:"auto" , fontSize:'12px'}}>{errors}</span>: ""}
                            </form>
                        </ModalBody>
                    </Modal>
                <Fab style ={{bottom: "10px", position: "fixed", right: "10px"}} onClick={this.openAddModal}  color="secondary" aria-label="add" title="Add New Site">
                    <AddIcon />
                </Fab>
            </Fragment>
        )
    }
}
