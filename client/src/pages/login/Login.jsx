import { useEffect, useState } from "react";
import AdminDashboard from "../admin/AdminDashboard";
import Navbar from "../../components/navbar/Navbar";
import { io } from "socket.io-client";
import { posts } from "../../data"; // Import your data.js file
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import loginBackground from "../../img/orchestre.jpg";
import "./login.css";
import { Link } from "react-router-dom";
import ChoristeDashboard from "../choriste/ChoristeDashboard";
import ChefPupitreDashboard from "../chefPupitre/ChefPupitreDashboard";

const Login = () => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState("password");
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [storedToken, setStoredToken] = useState();
  const [decodedToken, setDecodedToken] = useState();
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  // Declare socket outside of useEffect
  const socket = io.connect("http://localhost:5000/");

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
        socket.removeAllListeners();
        socket.disconnect();
      };
    }
  }, [user, socket]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setWrongCredentials(false);
    const newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = true;
    } else {
      newErrors.email = false;
    }

    if (password === "") {
      newErrors.password = true;
    } else {
      newErrors.password = false;
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      try {
        const res = await axios.post("http://localhost:8000/api/membre/login", {
          email,
          password,
        });
        if (res) {
          setStoredToken(res.data.token);
          localStorage.setItem("token", res.data.token);
          const decodedToken = jwtDecode(res.data.token);
          setDecodedToken(decodedToken);
          if (decodedToken) {
            setUser(decodedToken.membreId);
            console.log("decodetoken", decodedToken);
            console.log("id memebre : ", decodedToken.membreId);
            console.log("role memebre : ", decodedToken.role);
          } else {
            console.log("User not found");
          }
        }
      } catch (e) {
        if (e.response.status == 401) {
          setWrongCredentials(true);
        }
      }
    }
  };

  useEffect(() => {
    const storedTokenValue = localStorage.getItem("token");

    // If a value is found, set the state with that value
    if (storedTokenValue) {
      setStoredToken(storedTokenValue);
      console.log(decodedToken);  
      setDecodedToken(jwtDecode(storedTokenValue));
    }
  }, []);

  const handleShowHidePass = () => {
    setShowPass((prevShowPass) =>
      prevShowPass === "password" ? "text" : "password"
    );
  };

  function validateEmail($email) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return reg.test($email);
  }

  return (
    <div>
      {storedToken ? (
        <>
          {decodedToken ? (
            <>
              {decodedToken.role === "admin" ? (
                <AdminDashboard socket={socket} load="home" />
              ) : decodedToken.role === "choriste" ? (
                <ChoristeDashboard socket={socket} load="home" />
              ) : decodedToken.role === "chef du pupitre" ? (
                <ChefPupitreDashboard socket={socket} load="home" />
              ) : (
                // Redirection vers une page par défaut ou affichage d'un message d'erreur
                <p>
                  Vous n'avez pas les permissions nécessaires pour accéder à
                  cette page.
                </p>
              )}
            </>
          ) : (
            // Gérer le cas où le token est stocké mais non décodé
            <p>Loading...</p>
          )}
        </>
      ) : (
        <div className="login-container">
          <div className="login">
            <img
              src={loginBackground}
              alt="login image"
              className="login__img"
            />
            <form action className="login__form">
              <h1 className="login__title">Login</h1>
              <div className="login__content">
                <div className="login__box">
                  <i className="ri-user-3-line login__icon" />
                  <div className="login__box-input">
                    <input
                      type="text"
                      className="login__input"
                      id="login-email"
                      placeholder=" "
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="login-email" className="login__label">
                      Email
                    </label>
                  </div>
                </div>
                {errors.email && (
                  <p style={{ margin: "0", color: "red" }}>
                    Please enter a valid email
                  </p>
                )}

                <div className="login__box">
                  <i className="ri-lock-2-line login__icon" />
                  <div className="login__box-input">
                    <input
                      type={showPass}
                      className="login__input"
                      id="login-pass"
                      placeholder=" "
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    <label htmlFor="login-pass" className="login__label">
                      Password
                    </label>
                    <i
                      className="ri-eye-off-line login__eye"
                      id="login-eye"
                      onClick={handleShowHidePass}
                    />
                  </div>
                </div>
              </div>
              {errors.password && (
                <p style={{ margin: "0", color: "red", marginBottom: "20px" }}>
                  Please enter your password
                </p>
              )}
              <button onClick={handleLogin} className="login__button">
                Login
              </button>
              {wrongCredentials && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{ margin: "0", color: "red", marginBottom: "20px" }}
                  >
                    Please verify your credentials
                  </p>
                </div>
              )}
              <p className="login__register">
                Don't have an account? apply for a membership{" "}
                <Link style={{ textDecoration: "none", color: "white" }}>
                  {" "}
                  here{" "}
                </Link>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
