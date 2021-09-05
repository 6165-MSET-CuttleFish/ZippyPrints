import React from 'react';
import  { Home }  from './views/Home';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import './App.css';
import FileUpload from './Upload';
import NavBar from './components/NavBar';
import { firebaseConfig } from './firebaseConfig';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
