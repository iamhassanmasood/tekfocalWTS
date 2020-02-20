import React from 'react'
import AssetManagementComponent from './AssetManagementComponent'
import {useStyles, Wrapper} from '../Dashboard/StyledCompo';
import HeaderBar from '../../components/HeaderBar/HeaderBar';

export default function AssetManagement() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    return (
        <>    
            <HeaderBar state={{ open: [open, setOpen] }}/>
            {open ? <Wrapper className={classes.content}>
                <AssetManagementComponent/> 
            </Wrapper> : <Wrapper className={classes.contentShift}>
                <AssetManagementComponent/></Wrapper> }         
        </>
    )
}
