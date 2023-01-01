import React from 'react';
import  { Home }  from './views/Home';
import { Route, Routes, BrowserRouter  } from 'react-router-dom';
import './App.css';
import './views/Auth/Register.css'
import FileUpload from './views/Upload/Upload';
import NavBar from './components/NavBar';
import LoginExport from './views/Auth/LoginExport';
import { Map } from './views/Discover'
import Dashboard from "./views/Auth/Dashboard"
import RegisterExport from "./views/Auth/RegisterExport"
import Logout from "./views/Auth/Logout"
import { AuthProvider } from './views/Auth/Auth'
import AuthenticationError from './views/404/AuthenticationError'
import { Helmet } from 'react-helmet'
import { RedirectCheckProvider } from './views/Auth/RedirectCheck';
class App extends React.Component {
 

render()  {  
    return (
      <AuthProvider>
      <div>
      <Helmet>
        <title>ZippyPrints</title>
        <meta name="description" content="A fast, easy to use, and reliable way for printing custom designs through printers near you!" />
      </Helmet>
        <NavBar />
        <BrowserRouter>
          <RedirectCheckProvider>
            <Routes>
              <Route exact path="/Home" element={<Home />} />
              <Route exact path="/" element = {<Home />} />
              <Route exact path="/Login" element={<LoginExport />} />
              <Route exact path="/Discover" element={<Map />} />
              <Route exact path="/Profile" element={<Dashboard />} />
              <Route exact path="/Register" element={<RegisterExport />} />
              <Route exact path="/Logout" element={<Logout />} />
              <Route exact path="/AuthError" element={<AuthenticationError />} />
            </Routes>
          </RedirectCheckProvider>
        </BrowserRouter>
      </div>
      </AuthProvider>
    );
  }
}
export default App
