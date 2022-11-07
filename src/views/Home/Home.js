import React, { Component } from 'react';
import { useRef } from 'react';
import styles from '../Home/home.module.css'
import ZippyPrints from './images/ZippyPrints.png'

export default function Home(){
  const ref = useRef(null);
  const handleScrollDown = () => {
    ref.current?.scrollIntoView({behavior: 'smooth'});
  }

  return(
      <body>
          <div className={styles.StartScreen}>
            <div className={styles.block}>
              {/* <img src={ZippyPrints} alt="ZippyPrints"></img> */}
              <h1 className={styles.title}>ZippyPrints</h1>
              <p className={styles.subtitle}>A fast, easy to use, and reliable way for 3D printing custom designs through printers near you!</p>
              <button
              className={styles.scrollButton}
              onClick={handleScrollDown}
              >
                <div className={styles.buttonText}>Learn More</div>
              </button>      
            </div>
            <div ref={ref} className={styles.tutorialBackground}>
              <h1 className={styles.tutorialTitle}>How It Works</h1>
                <p className={styles.tutorialSubtitle}>For Printers:
                <p className={styles.tutorialDescription}>- Register your account</p>
                <p className={styles.tutorialDescription}>- Fill out the necessary information on your profile!</p>
                <p className={styles.tutorialDescription}>- Make an estimation on how much you want to charge ($/cm<sup>3</sup>)!</p>
                <p className={styles.tutorialDescription}>- When a team reuqests a print, you will recieve an email with their</p>
                <p className={styles.tutorialDescription}>‏‏‎ ‎‏‏‎ ‎contact information and any additional information!</p>
                <p className={styles.tutorialDescription}>- Now, simply wait for requests to flow in</p>
                <div className={styles.redVertical} />
              </p>

                <p className={styles.teamTutorialSubtitle}>For Teams:
                  <p className={styles.teamTutorialDescription}>Register your account -</p>
                  <p className={styles.teamTutorialDescription}>Fill out the necessary information on your profile! -</p>
                  <p className={styles.teamTutorialDescription}>Navigate to the 'Maps' menu on the navigation bar! -</p>
                  <p className={styles.teamTutorialDescription}>Find a printer near you if available and submit a -</p>
                  <p className={styles.teamTutorialDescription}>‏‏valid request with any additional information! -</p>
                  <p className={styles.teamTutorialDescription}>Hit submit and wait for an email response from your printer! -</p>
                  <div className={styles.teamVertical} />
                  </p>
                  <h1 className={styles.missionTitle}>Mission Statement</h1>
              <p className={styles.missionStatement}>ZippyPrints was created by 6165 MSET Cuttlefish, a FIRST Tech Challenge robotics team, to connect FTC teams with 3D printers with underresourced teams needing custom manufacturing services. 

</p>
             


              </div>
          </div>
        </body>

      );

}

