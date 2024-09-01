import React, { useState, useEffect, useContext } from 'react';
import Location from './Location'
import Account from './Account'
import Printer from './Printer'
import { Button } from '@mui/material'
import styles from './dashboard.module.css'
import { AuthContext } from "../Auth/Auth";
import { useNavigate } from 'react-router-dom';
import { MenuContext } from '../../components/NavBar/MenuProvider';
import Menu from '../../components/NavBar/Menu';
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';

function Dashboard() {
    const db = getFirestore();
    const [active, setActive] = useState("Account Details");
    const [locationColor, setLocationColor] = useState('#FFC107');
    const [accountColor, setAccountColor] = useState('#FFC107');
    const [printerColor, setPrinterColor] = useState('#FFC107');
    const [printer, setPrinter] = useState();
    const {currentUser} = useContext(AuthContext);
    const {menu} = useContext(MenuContext)
    const navigate = useNavigate();
    const sharedRef = doc(db, 'shared', `${currentUser?.uid}`)

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
        const getRef = async () => {
          try {
            const docSnap = await getDoc(sharedRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data?.printer) {
                setPrinter(true);
              } else {
                setPrinter(false);
              }
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.log(error)
          }
        };
    
        if (sharedRef) {
          getRef();
        }
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
    <div>
        {menu?
            <>
                <Menu/>
            </>
        :
        <>
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
                    {
                        printer &&
                    
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
                    }
                </div>
                {/* Different pages for settings */}
                {active === "Location" && <Location/>}
                {active === "Account Details" && <Account/>}
                {active === "Your Printer" && printer && <Printer/>}
            </div>
        </div>
        </>
        }
    </div>
    );
}
export default Dashboard