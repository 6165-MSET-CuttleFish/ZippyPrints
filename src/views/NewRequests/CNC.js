import React, { useState, useEffect, useContext } from 'react';
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import { getFirestore, setDoc, updateDoc, doc, getDoc, GeoPoint } from 'firebase/firestore/lite';
import { Box, Select, MenuItem, Button, Snackbar, Alert } from '@mui/material'
import { AuthContext } from "../Auth/Auth";
import styles from './cnc.module.css'
import {useNavigate} from "react-router-dom"
import { v4 } from 'uuid';
import { getStorage, ref, uploadBytes } from 'firebase/storage'

const materials = [
    'Aluminum',
    'Acrylic',
    'Polycarbonate',
    'HDPE',
    'Delrin',
    'Steel',
    'Brass',
    'Carbon Fiber',
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
    'Not Applicable',
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
    thickness: '',
    unit: '',
    info: '',
    file: '',
  }

function CNC() {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const [material, setMaterial] = useState();
    const [color, setColor] = useState();
    const [unit, setUnit] = useState();
    const [file, setFile] = useState(null);    
    const [fileName, setFileName] = useState("No file selected (.dxf, and .svg are accepted).");
    const pieces = fileName.split(".")
    const ext = pieces[pieces.length - 1].toLowerCase();

    const [success, setSuccess] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Error!");
    const [team, setTeam] = useState();
    const [location, setLocation] = useState();

    let id = v4();
    const storage = getStorage();
    const db = getFirestore();
    let colRef = null;
    let userRef = null;
    if(currentUser != null) {
        colRef = (doc(db, 'requests', "" + id))
        userRef = doc(db, 'users', "" + currentUser.uid)
    }
    useEffect(() => {
        const fetchData = async () => {
            const docSnap = await getDoc(userRef);
            setTeam(((await docSnap).data().teamnumber) !== undefined? ((await docSnap).data().teamnumber) : "MISSING!");
            let state = ((await docSnap).data().formattedAddress.split((","))[2]).split(" ")[1];
            let formatted = (await docSnap).data().formattedAddress.split((","))[1] + ", " + state + "," + (await docSnap).data().formattedAddress.split((","))[3];
            setLocation(((await docSnap).data().formattedAddress) !== undefined? (formatted) : "MISSING!");
        }
        fetchData()
    }, [colRef])

    const uploadData = async () => {
        await setDoc(colRef, {
             material: material,
             color: color,
             width: values.width,
             length: values.length,
             thickness: values.thickness,
             unit: unit,
             info: values.info,
             teamnumber: team,
             location: location,
             email: currentUser.email,
             file: id + "." + ext
        })
    }

    const handleSubmit = async(e) => {        
        e.preventDefault()
        if(validate() && validateSelect() && file != null && validateFile()) {
            uploadData(); 
            handleFile();
            resetForm();
            setSuccess(true);
        } else {
            if (!validateFile())
            setErrorMessage("Please select a valid file format (only .svg and .dxf file types are accepted).")
            if (!validate() || !validateSelect())
            setErrorMessage("Please fill in all the required fields!")
            setErrorOpen(true);
        }
    }

    const validateSelect = () => {
        if (!material || !unit) {
            return false;
        } else return true;
    }

    const handleFile = () => {
        if (file == null) {
            setErrorMessage("Please upload a file")
            setErrorOpen(true);
            return;
        }
        const fileRef = ref(storage, `prints/${id}.${ext}`);
        uploadBytes(fileRef, file).then(() => {
            setSuccess(true);
        })
    }

    const validateFile = () => {
        if (ext == "svg" || ext == "stl") {
            return true;
        }
        else return false;
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
        if ('thickness' in fieldValues)
            temp.thickness = (/^[0-9\b]+$/).test(fieldValues.thickness)?"":"Please enter valid information (at least one number)."
        if ('length' in fieldValues)
            temp.length = (/^[0-9\b]+$/).test(fieldValues.length)?"":"Please enter valid information (at least one number)."
        if ('width' in fieldValues)
            temp.width = (/^[0-9\b]+$/).test(fieldValues.width)?"":"Please enter valid information (at least one number)."
                
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
        <div>
           <Box component="form" noValidate >    
                <Form onSubmit={handleSubmit} className={styles.textboxContainer}>
                <div className={styles.singleContainer}>
                    <div className={styles.label}>Material*</div>
                    <Select
                        placeholder="material"
                        single
                        value={material}
                        error={errors.material}
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
                    <div className={styles.label}>Color</div>
                    <Select
                        placeholder="color"
                        single
                        value={color}
                        error={errors.color}
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
                        placeholder="Enter the length of your file in appropriate units"
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
                        placeholder="Enter the width of your file in appropriate units"
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
                    <div className={styles.label}>Thickness*</div>
                    <Controls.Input
                        placeholder="Enter the thickness of your file in appropriate units"
                        name="thickness"
                        value={values.thickness}
                        onChange = {handleInputChange}
                        error={errors.thickness}
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
                        value={unit}
                        error={errors.unit}
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
                    <div className={styles.label}>Additional Information</div>
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
                <Snackbar open={success} autoCloseDuration={5000} onClose={() => setSuccess(false)}>
                    <Alert severity="success" sx={{ width: '100%' }} onClose={() => setSuccess(false)}>
                        Success!
                    </Alert>
                </Snackbar>
                <Snackbar open={errorOpen} autoCloseDuration={5000} onClose={() => setErrorOpen(false)}>
                    <Alert onClose={() => setErrorOpen(false)} severity="error" sx={{ width: '100%' }}>
                        {errorMessage}
                    </Alert>
                </Snackbar>
                </div>
            </Box>
          </div>
    )
}
export default CNC