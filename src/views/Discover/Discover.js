import React, {useState, useEffect, useContext,  Component} from 'react';
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
import styles from './map.module.css'
import {useNavigate} from "react-router-dom"
import { Menu as SideBar} from '../../components/Menu/Menu'
import { CurrentCenterContext } from './CenterProvider.js'
import { CurrentSelectedContext } from './SelectedProvider';
import Mobile from './Mobile';
import { MenuContext } from '../../components/NavBar/MenuProvider';
import Menu from '../../components/NavBar/Menu';


const initalFValues = {
    id: 0,
    requester_email: '',
    teamnumber: '',
    cad_link: '',
    filament: '',
    supports: '',
    addt_info:'',
    time_frame: '',
    infill:'',
}
let open = false;
module.export = {open:open}

export function setOpen(children){
  open = children;
}
function Discover() {
  const { center, setCenter } = useContext(CurrentCenterContext);
  const {selected, setSelected} = useContext(CurrentSelectedContext);

  const {currentUser} = useContext(AuthContext);
  // const {redirect} = useContext(redirectCheck);
  const [markers, setMarkers] = useState([]);
  const storage = getStorage();
  const db = getFirestore();
  const classes = useStyles();
  const [openRegisterPopup, setOpenRegisterPopup] = useState(false)
  const navigate = useNavigate();
  const {menu} = useContext(MenuContext)
  
  //const auth = getAuth();
  //const user = auth.currentUser;
  
  useEffect(() => {
    const checkViewable = () => {
      if (!currentUser) {
        navigate("/login")
      } else if (!currentUser.emailVerified) {
        navigate("/verification")
      } else if (currentUser?.displayName == null) {
          navigate("/setup");
      }
    };
    checkViewable();
}, [currentUser]);

  if (!currentUser) {
    navigate("/Login");
    setOpen(true);
  }
  else if(!currentUser.emailVerified){
    navigate("../Verification");
    setOpen(true);
  }
    useEffect(() => {
      const getMarkerData = async () => {
        const db = getFirestore();
        const q = query(collection(db, "markers"));
        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              if (doc.data()?.visibility) {
                setMarkers((current) => [...current, {
                  ...doc.data(),
                  },
                ]);
              }
        });


        } catch (error) {
          console.log(error)
        }
    }
      getMarkerData()
    }, [storage])

  const libraries = ['places'];
  let libRef = React.useRef(libraries)
  const mapContainerStyle = {
    width: '74vw',
    height: '90vh',
    visibility: 'visible'
  }

const onSelect = (marker) => {
    setSelected(marker)
    setCenter({
      lat: marker.lat,
      lng: marker.lng
  })
}
       const getData = async () => {
        try {
         await addDoc(collection(db, "email"), {
          to: [selected.email, currentUser.email],
          message:{subject: 'New ZippyPrints Request #' + uuidv4().split("-")[1],
          text:
            'Hello ' + selected.username + ', we have a new request from User '+ currentUser.displayName + "of Team " + values.teamnumber + '\n\n'+
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
          values.id++;
          } catch(error) {
              console.log(error.message);
          }
    }
  const options = {
    disableDefaultUI: true,
    zoomContrl: true,
  }
  const {isLoaded, loadError} = useLoadScript({
      googleMapsApiKey: API_KEY,
      libraries: libRef.current,
  });


const mapRef = React.useRef();

const onMapLoad = (map) => {
  mapRef.current = map;

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

    const handleClick = async(e) => {
      setOpenRegisterPopup(true)
    }
    const handleSubmit = async(e) => {
      getData();
      setOpenRegisterPopup(false)
      setValues(initalFValues);
    }



  if (loadError) return "Error loading map";
  if (!isLoaded) return "Loading map...";

  return (

    //TODO: replace with actual logo
  <div>
      <Popup className={styles.popup}
        title = {`Request to ${selected?.teamnumber?`Team ${selected?.teamnumber}`:`Printer ${selected?.username}`}`}
        children =  {<Form onSubmit={handleSubmit}>
          <div className={styles.textboxContainer}>
          <Controls.Input
            label = "Team Number"
            name="teamnumber"
            value={values.teamnumber}
            size = 'small'
            InputProps={{
              className: styles.textbox
            }}
            onChange = {handleInputChange}
            error={errors.teamnumber}
            required
          />
          <Controls.Input
            label = "Your Email"
            name="requester_email"
            value={values.requester_email}
            onChange = {handleInputChange}
            error={errors.requester_email}
            size = 'small'
            InputProps={{
              className: styles.textbox
            }}
            required
          />
          <Controls.Input
            label = "Link to Your CAD (Onshape, GrabCad, etc)"
            name="cad_link"
            value={values.cad_link}
            onChange = {handleInputChange}
            error={errors.cad_link}
            size = 'small'
            InputProps={{
              className: styles.textbox
            }}
            required
          />
          <Controls.Input
            label = "Filament Type (PLA, TPU, etc)"
            name="filament"
            value={values.filament}
            onChange = {handleInputChange}
            error={errors.filament}
            size = 'small'
            InputProps={{
              className: styles.textbox
            }}
            required
          />
          <Controls.Input
            label = "Infill Percentage"
            name="infill" 
            value={values.infill}
            onChange = {handleInputChange}
            error={errors.infill}
            size = 'small'
            InputProps={{
              className: styles.textbox
            }}
            required
          />
          <Controls.Input
            label = "Does it Require Support? (if so, what type?)"
            name="supports"
            value={values.supports}
            onChange = {handleInputChange}
            error={errors.supports}
            size = 'small'
            InputProps={{
              className: styles.textbox
            }}
            required
          />
          <Controls.Input
            label = "When do you need this by?"
            name="time_frame"
            value={values.time_frame}
            onChange = {handleInputChange}
            error={errors.time_frame}
            className={classes.textbox}
            size = 'small'
            InputProps={{
              className: styles.textbox
            }}
            required
          />
          <Controls.Input
            label = "Addt Info (Orientation, Color, etc)"
            name="addt_info"
            value={values.addt_info}
            onChange = {handleInputChange}
            error={errors.addt_info}
            size = 'small'
            InputProps={{
              className: styles.textbox
            }}
          />
          <Controls.Button
            className = {classes.submitButton}
            variant = "contained"
            size = "large"
            style={{
              backgroundColor: "#001b2e",
              textTransform: "none",
              fontWeight: "600",
            }}
            text = "Submit"
            onClick = {handleSubmit}
          />
          </div>
        </Form>}
        openPopup={openRegisterPopup}
        setOpenPopup={setOpenRegisterPopup}>
      </Popup>
    {menu? 
      <Menu/>
      :
  
    <div className={styles.wrapper}>
      <div className={styles.menu}> <SideBar className={styles.menu}/> </div>
      <div className={styles.mobile}> <Mobile /> </div>
      <div className={styles.maps}>
        <GoogleMap 
          mapContainerStyle = {mapContainerStyle}
          zoom = {5}
          center = {center}
          options={options}
          onLoad={onMapLoad}
          >
            {markers?.map((marker, i) => (
              <Marker
              key={i}
              position = {{
                lat: marker.lat,
                lng: marker.lng
              }}
              icon={{
                url: '/printer.png',
                scaledSize: new window.google.maps.Size(30, 30),
                origin: new window.google.maps.Point(0,0),
                anchor: new window.google.maps.Point(15, 15)
              }}
              onClick={() => {
                onSelect(marker)
                }}
              />
            ))}


            {selected? (
            <InfoWindow
              position={{lat: selected.lat, lng: selected.lng}}
              onCloseClick={() => {
                setSelected(null)
              }}
            >
              <div className={styles.markerBox}>

                <p className={styles.teamText}>{selected?.teamnumber?`Team ${selected?.teamnumber}`:`Printer ${selected?.username}`}</p>

              <p className={styles.locationText}> 
                  {selected.location ? `${selected.location.split(",")[1]}, ${selected.location.split(",")[2]}` : `${selected.formattedAddress}`}
              </p>
              <Controls.Button 
                    variant = "contained"
                        size = "large"
                        style={{
                            backgroundColor: "#001b2e",
                            textTransform: "none",
                            fontWeight: "600",
                            width: "fit-content"
                        }}
                        text = "Submit Request"
                    onClick = {handleClick}
                    />  
              </div>
            </InfoWindow>) : null}
        </GoogleMap>
      </div>
    </div>  
    }
  </div>
  );
  
}
const useStyles = makeStyles(theme =>({ 
  requestButton: {
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      height: 48,
      width: 220,
    },
    submitButton:{
    right: -3,
    top: 7,
    width:350,
    },
    textbox:{
    right:5
    }
  
}))
export default Discover