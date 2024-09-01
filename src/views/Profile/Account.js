import React, { useState, useEffect, useContext } from 'react'
import { IconButton, InputAdornment} from '@mui/material'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import { updateProfile, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { getFirestore, setDoc, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore/lite';
import { Button, Snackbar, Alert } from '@mui/material'
import { AuthContext } from "../Auth/Auth";
import styles from '../Profile/account.module.css'
import {useNavigate} from "react-router-dom"
import Popup from "../../components/Popup";
import EditIcon from '@mui/icons-material/Edit';
import UserPrinterSwitch from './UserPrinterSwitch'; // adjust the path according to your directory structure

const initalFValues = {
    teamnumber: '',
    name: '',
    password: '',
}

let open = false;
module.export = {open:open}

export function setOpen(children){
    open = children;
  }
      
function Account() {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const [openDeletePopup, setOpenDeletePopup] = useState(false);
    const [ userInfo, setUserInfo ] = useState();
    const [name, setName] = useState("Update your username");
    const [teamnumber, setTeamnumber] = useState("Please enter your team number");
    const [printer, setPrinter] = useState();
    const [errorMessage, setErrorMessage] = useState("Error!");
    const [successMessage, setSuccessMessage] = useState("Success!");
    const db = getFirestore();
    const userRef = doc(db, 'users', `${currentUser?.uid}`);
    const printerRef = doc(db, 'printers', `${currentUser?.uid}`);
    const sharedRef = doc(db, 'shared', `${currentUser?.uid}`)
    const [ ref, setRef ] = useState();
    const [ activeReq, setActiveReq ] = useState(false);
    const [ success, setSuccess ] = useState(false)
    const [ error, setError ] = useState(false)
    const [isPrinter, setIsPrinter] = useState(false);
    const markerRef = doc(db, 'markers', `${currentUser.uid}`)


    
    const checkViewable= ()=> {
        if(!currentUser) {
            navigate("/Login")
            setOpen(true)
        }
        else if(!currentUser.emailVerified) {
        navigate("/Verification");
        setOpen(true);
        }
    }
    useEffect(() => {
        checkViewable()
    })

    
    useEffect(() => {
        const getRef = async () => {
          try {
            const docSnap = await getDoc(sharedRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data?.printer) {
                setRef(doc(db, 'printers', `${currentUser?.uid}`));
                setPrinter(true);
                setIsPrinter(true)
              } else {
                setRef(doc(db, 'users', `${currentUser?.uid}`));
                setPrinter(false);
                setIsPrinter(false)
              }
            } else {
                console.log("No such document!");
            }
          } catch (error) {
            console.error("Error getting document:", error);
          }
        };
    
        if (sharedRef) {
          getRef();
        }
      }, [success, printer]);

      
    useEffect(() => {
        const fetchData = async () => {
          try {
            if (ref) {
              const docSnap = await getDoc(ref);
              if (docSnap.exists()) {
                const data = docSnap.data();
                setName(data.username || "Update your username");
                setTeamnumber(data.teamnumber || "Please enter your team number");
                setUserInfo(data);
                if (printer && data.request !== undefined) {
                    setActiveReq(true)
                }
              } else {
                console.log("No such document");
                // setError(true)
              }
            }
          } catch (error) {
            console.error("Error fetching document:", error);
          }
        };
        if (ref) {
            fetchData();
        }
      }, [ref, success, printer]);


   const uploadData = async () => {
        await updateDoc(ref, {
            username: values.name,
            teamnumber: values.teamnumber,
        })
        await updateProfile(await currentUser, {
            displayName: values.name,
        })
        await updateDoc(markerRef, {
            username: values?.name,
            teamnumber: values?.teamnumber 
        })
    }


    const validate=(fieldValues = values)=>{
        let temp = {...errors}
        if ('name' in fieldValues)
            temp.name = (/.../).test(fieldValues.name)?"":"Username is not valid."
        if ('teamnumber' in fieldValues)
            temp.teamnumber = (/.../).test(fieldValues.teamnumber)?"":"Team Number is not valid."
                
        setErrors({
            ...temp
        })
        
        if (fieldValues === values)
        return Object.values(temp).every(x => x === "")
    }
    const handleSubmit = async(e) => {       
        e.preventDefault() 
        if(validate()) {
            uploadData(); 
            handlePrinter();
            resetForm();
        }  
    }

    const {
        values,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initalFValues, true, validate);

    const handleDelete = async() => {
        try {
            if (!activeReq) {
                const credential = EmailAuthProvider.credential(currentUser.email, values.password)
                const result = reauthenticateWithCredential(currentUser, credential)            
                // Pass result.user here
                await deleteUser((await result)?.user)
                navigate('/home')
                window.location.reload();
            } else {
                setErrorMessage("Request Failed: You currently have an unfilfilled acepted request, please complete the request or unassign it before deleting your account!")
                setError(true);
            }
        } catch (error) {
            setErrorMessage("Request Failed: check that you've entered the correct password, contact support if needed.")
            setError(true);
        }
        
    } 

    const handleEmail = () => {
        navigate("/reset_email");
    }
    const handlePassword = () => {
        navigate("/reset");
    }
    const handleDeletePopup = () => {
        setOpenDeletePopup(true)
      }

    const handleSwitchChange = (event) => {
        setIsPrinter(event.target.checked);
    };
    const handlePrinter = async () => {
        try {
            //changing account type from printer to user
            if (printer && !isPrinter) {
                if (activeReq) {
                    setErrorMessage("Error: You currently have an unfilfilled accepted request, please complete the request or unassign it before switching account types!")
                    setError(true)
                } else {
                    await updateDoc(sharedRef, {
                        printer: false
                    })
                    //update userDoc and then delete the current printer doc
                    await setDoc(userRef, {
                        address: userInfo?.address || "",
                        address2: userInfo?.address2 || "",
                        bio: userInfo?.bio || "",
                        city: userInfo?.city || "",
                        country: userInfo?.country || "",
                        email: userInfo?.email || "",
                        filament: userInfo?.filament || "",
                        formattedAddress: userInfo?.formattedAddress || "",
                        geoPoint: userInfo?.geoPoint || "",
                        price: userInfo?.price || "",
                        printer: false || "",
                        printers: userInfo?.printers || "",
                        service: userInfo?.service || "",
                        state: userInfo?.state || "",
                        teamnumber: values?.teamnumber || "",
                        username: values?.name || "",
                        zipcode: userInfo?.zipcode || "",
                        userRequest: userInfo?.userRequest || ""
                    })

                    await updateDoc(markerRef, {
                        visibility: false,
                    })
    
                    await deleteDoc(printerRef);
                    setSuccess(true)
                    setSuccessMessage("You are now a user!")
                    setPrinter(false)
                    navigate(0)
                }

            }  //changing account type from user to printer
            else if (!printer && isPrinter) {
                await updateDoc(sharedRef, {
                    printer: true
                })

                //update printer doc and delete the current userDoc
                await setDoc(printerRef, {
                    address: userInfo?.address || "",
                    address2: userInfo?.address2 || "",
                    bio: userInfo?.bio || "",
                    city: userInfo?.city || "",
                    country: userInfo?.country || "",
                    email: userInfo?.email || "",
                    filament: userInfo?.filament || "",
                    formattedAddress: userInfo?.formattedAddress || "",
                    geoPoint: userInfo?.geoPoint || "",
                    price: userInfo?.price || "",
                    printer: true || "",
                    printers: userInfo?.printers || "",
                    service: userInfo?.service || "",
                    state: userInfo?.state || "",
                    teamnumber: values?.teamnumber || "",
                    username: values?.name || "",
                    zipcode: userInfo?.zipcode || "",
                    userRequest: userInfo?.userRequest || ""
                })

                await updateDoc(markerRef, {
                    visibility: true,
                })

                await deleteDoc(userRef);
                setSuccess(true)
                setSuccessMessage("You are now a printer!")
                setPrinter(true)
                navigate(0)
            } else if (printer === isPrinter) {
                setSuccess(true)
                setSuccessMessage("Form submitted, you are a printer is a " + isPrinter + " statement")
            }
        } catch (error) {
            setError(true)
            setErrorMessage("Error: " + error)
        }
    }

    return(
        <div>
            <Form onSubmit={handleSubmit}>
                <div className={styles.columnContainer}>
                    <div className={styles.leftContainer}>
                        <div className={styles.singleContainer}>
                            <div className={styles.label}>Update username</div>
                            <Controls.Input
                                placeholder={name}
                                name="name"
                                value={values.name}
                                onChange = {handleInputChange}
                                error={errors.name}
                                InputProps={{
                                    className: styles.textbox,
                                }}/>
                        </div>
                        <div className={styles.singleContainer}>
                            <div className={styles.label}>FIRST Team Number</div>
                            <Controls.Input
                                placeholder={teamnumber}
                                name="teamnumber"
                                value={values.teamnumber}
                                onChange = {handleInputChange}
                                error={errors.teamnumber}
                                InputProps={{
                                    className: styles.textbox,
                                }} />                
                        </div>
                        <div className={styles.switchContainer}>
                            <div className={styles.label}>Update Account Type: currently {printer?"Printer" : "User"}</div>
                            <div className={styles.switch}>
                                <UserPrinterSwitch checked={isPrinter} onChange={handleSwitchChange} leftText = "Become a Printer" rightText = "Become a User" />
                            </div>
                        </div>
                        <Controls.Button 
                            className = {styles.button}
                            variant = "contained"
                            style={{
                                backgroundColor: "#015F8F",
                                textTransform: "none",
                                fontWeight: "600"
                            }}
                            size = "large"
                            text = "Save information"
                            onClick = {handleSubmit} />
                    </div>
                    <div className={styles.dividerLine}></div>
                    <div className={styles.rightContainer}>
                        <div className={styles.singleContainer}>
                            <div className={styles.label}>Email</div>
                            <Controls.Input
                                name="email"
                                disabled
                                InputProps={{
                                    className: styles.textbox,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {currentUser?.email}
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleEmail}>
                                                <EditIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                required />
                        </div>
                        <div className={styles.singleContainer}>
                            <div className={styles.label}>Password</div>
                            <Controls.Input
                                name="password"
                                disabled
                                type="password"
                                InputProps={{
                                    className: styles.textbox,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            ●●●●●●●●●●●●
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handlePassword}>
                                                <EditIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                required />
                        </div>
                            {/* <div className={styles.singleContainer}>
                                <Controls.Button
                                    className = {styles.button}
                                    variant = "contained"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        backgroundColor: '#02142E',
                                        borderRadius: '7px',
                                        padding: '0px 32px',
                                        width: '315px',
                                        transitionDuration: '500ms',
                                        height: '50px',
                                        "&:hover": {
                                        background: "#035ee6",
                                        boxShadow: '5px 5px 5px #02142e8e',
                                        transitionDuration: '500ms'
                                        },
                                    }}
                                    size = "large"
                                    text = "Update Printer Status"
                                    onClick = {handlePrinter}
                                />
                            </div>     */}
                        </div>
                    </div>
                </Form>
                <div className={styles.deleteContainer}>
                            <Button
                                className = {styles.button}
                                variant = "contained"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    backgroundColor: '#ff0000',
                                    borderRadius: '7px',
                                    padding: '0px 32px',
                                    width: '100px',
                                    transitionDuration: '500ms',
                                    height: '40px',
                                    "&:hover": {
                                    backgroundColor: '#ff0000',
                                    boxShadow: '5px 5px 5px #02142e8e',
                                    transitionDuration: '500ms'
                                    },
                                }}
                                size = "large"
                                onClick = {handleDeletePopup}
                        >
                                <div className={styles.deleteButtonText}>Delete Account</div>
                            </Button> 
                        </div>
            <Popup
                openPopup={openDeletePopup}
                setOpenPopup={setOpenDeletePopup}
                sx={{
                    marginTop: '20vw'
                }}>
                <div className={styles.singleContainer}>
                    <div className={styles.label}>Delete Account</div>
                        <Controls.Input
                        placeholder="Please enter your password"
                        name="password"
                        type="password"
                        value={values.password}
                        onChange = {handleInputChange}
                        error={errors.password}
                        InputProps={{
                            className: styles.deleteTextbox,
                        }}
                        required
                        />   
                        <Controls.Button
                            className = {styles.button}
                            variant = "contained"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '12px',
                                backgroundColor: '#ff0000',
                                borderRadius: '7px',
                                padding: '0px 32px',
                                width: '350px',
                                transitionDuration: '500ms',
                                height: '50px',
                                "&:hover": {
                                background: "#035ee6",
                                boxShadow: '5px 5px 5px #02142e8e',
                                transitionDuration: '500ms'
                                },
                            }}
                            size = "large"
                            text = "Delete Account"
                            onClick = {handleDelete}
                        />
                    </div>
                </Popup>
            <Snackbar open={success} autoCloseDuration={5000} onClose={() => setSuccess(false)}>
                <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={error} autoCloseDuration={5000} onClose={() => setError(false)}>
                <Alert onClose={() => setError(false)} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
          </div>
        )
}

export default Account
