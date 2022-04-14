import React from 'react'
import { getAuth } from "firebase/auth";


export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: ""
    };
  }
  componentDidMount() {
    (async() => {
      const useruid = await getAuth()?.currentUser?.uid
      this.setState({ user: await getAuth()?.currentUser?.uid });
      this.state.user = useruid;
    })();
  }
  componentDidUpdate() {
    (async() => {
      this.state.user = await getAuth()?.currentUser?.uid;
      this.setState({ user: await getAuth()?.currentUser?.uid });
    })();
  }

 
render () {
  return(

      <div className="App">
        <div className="Elements">
        <a href="home">Zippyprints</a>
        <a href="about">Upload</a>
        <a href="discover">Map</a>
        </div>

        <div className="Auth">
          {this.state.user? ( <a href ="Login" className="Login">Login</a>) : null}
          {this.state.user? (<a href ="Register" className="Login">Register</a>): null}
          {!this.state.user? (<a href ="Profile" className="Login">Edit Profile</a>) : null}
          {!this.state.user? (<a href ="Logout" className="Login">Log out</a>): null}
        </div>
      </div>
      );
  }
}

  
