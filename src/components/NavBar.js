function NavBar() {
    return (
      <div className="App">
        <div className="Elements">
        <a href="home">Home</a>
        <a href="about">About</a>
        <a href="examples">Examples</a>
        <a href="contact">Contact</a>
        </div>
  
        <div className="Auth">
          <a href ="login" className="Login">Log in</a>
          <a href ="signup" className="Login">Sign Up</a>
        </div>
      </div>
    );
  }
export default NavBar;