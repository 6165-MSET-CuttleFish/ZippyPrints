import React from 'react'
import { getAuth } from "firebase/auth";


export default class NavBar extends React.Component {
  Auth = () => {

      return (
        <div className="Auth">
         <a href ="Login" className="Login">Login</a>
         <a href ="Register" className="Login">Register</a>
         <a href ="Logout" className="Login">Log out</a>
      </div> 
        
      );
   
  }
render () {
  return(

      <div className="App">
        <div className="Elements">
        <a href="home">Zippyprints</a>
        <a href="upload">Upload</a>
        <a href="discover">Map</a>
        </div>

          <div>{this.Auth()}</div>
      </div>
      );
  }
}

  
