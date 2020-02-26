import React, {useState } from "react";
import clsx from "clsx";
import {useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton"; import MenuIcon from "@material-ui/icons/Menu";
import DashboardIcon from '@material-ui/icons/Dashboard'; import AccountTreeIcon from '@material-ui/icons/AccountTree'
import Alerticon from '@material-ui/icons/Notifications'; import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import DevicesOtherIcon from '@material-ui/icons/DevicesOther';
import DomainDisabledIcon from '@material-ui/icons/DomainDisabled';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew'; import ClearIcon from '@material-ui/icons/Clear';
import {useStyles, Wrapper, LogoImage, SideWrapper, IconWrapper, NameItem} from './styled-component'
import Logo from '../../assets/logo/Logo.PNG'; import WhiteLogo from '../../assets/logo/whiteLogo.PNG';
import {useHistory, NavLink} from 'react-router-dom'; import Button from '@material-ui/core/Button';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'; import ReportIcon from '@material-ui/icons/Report';

export const UserContext = React.createContext();

export default function HeaderBar(props) {
  const classes = useStyles();
  const theme = useTheme();
  let history = useHistory();
  const {
    open: [open, setOpen]
  } = {
    open: useState(false),
    ...(props.state || {})
  };
  const [openModal, setOpenModal] = useState(false);
  const handleLogout = ()=> {
    localStorage.removeItem('accessToken');
    localStorage.clear();
    history.push('/login')
  };
  const toggleModal = ()=>{
    setOpenModal(true)
}

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open
        })}>
        <Toolbar style={{padding:"0px"}}>
          <LogoImage className={clsx({[classes.sideBarNamesShift]: open, [classes.sideBarNames]:!open })} src ={WhiteLogo} style={{width:'65px', height:'45px'}}/>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={()=> setOpen(true)}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open
          })}>
            <MenuIcon />
          </IconButton>
          <Wrapper className={classes.grow} />
          <Wrapper >
            <IconButton onClick={() => setOpenModal(true)}>
              <PowerSettingsNewIcon style={{color: "white"}}/>
            </IconButton>
          </Wrapper>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })
        }}>
        <div className={classes.drawerHeader}>
        <LogoImage src ={Logo} style={{height:'40px', width:'120px'}}/>
          <IconButton style={{color: 'white'}} onClick={()=>setOpen(false)}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <SideWrapper>
            <NavLink exact to="/" className='main-nav' activeClassName='main-nav-active'>
              <IconWrapper className="row" title="Dashboard"><DashboardIcon fontSize="small"/>
                <NameItem  className={clsx({[classes.sideBarNames]: open, [classes.sideBarNamesShift]:!open })}> Dashboard</NameItem>
              </IconWrapper>
            </NavLink>
        </SideWrapper>
        <SideWrapper >
            <NavLink exact to="/alerts" className='main-nav' activeClassName='main-nav-active'>
              <IconWrapper className="row" title="Alerts"><Alerticon fontSize="small"/> 
                <NameItem className={clsx({[classes.sideBarNames]: open, [classes.sideBarNamesShift]:!open })}> Alerts </NameItem>
              </IconWrapper>
            </NavLink>
        </SideWrapper>        
        <SideWrapper >
            <NavLink exact to="/sitemanagement" className='main-nav' activeClassName='main-nav-active'>
              <IconWrapper className="row" title="Site Management"><AccountTreeIcon fontSize="small"/> 
                <NameItem className={clsx({[classes.sideBarNames]: open, [classes.sideBarNamesShift]:!open })}> Site Management </NameItem>
              </IconWrapper>
            </NavLink>
        </SideWrapper>        
        <SideWrapper >
            <NavLink exact to="/assetmanagement" className='main-nav' activeClassName='main-nav-active'>
              <IconWrapper className="row" title="Asset Management "><DomainDisabledIcon fontSize="small"/> 
                <NameItem className={clsx({[classes.sideBarNames]: open, [classes.sideBarNamesShift]:!open })}> Asset Management </NameItem>
              </IconWrapper>
            </NavLink>
        </SideWrapper>        
        <SideWrapper >
            <NavLink exact to="/devicemanagement" className='main-nav' activeClassName='main-nav-active'>
              <IconWrapper className="row" title="Device Management"><DevicesOtherIcon fontSize="small"/> 
                <NameItem className={clsx({[classes.sideBarNames]: open, [classes.sideBarNamesShift]:!open })}> Device Management </NameItem>
              </IconWrapper>
            </NavLink>
        </SideWrapper>
        <SideWrapper >
            <NavLink exact to="/transferassets" className='main-nav' activeClassName='main-nav-active'>
              <IconWrapper className="row" title=" Transfer Assets"><SwapHorizontalCircleIcon fontSize="small"/> 
                <NameItem className={clsx({[classes.sideBarNames]: open, [classes.sideBarNamesShift]:!open })}> Transfer Assets </NameItem>
              </IconWrapper>
            </NavLink>
        </SideWrapper>
        <SideWrapper >
            <NavLink exact to="/report" className='main-nav' activeClassName='main-nav-active'>
              <IconWrapper className="row" title=" Transfer Assets"><ReportIcon fontSize="small"/> 
                <NameItem className={clsx({[classes.sideBarNames]: open, [classes.sideBarNamesShift]:!open })}> Reports</NameItem>
              </IconWrapper>
            </NavLink>
        </SideWrapper>
        <SideWrapper >
            <NavLink exact to="/reporting" className='main-nav' activeClassName='main-nav-active'>
              <IconWrapper className="row" title=" Transfer Assets"><TrendingUpIcon fontSize="small"/> 
                <NameItem className={clsx({[classes.sideBarNames]: open, [classes.sideBarNamesShift]:!open })}> Reporting</NameItem>
              </IconWrapper>
            </NavLink>
        </SideWrapper>
      </Drawer>

      <Modal  style ={{color: "black"}} isOpen={openModal} toggle={toggleModal} backdrop={false}>
          <ModalHeader>Logout <PowerSettingsNewIcon/></ModalHeader>
          <ModalBody>Are you want to Logout?</ModalBody>
          <ModalFooter>
          <Button type ="submit" size="small" variant="contained" color="secondary" onClick={handleLogout}><PowerSettingsNewIcon/>Logout</Button>
                  <span></span>
          <Button type ="submit" size="small" variant="contained" color="primary" onClick={() => setOpenModal(false)}><ClearIcon />Cancel</Button>
          </ModalFooter>
      </Modal>


    </div>
  );
}
