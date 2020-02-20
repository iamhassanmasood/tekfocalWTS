import React from 'react';
import {useStyles, Wrapper} from '../Dashboard/StyledCompo';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import SiteManagementComponent from './SiteManagementComponent';


export default function SiteManagement() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    return (
        <>
          <HeaderBar state={{ open: [open, setOpen] }}/>
          {open ? <Wrapper className={classes.content}>
            <SiteManagementComponent/>  
          </Wrapper> : <Wrapper className={classes.contentShift}>
            <SiteManagementComponent/> </Wrapper> }
        </>
    )
}
