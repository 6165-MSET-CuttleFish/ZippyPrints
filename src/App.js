import React from 'react';
import  { Home }  from './views/Home';
import { Route, Routes, BrowserRouter  } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import LoginExport from './views/Auth/LoginExport';
import { Map } from './views/Discover'
import Dashboard from "./views/Auth/Dashboard"
import RegisterExport from "./views/Auth/RegisterExport"
import Logout from "./views/Auth/Logout"
import { AuthProvider } from './views/Auth/Auth'
import AuthenticationError from './views/Error/AuthenticationError'
import { Helmet } from 'react-helmet'
import { RedirectCheckProvider } from './views/Auth/RedirectCheck';
import styles from './App.css'
import Verification from './views/Auth/Verification';
import VerifySuccess from './views/Auth/VerifySuccess';
import ResetPassword from './views/Auth/ResetPassword';
import PageNotFound from './views/Error/PageNotFound'
class App extends React.Component {
 

render()  {  
    return (
      <body className = {styles.body}>
      <AuthProvider>
      <Helmet>
        <title>ZippyPrints</title>
        <meta name="description" content="A fast, easy to use, and reliable way for printing custom designs through printers near you!!" />
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
              <Route exact path="/Verification" element={<Verification />} />
              <Route exact path="/VerSuccess" element={<VerifySuccess />} />
              <Route exact path="/Reset" element={<ResetPassword />} />
              <Route exact path="/404" element={<PageNotFound />} />
              <Route path='*' element={<PageNotFound />}/>
            </Routes>
          </RedirectCheckProvider>
        </BrowserRouter>
      </AuthProvider>
      </body>
    );
  }
}
export default App
