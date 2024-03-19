import { useEffect, useState } from "react";

import Navbar from "../components/navbar/Navbar";
import { io } from "socket.io-client";
import { posts } from "../data"; // Import your data.js file
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const [candidates, setCandidates] = useState([]);
  const [storedToken, setStoredToken] = useState();
  const [decodedToken, setDecodedToken] = useState();
  // Declare socket outside of useEffect
  const socket = io();

  useEffect(() => {
    if (socket) {
      // Set the user's socketId when they connect
      socket.emit("setSocketId", user);

      // Listen for notifications only if socket is defined
      socket.on("getNotification", (allCandidates) => {
        console.log("Received updated candidates:", allCandidates);
        setCandidates(allCandidates);
      });

      return () => {
        // Clean up the socket connection on component unmount
        socket.removeAllListeners(); // Remove all event listeners
        socket.disconnect();
      };
    }
  }, [user, socket]); // Include socket in the dependency array

  const handleLogin = async () => {
    // Check if the entered username matches the "nom" field of any user in posts http://localhost:8000/api/membre/login

    const res = await axios.post("https://projet-choeur-api.vercel.app/api/membre/login", {
      email,
      password
    });
    if (res) {
      setStoredToken(res.data.token);

      // Store the value in local storage with the key 'myKey'
      localStorage.setItem("token", res.data.token);
      const decodedToken = jwtDecode(res.data.token);
      console.log(decodedToken);

      

      if (decodedToken) {
        setUser(decodedToken.membreId);
      } else {
        console.log("User not found");
      }
    }
  };

  useEffect(() => {
    const storedTokenValue = localStorage.getItem("token");

    // If a value is found, set the state with that value
    if (storedTokenValue) {
      setStoredToken(storedTokenValue);
    }
  }, []);

  return (
    <div className="container">
      {storedToken ? (
        <>
          <Navbar socket={socket} />
          <span className="username">{email}</span>
        </>
      ) : (
        <div className="login">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default Login;
