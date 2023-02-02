import React from 'react';

const Details = ({place}) => {
    console.log(place)
    return(
        <h1>
        {place.username}
        {place?.team}
        {place?.email}
        {place.location.split(",")[1]}, {place.location.split(",")[2]}
        </h1>
    );
}
export default Details