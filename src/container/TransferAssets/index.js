import React from 'react'
import TransferAssetsComponent from './TransferAssetsComponent'
import {useStyles, Wrapper } from '../Dashboard/StyledCompo';
import HeaderBar from '../../components/HeaderBar/HeaderBar';

export default function TransferAssets() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <HeaderBar state={{ open: [open, setOpen] }}/>
            {open ? <Wrapper className={classes.content}>
                <TransferAssetsComponent/> 
            </Wrapper> : <Wrapper className={classes.contentShift}>
                <TransferAssetsComponent/></Wrapper> }          
        </>
    )
}
