import React from 'react'
import DeviceManagementComponent from './DeviceManagementComponent'
import {useStyles, Wrapper } from '../Dashboard/StyledCompo';
import HeaderBar from '../../components/HeaderBar/HeaderBar';

export default function DeviceManagement() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <HeaderBar state={{ open: [open, setOpen] }}/>
            {open ? <Wrapper className={classes.content}>
                <DeviceManagementComponent/> 
            </Wrapper> : <Wrapper className={classes.contentShift}>
                <DeviceManagementComponent/></Wrapper> }          
        </>
    )
}
