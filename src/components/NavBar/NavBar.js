import React, {useContext} from 'react';
import { AuthContext } from "../../views/Auth/Auth";
import styles from '../NavBar/nav.module.css';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import { MenuContext } from './MenuProvider'


export default function NavBar() {
  const { currentUser } = useContext(AuthContext);
  const { menu, setMenu } = useContext(MenuContext)

    
    return (
      <div className={styles.nav}>
        <div className={styles.App}>
          <div className={styles.elements_mobile}>
            <a className={styles.title_mobile} href="home">ZippyPrints</a>
          </div>

          <div className={styles.elements}>
            <a className={styles.title} href="home">ZippyPrints</a>
            <a href="discover">Map</a>
            <a href="requests">Requests</a>
            <a href="new_requests">New Request</a>
          </div>

          <div className={styles.Auth}>
            {currentUser?.uid != null ? (
              <>
                <a href ="Logout" className={styles.loginButton}>            
                  <div className={styles.loginText}>Log out</div>
                </a>
                <a href ="Dashboard" className={styles.registerButton}>
                  <div className={styles.registerText}>Profile</div>
                </a>
                {/* Insert the Hamburger component here */}
                <div className={styles.menuContainer}>
                  <IconButton onClick={() => setMenu(!menu)}>
                    {!menu && <MenuIcon className={styles.menuIcon}/>}
                    {menu && <CloseIcon className={styles.menuIcon}/>}
                  </IconButton>
                </div>
              </>
                 ) : (
              <>
                <a href="Login" className={styles.loginButton}>
                  <div className={styles.loginText}>Log In</div>
                </a>
                <a href="Register" className={styles.registerButton}>
                  <div className={styles.registerText}>Sign Up</div>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    );
}