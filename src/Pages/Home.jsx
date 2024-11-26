// src/Home.js
import React from 'react';
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode';

// Contains logic for creating Google OAuthentication login

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
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCallbackResponse,
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
      {/* Google Sign-In Button */}
      <div id="signInDiv"></div>

      {/* Displaying User Info */}
      {user && Object.keys(user).length > 0 && (
        <div>
          <br />
          <img src={user.picture} alt="User Avatar" />
          <h3>{user.name}</h3>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Issued At:</strong> {new Date(user.iat * 1000).toLocaleString()}</p>
          {/* You can display other details from the user object */}
        </div>
      )}
      <br />
      {Object.keys(user).length != 0 &&
        <button onClick={(e) => handleSignOut(e)}>Sign Out</button>
      }

    </>
  );
}

export default Home;
