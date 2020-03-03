import React, { Fragment } from 'react'
import TablePagination from '@material-ui/core/TablePagination';
import {Wrapper, Table, TableRow, TableBody, TableData, TableHead, TableHeadings, HeadingTag, Break} from '../Dashboard/StyledCompo';
import {BASE_URL, PORT, ALERTS_API} from '../../config/config'
import axios from 'axios'; import { Redirect } from "react-router-dom";
import Loading from '../Loading/Loading';

export default class AlertManagementComponent extends React.PureComponent{
    _isMounted= false
    state = {
        Alertdata: [],
        rowsPerPage: 15,
        page: 0,
        count:undefined,
        redirect:false,
        done:false,
    }

    componentDidMount() {
        this._isMounted = true;
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        this.connectAlert();
        this.setState({done:true})
        axios.get(`${BASE_URL}:${PORT}/${ALERTS_API}/?limit=1&offset=0`, {headers})
        .then(res=> {
            this.setState({count:res.data.count})
            var offset = this.state.count-100; 
        axios.get(`${BASE_URL}:${PORT}/${ALERTS_API}/?limit=100&offset=${offset}`, {headers})
        .then(res=> {
        if (res.status===200) {
           this.setState({
            Alertdata: res.data.results,
            done:false
           })
        }
      }).catch(err =>  {
        if (err.response.data.detail === "Authentication credentials were not provided.") {
            localStorage.removeItem('accessToken');
            this.setState({redirect:true})
          } else return err 
        })
    })}
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

        wss.onerror = err => err? wss.close():''

        wss.onmessage = e=>{
            if (e.data) {
                var data = JSON.parse(e.data);
            }
            var alertMessage = data.message;
            if(alertMessage.length>0){
                let {Alertdata} = this.state;
                Alertdata.unshift({asset_name:alertMessage.split(',')[0], event:alertMessage.split(',')[1], timestamp:alertMessage.split(',')[2]})
                this.setState({Alertdata:Alertdata})
            }
          }
    };

    checkAlert = () => {
        const { wss } = this.state;
        if (!wss || wss.readyState === WebSocket.CLOSED) this.connect();
    };
    componentWillUnmount() {
        this._isMounted = false;
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
        var time = date +' '+ month + ' '+ year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
      }
      
    render(){
    const {Alertdata, page, rowsPerPage} = this.state;
    const rows = Alertdata.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).reverse().map((alt, i)=>{
        var AlertTimeNow;
        if(!alt.timestamp){
            AlertTimeNow = '';
        } else{      
            AlertTimeNow = this.timeConverter(alt.timestamp);
        }
    return <TableRow key={alt.id} style={{height:'30px'}}>
        <TableData >{i+1+rowsPerPage*page}</TableData>
        <TableData >{alt.event}</TableData>
        <TableData>{alt.asset_name}</TableData>
        <TableData>{AlertTimeNow}</TableData>
        </TableRow>})

        if(this.state.redirect){
            return <Redirect to='/login'/>
        }
        return (
            <Fragment>    
                <Break/>
                    <Wrapper className="col-lg-12 boxtt">
                        <HeadingTag>Alerts</HeadingTag>
                        {this.state.done ? (<Fragment><Break/><Break/><Loading/></Fragment>): (
                        <Table className="new-table">
                            <TableHead>
                                <TableRow>
                                    <TableHeadings>Sr#</TableHeadings>
                                    <TableHeadings>Events</TableHeadings>
                                    <TableHeadings>Asset</TableHeadings>
                                    <TableHeadings>Created At</TableHeadings>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows}
                            </TableBody>
                        </Table>)}
                        {Alertdata.length>10?
                        <TablePagination 
                        style={{ color:'white',  backgroundColor:'#1b1b1b'}}
                        rowsPerPageOptions={[10, 15, 20, 100]}
                        component="div"
                        count={Alertdata.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        labelRowsPerPage={'Assets Per Page'}
                        />:''}
                    </Wrapper>
                    <Break/>
            </Fragment>
        )
    }
}