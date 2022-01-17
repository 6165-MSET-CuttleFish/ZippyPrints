import React from 'react';
import  { Home }  from './views/Home';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import './App.css';
import FileUpload from './views/Upload/Upload';
import NavBar from './components/NavBar';
import { Auth } from './views/Auth';
import { Map } from './views/Discover'
import Dashboard from "./views/Auth/Dashboard"
import Auth2 from "./views/Auth/Auth2"
import { getAuth, onAuthStateChanged } from "firebase/auth";


function Lander() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
  return (
    <div>
      {auth.currentUser?.uid}
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
          <Route exact path="/Dashboard" component={Dashboard} />
          <Route exact path="/Auth2" component={Auth2} />



        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default Lander;
