import React from 'react';
import  { Home }  from './views/Home';
import { Route, Routes, BrowserRouter  } from 'react-router-dom';
import './App.css';
import FileUpload from './views/Upload/Upload';
import NavBar from './components/NavBar';
import LoginExport from './views/Auth/LoginExport';
import { Map } from './views/Discover'
import Dashboard from "./views/Auth/Dashboard"
import RegisterExport from "./views/Auth/RegisterExport"
import Logout from "./views/Auth/Logout"
import { AuthProvider } from './views/Auth/Auth'

class App extends React.Component {
 

render()  {  
    return (
      <AuthProvider>
      <div>
        <NavBar />
        <BrowserRouter>
          <Routes>
            <Route exact path="/Home" element={<Home />} />
            <Route exact path="/" element = {<Home />} />
            <Route exact path="/Upload" element={<FileUpload />} />
            <Route exact path="/Login" element={<LoginExport />} />
            <Route exact path="/Discover" element={<Map />} />
            <Route exact path="/Profile" element={<Dashboard />} />
            <Route exact path="/Register" element={<RegisterExport />} />
            <Route exact path="/Logout" element={<Logout />} />
          </Routes>
        </BrowserRouter>
      </div>
      </AuthProvider>
    );
  }
}
export default App
