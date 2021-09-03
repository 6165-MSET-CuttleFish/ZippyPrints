import React from 'react';
import  { Home }  from './views/Home';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import './App.css';
import FileUpload from './Upload';
import NavBar from './components/NavBar';

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
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default Lander;
