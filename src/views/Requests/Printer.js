import React, { useState, useEffect, useContext } from 'react';
import { Grid} from '@mui/material'
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import {makeStyles} from '@mui/styles'
import { getAuth, updateProfile, onAuthStateChanged, currentUser } from "firebase/auth";
import {Paper} from '@mui/material'
import { getFirestore, setDoc, updateDoc, doc, getDoc, GeoPoint } from 'firebase/firestore/lite';
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { Avatar, ThemeProvider, createTheme, Box, Select, OutlinedInput, MenuItem, Button } from '@mui/material'
import { query, collection, getDocs, where } from "firebase/firestore";
import { API_KEY } from '../../api/firebaseConfig'
import { AuthContext } from "../Auth/Auth";
import styles from './printer.module.css'
import {useNavigate} from "react-router-dom"
import { v4 } from 'uuid';
import { getStorage, ref, uploadBytes } from 'firebase/storage'


const materials = [
    'PLA',
    'ABS',
    'PETG',
    'TPU',
    'Nylon',
    'PC',
    'Other (specify below)'
  ];

  const colors = [
    'White',
    'Black',
    'Clear',
    'Red',
    'Orange',
    'Yellow',
    'Green',
    'Blue',
    'Purple',
    'Brown',
    'Other'
  ];

  const units = [
    'in',
    'mm',
  ];

  const initalFValues = {
    material: '',
    color: '',
    width: '',
    length: '',
    height: '',
    unit: '',
    info: '',
    file: '',
}
function Printer() {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const [material, setMaterial] = useState();
    const [color, setColor] = useState();
    const [unit, setUnit] = useState();
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("No file selected");

    let id = v4();
    const storage = getStorage();
    let username = null;
    let db = null;
    let colRef = null;
    let markerColRef = null;
    if(currentUser != null) {
        username = (currentUser?.displayName)
        db = (getFirestore());
        colRef = (doc(db, 'requests', "" + id))
    }

    const uploadData = async () => {
        await setDoc(colRef, {
             material: material,
             color: color,
             width: values.width,
             length: values.length,
             height: values.height,
             unit: unit,
             info: values.info,
             file: {id}
        })
    }

    const handleSubmit = async(e) => {        
        e.preventDefault()
        if(validate()) {
            uploadData(); 
            handleFile();
            resetForm();
        }  
    }

    const handleFile = () => {
        if (file == null) return;
        const fileRef = ref(storage, `prints/${id}`);
        uploadBytes(fileRef, file).then(() => {
            alert("Success!")
        })
    }

    const handleMaterial = (event) => {
        const {
          target: { value },
        } = event;
        setMaterial(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };
      const handleColor = (event) => {
        const {
          target: { value },
        } = event;
        setColor(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };
      const handleUnit = (event) => {
        const {
          target: { value },
        } = event;
        setUnit(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };
    
    const validate=(fieldValues = values)=>{
        let temp = {...errors}
        if ('printers' in fieldValues)
            temp.printers = (/.../).test(fieldValues.printers)?"":"Please enter at least three characters."
        if ('filament' in fieldValues)
            temp.address2 = (/.../).test(fieldValues.address2)?"":"Please enter at least three characters."
        if ('price' in fieldValues)
            temp.price = (/.../).test(fieldValues.price)?"":"Please enter at least three characters."
        if ('bio' in fieldValues)
            temp.bio = (/.../).test(fieldValues.bio)?"":"Please enter at least three characters."
                
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

    return (
        //Material Color Size Additional Info
        <div>
           <Box component="form" noValidate >    
                <Form onSubmit={handleSubmit} className={styles.textboxContainer}>
                <div className={styles.singleContainer}>
                    <div className={styles.label}>Material*</div>
                    <Select
                        placeholder="material"
                        single
                        value={material}
                        onChange={handleMaterial}
                        required
                        sx={{width: '34vw'}}>
                        {materials.map((name) => (
                            <MenuItem
                            key={name}
                            value={name}
                            InputProps={{
                                className: styles.textbox,
                            }}>
                            {name}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                <div className={styles.singleContainer}>
                    <div className={styles.label}>Color*</div>
                    <Select
                        placeholder="color"
                        single
                        value={color}
                        onChange={handleColor}
                        required
                        sx={{width: '34vw'}}>
                        {colors.map((name) => (
                            <MenuItem
                            key={name}
                            value={name}
                            InputProps={{
                                className: styles.textbox,
                            }}>
                            {name}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                <div className={styles.singleContainer}>
                    <div className={styles.label}>Length*</div>
                    <Controls.Input
                        placeholder="Enter the length of your print in appropriate units"
                        name="length"
                        value={values.length}
                        onChange = {handleInputChange}
                        error={errors.length}
                        InputProps={{
                            className: styles.textbox,
                        }}
                        required
                    />
                </div>
                <div className={styles.singleContainer}>
                    <div className={styles.label}>Width*</div>
                    <Controls.Input
                        placeholder="Enter the width of your print in appropriate units"
                        name="width"
                        value={values.width}
                        onChange = {handleInputChange}
                        error={errors.width}
                        InputProps={{
                            className: styles.textbox,
                        }}
                        required
                    />
                </div>
                <div className={styles.singleContainer}>
                    <div className={styles.label}>Height*</div>
                    <Controls.Input
                        placeholder="Enter the height of your print in appropriate units"
                        name="height"
                        value={values.height}
                        onChange = {handleInputChange}
                        error={errors.height}
                        InputProps={{
                            className: styles.textbox,
                        }}
                        required
                    />
                </div>
                <div className={styles.singleContainer}>
                    <div className={styles.label}>Measurement Unit*</div>
                    <Select
                        placeholder="units"
                        single
                        value={units}
                        onChange={handleUnit}
                        required
                        sx={{width: '34vw'}}>
                        {units.map((name) => (
                            <MenuItem
                            key={name}
                            value={name}
                            InputProps={{
                                className: styles.textbox,
                            }}>
                            {name}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
                <div className={styles.singleContainer}>
                    <div className={styles.label}>Additional Information*</div>
                    <Controls.Input
                        placeholder="Enter additional information about your request"
                        name="info"
                        value={values.info}
                        multiline
                        maxRows={4}
                        onChange = {handleInputChange}
                        error={errors.info}
                        InputProps={{
                            className: styles.longTextbox,
                        }}
                        required
                    />
                </div>
                </Form>
                    <div className={styles.uploadContainer}>
                    <Button variant="contained" component="label"  size="small"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                            gap: '12px',
                            backgroundColor: '#0B63E5',
                            borderRadius: '7px',
                            padding: '0px 32px',
                            width: '155px',
                            transitionDuration: '500ms',
                            height: '25px',
                            "&:hover": {
                            background: "#035ee6",
                            boxShadow: '5px 5px 5px #02142e8e',
                            transitionDuration: '500ms'
                            },
                        }}>
                            Upload File
                            <input 
                                type="file" 
                                hidden
                                onChange={(event) => {
                                    setFile(event.target.files[0])
                                    setFileName(event.target.files[0].name)
                                }}
                                />
                        </Button>
                        <div className={styles.uploadText}>
                            {fileName}
                    </div>
                </div>

                <div className={styles.submitContainer}>
                <Controls.Button 
                        className = {styles.button}
                        variant = "contained"
                        style={{
                            display: 'flex',
                            gap: '12px',
                            backgroundColor: '#0B63E5',
                            borderRadius: '7px',
                            padding: '0px 32px',
                            width: '500px',
                            transitionDuration: '500ms',
                            height: '50px',
                            marginTop: '0.7vw',
                            marginBottom: '1.5vw',
                            "&:hover": {
                            background: "#035ee6",
                            boxShadow: '5px 5px 5px #02142e8e',
                            transitionDuration: '500ms'
                            },
                        }}
                        size = "large"
                        text = "Submit"
                        onClick = {handleSubmit}
                    />
                </div>
            </Box>
          </div>
    )
}
export default Printer