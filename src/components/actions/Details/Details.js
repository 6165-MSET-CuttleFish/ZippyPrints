import React from 'react';
import { Box, Typography, Button, Card, CardMedia, CardContent, CardActions, Chip } from '@material-ui/core';

const Details = ({place}) => {
    console.log(place)
    return(
        <h1>
        {place.name}
        </h1>
    );
}
export default Details