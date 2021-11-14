import React from 'react';
import {GoogleMap, useLoadScript, Marker, InfoWindow} from '@react-google-maps/api';


export default function Discover() {

  const libraries = ["places"];
  const mapContainerStyle = {
    width: '100vw',
    height: '100vh'
  }
  const center = {
    lat: 43,
    lng: -79
  }
  const options = {
    disableDefaultUI: true,
    zoomContrl: true,
  }
  const {isLoaded, loadError} = useLoadScript({
      googleMapsApiKey: "AIzaSyD66Pg0s20be-L1lod3A29C8uyehouZREE",
      libraries
  });

  if (loadError) return "Error loading map";
  if (!isLoaded) return "Loading map...";

  return (
    
  <div>
    <GoogleMap 
      mapContainerStyle = {mapContainerStyle} 
      zoom = {8} 
      center = {center}
      options={options}
      >

    </GoogleMap>
  </div>
  );
}