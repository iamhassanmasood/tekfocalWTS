import React, { Component } from 'react'
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import Button from '@material-ui/core/Button'; import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import {Wrapper, Label, HeadingTag, Break} from '../Dashboard/StyledCompo';
import axios from 'axios'
import {BASE_URL, PORT, SITES_API, ASSET_BY_SITE} from '../../config/config'
import transferValidation from './validator'
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Loading from '../Loading/Loading';

export default class TransferAssetsComponent extends Component {
    _isMounted = false;
    state={
        sites:[],
        assets:[],
        open:false,
        transfer:false,
        siteVal:'', 
        assetVal:'',
        toSite: '', 
        isSubmitted: false,
        errors: undefined,
        redirect:false,
        done:false
    }

    componentDidMount(){
        this._isMounted= true
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        this.setState({ done:true })
        axios.get(`${BASE_URL}:${PORT}/${SITES_API}/`, {headers})
        .then(res=> {
          if (res.status === 200) {
            this.setState({
                sites: res.data.results,
                done:false
            })
           }
         })
         .catch(err =>  {
            if (err.response.data.detail === "Authentication credentials were not provided.") {
                    toast("Sorry! Session Expired Please Login Again")
                    localStorage.removeItem('accessToken');
                    this.setState({redirect:true})
              }
            })
      }

    toggleModal = (e) => {
        e.preventDefault();
        this.setState({ isSubmitted: true, errors:undefined });
        const { isValid, errors } = transferValidation(this.state);
        if (!isValid) {
          this.setState({ errors, isSubmitted: false });
          return false;
        } else {
        this.setState({
            open: true
        })};
      };
      
    toggleModalSuccess = () => {
        this.setState({
            transfer:!this.state.transfer
        });
      };
    handleEmpty=()=>{
        this.setState({
            siteVal:'',
            assetVal:'',
            toSite: ''
        })
    }

    handleChange=()=>{
        this.handleEmpty()
        var e = document.getElementById("site");
        var result = e.options[e.selectedIndex].value;
        this.setState({
            siteVal:result, errors:undefined, assetVal:''
        })
        this.handleChangeAssets(result);
      }
    
    handleChangeAssets=(id)=>{
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        axios.get(`${BASE_URL}:${PORT}/${ASSET_BY_SITE}${id}`, {headers})
            .then(res=> {
                if (res.status === 200) {
                    this.setState({
                        assets: res.data
                    })
                }
            }).catch(err => {
                if (err.response.data.detail === "Authentication credentials were not provided.") {
                    toast("Sorry! Session Expired Please Login Again")
                    localStorage.removeItem('accessToken');
                    this.setState({redirect:true})
                  }
                })
      }

    handleChangeAst=()=>{
        let e = document.getElementById("asset");
        let result = e.options[e.selectedIndex].value;
        this.setState({
            assetVal:result, errors:""
        })
    }
    handleChangeToSite=()=>{
        var e = document.getElementById("tosite");
        var result = e.options[e.selectedIndex].value;
        this.setState({
            toSite:result, errors:""
        })
    }

    handleSubmit=(e)=>{
        e.preventDefault();
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        let body = "asset_id="+this.state.assetVal+"&site_id="+this.state.toSite;
        axios.post(`${BASE_URL}:${PORT}/assets_transfer`, body, {headers})
        .then(res=>{
            this.setState({done:true})
            if(res.status === 200){
                this.setState({
                    open:false,
                    transfer:true,
                    siteVal:'',
                    assetVal:'',
                    toSite: '',
                    done:false
                });
              setTimeout(()=> this.setState({transfer: false}), 2000)
            }
        }).catch(err=> {
            if (err.response.data.detail === "Authentication credentials were not provided.") {
                
                localStorage.removeItem('accessToken');
                this.setState({redirect:true})
            } else if(err.response.status === 304){
                toast("Sorry! Your Request can't fulfill right now :(")
            }
        })
    }
    componentWillUnmount() {
        this._isMounted = false;
      }

    
    render(){
        
        const {open, transfer, sites, assets, siteVal, assetVal, toSite, errors} = this.state
        const sitesData = sites.map((item, i)=>(
            <option key={i} value={item.id}>{item.site_name}</option>
            ))
        const assetData = assets.map((item, i)=>(
            <option key={i} value={item[10]}>{item[1]}</option>
            ))
        const toSitesData = sites.map((item, i)=>(
            <option key={i} value={item.id}>{item.site_name}</option>
            ))
            
        if(this.state.redirect){
            return <Redirect to='/login'/>
        }
    
        return (
            <Wrapper>
                <Break/>
                <Wrapper className="col-lg-12 flexi">
                    <Wrapper className="flexi">
                        <HeadingTag> Transfer Assets </HeadingTag>
                    </Wrapper>
                </Wrapper>
                    <Wrapper className="col-lg-12 flexi  stret" >
                        {this.state.done? <><Break/><Loading/></> :
                        <Wrapper className="col-lg-4 boxt">
                            <Break/>
                            <form className="form-group">
                                <Label>From Site : </Label>
                                <select className="form-control" id="site" name="site" onChange={this.handleChange} value={siteVal}>
                                    <option  className="brave" value="" disabled defaultValue>Select Site</option>
                                    {sitesData}
                                </select>
                                
                                <Label>Select Asset : </Label>
                                 {!siteVal ? <select className="form-control" id="asset" name ="asset" disabled value={assetVal}>
                                    <option className="brave" defaultValue>Select Site First</option>
                                    {assetData}
                                </select>: assets.length === 0 ? <select className="form-control" id="asset" name ="asset" disabled value={assetVal}>
                                    <option  className="brave" defaultValue>No Asset Available</option>
                                    {assetData}
                                </select>: <select className="form-control" id="asset" name ="asset" onChange={this.handleChangeAst} value={assetVal}>
                                    <option  className="brave" defaultValue>Select Asset</option>
                                    {assetData}
                                </select>}

                                <Label>To Site : </Label>
                                {siteVal && !assetVal ?<select className="form-control" id="tosite" name ="tosite" disabled value={toSite}>
                                    <option  className="brave">Select Asset First </option>
                                </select>: !assetVal ? <select className="form-control" id="tosite" name ="tosite" onChange={this.handleChangeToSite} value={toSite}>
                                <option  className="brave" >Select Site </option>: 
                                </select>: <select className="form-control" id="tosite" name ="tosite" onChange={this.handleChangeToSite} value={toSite}>
                                <option  className="brave">Select Site </option>: 
                                {toSitesData}
                                </select>}
                                <Label/>
                                {errors ? <span className="flexi" style={{color: 'red', fontSize:'12px'}}>{errors}</span>:''} 
                                {transfer? <p className="flexi" style={{color: 'white', fontSize:'16px', backgroundColor:'#023e58'}}>Asset Transferred Successfully</p>:
                                 <button onClick={this.toggleModal} className="form-control btn btn-info" id="seli">Transfer Asset</button>}
                                
                            </form>
                        </Wrapper>}
                    </Wrapper>

                    <Modal  style ={{color: "black"}} isOpen={open} toggle={this.toggleModal} >
                        <ModalHeader toggle={()=>this.setState({open:false})}> Transfer Assets <SwapHorizIcon/></ModalHeader>
                        <ModalBody>Are you want to transfer Asset?</ModalBody>
                        <ModalFooter>
                            <Button type ="submit" size="small" variant="contained" color="primary" onClick={this.handleSubmit}> Yes</Button>
                        </ModalFooter>
                    </Modal>
                    <ToastContainer/>
            </Wrapper>
        )
    }
}
