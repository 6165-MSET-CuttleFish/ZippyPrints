import React from 'react';
import  { Home }  from './views/Home';
import { Route, Switch, Redirect, BrowserRouter  } from 'react-router-dom';
import './App.css';
import FileUpload from './views/Upload/Upload';
import NavBar from './components/NavBar';
import { Auth } from './views/Auth';
import { Map } from './views/Discover'
import Dashboard from "./views/Auth/Dashboard"
import Auth2 from "./views/Auth/Auth2"
import loggingOut from "./views/Auth/Logout"

class App extends React.Component {
 

render()  {  
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
            <Route exact path="/Login" component={Auth} />
            <Route exact path="/Discover" component={Map} />
            <Route exact path="/Profile" component={Dashboard} />
            <Route exact path="/Register" component={Auth2} />
            <Route exact path="/Logout" component={loggingOut} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
export default App
