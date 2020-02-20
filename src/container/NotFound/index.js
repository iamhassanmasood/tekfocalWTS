import React from 'react';
import {useStyles, Wrapper} from '../Dashboard/StyledCompo';
import HeaderBar from '../../components/HeaderBar/HeaderBar';
import NotFound from './NotFound';


export default function SiteManagement() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    return (
        <>
          <HeaderBar state={{ open: [open, setOpen] }}/>
          {open ? <Wrapper className={classes.content}>
            <NotFound/>  
          </Wrapper> : <Wrapper className={classes.contentShift}>
            <NotFound/> </Wrapper> }
        </>
    )
}
