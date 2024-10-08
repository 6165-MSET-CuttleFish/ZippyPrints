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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {FetchContext} from '../Requests/FetchContext'

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


    const [ ids, setIDs ] = useState([])
    const storage = getStorage();
    const db = getFirestore();
    const reqRef = doc(db, 'requests', `${currentUser?.uid}`)
    const printerRef = doc(db, 'printers', `${currentUser?.uid}`)
    const userRef = doc(db, 'users', `${currentUser?.uid}`)
    const sharedRef = doc(db, 'shared', `${currentUser?.uid}`)
    const [ref, setRef] = useState()
    const [printer, setPrinter] = useState();

    const {refreshRequests} = useContext(FetchContext)

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
                setTeam((data.teamnumber == "" || data.teamnumber == undefined)? "" : data.teamnumber)
                setLocation(data.formattedAddress)
              } else {
                console.log("No such document!");
                setErrorMessage("Error: having trouble fetching user information, please try again later")
                setErrorOpen(true)
              }
            }
          } catch (error) {
            console.error("Error fetching document:", error);
            setErrorMessage("Error: having trouble fetching user information, please try again later")
            setErrorOpen(true)
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
                setIDs(prev => [...prev, v4()])
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
            console.log(error)
            setErrorMessage("Error!")
            setErrorOpen(true)
          }
      }

      const uploadData = async () => {
        await setDoc(reqRef, {
            files: {
                file1: `${ids[0]}.${exts[0]}`,
                file2: (ids[1] == undefined)? "-1" : `${ids[1]}.${exts[1]}`,
                file3: (ids[2] == undefined)? "-1" : `${ids[2]}.${exts[2]}`,
            },
             material: material,
             color: color,
             width: values.width,
             length: values.length,
             thickness: values.thickness,
             height: "-1",
             unit: unit,
             info: values.info,
             teamnumber: team,
             location: location,
             email: currentUser.email,
             type: "Laser Cutting",
             accepted: false,
             uid: currentUser?.uid,
             printer: printer,
             name: currentUser?.displayName
        })
        await updateDoc(ref, {
            userRequest: {
                material: material,
                color: color,
                width: values.width,
                length: values.length,
                thickness: values.thickness,
                height: "-1",
                unit: unit,
                info: values.info,
                teamnumber: team,
                location: location,
                email: currentUser.email,
                files: {
                    file1: `${ids[0]}.${exts[0]}`,
                    file2: (ids[1] == undefined)? "-1" : `${ids[1]}.${exts[1]}`,
                    file3: (ids[2] == undefined)? "-1" : `${ids[2]}.${exts[2]}`,
                },
                type: "Laser Cutting",
                accepted: false,
                uid: currentUser.uid,
                name: currentUser?.displayName
            }
       })
    }

    const handleSubmit = () => {        
        if(validate() && validateSelect() && files != null && validateFile()) {
            uploadData(); 
            handleFile();
            resetForm();
            refreshRequests();
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
            const fileRef = storageRef(storage, `prints/${currentUser?.uid}/${ids[i]}.${exts[i]}`);
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
          <Form onSubmit={handleSubmit}>
            <div className={styles.columnContainer}>
              <div className={styles.leftContainer}>
              <div className={styles.singleContainer}>
                      <div className={styles.label}>Measurement Unit*</div>
                      <Select
                          placeholder="units"
                          single
                          value={unit}
                          error={errors.unit}
                          onChange={handleUnit}
                          required
                          className={styles.serviceSelect}
                          InputProps={{
                            className: styles.serviceSelect }}>
                          {units.map((name) => (
                              <MenuItem
                              key={name}
                              value={name}>
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
                  <div className={styles.uploadContainer}>
                      <Button 
                        variant="outlined" 
                        component="label"  
                        size="small"
                        style={{
                          borderColor: "#015F8F",
                          textTransform: "none",
                          fontWeight: "400",
                          width: '8rem',
                          height: '2rem'}}>
                        <CloudUploadIcon style={{ marginRight: '0.5rem', marginLeft: '-0.25rem', color: '#015F8F' }}/> 
                        <div className={styles.label}>Upload File</div>
                        <input 
                        type="file" 
                        hidden
                        multiple
                        onChange={(event) => {
                          setFiles(event.target.files)
                          setUploaded(true) }}/>
                      </Button>
                      { !uploaded && 
                        <div className={styles.uploadText}> {fileName}</div> }
                      { uploaded && 
                        <div className={styles.uploadText}> {files[0]?.name}, {files[1]?.name}, {files[2]?.name} </div>}
                  </div>
                </div>
                <div className={styles.rightContainer}>
                <div className={styles.singleContainer}>
                    <div className={styles.label}>Color</div>
                    <Select
                        placeholder="color"
                        single
                        value={color}
                        error={errors.color}
                        onChange={handleColor}
                        required
                        className={styles.serviceSelect}
                        InputProps={{
                           className: styles.serviceSelect }}>
                        {colors.map((name) => (
                            <MenuItem
                            key={name}
                            value={name}>
                            {name}
                            </MenuItem>
                        ))}
                    </Select>
                  </div>
                  <div className={styles.singleContainer}>
                    <div className={styles.label}>Material*</div>
                    <Select
                        placeholder="material"
                        single
                        value={material}
                        error={errors.material}
                        onChange={handleMaterial}
                        required
                        className={styles.serviceSelect}
                        InputProps={{
                           className: styles.serviceSelect }}>
                        {materials.map((name) => (
                            <MenuItem
                            key={name}
                            value={name}>
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
                              className: styles.textbox,
                          }}
                          required/>
                      </div>

                      <div className={styles.uploadContainer_mobile}>
                        <Button 
                          variant="outlined" 
                          component="label"  
                          size="small"
                          style={{
                            borderColor: "#015F8F",
                            textTransform: "none",
                            fontWeight: "400",
                            width: '8rem',
                            height: '2rem'}}>
                          <CloudUploadIcon style={{ marginRight: '0.5rem', marginLeft: '-0.25rem', color: '#015F8F' }}/> 
                            <div className={styles.label}>Upload File</div>
                              <input 
                              type="file" 
                              hidden
                              multiple
                              onChange={(event) => {
                                  setFiles(event.target.files)
                                  setUploaded(true) }}/>
                        </Button>
                        { !uploaded && 
                          <div className={styles.uploadText}> {fileName}</div> }
                        { uploaded && 
                          <div className={styles.uploadText}> {files[0]?.name}, {files[1]?.name}, {files[2]?.name} </div>}
                      </div>
                      <div className={styles.buttonContainer}>
                        <Controls.Button 
                          className = {styles.button}
                          variant = "contained"
                          style={{
                            backgroundColor: "#015F8F",
                            textTransform: "none",
                            fontWeight: "600",
                          }}
                          size = "large"
                          text = "Save and continue"
                          onClick = {handleSubmit}/>
                    </div>
                  </div>
                </div>
              </Form>                
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
    )
}
export default LaserCutter