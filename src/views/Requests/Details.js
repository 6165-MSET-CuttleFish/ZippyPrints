import React, { useContext, useState, useEffect } from "react";
import { RequestContext } from "./RequestContext";
import { CurrentDetailsContext } from "./DetailsContext";
import styles from './details.module.css'
import Controls from "../../components/actions/Controls";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { AuthContext } from "../Auth/Auth";

export default function Details() {
    const { currentUser } = useContext(AuthContext)
    const { req, setReq } = useContext(RequestContext);
    const { details, setDetails } = useContext(CurrentDetailsContext);
    const [ text, setText ] = useState("Height");
    const [ number, setNumber] = useState();
    const storage = getStorage();
    const db = getFirestore();
    const fileName = req.file.split(".")[0]

    useEffect(() => {
        const checkHeight = () => {
            if (req.height == undefined) {
                setText("Thickness");
                setNumber(req.thickness)
            } else {
                setText("Height")
                setNumber(req.height)
            }
        }
        checkHeight();
      }, [req.height]);

    const handleDownload = async() => {
        getDownloadURL(ref(storage, `prints/${req.file}`))
        .then((url) => {
            // This can be downloaded directly:
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
            const blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();
            window.open(url)
        })
        .catch((error) => {
            alert(error.message)
        });
      }

    const handleAccept = async() => {
        const reqRef = doc(db, 'requests', "" + fileName)
        const printerRef = doc(db, 'printers', "" + currentUser.uid)
        await updateDoc(reqRef, {
            accepted: true,
            acceptedBy: await currentUser.uid
        })
        await updateDoc(printerRef, {
            request: {
                material: req?.material,
                color: req?.color,
                width: req?.width,
                length: req?.length,
                thickness: number,
                unit: req?.unit,
                info: req?.info,
                teamnumber: req?.teamnumber,
                location: req?.location,
                email: req?.email,
                file: req?.file,
                type: req?.type,
                accepted: true,
            }
       })

       await deleteDoc(reqRef);
    }

    return (
        <div className={styles.container}>
            <div className={styles.titleText}>Team {req.teamnumber}'s {req.type} Request</div>
            <div className={styles.titleDescriptionText}>{req.email}</div>
            <div className={styles.titleDescriptionText}>{req.location} </div>

            <div className={styles.subtitleText}>Manufacturing Details:</div>
            <div className={styles.descriptionText}>Material: {req.material}</div>
            <div className={styles.descriptionText}>Color: {req.color} </div>
            <div className={styles.descriptionText}>Unit: {req.unit} </div>
            <div className={styles.descriptionText}>{text}: {number} </div>
            <div className={styles.descriptionText}>Width: {req.width} </div>
            <div className={styles.descriptionText}>Length: {req.length} </div>
            
            <Controls.Button 
                className = {styles.button}
                variant = "contained"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    backgroundColor: '#0B63E5',
                    borderRadius: '7px',
                    padding: '0px 32px',
                    width: '250px',
                    transitionDuration: '500ms',
                    height: '50px',
                    marginTop: '0.7vw',
                    marginBottom: '1.5vw',
                    "&:hover": {
                        background: "#035ee6",
                        boxShadow: '5px 5px 5px #02142e8e',
                        transitionDuration: '500ms'
                    },
                }}
                size = "large"
                text = "Return"
                onClick = {() => {setDetails(false)}}
            />
            <Controls.Button 
                className = {styles.button}
                variant = "contained"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    backgroundColor: '#0B63E5',
                    borderRadius: '7px',
                    padding: '0px 32px',
                    width: '250px',
                    transitionDuration: '500ms',
                    height: '50px',
                    marginTop: '0.7vw',
                    marginBottom: '1.5vw',
                    "&:hover": {
                        background: "#035ee6",
                        boxShadow: '5px 5px 5px #02142e8e',
                        transitionDuration: '500ms'
                    },
                }}
                size = "large"
                text = "Download File"
                onClick = {() => {handleDownload()}}
            />
            <Controls.Button 
                className = {styles.button}
                variant = "contained"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    backgroundColor: '#0B63E5',
                    borderRadius: '7px',
                    padding: '0px 32px',
                    width: '250px',
                    transitionDuration: '500ms',
                    height: '50px',
                    marginTop: '0.7vw',
                    marginBottom: '1.5vw',
                    "&:hover": {
                        background: "#035ee6",
                        boxShadow: '5px 5px 5px #02142e8e',
                        transitionDuration: '500ms'
                    },
                }}
                size = "large"
                text = "Accept Request"
                onClick = {() => {handleAccept()}}
            />

        </div>
        
    )
}