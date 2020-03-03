import React, { Component , Fragment} from 'react'
import {Wrapper, Table, TableRow, TableBody, TableData, TableHead, TableHeadings, HeadingTag, Break} from '../Dashboard/StyledCompo';
import {BASE_URL, PORT, SITES_API, ReportAPI} from '../../config/config.js'
import axios from 'axios'; import ReportValidation from './validator'
import TablePagination from '@material-ui/core/TablePagination';
import Loading from '../Loading/Loading';
import Chart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';
const date = new Date()
export default class Reporting extends Component {

    _isMounted = false
    constructor(props){
        super(props);
        this.state={
            siteData:[], redirect:false, siteValue:'', errors:'', isSubmitted:false,
            fromDate:'', toValue:'', reportData:undefined, rowsPerPage: 15, options:undefined,
            page: 0, count:0, done: false, week:undefined, month:undefined, daily:'daily', reportingData:[],totalData:undefined,
            optionPie: {
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
                            enabled: true
                      }
                    }
                  }
                }]
            },
            series: [{
                name:'Asset',
                data: [400, 430, 448, 470, 540]
              }],
            optionsBar: {
                plotOptions: {
                    bar: {
                        distributed: true
                    },
                    dataLabels: {
                        show: false,
                    }
                  },
                colors: ["#0992e1",  "#fd3550", '#7f8281',  "#1e5aa0", "#fb551d",],
                legend: {
                  position: 'bottom',
                },
                responsive: [{
                  breakpoint: undefined,
                  options: {
                    chart: {
                        sparkline: {
                            enabled: true
                      }
                    }
                  }
                }],
                chart: {
                    foreColor: '#fff',
                    animations: {
                        speed: 1600,
                    },
                },
                xaxis: {
                    categories: ['Registered Undiscovered', 'Registered Discovered', 'UnAuthorized Entry',  'Stolen', 'In Transit'],
                  },
            },
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
        this.setState({fromDate:'', options:undefined})
      }
    handleChange=()=>{
        this.handleEmpty()
        var e = document.getElementById("site");
        var result = e.options[e.selectedIndex].value;
        alert(result)
        this.setState({
            siteValue:result, errors:undefined
        })
      }
      handleChangeValue=(e)=>{
        let value = e.target.value;
        this.setState({
            options:value
        })
      }
    handleChangeDate=(e)=>{
        let name=e.target.name;
        let value = e.target.value;
        this.setState({
            [name]:value
        })

      }
    
    handleSubmit=(e)=>{
        e.preventDefault();
        // this.setState({ isSubmitted: true, errors:undefined });
        // const { isValid, errors } = ReportValidation(this.state);
        // if (!isValid) {
        //   this.setState({ errors, isSubmitted: false });
        //   return false;
        // } else {
        var token = localStorage.getItem('accessToken');
        var headers =  {'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Bearer '+token}
        axios.get(`https://wts.cs-satms.com:8443/reporting?report_type=daily&site_id=44`, {headers})
        .then(res=>{
           this.setState({reportingData:res.data, totalData:res.data.length})
        }).catch(err=> err)
            
    //    };
    }

    handleChangePage = (event, newPage) => {
        this.setState({page: newPage});
      }
    

    handleChangeRowsPerPage = event => {
        this.setState({rowsPerPage: +event.target.value, page: 0});
      };

    render() {
        const{siteValue, siteData, fromDate, errors, reportData, page, rowsPerPage, count, done, month, week, reportingData, totalData} = this.state;
        const sitesData = siteData.map((item, i)=>(
            <option key={i} value={item.id}>{item.site_name}</option>
            ))

        const finalPie = [400, 430, 448, 470, 540];
        
        if(totalData){
            console.log(reportingData)
        }
        return (
            <Fragment>
                <Wrapper className="col-lg-12" style={{marginTop:'2rem'}}>
                    <HeadingTag className="flexi">WTS Reporting</HeadingTag>
                    {done? <Fragment><Break/><Break/><Break/><Loading/></Fragment>:
                    <Wrapper className="col-lg-12" style={{marginTop:'2rem'}}>
                        <form className="form-group"> 
                            <Wrapper className="row">
                                <Wrapper className="col-lg-2">
                                    <label>Select Site:</label>
                                    <select className="form-control" id="site" name="site" onChange={this.handleChange} value={siteValue}>
                                        <option className="brave" value="" disabled defaultValue>Select Site</option>
                                            {sitesData}
                                    </select>
                                </Wrapper>
                            
                                <Wrapper className="col-lg-2">
                                    <label> Date:</label>
                                    <input className="form-control" id="month" type="month" name='month' max={date} onChange={this.handleChangeDate} value={month}/>
                                </Wrapper>

                                <Wrapper className="col-lg-2">
                                    <label> Date:</label>
                                    <input className="form-control" id="week" type="week" name='week' onChange={this.handleChangeDate} value={week}/>
                                </Wrapper>

                                <Wrapper className="col-lg-3">
                                    <Wrapper style={{marginTop:'2rem', display:'flex', justifyContent:'space-evenly'}}>
                                        <label className="radio-inline"><input type='radio' onChange={this.handleChangeValue} id="daily" name="type" value={1}/> Daily</label>
                                        <label className="radio-inline"><input type='radio' onChange={this.handleChangeValue} id="weekly" name="type" value={7}/> Weekly</label>
                                        <label className="radio-inline"><input type='radio' onChange={this.handleChangeValue} id="monthly" name="type" value={30}/> Monthly</label>
                                    </Wrapper>
                                </Wrapper>
                                <Wrapper className="col-lg-3">
                                    <button className="form-control btn btn-info" id="seli" onClick={this.handleSubmit}>Generate Report</button>
                                </Wrapper>
                                </Wrapper>
                                
                                    {errors? <p className="flexi" style={{color:'red'}}>{errors}</p>:''}
                                <Break/>
                        </form>
                    </Wrapper>}
                    <Wrapper className='col-lg-12'>
                        <Wrapper className='row'>
                            <Wrapper className = 'col-lg-5' style={{marginRight:0, height :`450px`}}>
                                <Chart options={this.state.optionPie} series={finalPie} type="pie" width={`100%`} height={`100%`} />
                            </Wrapper>

                            <Wrapper className='col-lg-7' id="chart">
                                <ReactApexChart options={this.state.optionsBar} series={this.state.series} type="bar" height={416}/>
                            </Wrapper>
                        </Wrapper>
                    </Wrapper>

                    <Break/>

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
                                            <TableData>{i+1}</TableData>
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
