import React, { useContext } from 'react'
import { AuthContext } from "../../views/Auth/Auth";
import styles from '../NavBar/nav.module.css'


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
        <a href="requests">Requests</a>
        <a href="new_requests">Make a Request</a>
        </div>
        <div className="Auth">
       <a href ="Logout" className={styles.loginButton}>            
        <div className={styles.loginText}>Log out</div>
      </a>
       <a href ="Dashboard" className={styles.registerButton}>
         <div className={styles.registerText}>Profile</div>
       </a>
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
          <a href="requests">Requests</a>
          <a href="new_requests">Make a Request</a>
        </div>

        <div className="Auth">
          <a href ="Login" className={styles.loginButton}>
            <div className={styles.loginText}>Login</div>
          </a>
          <a href ="Register" className={styles.registerButton}>
            <div className={styles.registerText}>Register</div>
          </a>
        </div> 

      </div>
    );
  }
  }
}

  
NavBar.contextType = AuthContext;