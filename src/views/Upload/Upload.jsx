import React, { useState } from 'react'
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { firebaseConfig } from '../../api/firebaseConfig';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { withStyles } from '@mui/styles'
import Controls from '../../components/actions/Controls'
import { Grid, Typography, Snackbar, SnackbarContent, Link,
  Paper, Progress, Alert, Item, Avatar, ThemeProvider, createTheme, Box, } from '@mui/material'
  import FileUploadIcon from '@mui/icons-material/FileUpload';
  import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { AuthContext } from "../../views/Auth/Auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
initializeApp(firebaseConfig);

const storage = getStorage();

const styles = theme => ({
  upload: {
    background: 'linear-gradient(45deg, #00ff00 100%, #9aff5c 90%)',
    border: 0,
      borderRadius: 3,
      boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      height: 48,
      width: 350,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      top: 10
    },
})

class FileUpload extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      fileType: null,
      user: {},
      noFileError: false,
      invalidFileError: false,
      success: false,
    };
  }

  componentDidMount() {
    (async() => {
      if (this.state.user.uid == null) {
        const {currentUser} = this.context;
        this.setState({user: currentUser});
      }
    })();
  }
  

  // On file select (from the pop up)
  onFileChange = event => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0], user: getAuth()?.currentUser?.uid });

  };

  // On file upload (click the upload button)

  onFileUpload = () => {
    if (this.state.selectedFile == null || this.state.selectedFile.name == null) {
      this.setState({noFileError: true});
    } else {
    const storageRef = ref(storage, "files/" + this.state.user.uid + "." + this.state.selectedFile.name.split('.')[1]);
    console.log(this.state.user)

    // Details of the uploaded file
    console.log(this.state.selectedFile);
    if (this.verifyFile()) {
      
      // 'file' comes from the Blob or File API
      // eslint-disable-next-line no-undef
      uploadBytes(storageRef, this.state.selectedFile).then((snapshot) => {
        console.log('Uploaded a file!');
      });
     
    } else {
      
    }
  }
  };

  verifyFile() {
    console.log(this.state.selectedFile.name.split('.')[1])
    if ("" + this.state.selectedFile.name.split('.')[1] === ("STL")) {
      this.setState({noFileError: false});
      this.setState({success: true});
      return true;
    }
    this.setState({invalidFileError: true})
    this.setState({noFileError: false});
    return false;

  }

  // File content to be displayed after
  // file upload is complete
  fileData = () => {
    if (this.state.selectedFile) {
      const theme = createTheme();
      return (
        <div>
        <ThemeProvider theme={theme}>
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2>File Details:</h2>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.name.split('.')[1]}</p>
        </Box>
       </ThemeProvider>
       </div>
      );
    } else {
    const theme = createTheme();
      return (
        <ThemeProvider theme={theme}>
         
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h4>Select a file before pressing 'Upload'</h4>

        </Box>
        </ThemeProvider>
      );
    }
  };

  render() {
    const theme = createTheme();
    const { classes } = this.props
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
        <h3> File Upload </h3>
           <Avatar sx={{ m: 0, bgcolor: '#00ff00', fontSize: 2 }}>
            <FileUploadIcon/>

          </Avatar>
          
          <Box component="form" noValidate sx={{ mt: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                <h4> Upload your file below: {this.state.user.displayName}</h4>
                
                <input type="file" onChange={this.onFileChange}/>
                <div>{this.fileData()}</div>
                <Controls.Button 
                    className = {classes.upload}
                    variant = "contained"
                    color = "secondary"
                    size = "large"
                    text = "Upload"
                    onClick = {this.onFileUpload}
                  />   
          </Box>
         
        </Box>
      </Container>
      <Snackbar open={this.state.noFileError} autoHideDuration={2} onClose={this.state.success}>
        <Alert  onClose={this.state.success} severity="error" sx={{ width: '100%' }}>
          Please select a file!
        </Alert>
      </Snackbar>

      <Snackbar open={this.state.success} autoCloseDuration={200}>
        <Alert severity="success" sx={{ width: '100%' }}>
          File uploaded!
        </Alert>
      </Snackbar>

      <Snackbar open={this.state.invalidFileError} autoHideDuration={200} onClose={this.state.success}>
        <Alert severity="error" sx={{ width: '100%' }}>
          Wrong file type!
        </Alert>
      </Snackbar>

  </ThemeProvider>

      
    );
  }
}
export default withStyles(styles, { withTheme: true })(FileUpload);