import React, { Component, Fragment } from 'react'
import TablePagination from '@material-ui/core/TablePagination';
import {Wrapper, Table, TableRow, TableBody, TableData, TableHead, TableHeadings, HeadingTag, Break} from '../Dashboard/StyledCompo';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';import Button from '@material-ui/core/Button'; import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add'
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import Fab from '@material-ui/core/Fab'; import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import deviceValidation from './Validator'
import {BASE_URL, PORT, DEVICES_API} from '../../config/config'
import axios from 'axios'
import Loading from '../Loading/Loading'; 
import { Redirect } from "react-router-dom";

export default class DeviceManagementComponent extends Component{
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            data: [],
            rowsPerPage: 15,
            page: 0,
            opendeleteModal: false,
            openaddmodal:false,
            isOpen: false,
            device_id: "",
            device_name:"", 
            api_key: "",
            timestamp: Math.floor(Date.now()/1000),
            id: '',
            delId: '',
            isSubmitted: false,
            errors: undefined, done: undefined, redirect:false,
        }
        this.timeConverter=this.timeConverter.bind(this)
    }

    componentDidMount() {
        this._isMounted = true;
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        axios.get(`${BASE_URL}:${PORT}/${DEVICES_API}/`, {headers})
        .then(res=> {
            this.setState({ done: true })
            if (this._isMounted) {
            this.setState({
                data: res.data.results,
            })
           }
         }).catch(err =>  {
            if (err.response.data.detail === "Authentication credentials were not provided.") {
                localStorage.removeItem('accessToken');
                this.setState({redirect:true})
              }
        })
      }


    removerow = () => {
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        axios.delete(`${BASE_URL}:${PORT}/${DEVICES_API}/${this.state.delId}/`, {headers}).then(res=>{  
            this.setState({ done: true })
            var index = this.state.delId;
            const items = this.state.data.filter(row => row.id !== index)
            if(res.status === 204){
                this.setState({
                    data: items
                })
            }
        }).catch(err=>{
            if (err.response.data.detail === "Authentication credentials were not provided.") {
                localStorage.removeItem('accessToken');
                this.setState({redirect:true})
            }
        })
      }
    
    openEditModal=(id, d_id, name, api)=>{
        const previousState = !this.state.isOpen;
        this.setState({
              isOpen: previousState,
              id: id,
              device_id: d_id,
              device_name:name,
              api_key: api,
              errors:undefined
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
    
       
    handleChange = (event) =>{
        let name = event.target.name;
        let val = event.target.value;
        this.setState({[name]: val});
        }
    handleEmpty(){
        this.setState({
            device_id: "",
            device_name:"", 
            api_key: "",
        })
    }
    handleEditSubmit(e){
        e.preventDefault();
        this.setState({ isSubmitted: true, errors:undefined });
        const { isValid, errors } = deviceValidation(this.state);
        if (!isValid) {
          this.setState({ errors, isSubmitted: false });
          return false;
        } else {
        let body = "device_id="+this.state.device_id+"&device_name="+this.state.device_name+"&api_key="+this.state.api_key+"&timestamp="+this.state.timestamp;
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        axios.put(`${BASE_URL}:${PORT}/${DEVICES_API}/${this.state.id}/`, body,  {headers})
        .then(res=>{
            if(res.status=== 200){
                this.setState({
                    isSubmitted: true,
                    isOpen:false,
                })
                this.componentDidMount()
            }
        })
        .catch(err=> {
            if(err.response.data.device_id){
                this.setState({ errors: "Oops! Device ID already exists ", isSubmitted: false })
                } else if (err.response.data.device_name){
                this.setState({  errors: "Oops! Device Name already exists ", isSubmitted: false })
                } else if (err.response.data.api_key){
                this.setState({  errors: "Oops! Device With this key already exists ", isSubmitted: false })
                }
            })
        }
      }

    handleAddSubmit(e){       
        e.preventDefault();
        this.setState({ isSubmitted: true, errors:undefined });
        const { isValid, errors } = deviceValidation(this.state);
        if (!isValid) {
          this.setState({ errors, isSubmitted: false });
          return false;
        } else {  
        let body = "device_id="+this.state.device_id+"&device_name="+this.state.device_name+"&api_key="+this.state.api_key+"&timestamp="+this.state.timestamp;
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        axios.post(`${BASE_URL}:${PORT}/${DEVICES_API}/`, body,  {headers})
        .then(res=> {
            if(res.status === 201){
                this.setState({
                    isSubmitted: true,
                    openaddmodal:false,
                })
                this.componentDidMount()
            }
        })
        .catch(err=>{
            if(err.response.data.device_id){
                this.setState({ errors: "Oops! Device ID already exists ", isSubmitted: false })
                } else if (err.response.data.device_name){
                this.setState({  errors: "Oops! Device Name already exists ", isSubmitted: false })
                } else if (err.response.data.api_key){
                this.setState({  errors: "Oops! Device With this key already exists ", isSubmitted: false })
                }
            }
        )}
    }

    toggleDeleteModal = (id)=>{
        const currentState = this.state.opendeleteModal;
        this.setState({ opendeleteModal: !currentState, delId:id})
      }
    

    handleChangePage = (event, newPage) => {
        this.setState({page: newPage});
      }

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: +event.target.value, page: 0});
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
            const {data, opendeleteModal, isOpen, page, rowsPerPage, api_key, device_id, device_name, openaddmodal, errors} = this.state;
            if(this.state.redirect){
                return <Redirect to='/login'/>
            }
        return (
            <Fragment>
                <Break/>
                    <Wrapper className="col-lg-12 boxtt">
                        <HeadingTag> Device Management</HeadingTag>
                        {!this.state.done ? (<Fragment><Break/><Break/><Loading/></Fragment>): (<Table className="new-table" >
                        <TableHead>
                            <TableRow>
                                <TableHeadings>Sr#</TableHeadings>
                                <TableHeadings>Device Id</TableHeadings>
                                <TableHeadings>Device Name</TableHeadings>
                                <TableHeadings>Device Api Key</TableHeadings>
                                <TableHeadings>Created At</TableHeadings>
                                <TableHeadings>Actions</TableHeadings>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {this.state.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).reverse().map((alt, i)=>{

                        var timeNow = this.timeConverter(alt.timestamp)
                        return <TableRow key={i}>
                            <TableData style={{width:'5%'}}>{i+1}</TableData>
                            <TableData style={{width:'10%'}}>{alt.device_id}</TableData>
                            <TableData style={{width:'15%'}}>{alt.device_name}</TableData>
                            <TableData style={{width:'25%'}}>{alt.api_key}</TableData>
                            <TableData style={{width:'25%'}}>{timeNow}</TableData>
                            <TableData style={{width:'30%'}}>
                                <IconButton style={{color: "white"}}  
                                    onClick={this.openEditModal.bind(this, alt.id, alt.device_id, alt.device_name, alt.api_key)}>
                                    <EditIcon fontSize="small"/></IconButton>
                                <IconButton style ={{color: "white"}} onClick={this.toggleDeleteModal.bind(this, alt.id)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                                <Modal  style ={{color: "black"}} isOpen={opendeleteModal} backdrop={false} toggle={this.toggleDeleteModal} >
                                    <ModalHeader toggle={()=>this.setState({opendeleteModal:false})}> Delete Device <DeleteForeverIcon /></ModalHeader>
                                    <ModalBody>Are you want to delete Device?</ModalBody>
                                    <ModalFooter>
                                    <Button type ="submit" size="small" variant="outlined" color="secondary" onClick={() => {
                                            this.removerow(alt.id)
                                            this.setState({opendeleteModal:false})}}><DeleteIcon/>Delete</Button>
                                            <span></span>
                                    <Button type ="submit" size="small" variant="outlined" color="primary" onClick={() =>this.setState({opendeleteModal:false})}><CancelIcon />Cancel</Button>
                                    </ModalFooter>
                                </Modal>
                            </TableData>
                            </TableRow>})}
                        </TableBody>
                    </Table>)}
                        <Break/>
                    </Wrapper>
                    {data.length> 10? <TablePagination 
                        style={{ color:'white',  backgroundColor:'#1b1b1b'}}
                        rowsPerPageOptions={[10, 15, 20, 100]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        labelRowsPerPage={'Devices Per Page'}
                    /> :""}
                    {/**Edit Modal */}

                        <Modal  isOpen={isOpen} toggle={this.openEditModal} backdrop={false}>
                            <ModalHeader toggle={()=>this.setState({isOpen:false})}>Edit Device</ModalHeader>
                            <ModalBody>
                                <form className="form-group">

                                    <Wrapper className="form-group">
                                        <label>Device ID : </label>
                                        <input type="text" className="form-control" value={device_id} disabled={true}/>
                                    </Wrapper>

                                    <Wrapper className="form-group">
                                        <label>Device Name : </label>
                                        <input type="text" className="form-control" name ="device_name"  value={device_name} onChange={this.handleChange} placeholder="Device Name"/>
                                    </Wrapper>

                                    <Wrapper className="form-group">
                                        <label>Device Key : </label>
                                        <input type="text" className="form-control" name ="api_key" value={api_key.trim()} onChange={this.handleChange} placeholder="Device Key"/>
                                    </Wrapper>
                                    
                                    <Button className="form-group col-lg-12 flexi" type ="submit" onClick={this.handleEditSubmit.bind(this)} size="large" variant="contained" color="primary"> Done</Button>
                                        {errors ? <span style={{color: 'red', margin:"auto" , fontSize:'12px'}}>{errors}</span>: ""}
                                </form>
                            </ModalBody>
                        </Modal>

                        <Modal style ={{color: "black"}} isOpen={openaddmodal} backdrop={false} toggle={this.openAddModal}>
                            <ModalHeader toggle={()=>this.setState({openaddmodal:false})}>Add New Device</ModalHeader>
                            <ModalBody>
                            <form className="form-group" onSubmit={this.handleEditSubmit}>

                            <Wrapper className="form-group">
                                <label>Device ID <span className="asterisk_input"/></label>
                                <input type="text" name="device_id" className="form-control" value={device_id.trim()} onChange={this.handleChange} placeholder="Device ID" required/>
                            </Wrapper>

                            <Wrapper className="form-group">
                                <label>Device Name <span className="asterisk_input"/> </label>
                                <input type="text" className="form-control" name ="device_name"  value={device_name} onChange={this.handleChange} placeholder="Device Name"/>
                            </Wrapper>

                            <Wrapper className="form-group">
                                <label>Device Key <span className="asterisk_input"/> </label>
                                <input type="text" className="form-control" name ="api_key" value={api_key.trim()} onChange={this.handleChange} placeholder="Device Key"/>
                            </Wrapper>

                            <Button className="form-group col-lg-12 flexi" onClick={this.handleAddSubmit.bind(this)} 
                                type ="submit" size="medium" variant="contained" color="primary" aria-label="add"> <AddIcon />
                                ADD DEVICE</Button>
                                {errors ? <span style={{color: 'red', margin:"auto" , fontSize:'12px'}}>{errors}</span>: ""}
                            </form>
                            </ModalBody>
                        </Modal>

                        <Fab style ={{bottom: "10px", position: "fixed", right: "10px"}} onClick={this.openAddModal} size="large" color="secondary" aria-label="add" title="Add New Device">
                            <AddIcon />
                        </Fab>  
            </Fragment>
        )
    }
}