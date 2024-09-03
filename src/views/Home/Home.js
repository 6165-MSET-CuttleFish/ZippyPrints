import React, { useContext } from 'react';
import { useRef } from 'react';
import styles from '../Home/home.module.css'
import Button from '../../components/actions/Button';
import {useNavigate} from "react-router-dom"
import cuttlelogo from './images/cuttlelogo.PNG'
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { MenuContext } from '../../components/NavBar/MenuProvider';
import Menu from '../../components/NavBar/Menu';
import PrinterSearch from './images/PrinterSearch.svg'
import UploadRequest from './images/UploadRequest.png'
import RequestAccept from './images/RequestAccept.png'
import MapsGraphic from './images/graphic1_map.png'
import RequestGraphic from './images/graphic2_request.png'
import NewRequestGraphic from './images/graphic3_newrequest.png'
import {Link} from '@mui/material';

import './Home.css'

export default function Home(){
  const navigate = useNavigate();
  const ref = useRef(null);
  const { menu } = useContext(MenuContext)


  const handleUserSubmit = () => {
    navigate("/Register");
  }

  return(
    <div>
      { menu && 
        <Menu />
      }
      { !menu &&
          <div className={styles.StartScreen}>
            <div className={styles.landingScreen}> 
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
                    backgroundColor: '#ffc926f1',
                    borderRadius: '2px',
                    height: '2.75rem',
                    padding: '0px 32px',
                    width: 'fit-content',
                    transitionDuration: '500ms',
                    "&.MuiButton-contained": {
                      color: '#FFFFFF',
                      fontFamily: "Lexend Regular",
                      fontSize: 'clamp(11pt, 0.9vw, 18px)',
                      fontWeight: '500',
                      letterSpacing: '0',
                      lineHeight: '56px',
                      marginTop: '-2px',
                      whiteSpace: 'nowrap',
                      width: 'fit-content'
                    },
                    "&:hover": {
                      background: "#ffc926bd",
                      boxShadow: '5px 5px 5px #02142eb7',
                      transitionDuration: '500ms',                  
                    },
                  }}
                    text = "Request a Print"
                    onClick = {handleUserSubmit}
                  >
                  </Button>   

                  <Button
                  className={styles.userButton}
                  variant = "outlined"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    borderRadius: '2px',
                    borderColor: '#FFFFFF',
                    height: '2.75rem',
                    padding: '0px 32px',
                    width: 'fit-content',
                    transitionDuration: '500ms',
                    "&.MuiButton-outlined": {
                      color: '#F0F5FF',
                      fontFamily: "Lexend Regular",
                      fontSize: 'clamp(11pt, 0.9vw, 18px)',
                      fontWeight: '500',
                      letterSpacing: '0',
                      lineHeight: '56px',
                      marginTop: '-2px',
                      whiteSpace: 'nowrap',
                      width: 'fit-content'
                    },
                    "&:hover": {
                      borderColor: '#FFFFFF',
                      boxShadow: '5px 5px 5px #02142eb7',
                      transitionDuration: '500ms'
                    },
                  }}
                    text = "Learn More"
                    onClick = {() => {ref.current?.scrollIntoView({behavior: 'smooth'});}}
                  >
                  </Button>   
                </div>   
              </div>
              </div>
            
              <div className={styles.tutorialContainer} ref={ref}>
                <div className={styles.tutorialHeadingContainer}> 
                  <h1 className={styles.imageTitle}>Services</h1>
                </div>
                <div className={styles.servicesContainer}>
                    <div className={styles.serviceBox}> 
                        <div className={styles.serviceTextContainer}> 
                          <div className={styles.serviceTitle}>Discover</div>
                          <div className={styles.serviceSubtitle}>Want something printed? Hop over to our Discover page to directly contact printers.</div>
                          <div className={styles.serviceButton}> 
                            <Button
                              variant = "contained"
                              text="Details"
                              style={{
                                backgroundColor: "#015F8F",
                                textTransform: "none",
                                fontWeight: "400",
                              }}
                              onClick = {() => navigate("/discover")}
                            />
                          </div>
                        </div>
                        <img src={PrinterSearch} className={styles.serviceImage} alt="Search for printers" />
                    </div>
                    <div className={styles.serviceBox}> 
                      <div className={styles.serviceTextContainer}> 
                          <div className={styles.serviceTitle}>New Request</div>
                          <div className={styles.serviceSubtitle}>Not sure which printer to pick? Submit a request and a printer will accept your request!</div>
                          <div className={styles.serviceButton}> 
                            <Button
                              variant = "contained"
                              text="Details"
                              style={{
                                backgroundColor: "#015F8F",
                                textTransform: "none",
                                fontWeight: "400",
                              }}
                              onClick = {() => navigate("/new_requests")}
                            />
                          </div>
                        </div>
                        <img src={UploadRequest} className={styles.serviceImage} alt="Search for printers" />
                    </div>
                    <div className={styles.serviceBox}> 
                    <div className={styles.serviceTextContainer}> 
                          <div className={styles.serviceTitle}>Accept Requests</div>
                          <div className={styles.serviceSubtitle}>Printers: head over to our Request List to start accepting awaiting requests!</div>
                          <div className={styles.serviceButton}> 
                            <Button
                              variant = "contained"
                              text="Details"
                              style={{
                                backgroundColor: "#015F8F",
                                textTransform: "none",
                                fontWeight: "400",
                              }}
                              onClick = {() => navigate("/requests")}
                            />
                          </div>
                        </div>
                        <img src={RequestAccept} className={styles.serviceImage} alt="Search for printers" />
                    </div>
                </div>
                
                {/* 1. Maps tutorial */}
                <div className={styles.ImageTextContainer}>
                  <div className={styles.textContainer}>
                      <div className={styles.imageTitle}>Discover Printers with ZippyPrints </div>
                      <div className={styles.imageSubtitle}>Find a printer near you either through the Maps Menu or by navigating the map manually and submit a valid request with any additional information! </div>
                      <div className={styles.imageButtonContainer}> 
                        <Button
                          className={styles.userButton}
                          variant = "contained"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#00344E',
                            borderRadius: '2px',
                            height: '2.75rem',
                            padding: '0px 32px',
                            width: 'fit-content',
                            transitionDuration: '500ms',
                            "&.MuiButton-contained": {
                              color: '#FFFFFF',
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
                              background: "#00344E",
                              boxShadow: '5px 5px 5px #02142eb7',
                              transitionDuration: '500ms',                  
                            },
                          }}
                            text = "Get Started"
                            onClick = {handleUserSubmit}
                          />
                        <Link href="Login" variant="body2" 
                            style={{ 
                                color: 'black', 
                                textDecoration: 'underline',
                                textDecorationColor: 'black',
                                fontSize: '0.95rem',
                                fontWeight: 'normal'
                            }}>
                            Already a user? Sign in
                          </Link>
                    </div>
                  </div>
                  <img src={MapsGraphic} className={styles.imageContainer} alt="Maps Graphic"></img>
                </div>
                {/* 2. Join ZippyPrints as a printer */}
                <div className={styles.ImageTextContainer}>
                <div className={styles.imageReverse}> 
                <img src={RequestGraphic} className={styles.imageContainer} alt="Find Requests Graphic"></img>
                  <div className={styles.textContainer}>
                      <div className={styles.imageTitle}>Help others build the perfect robot </div>
                      <div className={styles.imageSubtitle}>Make an impact by helping supply custom manufacturing to teams across the United States, one part at a time.</div>
                      <div className={styles.imageButtonContainer}> 
                        <Button
                          className={styles.userButton}
                          variant = "contained"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#00344E',
                            borderRadius: '2px',
                            height: '2.75rem',
                            padding: '0px 32px',
                            width: 'fit-content',
                            transitionDuration: '500ms',
                            "&.MuiButton-contained": {
                              color: '#FFFFFF',
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
                              background: "#00344E",
                              boxShadow: '5px 5px 5px #02142eb7',
                              transitionDuration: '500ms',                  
                            },
                          }}
                            text = "Become a Printer"
                            onClick = {handleUserSubmit}
                          />
                        <Link href="Login" variant="body2" 
                            style={{ 
                                color: 'black', 
                                textDecoration: 'underline',
                                textDecorationColor: 'black',
                                fontSize: '0.95rem',
                                fontWeight: 'normal'
                            }}>
                            Already a printer? Sign in
                          </Link>
                    </div>
                  </div>
                  </div>
                </div>

                <div className={styles.ImageTextContainer}>
                  <div className={styles.textContainer}>
                      <div className={styles.imageTitle}>Not sure which printer to choose? Submit a request instead. </div>
                      <div className={styles.imageSubtitle}>Find choosing a printer too difficult? Submit up to three files with each request ranging from 3D Printing, Laser Cutting, and CNC. In the meantime, just relax and let the printers choose you! </div>
                  </div>
                  <img src={NewRequestGraphic} className={styles.imageContainer_large} alt="New Request Graphic"></img>
                </div>

                              
                
                  <div className={styles.missionHeadingContainer}>
                    <h1 className={styles.imageTitle}>Getting you your prints, whenever you need</h1>
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
          }
        </div>
      );
}

