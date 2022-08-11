import React, {useState, useEffect, useContext,  Component} from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios'
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, getDoc, GeoPoint, query, setDoc } from 'firebase/firestore/lite';
import { getAuth, updateProfile,  } from "firebase/auth";
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
function Discover() {
  const {currentUser} = useContext(AuthContext);
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const storage = getStorage();
   const db = getFirestore();
  const classes = useStyles();

      const username = currentUser?.displayName
    const [openPopup, setOpenPopup] = useState(false)
    const [openRegisterPopup, setOpenRegisterPopup] = useState(false)

    useEffect(() => {
      const getMarkerData = async () => {
        const db = getFirestore();
        const q = query(collection(db, "markers"));

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              const pathReference = ref(storage, "files/" + doc.data().uid + ".STL");

              getDownloadURL(pathReference).then((response) =>{
                setMarkers((current) => [...current,
                  {
                    lat: doc.data()?.lat,
                    lng: doc.data()?.lng,
                    team: doc.data()?.teamnumber,
                    location: doc.data()?.formattedAddress,
                    email: doc.data()?.email,
                    uid: doc.data()?.uid
                  },
                ]);
              }).catch((err) => {
                console.log(err)
              })
              
            
        });
              
          
        } catch (error){
          window.alert(error)
            console.log(error)

        }
    }
      getMarkerData()
    }, [storage])

  const libraries = ['places'];
  let libRef = React.useRef(libraries)
  const mapContainerStyle = {
    width: '100vw',
    height: '100vh'
  }
  const [center, setCenter]= useState({
    lat: 36.7783, lng: -96.4179
})

const onSelect = (marker) => {
    setSelected(marker)
    setCenter({
      lat: marker.lat, 
      lng: marker.lng
  })
}
       const getData = async () => {
        try {
         const docRef = await addDoc(collection(db, "email"), {
to:selected.email,
message:{subject:'New ZippyPrints Request',
text:'Hello ZippyPrinter, we have a new request from Team '+ values.teamnumber+ '\n\n'+
'Requester\'s email: ' + values.requester_email+ '\n'+

'Filament Info: '+values.filament +'\n'+
 'Supports Info: ' + values.supports +'\n'+
  'Infill Percentage + Info: ' + values.infill+'\n'+

  'Requested Time Frame: '+  values.time_frame +'\n'+
    'Additional Information: '  +  values.addt_info+'\n\n'+
     'Link to Requested CAD: ' + values.cad_link +'\n\n'+
        'Please contact the requester through their email for further communications'+'\n\n'+
        'Thanks for your continued support of ZippyPrints!'+'\n'+
        'To stop receiving requests, go to your account page and disable your printer.'+'\n\n'+
        'Reference ID: #'+uuidv4(),
}
         });
        }catch(error) {
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

const uploadData = async () => {
        await getData();
    }
      const validate=(fieldValues = values)=>{
            let temp = {...errors}
            if ('teamnumber' in fieldValues)
                temp.teamnumber = (/./).test(fieldValues.teamnumber)?"":"Team Number is required."
            if ('requester_email' in fieldValues)
                temp.requester_email = (/./).test(fieldValues.requester_email)?"":"Email is required."
            if ('cad_link' in fieldValues)
                temp.cad_link1 = (/./).test(fieldValues.cad_link1)?"":"Cad Link is required."
            if ('supports' in fieldValues)
                temp.supports = (/./).test(fieldValues.supports)?"":"Support info is required."
            if ('filament' in fieldValues)
                temp.filament = (/./).test(fieldValues.addt_info)?"":"Filament info is required."
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
/*  const db = getFirestore();
 const docRef = doc(db, "users", "" + currentUser.uid)
const docSnap = await getDoc(docRef);
if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
} else {
  // doc.data() will be undefined in this case
  console.log("No such document!");
}*/
setOpenRegisterPopup(true)
}
    const handleSubmit = async(e) => {
    getData();
    setOpenRegisterPopup(false)
    }


  if (loadError) return "Error loading map";
  if (!isLoaded) return "Loading map...";

  return (

    //TODO: replace with actual logo
  <div>
    <h2>
    Zippyprints {" "}
      <span role ="img" aria-label="logo">
      🖨️ 
      </span>
    </h2>
      <Popup
                        title = "Register"
                        children =    <Form onSubmit={handleSubmit}>
                                                     <Controls.Input
                                                         label = "Team Number"
                                                         name="teamnumber"
                                                         value={values.teamnumber}
                                                         onChange = {handleInputChange}
                                                         error={errors.teamnumber}
                                                         className={classes.textbox}
                                                         style = {{width: '350px'}}
                                                         required
                                                         />
                                                     <Controls.Input
                                                         label = "Your Email"
                                                         name="requester_email"
                                                         value={values.requester_email}
                                                         onChange = {handleInputChange}
                                                         error={errors.requester_email}
                                                         className={classes.textbox}
                                                         style = {{width: '350px'}}
                                                         required
                                                         />
                                                     <Controls.Input
                                                         label = "Link to Your CAD (Onshape, GrabCad, etc)"
                                                         name="cad_link"
                                                         value={values.cad_link}
                                                         onChange = {handleInputChange}
                                                         error={errors.cad_link}
                                                         className={classes.textbox}
                                                         style = {{width: '350px'}}
                                                         required
                                                         />
                                                     <Controls.Input
                                                         label = "Filament Type (PLA, TPU, etc)"
                                                         name="filament"
                                                         value={values.filament}
                                                         onChange = {handleInputChange}
                                                         error={errors.filament}
                                                         className={classes.textbox}
                                                         style = {{width: '350px'}}
                                                                                                                  required
                                                         />
                                                     <Controls.Input
                                                         label = "Infill Percentage"
                                                         name="infill"
                                                         value={values.infill}
                                                         onChange = {handleInputChange}
                                                         error={errors.infill}
                                                         className={classes.textbox}
                                                         style = {{width: '350px'}}
                                                         required
                                                         />
                                                     <Controls.Input
                                                         label = "Does it Require Support? (if so, what type?)"
                                                         name="supports"
                                                         value={values.supports}
                                                         onChange = {handleInputChange}
                                                         error={errors.supports}
                                                         className={classes.textbox}
                                                         style = {{width: '350px'}}
                                                         required
                                                         />
                                                     <Controls.Input
                                                         label = "When do you need this by?"
                                                         name="time_frame"
                                                         value={values.time_frame}
                                                         onChange = {handleInputChange}
                                                         error={errors.time_frame}
                                                         className={classes.textbox}
                                                         style = {{width: '350px'}}
                                                         required
                                                         />
                                                     <Controls.Input
                                                         label = "Addt Info (Orientation, Color, etc)"
                                                         name="addt_info"
                                                         value={values.addt_info}
                                                         onChange = {handleInputChange}
                                                         error={errors.addt_info}
                                                         className={classes.textbox}
                                                         style = {{width: '350px'}}
                                                         />
                                                     <Controls.Button
                                                         className = {classes.submitButton}
                                                         variant = "contained"
                                                         color = "secondary"
                                                         size = "large"
                                                         text = "Submit"
                                                         onClick = {handleSubmit}
                                                     />
                                                 </Form>
                        openPopup={openRegisterPopup}
                        setOpenPopup={setOpenRegisterPopup}>
                    </Popup>
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
          <Box sx={{marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            m:1}}>

            <h3>
            {selected.team}
           </h3>

           <h5>
           Location: {selected.location}
           </h5>
            
           <Controls.Button 
                className = {classes.requestButton}
                variant = "contained"
                color = "secondary"
                size = "large"
                text = "Submit Request"
                onClick = {handleClick}
                />  
          </Box>
        </InfoWindow>) : null}
    </GoogleMap>
  </div>
  );
  
}
const useStyles = makeStyles(theme =>({ 
  requestButton: {
    background: 'linear-gradient(45deg, #00ff00 100%, #9aff5c 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      height: 48,
      width: 220,
    }
  
}))
export default Discover