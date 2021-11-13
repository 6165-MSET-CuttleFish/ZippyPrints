import React from "react"
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { firebaseConfig } from '../../api/firebaseConfig';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
initializeApp(firebaseConfig);

const storage = getStorage();

export default class FileUpload extends React.Component {
  state = {
    // Initially, no file is selected
    selectedFile: null
  };
  
  // On file select (from the pop up)
  onFileChange = event => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
    
  };
  
  // On file upload (click the upload button)
  onFileUpload = () => {
    if (this.state.selectedFile == null) return;
    const storageRef = ref(storage, 'files/something');
      
      // Details of the uploaded file
      console.log(this.state.selectedFile);
      if (this.verifyFile()) {
        // 'file' comes from the Blob or File API
        // eslint-disable-next-line no-undef
        uploadBytes(storageRef, this.state.selectedFile).then((snapshot) => {
          console.log('Uploaded a file!');
        });
        // addDoc(collection(db, "files"), {
        //   name: this.state.selectedFile.name,
        //   size: this.state.selectedFile.size * 0.000001,
        //   type: this.state.selectedFile.type,
        //   date: new Date()
        // });
        
      }
    };

    verifyFile() {
      // TODO: verify file is a valid CAD file
      return true;
    }
    
    // File content to be displayed after
    // file upload is complete
    fileData = () => {
      
      if (this.state.selectedFile) {
        
        return (
          <div>
          <h2>File Details:</h2>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.type}</p>
          <p>
          Last Modified:{" "}
          {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>
          
          </div>
          );
        } else {
          return (
            <div>
            <br />
            <h4>Select a file before pressing 'Upload'</h4>
            </div>
            );
          }
        };
        
        render() {
          return (
            <div>
            <h1>
            CAD File
            </h1>
            <h3>
            Please upload a valid CAD file
            </h3>
            <div className="Auth">
            <input type="file" onChange={this.onFileChange} />
            <button onClick={this.onFileUpload}>
            Upload
            </button>
            </div>
            {this.fileData()}
            </div>
            );
          }
        }