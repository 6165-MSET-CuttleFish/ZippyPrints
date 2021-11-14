import React from 'react';
import  { Home }  from './views/Home';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import './App.css';
import FileUpload from './views/Upload/Upload';
import NavBar from './components/NavBar';
import { Auth } from './views/Auth';
import { Map } from './views/Discover'

function Lander() {
  return (
    <div>
      <NavBar />
      <BrowserRouter>
        <Switch>
          <Route exact path="/Home" component={Home} />
          <Route exact path="/">
            <Redirect to="/Home" />
          </Route>
          <Route exact path="/About" component={FileUpload} />
          <Route exact path="/Auth" component={Auth} />
          <Route exact path="/Discover" component={Map} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default Lander;
