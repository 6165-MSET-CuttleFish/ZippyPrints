import React, {useState, useEffect, useCallback} from 'react';
import {GoogleMap, useLoadScript, Marker, InfoWindow} from '@react-google-maps/api';
import axios from 'axios'
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, getDoc, GeoPoint, query } from 'firebase/firestore/lite';
import { getAuth, updateProfile,  } from "firebase/auth";
import { getDatabase, ref, set, onValue} from "firebase/database";
import { getMarkerData} from '../../components/actions/Location'
import Controls from '../../components/actions/Controls'
import {makeStyles} from '@mui/styles'
import {Typography} from '@mui/material'



function Discover() {

  

  const [currentUser, setCurrentUser] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [location, setLocation] = useState([]);
  const [team, setTeam] = useState([]);
  const [selected, setSelected] = useState(null);

  
  
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
              setMarkers((current) => [...current, 
                {
                  lat: doc.data()?.lat,
                  lng: doc.data()?.lng,
                  team: doc.data()?.teamnumber,
                  location: doc.data()?.formattedAddress
                },
              ]);
              setTeam(doc.data()?.teamnumber)
              setLocation(doc.data()?.formattedAddress)
        });
              
          
        } catch (error){
            console.log(error)
    
        }
    }
      getMarkerData()
    }, [])

  




   

  const libraries = ['places'];
  let libRef = React.useRef(libraries)
  const mapContainerStyle = {
    width: '100vw',
    height: '100vh'
  }
  const [center, setCenter]= useState({
    lat: 36.7783, lng: -119.4179
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

  if (loadError) return "Error loading map";
  if (!isLoaded) return "Loading map...";

  return (
    //TODO: replace with actual logo
  <div>
    
    <h1>
      Zippyprints {" "}
      <span role ="img" aria-label="logo">
      🖨️ 
      </span>
    </h1>
    <GoogleMap
      mapContainerStyle = {mapContainerStyle} 
      zoom = {4} 
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
          <div>
           <Typography gutterBottom variant="h5">
            {selected.team}'s Printer
           </Typography>
           <Typography  variant="body2" component = "h2">
            Location: {selected.location}
           </Typography>
           <div> .</div>
            <Controls.Button 
                className = {classes.requestButton}
                variant = "contained"
                color = "secondary"
                size = "large"
                text = "See Request"
                type="request"
                //onClick = {}
                />
                <div></div>
          </div>
          
        </InfoWindow>) : null}
    </GoogleMap>
  </div>
  );
  
}
const useStyles = makeStyles(theme =>({ 
  requestButton: {
      background: 'linear-gradient(45deg, #00ff00 30%, #9aff5c 90%)',
      border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      height: 48,
      width: 200,
      left: 10,
      bottom: 5
    }
  
}))
export default Discover