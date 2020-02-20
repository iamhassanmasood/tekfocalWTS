import React from 'react';

import SelectComponent from '../../components/Tables/SelectComponent'
import Headerbar from '../../components/HeaderBar/HeaderBar';
import {useStyles, Wrapper, Break} from './StyledCompo'
import './FirstScreen.css'

export const Dashboard = ()=>{
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  return (
    <>
    <Headerbar state={{ open: [open, setOpen] }}/>
    { !open ? <Wrapper className={classes.contentShift}>
      <Break/>
      <SelectComponent />
      </Wrapper >:  <Wrapper className={classes.content}>
      <Break/>
      <SelectComponent/>
      </Wrapper >}  
    </>
  );
}
export default Dashboard;
