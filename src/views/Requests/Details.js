import React, { useContext, useState, useEffect } from "react";
import { RequestContext } from "./RequestContext";
import { CurrentDetailsContext } from "./DetailsContext";
import styles from './details.module.css'
import Controls from "../../components/actions/Controls";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { getFirestore, doc, updateDoc, deleteDoc, deleteField, setDoc, getDoc } from "firebase/firestore";
import { AuthContext } from "../Auth/Auth";
import { Alert, Snackbar } from "@mui/material";


export default function Details() {
    const { currentUser } = useContext(AuthContext)
    const { req, setReq } = useContext(RequestContext);
    const { details, setDetails } = useContext(CurrentDetailsContext);
    const [ height, setHeight ] = useState(-1);
    const [ thickness, setThickness ] = useState(-1);
    const [ text, setText ] = useState("Height");
    const [ number, setNumber] = useState();
    const [ accepted, setAccepted ] = useState();
    const [ error, setError] = useState("An error has occured, please try again later")
    const [ snackbar, setSnackbar ] = useState(false);
    const [ success, setSuccess ] = useState(false);
    const [ unSuccess, setUnSuccess ] = useState(false);
    const [ requestStatus, setRequestStatus ] = useState();
    const [ rerender, setRerender ] = useState(1);
    const storage = getStorage();
    const db = getFirestore();
    const reqRef = doc(db, 'requests', `${req?.uid}`)
    const fileNames = Object.keys(req?.files).map(i => {
        return {name: req?.files[i]} 
    });
    const printerRef = doc(db, 'printers', "" + currentUser.uid)

    useEffect(() => {
        const checkHeight = () => {
            if (req?.height == undefined || req?.height == -1) {
                setText("Thickness");
                setNumber(req?.thickness)
                setThickness(req?.thickness)
            } else if (req?.thickness == undefined || req?.thickness == -1) {
                setText("Height")
                setNumber(req?.height)
                setHeight(req?.height)
            }
        }
        checkHeight();
      }, [req?.height]);

    useEffect(() => {
        const fetchData = async () => {
            const docSnap = await getDoc(reqRef);
            if ((await docSnap).data()?.accepted == undefined)
                setAccepted(true)
            else 
                setAccepted((await docSnap).data()?.accepted)
        } 
        fetchData()
    }, [reqRef])

    useEffect(() => {
        const fetchData = async () => {
            const docSnap = await getDoc(printerRef);
            if ((await docSnap).data()?.request == undefined)
                setRequestStatus(false)
            else 
                setRequestStatus(true)
        } 
        fetchData()
    }, [printerRef])


    

    const handleDownload = async() => {
        for (let i = 0; i < fileNames.length; i++) {
            getDownloadURL(ref(storage, `prints/${req?.uid}/${fileNames[i].name}`)).then((url) => {
                // This can be downloaded directly:
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                const blob = xhr.response;
                };
                xhr.open('GET', url);
                xhr.send();
                window.open(url)
                console.log("SUCCESS " + i)
            }).catch((error) => {
            alert(error.message)
            });
        }
      }

    const handleAccept = async() => {
        try {
            if (!requestStatus) {
                await updateDoc(printerRef, {
                    request: {
                        material: req?.material,
                        color: req?.color,
                        width: req?.width,
                        length: req?.length,
                        height: height,
                        thickness: thickness,
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
                await updateDoc(reqRef, {
                    accepted: true,
                    acceptedBy: await currentUser.uid
                })
               await deleteDoc(reqRef);

               setSuccess(true);
            } else {
                setError("You can only accept one request at a time! Please complete or unassign your active request to accept this request")
                setSnackbar(true)
            }
            
        } catch (error) {
            setSnackbar(true);
            window.location.reload()
        }
    }

    const handleUnassign = async() => {
        try {
            await setDoc(reqRef, {
                material: req?.material,
                color: req?.color,
                width: req?.width,
                length: req?.length,
                height,
                thickness,
                unit: req?.unit,
                info: req?.info,
                teamnumber: req?.teamnumber,
                location: req?.location,
                email: req?.email,
                file: req?.file,
                type: req?.type,
                accepted: false,
           })
    
            await updateDoc(printerRef, {
                request: deleteField()
            });

            setUnSuccess(true)
        } catch (error) {
            setSnackbar(true)
            window.location.reload()
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.titleText}>Team {req?.teamnumber}'s {req?.type} Request</div>
            <div className={styles.titleDescriptionText}>{req?.email}</div>
            <div className={styles.titleDescriptionText}>{req?.location} </div>

            <div className={styles.subtitleText}>Manufacturing Details:</div>
            <div className={styles.descriptionText}>Material: {req?.material}</div>
            <div className={styles.descriptionText}>Color: {req?.color} </div>
            <div className={styles.descriptionText}>Unit: {req?.unit} </div>
            <div className={styles.descriptionText}>{text}: {number} </div>
            <div className={styles.descriptionText}>Width: {req?.width} </div>
            <div className={styles.descriptionText}>Length: {req?.length} </div>
            
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
            { !accepted &&
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
            }

            { accepted &&
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
                text = "Unassign Request"
                onClick = {() => {handleUnassign()}}
            />
            }
        <Snackbar open={snackbar} autoCloseDuration={5000} onClose={() => setSnackbar(false)}>
            <Alert onClose={() => setSnackbar(false)} severity="error" sx={{ width: '100%' }}>
                {error}
            </Alert>
        </Snackbar>

        <Snackbar open={success} autoCloseDuration={5000} onClose={() => setSuccess(false)}>
            <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                You have successfully accepted this request, please contact the requester for further information!
            </Alert>
        </Snackbar>

        <Snackbar open={success} autoCloseDuration={5000} onClose={() => setSuccess(false)}>
            <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                You have successfully accepted this request, please contact the requester for further information!
            </Alert>
        </Snackbar>

        <Snackbar open={unSuccess} autoCloseDuration={5000} onClose={() => setUnSuccess(false)}>
            <Alert onClose={() => setUnSuccess(false)} severity="success" sx={{ width: '100%' }}>
                You have successfully unassigned this request
            </Alert>
        </Snackbar>
        </div>
        
    )
}