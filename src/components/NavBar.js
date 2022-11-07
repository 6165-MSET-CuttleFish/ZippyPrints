import React, { useContext } from 'react'
import { AuthContext } from "../views/Auth/Auth";


export default class NavBar extends React.Component {
  static contextType = AuthContext;
  
render () {
  const {currentUser} = this.context;
  if (currentUser?.uid != null) {
    return (
      <div>
      <div className="App">
        <div className="Elements">
        <a href="home">Zippyprints </a>
        <a href="discover">Map</a>
        </div>
        <div className="Auth">
       <a href ="Logout" className="Login">Log out</a>
       <a href ="Profile" className="Login">Profile</a>
      </div>

    </div> 
    </div>
    );
  } else {
    return (
      <div className="App">
        <div className="Elements">
          <a href="home">Zippyprints</a>
          <a href="discover">Map</a>
        </div>
        <div className="Auth">
          <a href ="Login" className="Login">Login</a>
          <a href ="Register" className="Login">Register</a>
        </div> 
      </div>
      

    );
  }
  }
}

  
NavBar.contextType = AuthContext;