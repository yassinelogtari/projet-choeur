import { useEffect, useState } from "react";
import "./profil.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Paper, Typography, Grid, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import manIcon from "../../../../assets/img/avatars/man.png";
import womanIcon from "../../../../assets/img/avatars/woman.png";

function Profile() {
  const navigate = useNavigate();
  const socket = io.connect("http://localhost:5000/");
  const [user, setUser] = useState();
  const [storedToken, setStoredToken] = useState();

  useEffect(() => {
    if (socket && user) {
      // Set the user's socketId when they connect
      socket.emit("setSocketId", user._id);
      console.log(socket);

      return () => {
        // Clean up the socket connection on component unmount
        socket.removeAllListeners(); // Remove all event listeners
        socket.disconnect();
      };
    }
  }, [user, socket]);
  useEffect(() => {
    const storedTokenValue = String(localStorage.getItem("token"));

    if (storedTokenValue && storedTokenValue != "null") {
      setStoredToken(storedTokenValue);
      if (storedToken) {
        console.log(storedToken);
        fetchUser();
      }
    }
  }, [storedToken]);
  const fetchUser = async () => {
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);

      socket.emit("setSocketId", decodedToken.membreId);

      const res = await axios.get(
        `http://localhost:8000/api/profile/getUser/${decodedToken.membreId}`
      );

      if (res) {
        setUser(res.data);
        //console.log("hh", user);
      }
    }
  };

  const renderUserAvatar = () => {
    if (!user?.sexe) {
      return (
        <img src={manIcon} alt="" className="rounded-circle avatarprofil" />
      );
    } else if (user?.sexe === "Homme") {
      return (
        <img src={manIcon} alt="" className="rounded-circle avatarprofil" />
      );
    } else if (user?.sexe === "Femme") {
      return (
        <img src={womanIcon} alt="" className="rounded-circle avatarprofil" />
      );
    } else {
      return (
        <img src={manIcon} alt="" className="rounded-circle avatarprofil" />
      );
    }
  };
  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <div
      className={`position-absolute top-50 start-50 translate-middle profildiv`}
    >
      <div className="titreprofil">Mon Profil</div>
      <Paper className="paperprofil">
        <Grid spacing={2}>
          <Grid container spacing={2} style={{ marginLeft: "60px" }}>
            <Grid item className="avatarprofil">
              {renderUserAvatar()}
            </Grid>
            <Grid item className="fullnameprofil">
              {capitalizeFirstLetter(user?.prenom)}
              &nbsp;
              {user?.nom?.toUpperCase()}
            </Grid>
          </Grid>

          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item>
                <Typography variant="h5"></Typography>
                <Typography variant="subtitle1"></Typography>
              </Grid>
              <Grid
                container
                spacing={2}
                style={{ marginLeft: "80px", marginTop: "7px" }}
              >
                {/* Column 1 */}
                <Grid item xs={6}>
                  <Typography
                    variant="body1"
                    className="lesinfos"
                    style={{ paddingBottom: "10px" }}
                  >
                    <b>CIN: </b>
                    {user?.CIN}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="lesinfos"
                    style={{ paddingBottom: "10px" }}
                  >
                    <b>Email : </b>
                    {user?.email}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="lesinfos"
                    style={{ paddingBottom: "10px" }}
                  >
                    <b>Genre : </b>
                    {user?.sexe}{" "}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="lesinfos"
                    style={{ paddingBottom: "10px" }}
                  >
                    <b>Nationalité</b> : {user?.nationalite}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="lesinfos"
                    style={{ paddingBottom: "10px" }}
                  >
                    <b>Date De Naissance :</b> {user?.dateNaissance}{" "}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="lesinfos"
                    style={{ paddingBottom: "10px" }}
                  >
                    <b>Situation Personnelle : </b> {user?.situationPerso}{" "}
                  </Typography>
                </Grid>
                {/* Column 2 */}
                <Grid item xs={6}>
                  <Typography
                    variant="body1"
                    className="lesinfos"
                    style={{ paddingBottom: "10px" }}
                  >
                    <b>Taille :</b> {user?.taille}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="lesinfos"
                    style={{ paddingBottom: "10px" }}
                  >
                    <b>Connaissance Musicale : </b>{" "}
                    {user?.connaissanceMusic ? "Oui ✔ " : "Non ✘"}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="lesinfos"
                    style={{ paddingBottom: "10px" }}
                  >
                    <b>Numéro de Téléphone :</b> {user?.telephone}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="lesinfos"
                    style={{ paddingBottom: "10px" }}
                  >
                    <b>Statut :</b> {user?.statut}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="lesinfos"
                    style={{ paddingBottom: "10px" }}
                  >
                    <b>Pupitre : </b> {user?.pupitre}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
export default Profile;
