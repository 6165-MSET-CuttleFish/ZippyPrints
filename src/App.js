import logo from './logo.svg';
import './App.css';
import ButtonWeb from './components/Button';

function NavBar() {
  return (
    <div className="App">
      <div className="Elements">
      <a href="https://youtube.com">Home</a>
      <a>About</a>
      <a>Examples</a>
      <a>Contact</a>
      </div>

      <div className="Auth">
        <a className="Login">Log in</a>
        <a className="SignUp">
          <p>Sign Up</p>
          <div className="GoogleLogo"></div>
        </a>
      </div>
    </div>
  );
}

function Upload() {
  return(
    <div className="Upload">
      <div className="InfoBlurb">
        <h1>Uberprints.</h1>
        <p>A fast, easy to use, and reliable way for printing custom designs through printers near you!</p>
        <a>Example prints</a>
      </div>
      <div className="UploadDesign"></div>
    </div>
  );
}

function Home() {
  return(
    <div className="body">
      <NavBar/>
      <Upload/>      
    </div>
  );
}

export default Home;
