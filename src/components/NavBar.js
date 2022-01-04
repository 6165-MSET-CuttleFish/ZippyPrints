import React, {useState} from 'react'
import Controls from "../components/actions/Controls";
import Popup from "./Popup";
import { createTheme, ThemeProvider } from '@mui/material';
import LoginForm from '../views/Auth/LoginForm'


function NavBar() {
  const [openLoginPopup, setOpenLoginPopup] = useState(false)
  const handleLoginButton = () => {
    setOpenLoginPopup(true)
  }
    return (
      <div className="App">
        <div className="Elements">
        <a href="home">Home</a>
        <a href="about">About</a>
        <a href="examples">Examples</a>
        <a href="discover">Find Printers</a>
        </div>

        <div className="Auth">
          <a href ="Auth" className="Login">Login</a>
          <a href ="Auth2" className="Register">Register</a>
        </div>
        <ThemeProvider theme = {color}>
        <Controls.Button
        text = "Login"
        variant = "contained"
        size = "large"
        color = "white"
        onClick = {handleLoginButton}>
        
      </Controls.Button>
      </ThemeProvider>
      <Popup 
        title = "Login"
        openPopup={openLoginPopup}
        setOpenPopup={setOpenLoginPopup}>
        <LoginForm/>
      </Popup>
      </div>
    
    );
  }
  const color = createTheme({
    palette: {
      white: {
        main: '#FFFFFF',
      },
      red: {
        main: ''
      },
    },
  });
  
export default NavBar;