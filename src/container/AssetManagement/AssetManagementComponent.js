import React, { Component, Fragment } from 'react'
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';import Button from '@material-ui/core/Button'; import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add'
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import Fab from '@material-ui/core/Fab';
import TablePagination from '@material-ui/core/TablePagination'; import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import {Wrapper, Table, TableRow, TableBody, TableData, TableHead, TableHeadings, HeadingTag, Break} from '../Dashboard/StyledCompo';
import {BASE_URL, PORT, ASSET_API, SITES_API} from '../../config/config'
import assetValidation from './validator'
import axios from 'axios'
import Loading from '../Loading/Loading';
import { Redirect } from "react-router-dom";

var token = localStorage.getItem('accessToken');
var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
export default class AssetManagementComponent extends Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = { 
            data: [],
            openaddmodal:false,
            isOpen:false,
            opendeleteModal:false,
            backdrop: true,
            asset_id: "",
            asset_name:'',
            asset_brand:'',
            asset_owner_name:'',
            asset_owner_type:'',
            page: 0,
            rowsPerPage: 10,
            timestamp: Math.floor(Date.now()/1000),
            siteData:[],
            site: '',
            id:'',
            delId:'',
            isSubmitted: false,
            errors: undefined,
            done: false,
            redirect:false,
        }
        this.timeConverter = this.timeConverter.bind(this)
    }

    componentDidMount() {
        this._isMounted = true;
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        axios.get(`${BASE_URL}:${PORT}/${ASSET_API}/`, {headers})
        .then(res=> {
            this.setState({ done: true })
        if (res.status===200) {
           this.setState({
               data: res.data.results,
               asset_id:'',
               asset_name:'',
               asset_brand:'',
               asset_owner_name:'',
               asset_owner_type:'',
               redirect:false
           })
          }
         })
         .catch(err =>  {
            if (err.response.data.detail === "Authentication credentials were not provided.") {
                localStorage.removeItem('accessToken');
                this.setState({redirect:true})
              } else return err
            })

        axios.get(`${BASE_URL}:${PORT}/${SITES_API}/`, {headers})
        .then(res=> {
            this.setState({ done: true })
        if (res.status===200) {
           this.setState({
               siteData: res.data.results.sort((a, b)=> b.timestamp-a.timestamp),
           })
          }
         })
        .catch(err => err)
     }


    removerow = () => {
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        axios.delete(`${BASE_URL}:${PORT}/${ASSET_API}/${this.state.delId}/`, {headers}).then(res=>{   
        this.setState({ done: true })
        var index = this.state.delId;
        const items = this.state.data.filter(row => row.id !== index)       
            if(res.status === 204){
               this.setState({data:items})
            }
          }).catch(err =>  {
            if (err.response.data.detail === "Authentication credentials were not provided.") {
                    localStorage.removeItem('accessToken');
                    this.setState({redirect:true})
              } else return err
        })
     }
    
    openEditModal= (id, ai, an, aon, ab, aot, s)=>{
        const currentState = !this.state.isOpen
        this.setState({
            isOpen: currentState,
            id: id,
            asset_id:ai,
            asset_brand:ab,
            asset_name:an,
            asset_owner_name:aon,
            asset_owner_type:aot,
            site:s,
            errors:undefined,
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
        this.setState({[name]: val, errors:""});
    }
    
    handleEmpty=()=>{
        this.setState({
            asset_id: "",
            asset_name:'',
            asset_brand:'',
            asset_owner_name:'',
            asset_owner_type:'',
            site: '',
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
      }

    handleAddSubmit(e){       
        e.preventDefault();
        this.setState({ isSubmitted: true, errors:undefined });
        const { isValid, errors } = assetValidation(this.state);
        if (!isValid) {
          this.setState({ errors, isSubmitted: false });
          return false;
        } else {  
        let body = "asset_id="+this.state.asset_id+"&asset_name="+this.state.asset_name+"&asset_brand="+this.state.asset_brand+"&asset_owner_name="+
        this.state.asset_owner_name+"&asset_owner_type="+this.state.asset_owner_type+"&site="+this.state.site+"&timestamp="+this.state.timestamp;
        axios.post(`${BASE_URL}:${PORT}/${ASSET_API}/`, body,  {headers})
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
            if(err.response.data.asset_id){
            this.setState({ errors: "Oops! Asset ID already exists ", isSubmitted: false })
            } else if (err.response.data.asset_name){
            this.setState({ errors: "Oops! AssetName already exists ", isSubmitted: false })
            }
        })}
    }
    
    handleEditSubmit = (e)=> {
        e.preventDefault();
        this.setState({ isSubmitted: true, errors:undefined });
        const { isValid, errors } = assetValidation(this.state);
        if (!isValid) {
          this.setState({ errors, isSubmitted: false });
          return false;
        } else { 
        let body = `asset_id=+${this.state.asset_id}+&asset_name=+${this.state.asset_name}+&asset_brand=+${this.state.asset_brand}+&asset_owner_name=+${this.state.asset_owner_name}+&asset_owner_type=+${this.state.asset_owner_type}+&timestamp=${this.state.timestamp}+&site=+${this.state.site}`;
        axios.put(`${BASE_URL}:${PORT}/${ASSET_API}/${this.state.id}/`, body,  {headers})
        .then(res=> {
            if(res.status === 200){
                this.setState({
                    isSubmitted:true,
                    isOpen:false, 
                })
            this.componentDidMount()
        }})
        .catch(err=>{
            if(err.response.data.asset_id){
            this.setState({ errors: "Oops! AssetID already exists ", isSubmitted: false })
            } else if (err.response.data.asset_name){
            this.setState({  errors: "Oops! AssetName already exists ", isSubmitted: false })
            }
        }
        )}
    }

    toggleDeleteModal(id){
        const currentState = this.state.opendeleteModal;
        this.setState({ opendeleteModal: !currentState, delId:id})
    }
    
    handleChangeSite = ()=>{
        var e = document.getElementById("site");
        var result = e.options[e.selectedIndex].value;
        this.setState({
            site:result
        })
      }

    handleChangePage = (event, newPage) => {
        this.setState({page: newPage});
      }
    
    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: +event.target.value, page: 0});
      };

    timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp * 1000);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date +' '+ month +' '+ year +' '+ hour +':'+ min +':' + sec ;
        return time;
      }

    render() {
        const {asset_name, asset_id, asset_brand, asset_owner_name, asset_owner_type, isOpen, data, openaddmodal, page, rowsPerPage, opendeleteModal, site, siteData, errors, done} = this.state;
        if(this.state.redirect){
            return <Redirect to='/login'/>
        }
        return (
        
            <Fragment>                      
                <Break/>
                    <Wrapper className="col-lg-12 boxtt">
                        <HeadingTag> Asset Management </HeadingTag>
                    {!done ? (<Fragment><Break/><Break/><Loading/></Fragment>): (
                    <Table className='new-table'>
                        <TableHead>
                            <TableRow>
                                <TableHeadings>Sr#</TableHeadings>
                                <TableHeadings>Asset Id</TableHeadings>
                                <TableHeadings>Asset Name</TableHeadings>
                                <TableHeadings>Site</TableHeadings>
                                <TableHeadings>Asset Brand</TableHeadings>
                                <TableHeadings>Owner Name</TableHeadings>
                                <TableHeadings>Owner Type</TableHeadings>
                                <TableHeadings>Created At</TableHeadings>
                                <TableHeadings>Actions</TableHeadings>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((rd, i )=> {
                                var sName = this.state.siteData[this.state.siteData.findIndex(x => x.id === parseInt(rd.site))]
                                if(sName){
                                    var site_name = sName.site_name;
                                }

                                var timeNow = this.timeConverter(rd.timestamp)
                                return <TableRow tabIndex={-1} key={ i}>
                                    <TableData>{i+1+rowsPerPage*page}</TableData>
                                    <TableData>{rd.asset_id}</TableData>
                                    <TableData>{rd.asset_name}</TableData>
                                    <TableData>{site_name}</TableData>  
                                    <TableData>{rd.asset_brand}</TableData>
                                    <TableData>{rd.asset_owner_name}</TableData>
                                    <TableData>{rd.asset_owner_type}</TableData>    
                                    <TableData>{timeNow}</TableData>    
                                    <TableData>
                                        <IconButton style={{color: "white"}}  
                                            onClick={this.openEditModal.bind(this, rd.id, rd.asset_id, rd.asset_name, rd.asset_brand, rd.asset_owner_name, rd.asset_owner_type, rd.site)} >
                                            <EditIcon fontSize="small"/></IconButton>
                                        <IconButton style ={{color: "white"}} onClick={this.toggleDeleteModal.bind(this, rd.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                        <Modal isOpen={opendeleteModal} toggle={this.toggleDeleteModal} backdrop={false}>
                                            <ModalHeader toggle={()=>this.setState({opendeleteModal:false})}>Delete Asset <DeleteForeverIcon /></ModalHeader>
                                            <ModalBody>Are you want to delete this Asset ?</ModalBody>
                                            <ModalFooter>
                                            <Button type ="submit" size="small" variant="outlined" color="secondary" onClick={() => {
                                                    this.setState({opendeleteModal:false})
                                                    this.removerow(rd.id)}}><DeleteIcon />Delete</Button>
                                                    <span></span>
                                            <Button type ="submit" size="small" variant="outlined" color="primary" onClick={()=>this.setState({opendeleteModal:false})}><CancelIcon />Cancel</Button>
                                            </ModalFooter>
                                        </Modal>
                                    </TableData>
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>
                    )}
                    {data.length> 10 ?  <TablePagination 
                        style={{ color:'white',  backgroundColor:'#1b1b1b'}}
                        rowsPerPageOptions={[10, 20, 100]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        labelRowsPerPage={'Assets Per Page'}
                    /> :""}
                        <Break/>
                    </Wrapper>
                    
                    <Modal isOpen={isOpen} fade={false} toggle={this.openEditModal} backdrop={false}>
                        <ModalHeader toggle={()=>this.setState({isOpen:false})}>Edit Assets</ModalHeader>
                        <ModalBody>
                            <form className="form-group" onSubmit={this.handleEditSubmit}>

                                <Wrapper className="form-group">
                                    <label htmlFor="asset_id">Asset ID<span className="asterisk_input"/> </label>
                                    <input type="text" name="asset_id" className="form-control" value={asset_id} disabled={true} />
                                </Wrapper>

                                <Wrapper className="form-group">
                                    <label htmlFor="asset_name">Asset Name<span className="asterisk_input"/> </label>
                                    <input type="text" name ="asset_name" className="form-control" value={asset_name} onChange={this.handleChange} placeholder="Site Name"/>
                                </Wrapper>

                                <Wrapper className="form-group">
                                    <label htmlFor="asset_brand">Asset Brand<span className="asterisk_input"/> </label>
                                    <input type="text" className="form-control" name ="asset_brand" value={asset_brand} onChange={this.handleChange} placeholder="Asset Brand"/>
                                </Wrapper>

                                <Wrapper className="form-group">
                                    <label htmlFor="asset_owner_name">Asset Owner Name<span className="asterisk_input"/> </label>
                                    <input type="text" className="form-control" name ="asset_owner_name" value={asset_owner_name} onChange={this.handleChange} placeholder="Asset Owner Name "/>
                                </Wrapper>
                                
                                <Wrapper className="form-group">
                                    <label htmlFor="asset_owner_type">Asset Owner Type<span className="asterisk_input"/> </label>
                                    <input type="text" className="form-control" name ="asset_owner_type" value={asset_owner_type} onChange={this.handleChange} placeholder="Asset Owner Type"/>
                                </Wrapper>

                                <Wrapper className="form-group">
                                    <label htmlFor="site">Site<span className="asterisk_input"/> </label>
                                    <select className="form-control" name ="site" id ="site" value={site} onChange={this.handleChangeSite} placeholder="Site">
                                        <option  className="brave" value="" disabled defaultValue>Select Site</option> 
                                        {siteData.map((sit, i) => (
                                        <option key={i} value={sit.id}> {sit.site_name} </option>))}
                                    </select>
                                </Wrapper>
                                <button className="form-group col-lg-12 btn btn-info flexi" type ="submit" size="large" variant="contained" color="primary" aria-label="add"> Done</button>
                                {errors ? <span style={{color: 'red', margin:"auto" , fontSize:'12px'}}>{errors}</span>: ""}
                            </form>
                        </ModalBody>
                    </Modal>

                    {/**Add New Site */}

                    <Modal isOpen={openaddmodal} toggle={this.openAddModal} backdrop={false}>
                        <ModalHeader toggle={()=>this.setState({openaddmodal:false})}>Add New Asset</ModalHeader>
                        <ModalBody>
                            <form className="form-group">

                                <Wrapper className="form-group">
                                    <label >Asset ID<span className="asterisk_input"/> </label>
                                    <input type="text" name ="asset_id" className="form-control" value={asset_id.trim()} onChange={this.handleChange} placeholder="Asset Id"/>
                                </Wrapper>
                                <Wrapper className="form-group">
                                    <label htmlFor="asset_name">Asset Name<span className="asterisk_input"/> </label>
                                    <input type="text" name ="asset_name" className="form-control" value={asset_name} onChange={this.handleChange} placeholder="Asset Name"/>
                                </Wrapper>

                                <Wrapper className="form-group">
                                    <label htmlFor="asset_brand">Asset Brand<span className="asterisk_input"/> </label>
                                    <input type="text" className="form-control" name ="asset_brand" value={asset_brand} onChange={this.handleChange} placeholder="Asset Brand"/>
                                </Wrapper>

                                <Wrapper className="form-group">
                                    <label htmlFor="asset_owner_name">Asset Owner Name<span className="asterisk_input"/> </label>
                                    <input type="text" className="form-control" name ="asset_owner_name" value={asset_owner_name} onChange={this.handleChange} placeholder="Asset Owner Name "/>
                                </Wrapper>
                                
                                <Wrapper className="form-group">
                                    <label htmlFor="asset_owner_type">Asset Owner Type<span className="asterisk_input"/> </label>
                                    <input type="text" className="form-control" name ="asset_owner_type" value={asset_owner_type} onChange={this.handleChange} placeholder="Asset Owner Type"/>
                                </Wrapper>

                                <Wrapper className="form-group">
                                    <label htmlFor="site">Site<span className="asterisk_input"/> </label>
                                    <select className="form-control" name ="site" id ="site" value={site} onChange={this.handleChangeSite} placeholder="Site">
                                        <option  className="brave" value="" disabled defaultValue>Select Site</option> 
                                        {siteData.map((sit, i) => (
                                        <option key={i} value={sit.id}> {sit.site_name} </option>))}
                                    </select>
                                </Wrapper>
                                
                                <button className="form-group col-lg-12 btn btn-info flexi" onClick={this.handleAddSubmit.bind(this)} 
                                type ="submit" size="medium" variant="contained" color="primary" aria-label="add">
                                    ADD ASSET
                                </button>
                                {errors ? <span style={{color: 'red', margin:"auto" , fontSize:'12px'}}>{errors}</span>: ""}
                            </form>
                        </ModalBody>
                    </Modal>
                <Fab style ={{bottom: "10px", position: "fixed", right: "10px"}} onClick={this.openAddModal}  color="secondary" aria-label="add" title="Add New Asset">
                    <AddIcon />
                </Fab>
            </Fragment>
        )
    }
}
