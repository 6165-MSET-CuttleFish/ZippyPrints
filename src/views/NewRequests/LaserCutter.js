import React, { useState, useEffect, useContext } from 'react';
import {useForm, Form} from '../../components/useForm'
import Controls from '../../components/actions/Controls'
import { getFirestore, setDoc, updateDoc, doc, getDoc, GeoPoint } from 'firebase/firestore/lite';
import { Box, Select, MenuItem, Button, Snackbar, Alert } from '@mui/material'
import { AuthContext } from "../Auth/Auth";
import styles from './lasercutter.module.css'
import {useNavigate} from "react-router-dom"
import { v4 } from 'uuid';
import { getStorage, ref as storageRef, uploadBytes } from 'firebase/storage'

const materials = [
    'Acrylic',
    'Delrin',
    'MDF (Draftboard)',
    'Plywood',
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
function LaserCutter() {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();
    const [material, setMaterial] = useState();
    const [color, setColor] = useState();
    const [unit, setUnit] = useState();
    const fileName = useState("No file selected (.dxf and .svg are accepted). You may upload up to three files per request.");

    const [files, setFiles] = useState([])
    const [exts, setExts] = useState([])

    const [success, setSuccess] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Error!!");
    const [team, setTeam] = useState();
    const [location, setLocation] = useState();
    const [uploaded, setUploaded] = useState();

    let id1 = v4();
    let id2 = v4();
    let id3 = v4();
    let id = [id1, id2, id3]
    const storage = getStorage();
    const db = getFirestore();
    const reqRef = doc(db, 'requests', `${currentUser?.uid}`)
    const printerRef = doc(db, 'printers', `${currentUser?.uid}`)
    const userRef = doc(db, 'user', `${currentUser?.uid}`)
    const sharedRef = doc(db, 'shared', `${currentUser?.uid}`)
    const [ref, setRef] = useState()
    const [printer, setPrinter] = useState();

    useEffect(() => {
        const getRef = async () => {
          try {
            const docSnap = await getDoc(sharedRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data?.printer) {
                setPrinter(true);
                setRef(printerRef);
              } else {
                setPrinter(false);
                setRef(userRef);
              }
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            setErrorMessage(error)
            console.log(error)
            setErrorOpen(true)
          }
        };
    
        if (sharedRef) {
          getRef();
        }
      }, [success]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            if (ref) {
              const docSnap = await getDoc(ref);
              if (docSnap.exists()) {
                const data = docSnap.data();
                setTeam((data.teamnumber == "" || data.teamnumber == undefined)? "MISSING!" : data.teamnumber)
                let state = data.formattedAddress?.split((","))[2].split(" ")[1];
                let formatted = (await docSnap).data().formattedAddress?.split((","))[1] + ", " + state + "," + (await docSnap).data().formattedAddress.split((","))[3];
                setLocation(formatted)
              } else {
                console.log("No such document!");
                setErrorOpen(true)
              }
            }
          } catch (error) {
            console.error("Error fetching document:", error);
          }
        };
        if (ref) {
            fetchData();
        }
      }, [ref, success, printer]);

      useEffect(() => {
        const getExt = () => {
            for (let i = 0; i < files.length; i++) {
                let pieces = files[i].name.split(".")
                let ext = pieces[pieces.length - 1].toLowerCase();
                setExts(prev => [...prev, ext])
            }
        }
        getExt();
      }, [files])
      
  
      const validateFile = () => {
          //check if only three files have been uploaded
          try {
              if (files.length > 3) {
                  setErrorMessage("You can only upload up to three files!")
                  setErrorOpen(true)
                  return false
              }
      
              let valid = true;
              //check extensions of files
              for (let i = 0; i < files.length; i++) {
                  if (exts[i] == "svg" || exts[i] == "dxf") {
                    valid = valid;
                  } else {
                    valid = false
                    setErrorMessage("Please select a valid file format (only .svg and .dxf file types are accepted).")
                    setErrorOpen(true)
                  }
              }
              return valid;
          } catch (error) {
            setErrorMessage("Error!")
            setErrorOpen(true)
          }
      }

      const uploadData = async () => {
        await setDoc(reqRef, {
            files: {
                file1: id1 + "." + exts[0],
                file2: id2 + "." + exts[1],
                file3: id3 + "." + exts[2],
            },
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
             type: "Laser Cutting",
             accepted: false,
             uid: currentUser.uid
        })
        await updateDoc(ref, {
            request: {
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
                files: {
                    file1: id1 + "." + exts[0],
                    file2: id2 + "." + exts[1],
                    file3: id3 + "." + exts[2],
                },
                type: "Laser Cutting",
                accepted: false,
                uid: currentUser.uid
            }
       })
    }

    const handleSubmit = () => {        
        if(validate() && validateSelect() && files != null && validateFile()) {
            uploadData(); 
            handleFile();
            resetForm();
            setSuccess(true);
        } else {
            if (!validateFile())
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
        if (files == null) {
            setErrorMessage("Please upload a file")
            setErrorOpen(true);
            return;
        }
        for (let i = 0; i < files.length; i++) {
            //each file is stored under prints/uid
            const fileRef = storageRef(storage, `prints/${currentUser?.uid}/${id[i]}.${exts[i]}`);
            uploadBytes(fileRef, files[i]).then(() => {
                setSuccess(true);
            }).catch((error) => {
                setErrorMessage("Error: " + error)
                setErrorOpen(true)
            })
        }
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
                                multiple
                                onChange={(e) => {
                                    setFiles(e.target.files)
                                    setUploaded(true)
                                }}
                                />
                        </Button>
                        { !uploaded && <div className={styles.uploadText}>
                            {fileName}
                        </div> }
                        { uploaded && <div className={styles.uploadText}>
                            {files[0]?.name}, {files[1]?.name}, {files[2]?.name}  
                        </div>}
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
export default LaserCutter