import { useContext } from 'react'
import styles from './menu.module.css'
import { MenuContext } from './MenuProvider'

export default function Menu() {
    const { setMenu } = useContext(MenuContext)

    return (
        <div>
            <div className={styles.linksContainer}>
                <a className={styles.text} onClick={() => setMenu(false)} href="discover" >Maps</a>
                <a className={styles.text} href="requests" onClick={() => setMenu(false)}>Requests</a>
                <a className={styles.text} href="new_request" onClick={() => setMenu(false)}>New Request</a>
            </div>
        </div>
    )
}