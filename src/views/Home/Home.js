import React, { Component } from 'react';
import { useRef } from 'react';
import styles from '../Home/home.module.css'
import ZippyPrints from './images/ZippyPrints.png'
import Button from '../../components/actions/Button';
import {useNavigate} from "react-router-dom"
import { Paper } from '@mui/material';
import waves from './images/wave-5.png'
import cuttlelogo from './images/cuttlelogo.PNG'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function Home(){
  const navigate = useNavigate();
  const ref = useRef(null);
  const handleScrollDown = () => {
    ref.current?.scrollIntoView({behavior: 'smooth'});
  }

  const handleUserSubmit = () => {
    navigate("/Register");
  }
  const handlePrinterSubmit = () => {
    navigate("/Register");
  }

  return(
          <div className={styles.StartScreen}>
            <div className={styles.intro}>
              <h1 className={styles.title}>ZippyPrints</h1>
                <div className={styles.subtitleContainer}>
                  <div className={styles.line}></div>
                  <p className={styles.subtitle}>ZippyPrints is a fast, easy to use, and reliable way 
                  for robotics teams without access to 3D printers to receive custom designs. 
                  Make an account now.</p>
                  </div>
                <div className={styles.buttonContainer}>
                  <Button
                  className={styles.userButton}
                  variant = "contained"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    backgroundColor: '#F0F5FF',
                    borderRadius: '7px',
                    padding: '0px 32px',
                    width: 'fit-content',
                    transitionDuration: '500ms',
                    "&.MuiButton-contained": {
                      color: '#0B63E5',
                      fontFamily: "Lexend Regular",
                      fontSize: 'clamp(10px, 0.9vw, 18px)',
                      fontWeight: '500',
                      letterSpacing: '0',
                      lineHeight: '56px',
                      marginTop: '-2px',
                      whiteSpace: 'nowrap',
                      width: 'fit-content'
                    },
                    "&:hover": {
                      background: "#d9e6ff",
                      boxShadow: '5px 5px 5px #02142e8e',
                      transitionDuration: '500ms',                  
                    },
                  }}
                    text = "Request a Print"
                    onClick = {handleUserSubmit}
                  >
                  </Button>   

                  <Button
                  className={styles.userButton}
                  variant = "contained"
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
                      lineHeight: '56px',
                      marginTop: '-2px',
                      whiteSpace: 'nowrap',
                      width: 'fit-content'
                    },
                    "&:hover": {
                      background: "#035ee6",
                      boxShadow: '5px 5px 5px #02142e8e',
                      transitionDuration: '500ms'
                    },
                  }}
                    text = "Become a Vendor"
                    onClick = {handlePrinterSubmit}
                  >
                  </Button>   
                </div>   
              </div>

              <div className={styles.dividerContainer}>
                

              </div>
              {/* <img src={cuttlelogo} alt="ZippyPrints divider" className={styles.cuttlelogo}></img> */}
              
              <div className={styles.tutorialBackground}>
                <div className={styles.tutorialHeadingContainer}>
                  <h1 className={styles.tutorialTitle}>Learn how to utilize ZippyPrints</h1>
                </div>
                <div className={styles.cardsContainer}>
                <Paper 
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  border: '1px solid',
                  borderColor: 'rgba(230, 232, 236, 0.502)',
                  borderRadius: '20px',
                  gap: '32px',
                  padding: '40px',
                  width: 'fit-content',
                }}>
                <div className={styles.cardsTextContainer}> 
                    <p className={styles.cardTitle}>Get Started: Printers</p>
                    <p className={styles.cardText}>Register your account</p>
                    <p className={styles.cardText}>Fill out the necessary information on your profile!</p>
                    <p className={styles.cardText}>Make an estimation on how much you want to charge ($/cm<sup>3</sup>), or volunteer your services for free!</p>
                    <p className={styles.cardText}>When a team reuqests a print, you will recieve an email 
                                                  with their contact information and any additional information!</p>
                    <p className={styles.cardText}>Now, simply wait for requests to flow in</p>
                    <div className={styles.tutorialButton}>
                        <a className={styles.tutorialButtonText} href="/Register">Register now!</a>
                        <a href="/Register">
                          <ArrowForwardIcon className={styles.arrowRight}/>
                        </a>                      
                        </div> 
                  </div>
                </Paper>
                <Paper sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  border: '1px solid',
                  borderColor: 'rgba(230, 232, 236, 0.502)',
                  borderRadius: '20px',
                  gap: '32px',
                  padding: '40px',
                  width: 'fit-content',
                }}>
                   <div className={styles.cardsTextContainer}>
                      <p className={styles.cardTitle}>Get Started: Users</p>
                      <p className={styles.cardText}>Register your account</p>
                      <p className={styles.cardText}>Fill out the necessary information on your profile!</p>
                      <p className={styles.cardText}>Navigate to the 'Maps' menu on the navigation bar!</p>
                      <p className={styles.cardText}>Find a printer near you either through the Maps Menu 
                                                    or by navigating the map manually and submit a 
                                                      valid request with any additional information!</p>
                      <p className={styles.cardText}>Hit submit and wait for an email response from your printer!</p>
                      <div className={styles.tutorialButton}>
                        <a className={styles.tutorialButtonText} href="/Register">Become a printer!</a>
                        <a href="/Register">
                          <ArrowForwardIcon className={styles.arrowRight}/>
                        </a>
                      </div>
                  </div>
                </Paper>

                </div>
                
                  <div className={styles.missionHeadingContainer}>
                    <h1 className={styles.missionTitle}>Getting you your prints, whenever you need</h1>
                  </div>
                  <div className={styles.missionContainer}>
                  <div className={styles.missionDescriptionContainer}>
                  <img src={cuttlelogo} alt="Cuttle Logo" className={styles.cuttlelogo}></img>
                  <div className={styles.missionDescriptionContainer2}>
                    <p className={styles.missionDescription}>ZippyPrints was created by 6165 MSET Cuttlefish, a FIRST Tech 
                    Challenge (FTC) robotics team, to connect FTC teams with 3D printers with underresourced teams needing custom 
                    manufacturing services to  create custom parts they design. Through ZippyPrints, our team hopes to provide
                    more learning opportunities and increase the competitiveness of traditionally underepresented teams in
                    not only FTC teams, but teams from all competitions. Individuals who require custom parts
                    for their personal or professional projects can benefit as well!</p>
                  </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.footerScreen}>
                <div className={styles.footerContainer}>
                  <div className={styles.footerColumn1}>
                      <div className={styles.rowTitleBig}>ZippyPrints</div>

                      <div className={styles.footerRow2}>
                        <div className={styles.navigation}>
                          <div className={styles.rowTitle}>User</div>
                          <a href="/login" className={styles.rowDescription}>Login</a>
                          <a href="/register" className={styles.rowDescription}>Register</a>
                          <a href="/profile" className={styles.rowDescription}>Profile</a>

                        </div>
                        <div className={styles.navigation}>
                          <div className={styles.rowTitle}>Functions</div>
                          <a href="/discover" className={styles.rowDescription}>Maps</a>
                          <a href="/safety" className={styles.rowDescription}>Safety Policy</a>
                          <a href="/terms" className={styles.rowDescription}>Terms of Service</a>
                        </div>
                      <div className={styles.contactUs}>
                        <div className={styles.rowTitle}>Contact us</div>
                          <div onClick={() => window.location = 'mailto:6165zippyprints@gmail.com'}
                          className={styles.rowDescription}>Email: 6165zippyprints@gmail.com</div>
                          <div className={styles.logoContainer}>
                            <InstagramIcon onClick={() => window.open('https://www.instagram.com/mset6165/', '_blank', 'noreferrer')}
                            className={styles.footerIcons}/>  
                            <YouTubeIcon onClick={() => window.open('https://www.youtube.com/c/msetcuttlefish6165', '_blank', 'noreferrer')}
                            className={styles.footerIcons}/>
                          </div>
                      </div>
                      </div>
                  </div>
                </div>
              </div>
             
          </div>

      );

}

