import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { jwtDecode } from 'jwt-decode';
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';  // Assuming Home is your main page component
import History from './History'; // Import the new History page
import { Link } from 'react-router-dom';
// const google = window.google;



function App() {
  const [user, setUser] = useState({});

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    const userObject = jwtDecode(response.credential)
    console.log(userObject)
    setUser(userObject)
    document.getElementById("signInDiv").hidden = true
    document.getElementById("logo").hidden = true
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false

  }

  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id: "418938695402-qv1v3hpg0cm3psp6eqe5p9ceanhqkfh1.apps.googleusercontent.com",
      callback: handleCallbackResponse //"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"
    });

    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {
        theme: "outline", size: "large"
      }
    );

    google.accounts.id.prompt();

  }, [])

  return (
    <>
      

      <div id="signInDiv"></div>
      {user &&
        <div>
          <br />
          <img src={user.picture}></img>
          <h3>{user.name}</h3>
        </div>
      }
      <br />
      {Object.keys(user).length != 0 &&
        <button onClick={(e) => handleSignOut(e)}>Sign Out</button>
      }
      <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/history">History</Link></li>
        </ul>
      </nav>
        <Routes>
          <Route path="/" element={<Home />} />  {/* Home page */}
          <Route path="/history" element={<History />} />  {/* History page */}
        </Routes>
      </Router>

    </>

  )
}

export default App
