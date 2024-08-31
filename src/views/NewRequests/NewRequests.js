import React, { useState, useEffect, useContext } from 'react';
import { Paper, Button } from '@mui/material'
import styles from './requests.module.css'
import { AuthContext } from "../Auth/Auth";
import CNC from './CNC'
import Printer from './Printer'
import LaserCutter from './LaserCutter'
import { useNavigate } from 'react-router-dom';
import { MenuContext } from '../../components/NavBar/MenuProvider';
import Menu from '../../components/NavBar/Menu';


function NewRequests() {
    const [active, setActive] = useState("3D Printing");
    const [printer, setPrinter] = useState('#717B8C');
    const [laserCutter, setLaserCutter] = useState('#717B8C');
    const [cnc, setCNC] = useState('#717B8C');
    const {currentUser} = useContext(AuthContext);
    const {menu} = useContext(MenuContext)
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
                case "3D Printing":
                    setPrinter("#FFC107");
                    setLaserCutter("#717B8C");
                    setCNC("#717B8C");
                    break;
                case "Laser Cutting":
                    setPrinter("#717B8C");
                    setLaserCutter("#FFC107");
                    setCNC("#717B8C");
                    break;
                case "CNC":
                    setPrinter("#717B8C");
                    setLaserCutter("#717B8C");
                    setCNC("#FFC107");
                    break;
                default:
            }
        }
       handleColor();
    }, [active])
    
    return (
    <>
        {menu?
            <Menu />
        :
        <div className={styles.columnContainer}>
            <div className={styles.titleContainer}>
                <div className={styles.title}>Request a Part</div>
                <div className={styles.subtitle}>Need something made? Choose a service below!</div>
            </div>
            <div className={styles.bodyContainer}>
                <div className={styles.requestNav}>
                    <Button 
                        variant="text"
                        text="3D Printing"
                        sx={{
                            border: 0,
                            textTransform: 'none',
                            color: printer
                        }}
                        onClick={() => setActive("3D Printing")}
                    >
                        <div className={styles.requestButtonText}>3D Printing</div>
                    </Button>
                    <Button 
                        variant="text"
                        sx={{
                            border: 0,
                            textTransform: 'none',
                            color: laserCutter,
                            
                        }}
                        onClick={() => setActive("Laser Cutting")}
                    >
                        <div className={styles.requestButtonText}>Laser Cutting</div>
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
                        <div className={styles.requestButtonText}>CNC</div>
                    </Button>
                </div>
                {active === "3D Printing" && <Printer/>}
                {active === "Laser Cutting" && <LaserCutter/>}
                {active === "CNC" && <CNC/>}
            </div>
        </div>
    }
    </>
    );
} 
export default NewRequests