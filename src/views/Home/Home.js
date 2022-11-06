import React, { Component } from 'react';
import { useRef } from 'react';
import styles from '../Home/home.module.css'
import Controls from '../../components/actions/Controls'
import ScrollButton from 'react-scroll-button';

export default function Home(){
  const ref = useRef(null);
  const handleScrollDown = () => {
    ref.current?.scrollIntoView({behavior: 'smooth'});
  }

  return(
      <body>
          <div className={styles.StartScreen}>
            <div className={styles.block}>
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
                <p className={styles.tutorialDescription}>- Register an account</p>
                <p className={styles.tutorialDescription}>- Fill out the necessary information on your profile!</p>
                <p className={styles.tutorialDescription}>- Make an estimation on how much you want to charge ($/cm<sup>3</sup>)!</p>
                <p className={styles.tutorialDescription}>- When a team reuqests a print, you will recieve an email with their</p>
                <p className={styles.tutorialDescription}>‏‏‎ ‎‏‏‎ ‎contact information and any additional information!</p>
                <p className={styles.tutorialDescription}>- Now, simply wait for requests to flow in</p>
                <div className={styles.redVertical} />
              </p>

                <p className={styles.teamTutorialSubtitle}>For Teams:
                  <p className={styles.teamTutorialDescription}>- Register an account</p>
                  <p className={styles.teamTutorialDescription}>- Fill out the necessary information on your profile!</p>
                  <p className={styles.teamTutorialDescription}>- Make an estimation on how much you want to charge ($/cm<sup>3</sup>)!</p>
                  <p className={styles.teamTutorialDescription}>- When a team reuqests a print, you will recieve an email with their</p>
                  <p className={styles.teamTutorialDescription}>‏‏‎ ‎‏‏‎ ‎contact information and any additional information!</p>
                  <p className={styles.teamTutorialDescription}>- Now, simply wait for requests to flow in</p>
                  <div className={styles.teamVertical} />
                  </p>
                  <p className={styles.missionTitle}>Mission Statement</p>
              <p className={styles.missionStatement}>ZippyPrints was founded by 6165 MSET Cuttlefish</p>
              </div>
              

          
          </div>
            
        </body>

      );

}

