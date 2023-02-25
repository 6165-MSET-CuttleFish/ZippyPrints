import React, { useState, useEffect } from 'react';
import Location from './Location'
import Account from './Account'
import { Paper, Button } from '@mui/material'
import styles from './dashboard.module.css'
import Controls from '../../components/actions/Controls'
function Dashboard() {
    const [active, setActive] = useState("Location");
    const [locationColor, setLocationColor] = useState('#717B8C');
    const [accountColor, setAccountColor] = useState('#717B8C');
    const [printerColor, setPrinterColor] = useState('#717B8C');

    useEffect(() => {    
        const handleColor = () => {
            switch(active) {
                case "Location":
                    setLocationColor("#094FB7");
                    setAccountColor("#717B8C");
                    setPrinterColor("#717B8C");
                    break;
                case "Account Settings":
                    setAccountColor("#094FB7");
                    setPrinterColor("#717B8C");
                    setLocationColor("#717B8C");
                    break;
                case "Your Printer":
                    setPrinterColor("#094FB7");
                    setAccountColor("#717B8C");
                    setLocationColor("#717B8C");
                    break;
                default:
            }
        }
       handleColor();
    }, [active])
    return (
        <div className={styles.container}>
            <Paper 
                sx={{
                    backgroundColor: "#F0F5FF",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    border: '1px solid',
                    borderColor: 'rgba(230, 232, 236, 0.502)',
                    borderRadius: '5px',
                    gap: '32px',
                    width: '75vw',
                    height: '60vh',
                    marginRight: '2.25vw',
                }}            
            >
                <div className={styles.dashboardNav}>
                    <Button 
                        variant="text"
                        text="Location"
                        sx={{
                            border: 0,
                            textTransform: 'none',
                            color: locationColor
                        }}
                        onClick={() => setActive("Location")}
                    >
                        <div className={styles.dashboardButtonText}>Location</div>
                    </Button>
                    <Button 
                        variant="text"
                        sx={{
                            border: 0,
                            textTransform: 'none',
                            color: accountColor,
                            
                        }}
                        onClick={() => setActive("Account Settings")}
                    >
                        <div className={styles.dashboardButtonText}>Account Settings</div>
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
                {active === "Location" && <Location/>}
                {active === "Account Settings" && <Account/>}
                {active === "Your Printer" && <Location/>}

            </Paper>
        </div>
    );
}
export default Dashboard