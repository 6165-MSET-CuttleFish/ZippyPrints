import React from 'react';
import  { Home }  from './views/Home';
import { Route, Routes, Navigate, BrowserRouter  } from 'react-router-dom';
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
          <Routes>
            <Route exact path="/Home" element={<Home />} />
            <Route exact path="/" element = {<Home />} />
            <Route exact path="/Upload" element={<FileUpload />} />
            <Route exact path="/Login" element={<Auth />} />
            <Route exact path="/Discover" element={<Map />} />
            <Route exact path="/Profile" element={<Dashboard />} />
            <Route exact path="/Register" element={<Auth2 />} />
            <Route exact path="/Logout" element={<loggingOut />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}
export default App
