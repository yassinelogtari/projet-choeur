import { useEffect, useState } from "react";
import "./app.css";
import Card from "./components/card/Card";
import Navbar from "./components/navbar/Navbar";
import { io } from "socket.io-client";
import { posts } from "./data"; // Import your data.js file

const App = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");

  const [candidates, setCandidates] = useState([]);

  // Declare socket outside of useEffect
  const socket = io("http://localhost:5000");

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

  const handleLogin = () => {
    // Check if the entered username matches the "nom" field of any user in posts
    const matchingUser = posts.find((post) => post.nom === username);

    if (matchingUser) {
      setUser(matchingUser._id);
    } else {
      console.log("User not found");
    }
  };

  return (
    <div className="container">
      {user ? (
        <>
          <Navbar socket={socket} />
          <span className="username">{username}</span>
        </>
      ) : (
        <div className="login">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default App;