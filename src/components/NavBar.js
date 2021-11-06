import React, {useState} from 'react'
import Controls from "../components/actions/Controls";
import Popup from "./Popup";
import { createTheme, ThemeProvider } from '@mui/material';
import LoginForm from '../views/Auth/LoginForm'


function NavBar() {
  const [openPopup, setOpenPopup] = useState(false)

    return (
      <div className="App">
        <div className="Elements">
        <a href="home">Home</a>
        <a href="about">About</a>
        <a href="examples">Examples</a>
        <a href="contact">Contact</a>
        </div>

        <div className="Auth">
          <a href ="Auth" className="Login">Get Started</a>
        </div>
        <ThemeProvider theme = {color}>
        <Controls.Button
        text = "Login"
        variant = "contained"
        size = "large"
        color = "white"
        onClick={() => setOpenPopup(true)}>
        
      </Controls.Button>
      </ThemeProvider>
      <Popup 
        title = "Login"
        openPopup={openPopup}
        setOpenPopup={setOpenPopup}>
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