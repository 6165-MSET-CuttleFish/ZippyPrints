const Home = props => {
    return(
        <div className="StartScreen">
          <div className="InfoBlurb">
            <h1>Zippyprints.</h1>
            <p>A fast, easy to use, and reliable way for printing custom designs through printers near you!</p>
          </div>
          <div className="SignUpForm">
            <form onSubmit={handleSubmit}>
              <div className="FormField">
              <input type="text" id="fname" name="fname" placeholder="First Name"/>
              <input type="text" id="lname" name="lname" placeholder="Last Name"/>
              </div>
              
              
              <input type="text" id="email" name="email" placeholder="Email"/>
              <input type="password" id="password" name="password" placeholder="Password"/>
              <input type="password" id="cpassword" name="cpassword" placeholder="Confirm Password"/>
            </form>
          </div>
        </div>
      );
}
function handleSubmit() {
  console.log('handleSubmit');
}
export default Home;