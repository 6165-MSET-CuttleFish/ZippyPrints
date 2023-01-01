import React from 'react';

const Details = ({place}) => {
    console.log(place)
    return(
        <h1>
        {place.name}
        </h1>
    );
}
export default Details