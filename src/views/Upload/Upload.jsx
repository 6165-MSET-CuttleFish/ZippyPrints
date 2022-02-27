import React from "react"
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { firebaseConfig } from '../../api/firebaseConfig';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
initializeApp(firebaseConfig);

const storage = getStorage();

export default class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      user: getAuth().currentUser
    };
  }
  componentDidMount() {
    (async() => {
      const useruid = await getAuth()?.currentUser?.uid
      this.state.user = useruid;
    })();
  }
  componentDidUpdate() {
    (async() => {
      this.state.user = await getAuth()?.currentUser?.uid;
    })();
  }

  // On file select (from the pop up)
  onFileChange = event => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0], user: getAuth()?.currentUser?.uid });

  };

  // On file upload (click the upload button)
  onFileUpload = () => {
    if (this.state.selectedFile == null) return;
    const storageRef = ref(storage, "files/" + this.state.user + "." + this.state.selectedFile.name.split('.')[1]);
    console.log(this.state.user)

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
    console.log(this.state.selectedFile.name.split('.')[1])
    if ("" + this.state.selectedFile.name.split('.')[1] === ("STL")) {
      return true;
    }
    return false;

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
          </p>
          <div>User:{" "} {this.state.user}</div>

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
        <div>
          <h2>
          CAD File
          </h2>
          </div>
        <div>
          <h3>
          Please upload a valid CAD file (We only support .STL for now)
          </h3>
        </div>
        <div></div>
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