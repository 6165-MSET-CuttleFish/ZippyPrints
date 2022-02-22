import React, {useState, useEffect, useCallback} from 'react';
import {GoogleMap, useLoadScript, Marker, InfoWindow} from '@react-google-maps/api';
import LoginForm from '../Auth/LoginForm'
import axios from 'axios'
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, getDoc, GeoPoint } from 'firebase/firestore/lite';
import { getAuth, updateProfile,  } from "firebase/auth";
import { getDatabase, ref, set, onValue} from "firebase/database";


function Discover() {


  const libraries = ["places"];
  const mapContainerStyle = {
    width: '100vw',
    height: '100vh'
  }
  const center = {
    lat: 37,
    lng: -95
  }
  const options = {
    disableDefaultUI: true,
    zoomContrl: true,
  }
  const {isLoaded, loadError} = useLoadScript({
      googleMapsApiKey: "AIzaSyD66Pg0s20be-L1lod3A29C8uyehouZREE",
      libraries
  });
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);

  const onMapClick = React.useCallback((event) => {
    setMarkers((current) => [...current, 
    {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      time: new Date(),

    },
  ]);
}, []);

const mapRef = React.useRef();
const onMapLoad = React.useCallback((map) => {
  mapRef.current = map;
}, [])

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
      onClick={onMapClick}
      onLoad={onMapLoad}
      >
        {markers.map(marker => ( 
          <Marker 
          key={LoginForm.email} 
          position = {{lat: marker.lat, lng: marker.lng}}
          icon={{
            url: '/printer.png',
            scaledSize: new window.google.maps.Size(30, 30),
            origin: new window.google.maps.Point(0,0),
            anchor: new window.google.maps.Point(15, 15)
          }}
          onClick={() => {
            setSelected(marker);
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
          <div>
            <h2>Team Printer: 6165 </h2>
            <p>Team Info: MSET Cuttlefish 6165 </p>
            <p>Location: {}</p>
          </div>
        </InfoWindow>) : null}
    </GoogleMap>
  </div>
  );
}
export default Discover