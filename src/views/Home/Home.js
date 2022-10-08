import React, { Component } from 'react';
import styles from '../Home/home.module.css'
import Controls from '../../components/actions/Controls'

export default class Home extends Component {

  render() {
  return(
      <body>
          <div className={styles.StartScreen}>
            <div className={styles.block}>
              <h1 className={styles.title}>Zippyprints</h1>
              <p className={styles.subtitle}>A fast, easy to use, and reliable way for printing custom designs through printers near you!</p>
              <div className={styles.button}>
              <div className={styles.buttonText}>Login</div>  
              </div>
              </div>
          </div>
        </body>

      );
}
}

