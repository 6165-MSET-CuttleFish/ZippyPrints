import React, { useState, useEffect, createRef } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';
import useStyles from './styles';
import Details from '../Details/Details';
import { Autocomplete } from '@react-google-maps/api';
import { AppBar, Toolbar, Box, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CssStyles from '../Menu/menu.module.css'
// import {SelectChangeEvent } from '@mui/material/SelectChangeEvent';


export const Menu = () => {
    const classes = useStyles();
    const [type, setType] = useState("3D Printing");
    const places = [{}] // get from firebase?
    const handleInputChange = (event) => {
        setType(event?.target.value);
    }
    return(
        <Box className = {classes.container}>
            <Autocomplete>
                <div className = {CssStyles.wrapper}>
                    <SearchIcon />
                    <InputBase className = {classes.search} sx = {{color: '##00FF00'}} placeholder = "Search..."/>
                </div>
                </Autocomplete>
            <Typography variant = 'h4'> 
                Options Around You
            </Typography>
            <FormControl className = {classes.formControl}>
                <InputLabel >What method are you looking for?</InputLabel>
                <Box sx = {{marginTop:2.85}}>
                <Select value = {type} sx = {{margin: 30}} onChange = {handleInputChange}>
                    <MenuItem value = '3D Printing'> 3D Printing </MenuItem>
                    <MenuItem value = 'Laser Cutting'> Laser Cutting </MenuItem>
                    <MenuItem value = 'CNC Work'> CNC Work </MenuItem>
                    <MenuItem value = 'CNC Routing'> CNC Routing </MenuItem>
                </Select>
                </Box>
            </FormControl>
            <Grid container spacing = {3} className = {classes.list}>
                {places?.map((place,i) =>(
                   <Grid item key = {i} xs = {12}>
                        <Details place ={place}/>
                   </Grid> 
                ))}
            </Grid>
        </Box>
    );
}
