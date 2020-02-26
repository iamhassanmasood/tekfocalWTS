import React from 'react';
import Dashboard from './container/Dashboard/Dashboard'
import Login from './container/LoginPage/Login'

import {
  BrowserRouter as Router,
  Route, Redirect, Switch
} from "react-router-dom";
import DeviceManagement from './container/DeviceManagement';
import SiteManagement from './container/SiteManagement';
import AlertManagement from './container/AlertManagement';
import TransferAssets from './container/TransferAssets'
import AssetManagement from './container/AssetManagement'
import Reports from './container/Reports'
import Reporting from './container/Reporting'
import NotFound from './container/NotFound'

const AuthenticatedRoutes =  ({component: Component, ...rest})=>(
    <Route
      {...rest}
      render={props =>
        localStorage.getItem("accessToken") ?(
          <Component {...props} />
        ) : (
          <Redirect to={{
            pathname:"/login"
          }}/>
        )
      }
    />
  
)

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login}/>
        <AuthenticatedRoutes exact path="/" component={Dashboard}/>
        <AuthenticatedRoutes exact path="/devicemanagement" component={DeviceManagement}/>
        <AuthenticatedRoutes exact path="/sitemanagement" component={SiteManagement}/>
        <AuthenticatedRoutes exact path="/alerts" component={AlertManagement}/>
        <AuthenticatedRoutes exact path="/transferassets" component={TransferAssets}/>
        <AuthenticatedRoutes exact path="/assetmanagement" component={AssetManagement}/>
        <AuthenticatedRoutes exact path="/report" component={Reports}/>
        <AuthenticatedRoutes exact path="/reporting" component={Reporting}/>
        <AuthenticatedRoutes exact path="/*" component={NotFound}/>
      </Switch>
    </Router>
    
  )
}

export default App;