import React, { useState, useEffect, useContext } from 'react';
import { Paper, Button } from '@mui/material'
import styles from './requests.module.css'
import { AuthContext } from "../Auth/Auth";
import CNC from './CNC'
import Printer from './Printer'
import LaserCutter from './LaserCutter'
import { useNavigate } from 'react-router-dom';




function NewRequests() {
    const [active, setActive] = useState("");
    const [printer, setPrinter] = useState('#717B8C');
    const [laserCutter, setLaserCutter] = useState('#717B8C');
    const [cnc, setCNC] = useState('#717B8C');
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
                case "3D Printer":
                    setPrinter("#094FB7");
                    setLaserCutter("#717B8C");
                    setCNC("#717B8C");
                    break;
                case "Laser Cutter":
                    setPrinter("#717B8C");
                    setLaserCutter("#094FB7");
                    setCNC("#717B8C");
                    break;
                case "CNC":
                    setPrinter("#717B8C");
                    setLaserCutter("#717B8C");
                    setCNC("#094FB7");
                    break;
                default:
            }
        }
       handleColor();
    }, [active])
    
    return (
        <div className={styles.entireContainer}>
            <div className={styles.dashboardTitle}>Need something? Choose a service below!</div>
            <div className={styles.container}>
            <Paper 
                sx={{
                    backgroundColor: "#F0F5FF",
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    border: '1px solid',
                    borderColor: 'rgba(230, 232, 236, 0.502)',
                    borderRadius: '5px',
                    gap: '32px',
                    width: '75vw',
                    height: 'clamp:(700px, 65vh, 2000px)',
                    marginRight: '2.25vw',
                }}            
            >
                <div className={styles.dashboardNav}>
                    <Button 
                        variant="text"
                        text="3D Printer"
                        sx={{
                            border: 0,
                            textTransform: 'none',
                            color: printer
                        }}
                        onClick={() => setActive("3D Printer")}
                    >
                        <div className={styles.dashboardButtonText}>3D Printer</div>
                    </Button>
                    <Button 
                        variant="text"
                        sx={{
                            border: 0,
                            textTransform: 'none',
                            color: laserCutter,
                            
                        }}
                        onClick={() => setActive("Laser Cutter")}
                    >
                        <div className={styles.dashboardButtonText}>Laser Cutter</div>
                    </Button>
                    <Button 
                        variant="text"
                        sx={{
                            border: 0,
                            textTransform: 'none',
                            color: cnc,
                        }}
                        onClick={() => setActive("CNC")}
                    >
                        <div className={styles.dashboardButtonText}>CNC</div>
                    </Button>
                </div>
                {active === "3D Printer" && <Printer/>}
                {active === "Laser Cutter" && <LaserCutter/>}
                {active === "CNC" && <CNC/>}
            </Paper>
        </div>
        </div>
    );
} 
export default NewRequests