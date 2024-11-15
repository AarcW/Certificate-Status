// src/Home.js
import React from 'react';
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';

function Home() {
  const [user, setUser] = useState({});

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    const userObject = jwtDecode(response.credential)
    console.log(userObject)
    setUser(userObject)
    document.getElementById("signInDiv").hidden = true
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
    <div>
      <h1>Home Page</h1>
      <p>This is the Home page of the app.</p>
    </div>
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

    </>
  );
}

export default Home;
