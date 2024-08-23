import SadCuttle from "../../res/sadcuttles.svg"
import styles from "./norequests.module.css"
import errorcuttles from "../Error/errorcuttle.png"
export default function NoRequests() {
    
    return (
        <div className={styles.container}>
            <div className={styles.title}>Oh no! Trevor the Cuttlefish could not find any requests in the sea. Try again later!</div>
            <img src={errorcuttles} className={styles.image} alt="No requests with these filters!" />
        </div>
    )
}
