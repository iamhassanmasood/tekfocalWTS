import React, { Component, Fragment } from 'react'
import {Wrapper, Table, TableRow, TableBody, TableData, TableHead, TableHeadings, HeadingTag, Break} from '../Dashboard/StyledCompo';
import {BASE_URL, PORT, SITES_API, ASSET_BY_SITE, ReportAPI} from '../../config/config.js'
import axios from 'axios'; import ReportValidation from './validator'
import TablePagination from '@material-ui/core/TablePagination';
import Loading from '../Loading/Loading';
import { Redirect } from "react-router-dom";

export default class Reports extends Component {
    _isMounted = false
    constructor(props){
        super(props);
        this.state={
            siteData:[], assetsData:[], redirect:false, siteValue:'', errors:'', isSubmitted:false,
            assetValue:'', fromDate:'', toDate:'', reportData:undefined, rowsPerPage: 15,
            page: 0, count:0, done: false
        }
        
    }
    componentDidMount(){
        this._isMounted = true;
        this.setState({done:true})
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        axios.get(`${BASE_URL}:${PORT}/${SITES_API}/`, {headers})
        .then(res=> {
            if (res.status === 200) {
               this.setState({ siteData : res.data.results, done: false})
               }
             })
        .catch(err =>  {
            if (err.response.data.detail === "Authentication credentials were not provided.") {
                localStorage.removeItem('accessToken');
                this.setState({redirect:true})
              } else return err
        })
    }
    componentWillUnmount() {
        this._isMounted = false;
      }
  
    handleEmpty=()=>{
        this.setState({siteValue:'', assetValue:'', fromDate:'', toDate:''})
      }
    handleChange=()=>{
        this.handleEmpty()
        var e = document.getElementById("site");
        var result = e.options[e.selectedIndex].value;
        this.setState({
            siteValue:result, errors:undefined
        })
        this.handleChangeAssets(result);
      }
    handleChangeAst=()=>{
        let e = document.getElementById("asset");
        let result = e.options[e.selectedIndex].value;
        this.setState({
            assetValue:result, errors:undefined
        })
      }
    handleChangeDate=(e)=>{
        let name=e.target.name;
        let value = e.target.value;
        this.setState({
            [name]:value
        })

      }

    handleChangeAssets=(id)=>{
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        axios.get(`${BASE_URL}:${PORT}/${ASSET_BY_SITE}${id}`, {headers})
        .then(res=> {
            if (this._isMounted) {
                this.setState({
                    assetsData: res.data
                })
            }
        }).catch(err => err)
      }
    
    handleSubmit=(e)=>{
        e.preventDefault();
        this.setState({ isSubmitted: true, errors:undefined });
        const { isValid, errors } = ReportValidation(this.state);
        if (!isValid) {
          this.setState({ errors, isSubmitted: false });
          return false;
        } else {
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        const {siteValue, assetValue, fromDate, toDate}=this.state;
        const fromTime = (new Date(fromDate).getTime())/1000;
        const toTime = (new Date(toDate).getTime())/1000+86400;
        let body = "site_id="+siteValue+"&asset_id="+assetValue+"&from_time="+fromTime+"&to_time="+toTime;
        axios.post(`${BASE_URL}:${PORT}/${ReportAPI}`, body, {headers})
        .then(res=>{
            if(res.status === 200){
                var arr = [];
                for(var i=0;i<res.data.length;i++){
                    arr.unshift({site_name: res.data[i][0], asset_name: res.data[i][1], event: res.data[i][2]  })
                }
                this.setState({
                    reportData:arr,
                    isSubmitted: true,
                    errors:undefined,
                    count:res.data.length
                })
            }
        }).catch(err=> err)
            
       };
    }

    handleChangePage = (event, newPage) => {
        this.setState({page: newPage});
      }
    

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: +event.target.value, page: 0});
      };

    render() {
        const{siteValue, assetValue, siteData, assetsData, fromDate, toDate, errors, reportData, page, rowsPerPage, count, done} = this.state;
        const sitesData = siteData.map((item, i)=>(
            <option key={i} value={item.id}>{item.site_name}</option>
            ))

        const assetData = assetsData.map((item, i)=>(
            <option key={i} value={item[10]}>{item[1]}</option>
            ))

        if(this.state.redirect){
            return <Redirect to='/login'/>
        }

        return (
            <Fragment>
                <Wrapper className="col-lg-12" style={{marginTop:'2rem'}}>
                    <HeadingTag className="flexi">Reports</HeadingTag>
                    {done? <Fragment><Break/><Break/><Break/><Loading/></Fragment>:
                    <Wrapper className="col-lg-12" style={{marginTop:'2rem'}}>
                        <form className="form-group"> 
                            <Wrapper className="row">
                                <Wrapper className="col-lg-3">
                                    <label>Select Site:</label>
                                    <select className="form-control" id="site" name="site" onChange={this.handleChange} value={siteValue}>
                                        <option  className="brave" value="" disabled defaultValue>Select Site</option>
                                            {sitesData}
                                    </select>
                                </Wrapper>
                                
                                <Wrapper className="col-lg-3">
                                <label>Select Asset:</label>
                                {!siteValue ? <select className="form-control" id="asset" name ="asset" disabled value={assetValue}>
                                    <option className="brave" defaultValue>Select Site First</option>
                                    {assetData}
                                </select>: assetsData.length === 0 ? <select className="form-control" id="asset" name ="asset" disabled value={assetValue}>
                                    <option  className="brave" defaultValue>No Asset Available</option>
                                    {assetData}
                                </select>: <select className="form-control" id="asset" name ="asset" onChange={this.handleChangeAst} value={assetValue}>
                                    <option  className="brave" defaultValue>Select Asset</option>
                                    {assetData}
                                    <option  className="brave" value={0}>All Assets</option>
                                </select>}
                                </Wrapper>
                                
                                <Wrapper className="col-lg-3">
                                    <label>From Date:</label>
                                    <input className="form-control" type='date' name='fromDate' onChange={this.handleChangeDate} value={fromDate}/>
                                </Wrapper>

                                <Wrapper className="col-lg-3">
                                    <label>To Date:</label>
                                    <input className="form-control" type='date' name='toDate' onChange={this.handleChangeDate} value={toDate}/>
                                </Wrapper>
                                </Wrapper>
                                
                                <Wrapper className="col-lg-3 flexi">
                                    <button className="form-control btn btn-info" id="seli" onClick={this.handleSubmit}>Get Report</button>
                                </Wrapper>
                                    {errors? <p className="flexi" style={{color:'red'}}>{errors}</p>:''}
                                <Break/>
                        </form>
                    </Wrapper>}

                    {!done?<Wrapper className="col-lg-12">
                        <Table className="new-table" >
                            <TableHead>
                                <TableRow>
                                    <TableHeadings style={{width:'10%'}}>Sr#</TableHeadings>
                                    <TableHeadings style={{width:'20%'}}>Site</TableHeadings>
                                    <TableHeadings style={{width:'20%'}}>Asset</TableHeadings>
                                    <TableHeadings style={{width:'50%'}}>Event</TableHeadings>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reportData!==undefined ? reportData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i)=> (
                                        <TableRow key={i}>
                                            <TableData>{i+1+rowsPerPage*page}</TableData>
                                            <TableData>{item.site_name}</TableData>
                                            <TableData>{item.asset_name}</TableData>
                                            <TableData>{item.event}</TableData>
                                        </TableRow>))
                                    :undefined}
                            </TableBody>
                        </Table>
                        {reportData===undefined ? <p className="flexi" style={{color:'red'}}> No Data Found</p>: count ===0?<p className="flexi" style={{color:'red'}}> No Data Available Right Now</p>: ''}

                        {count>15?
                        <TablePagination 
                            style={{ color:'white',  backgroundColor:'#1b1b1b'}}
                            rowsPerPageOptions={[15, 25, 100]}
                            component="div"
                            count={count}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={this.handleChangePage}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            labelRowsPerPage={'Alerts Per Page'}
                        />:''}

                    </Wrapper>:''}
                </Wrapper>
            </Fragment>
        )
    }
}
