import React, {useState, useEffect, useContext,  Component} from 'react';
import styles from './details.module.css'
import {Button} from '@mui/material'
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios'
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, getDoc, GeoPoint, query, setDoc } from 'firebase/firestore/lite';
import { getAuth, updateCurrentUser, updateProfile,  } from "firebase/auth";
import { getDatabase, set, onValue} from "firebase/database";
import { getMarkerData} from '../../components/actions/Location'
import Controls from '../../components/actions/Controls'
import {makeStyles} from '@mui/styles'
import { Typography, Box } from '@mui/material'
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { API_KEY } from "../../api/firebaseConfig"
import {AuthContext} from "../../views/Auth/Auth"
import Popup from "../../components/Popup";
import {useForm, Form} from '../../components/useForm'
import { v4 as uuidv4 } from 'uuid';
import {useNavigate} from "react-router-dom"
import {Menu} from '../../components/Menu/Menu'
import { CurrentCenterContext } from '../../views/Discover/CenterProvider';
import { CurrentSelectedContext } from '../../views/Discover/SelectedProvider';

const Details = ({place}) => {
    const initalFValues = {
        requester_email: '',
        teamnumber: '',
        cad_link: '',
        filament: '',
        supports: '',
        addt_info:'',
        time_frame: '',
        infill:'',
    }
    const validate=(fieldValues = values)=>{
        let temp = {...errors}
        if ('teamnumber' in fieldValues)
            temp.teamnumber = (/./).test(fieldValues.teamnumber)?"":"Team Number is required."
        if ('requester_email' in fieldValues)
            temp.requester_email = (/./).test(fieldValues.requester_email)?"":"Email is required."
        if ('cad_link' in fieldValues)
            temp.cad_link = (/./).test(fieldValues.cad_link)?"":"Cad Link is required."
        if ('supports' in fieldValues)
            temp.supports = (/./).test(fieldValues.supports)?"":"Support info is required."
        if ('filament' in fieldValues)
            temp.filament = (/./).test(fieldValues.filament)?"":"Filament info is required."
        if ('time_frame' in fieldValues)
            temp.time_frame = (/./).test(fieldValues.time_frame)?"":"Time frame is required."
        if ('infill' in fieldValues)
            temp.infill = (/./).test(fieldValues.infill)?"":"Infill Info is required."

        setErrors({
            ...temp
        })
        if (fieldValues === values)
        return Object.values(temp).every(x => x === "")
    }
    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initalFValues, true, validate);
    const {currentUser} = useContext(AuthContext);
    // const {redirect} = useContext(redirectCheck);
    const [markers, setMarkers] = useState([]);
    const storage = getStorage();
    const db = getFirestore();
    const [openRegisterPopup, setOpenRegisterPopup] = useState(false)
    const navigate = useNavigate();
    const { center, setCenter } = useContext(CurrentCenterContext);
    const {selected, setSelected} = useContext(CurrentSelectedContext);

    const getData = async () => {
        try {
         await addDoc(collection(db, "email"), {
          to: [place.email, currentUser.email],
          message:{subject: 'New ZippyPrints Request #' + uuidv4().split("-")[1],
          text:
            'Hello ' + place.username + ', we have a new request from Team '+ values.teamnumber+ '\n\n'+
            'Requester\'s email: ' + values.requester_email+ '\n'+
            'Filament Info: '+values.filament +'\n'+
            'Supports Info: ' + values.supports +'\n'+
            'Infill Percentage + Info: ' + values.infill+'\n'+
            'Requested Time Frame: '+  values.time_frame +'\n'+
            'Additional Information: '  +  values.addt_info+'\n\n'+
            'Link to Requested CAD: ' + values.cad_link +'\n\n'+
            'Please contact the requester through their email for further communications'+'\n\n'+
            'Thanks for your continued support of ZippyPrints! \n'+
            'To stop receiving requests, go to your account page and disable your printer.'+'\n\n' 
          }
        });
          } catch(error) {
              console.log(error.message);
          }
    }

    const handleClick = async(e) => {
        setOpenRegisterPopup(true)
      }
      const handleSubmit = async(e) => {
        getData();
        setOpenRegisterPopup(false)
        setValues(initalFValues);
      }
    // TODO: make setCenter and a global variable, so I can set it from here as well
    const onSelect = (place) => {
        setSelected(place)
        setCenter({
          lat: place.lat,
          lng: place.lng
      })
    }
    // console.log(place?.service)

    return(
        <div className={styles.entireContainer}>
            <div className={styles.titleContainer}>
                <div className={styles.printerTitle}>{place?.teamnumber ? `Team ${place?.teamnumber}` : `Printer ${place?.username}`}</div>
                <div className={styles.printerTitle}>{place?.distance_value < 100 ? `0 mi` : `${place?.distance}`}</div>
            </div>
            <div className={styles.infoContainer}>
                    {/* <div className={styles.line}></div> */}
                    <div className={styles.printerHeading}>Contact Info:</div>
                    <div className={styles.printerSubtitle}>{place?.email}</div>
                    <div className={styles.printerHeading}>Services: {place.service?.length || "Not specified"}</div>
                    <div className={styles.printerSubtitle}>
                    {place.service?.map((p) =>(
                      p + " " 
                    ))}
                    </div>
                    <div className={styles.printerHeading}>General Location:</div>
                    {place.formattedAddress.split(",")[1]}, {(place.formattedAddress.split(",")[2]).split(" ")[1]}
            </div>

            <div className={styles.buttonContainer}>
            <Button
                  variant = "contained"
                  sx={{
                    backgroundColor: "#015F8F",
                    textTransform: "none",
                    fontWeight: "600", 
                    "&:hover": {
                        backgroundColor: "#015F8F"
                    }}}
                  onClick={() => {
                    onSelect(place)
                    }}>
                      Find on Map
            </Button>   
            <Button
                  variant = "contained"
                  sx={{
                    backgroundColor: "#015F8F",
                    textTransform: "none",
                    fontWeight: "600", 
                    "&:hover": {
                        backgroundColor: "#015F8F"
                    }}}
                    onClick = {handleClick}>
                      Request a Print
            </Button>   
          </div>
        <Popup
        title = "Request"
        children =  {
        <Form onSubmit={handleSubmit}>
          <Controls.Input
            label = "Team Number"
            name="teamnumber"
            value={values.teamnumber}
            onChange = {handleInputChange}
            error={errors.teamnumber}
            className={styles.textbox}
            style = {{width: '350px'}}
            required
          />
          <Controls.Input
            label = "Your Email"
            name="requester_email"
            value={values.requester_email}
            onChange = {handleInputChange}
            error={errors.requester_email}
            className={styles.textbox}
            style = {{width: '350px'}}
            required
          />
          <Controls.Input
            label = "Link to Your CAD (Onshape, GrabCad, etc)"
            name="cad_link"
            value={values.cad_link}
            onChange = {handleInputChange}
            error={errors.cad_link}
            className={styles.textbox}
            style = {{width: '350px'}}
            required
          />
          <Controls.Input
            label = "Filament Type (PLA, TPU, etc)"
            name="filament"
            value={values.filament}
            onChange = {handleInputChange}
            error={errors.filament}
            className={styles.textbox}
            style = {{width: '350px'}}
            required
          />
          <Controls.Input
            label = "Infill Percentage"
            name="infill" 
            value={values.infill}
            onChange = {handleInputChange}
            error={errors.infill}
            className={styles.textbox}
            style = {{width: '350px'}}
            required
          />
          <Controls.Input
            label = "Does it Require Support? (if so, what type?)"
            name="supports"
            value={values.supports}
            onChange = {handleInputChange}
            error={errors.supports}
            className={styles.textbox}
            style = {{width: '350px'}}
            required
          />
          <Controls.Input
            label = "When do you need this by?"
            name="time_frame"
            value={values.time_frame}
            onChange = {handleInputChange}
            error={errors.time_frame}
            className={styles.textbox}
            style = {{width: '350px'}}
            required
          />
          <Controls.Input
            label = "Addt Info (Orientation, Color, etc)"
            name="addt_info"
            value={values.addt_info}
            onChange = {handleInputChange}
            error={errors.addt_info}
            className={styles.textbox}
            style = {{width: '350px'}}
          />
          <Controls.Button
            className = {styles.submitButton}
            variant = "contained"
            size = "large"
            style={{
              backgroundColor: "#001b2e",
            }}
            text = "Submit"
            onClick = {handleSubmit}
          />
        </Form>}
        openPopup={openRegisterPopup}
        setOpenPopup={setOpenRegisterPopup}>
      </Popup>
        </div>
    );
    
}
export default Details