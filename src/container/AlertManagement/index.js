import React from 'react'
import {useStyles, Wrapper } from '../Dashboard/StyledCompo';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import AlertManagementComponent from './AlertManagementComponent';

export default function AlertManagement() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <HeaderBar state={{ open: [open, setOpen] }}/>
            {open ? <Wrapper className={classes.content}>
                <AlertManagementComponent/> 
            </Wrapper> : <Wrapper className={classes.contentShift}>
                <AlertManagementComponent/></Wrapper> }          
        </>
    )
}
