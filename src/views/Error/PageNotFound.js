import React from 'react'
import {useNavigate} from "react-router-dom"
import styles from '../Error/error.module.css'
import Button from '../../components/actions/Button';
import errorcuttle from './errorcuttle.png'


export default function PageNotFound(){
    const navigate = useNavigate();
    const goBack = () => {
        navigate(-1);
      }
      const returnHome = () => {
        navigate("/home");
      }
    return(
        <div className={styles.background}>
            <div className={styles.rowContainer}>
                <div className={styles.columnContainer}>
                        <div className={styles.errorContainer}>
                            <div className={styles.container}>
                                <div className={styles.errorTitle}>Trevor the Cuttlefish broke this page... oops!</div>
                                <div className={styles.errorSubtitle}>The page you’re looking for does not exist...
                                or does it? I guess you’ll never know. Anyways, head back or return to our lovely home page.</div>
                                <div className={styles.buttonContainer}>
                                    <Button
                                        variant = "contained"
                                        text = "← Go Back"
                                        onClick = {goBack}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px',
                                            backgroundColor: '#0B63E5',
                                            borderRadius: '7px',
                                            padding: '0px 32px',
                                            width: 'fit-content',
                                            transitionDuration: '500ms',
                                            "&.MuiButton-contained": {
                                            color: '#F0F5FF',
                                            fontFamily: "Lexend Regular",
                                            fontSize: 'clamp(10px, 0.9vw, 18px)',
                                            fontWeight: '500',
                                            letterSpacing: '0',
                                            lineHeight: '50px',
                                            marginTop: '1.5vw',
                                            whiteSpace: 'nowrap',
                                            width: 'fit-content'
                                            },
                                            "&:hover": {
                                            background: "#035ee6",
                                            boxShadow: '5px 5px 5px #02142e8e',
                                            transitionDuration: '500ms'
                                            },
                                        }}
                                        >
                                    </Button>
                                    <Button
                                        variant = "outlined"
                                        text = "Home"
                                        onClick = {returnHome}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px',
                                            color: '#0B63E5',
                                            borderRadius: '7px',
                                            padding: '0px 32px',
                                            width: 'fit-content',
                                            transitionDuration: '500ms',
                                            "&.MuiButton-outlined": {
                                            color: '#0B63E5',
                                            fontFamily: "Lexend Regular",
                                            fontSize: 'clamp(10px, 0.9vw, 18px)',
                                            fontWeight: '500',
                                            letterSpacing: '0',
                                            lineHeight: '50px',
                                            marginTop: '1.5vw',
                                            whiteSpace: 'nowrap',
                                            width: 'fit-content'
                                            },
                                            "&:hover": {
                                            color: "#035ee6",
                                            boxShadow: '5px 5px 5px #02142e8e',
                                            transitionDuration: '500ms'
                                            },
                                        }}
                                        >
                                    </Button>
                                </div>
                            </div>
                        <img src={errorcuttle} alt="Trevor the Cuttlefish" className={styles.errorcuttle}></img>
                    </div>
                </div>
            </div>
        </div>
    );
}

