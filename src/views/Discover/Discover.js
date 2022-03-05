import React, {useState, useEffect, useCallback} from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios'
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, getDoc, GeoPoint, query } from 'firebase/firestore/lite';
import { getAuth, updateProfile,  } from "firebase/auth";
import { getDatabase, set, onValue} from "firebase/database";
import { getMarkerData} from '../../components/actions/Location'
import Controls from '../../components/actions/Controls'
import {makeStyles} from '@mui/styles'
import { Typography, Box } from '@mui/material'
import { getStorage, ref, getDownloadURL } from "firebase/storage";


function Discover() {

  

  const [currentUser, setCurrentUser] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const storage = getStorage();
  
  
  const classes = useStyles();
    const user = getAuth()?.currentUser;
    useEffect(() => {
        async function fetchUser() {
            const requestUser = await user;
            setCurrentUser(requestUser)
            return requestUser
        }
        fetchUser();
    }, [user])
    
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

  const options = {
    disableDefaultUI: true,
    zoomContrl: true,
  }
  const {isLoaded, loadError} = useLoadScript({
      googleMapsApiKey: "AIzaSyD66Pg0s20be-L1lod3A29C8uyehouZREE",
      libraries: libRef.current,
    });
  
  
const mapRef = React.useRef();

const onMapLoad = (map) => {
  mapRef.current = map;

}
const handleClick = async(e) => {
  e.preventDefault();
  const pathReference = ref(storage, "files/" + selected.uid + ".STL");
  getDownloadURL(pathReference)
  .then((url) => {
    window.open(url, '_blank');
  })
  .catch((error) => {
    console.log(error)
    
  })
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
            onSelect(marker)}}
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
            {selected.team}'s Request
           </h3>

           <h5>
           Location: {selected.location}
           </h5>

           <Controls.Button 
                className = {classes.requestButton}
                variant = "contained"
                color = "secondary"
                size = "large"
                text = "Download Request"
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