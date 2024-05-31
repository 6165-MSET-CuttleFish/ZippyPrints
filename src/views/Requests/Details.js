import React, { useContext } from "react";
import { RequestContext } from "./RequestContext";
import { CurrentDetailsContext } from "./DetailsContext";
import styles from './details.module.css'

export default function Details() {
    const { req, setReq } = useContext(RequestContext);
    const { details, setDetails } = useContext(CurrentDetailsContext);


    return (
        <div className={styles.container}>
            {req.file}
            {req.teamnumber}
        
        </div>
        
    )
}