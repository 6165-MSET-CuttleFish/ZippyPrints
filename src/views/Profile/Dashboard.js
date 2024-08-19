import React, { useState, useEffect, useContext } from 'react';
import Location from './Location'
import Account from './Account'
import Printer from './Printer'
import { Paper, Button } from '@mui/material'
import styles from './dashboard.module.css'
import { AuthContext } from "../Auth/Auth";
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [active, setActive] = useState("Account Details");
    const [locationColor, setLocationColor] = useState('#FFC107');
    const [accountColor, setAccountColor] = useState('#FFC107');
    const [printerColor, setPrinterColor] = useState('#FFC107');
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        const checkViewable = () => {
          if (!currentUser) {
            navigate("/login")
          } else if (!currentUser.emailVerified) {
            navigate("/verification")
          } else if (currentUser?.displayName == null) {
              navigate("/setup");
          }
        };
        checkViewable();
    }, [currentUser]);

    useEffect(() => {    
        const handleColor = () => {
            switch(active) {
                case "Location":
                    setLocationColor("#FFC107");
                    setAccountColor("#717B8C");
                    setPrinterColor("#717B8C");
                    break;
                case "Account Details":
                    setAccountColor("#FFC107");
                    setPrinterColor("#717B8C");
                    setLocationColor("#717B8C");
                    break;
                case "Your Printer":
                    setPrinterColor("#FFC107");
                    setAccountColor("#717B8C");
                    setLocationColor("#717B8C");
                    break;
                default:
            }
        }
       handleColor();
    }, [active])
    return (
        <div className={styles.columnContainer}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>Account Settings</div>
            </div>
            <div className={styles.bodyContainer}>
                {/* NavBar for Settings */}
                <div className={styles.dashboardNav}>
                    <Button 
                        variant="text"
                        sx={{
                            border: 0,
                            textTransform: 'none',
                            color: accountColor,
                        }}
                        onClick={() => setActive("Account Details")}
                    >
                        <div className={styles.dashboardButtonText}>Account Details</div>
                    </Button>
                    <Button 
                        variant="text"
                        text="Location"
                        sx={{
                            border: 0,
                            textTransform: 'none',
                            color: locationColor
                        }}
                        onClick={() => setActive("Location")}>
                        <div className={styles.dashboardButtonText}>Location</div>
                    </Button>
                    <Button 
                        variant="text"
                        sx={{
                            border: 0,
                            textTransform: 'none',
                            color: printerColor,
                        }}
                        onClick={() => setActive("Your Printer")}
                    >
                        <div className={styles.dashboardButtonText}>Your Printer</div>
                    </Button>
                </div>
                {/* Different pages for settings */}
                {active === "Location" && <Location/>}
                {active === "Account Details" && <Account/>}
                {active === "Your Printer" && <Printer/>}
            </div>
        </div>
    );
}
export default Dashboard