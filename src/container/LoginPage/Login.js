import React, { Component, Fragment } from 'react'
import {TextFieldinput, Form, Wrapper, Title, CenterWrapper} from './styled-component'
import Logo from '../../assets/logo/Logo.PNG'
import './Login.css'
import loginValidation from './validator';
import axios from 'axios'
import {BASE_URL, PORT, LOGIN, CLIENT_ID, CLIENT_SECRET} from '../../config/config'
import { Redirect } from 'react-router';
import Loading from '../Loading/Loading';

export default class Login extends Component {
    constructor(props){
        super(props)
        this.state={
            username:'',
            password: '',
            isSubmitted: false,
            errors: undefined,
            accessToken: undefined,
            refreshToken: undefined,
            loading:false
        }
       
    }

    handleUserInput = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({[name]: value, errors:""});
      }

      handleSubmit=(e)=>{
        e.preventDefault();
        this.setState({ isSubmitted: true, errors:undefined });

        const { isValid, errors } = loginValidation(this.state);
        if (!isValid) {
          this.setState({ errors, isSubmitted: false });
          return false;
        } else {
            const username = this.state.username;
            const password = this.state.password;
            const CLIENT64 = btoa( CLIENT_ID +":"+ CLIENT_SECRET);
            let body = "grant_type=password&username="+username+"&password="+password;
            let headers =  { 'Content-Type' : 'application/x-www-form-urlencoded', 'Authorization':'Basic '+ CLIENT64 }
            this.setState({loading:true})
            axios.post(`${BASE_URL}:${PORT}/${LOGIN}/`, body, {headers})
                .then(res =>{
                    localStorage.setItem('accessToken', res.data.access_token);
                    localStorage.setItem('expiry', res.data.expires_in);
                    localStorage.setItem('refreshToken', res.data.refresh_token);
                    if(res.status===200){
                        this.props.history.push("/");
                        this.setState({
                            accessToken : res.data.access_token,
                            refreshToken : res.data.refresh_token,
                            isSubmitted:true,
                            loading:false
                        })
                    }
                 })
                 .catch(err => err ? this.setState({
                     errors: "Invalid Username or Password",
                     isSubmitted:false,
                     loading:false
                    }): ''
                 );
        } 
      };
      
    render() {
        if(localStorage.getItem('accessToken')) return <Redirect to ='/'/>
        const {username, password, errors} = this.state;
        return (
        <Fragment>
            <Wrapper className="col-lg-12">
                <CenterWrapper className="card">
                    <img alt ="" src={Logo} style={{marginTop: '110px'}}/>
                
                    <Form onSubmit={this.handleSubmit} style={{marginBottom: '70px'}}>
                        <Title style={{color: 'gray'}}>Login</Title>
                        {errors ? <span style={{color: 'red'}}>{errors}</span>
                        : <span style={{color: 'gray', fontSize:'12px'}}>Please enter your username and Password to Login</span>}
                        <Wrapper className={`form-group`} >
                            <TextFieldinput 
                                type="text" 
                                name="username"
                                className="form-control login-form textbox-margin" 
                                value={username.trim()}
                                onChange={this.handleUserInput}
                                placeholder="Username"
                                />
                        </Wrapper>
                        
                        <Wrapper className={`form-group `}>
                            <TextFieldinput 
                                type="password" 
                                name="password"
                                className="form-control  login-form" 
                                value={password.trim()}
                                onChange={this.handleUserInput}
                                placeholder="Password"
                                />
                        </Wrapper>
                        <Wrapper className={`form-group`}>
                           <button type="submit" className="form-control login-form btn btn-info">Login</button>
                        </Wrapper>
                           {this.state.loading? <Wrapper> <br/><Loading /></Wrapper>:''}

                    </Form>
                </CenterWrapper>
            </Wrapper>
        </Fragment>
        )
    }
}
