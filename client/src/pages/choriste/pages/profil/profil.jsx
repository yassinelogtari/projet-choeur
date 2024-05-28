import { useEffect, useState } from "react";
import "./profil.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Paper,
  Typography,
  Grid,
  Avatar,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, NavLink } from "react-router-dom";
import { io } from "socket.io-client";
import RotateRightIcon from "@mui/icons-material/RotateRight";

import manIcon from "../../../../assets/img/avatars/man.png";
import womanIcon from "../../../../assets/img/avatars/woman.png";

function Profile() {
  const navigate = useNavigate();
  const socket = io.connect("http://localhost:5000/");
  const [user, setUser] = useState();
  const [storedToken, setStoredToken] = useState();
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [historiqueStatut, setHistoriqueStatut] = useState([]);
  const [historiqueStatut2, setHistoriqueStatut2] = useState([]);
  const [historiqueLoading, setHistoriqueLoading] = useState(true);

  const handleExpand = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

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
        setLoading(false);
        //console.log("hh", user);
      }
    }
  };
  const fetchHistoriqueStatut = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/saison/member/historique_statut/${user._id}`
      );
      setHistoriqueStatut(response.data.data);
      console.log(response.data.data);
      setHistoriqueLoading(false);
    } catch (error) {
      setHistoriqueLoading(false);
      console.error("Error fetching historical status:", error);
    }
  };
  useEffect(() => {
    const fetchHistoriqueStatut = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/saison/member/historique_statut/${user._id}`
        );
        setHistoriqueStatut(response.data.data);
        console.log(response.data.data);
        setHistoriqueLoading(false);
      } catch (error) {
        setHistoriqueLoading(false);
        console.error("Error fetching historical status:", error);
      }
    };

    fetchHistoriqueStatut();
  }, [user]);

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
  const getDateFromCreatedAt = () => {
    if (!user?.createdAt) return "";
    const date = new Date(user?.createdAt);
    return date.toLocaleDateString(); // Format date as per locale
  };
  const handleUpdateClick = async (season) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/saison/member/historique_statut/${user._id}`
      );
      setHistoriqueStatut2(response.data.data);
      fetchHistoriqueStatut();
      console.log(`Status updated for season: ${season}`);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  return (
    <div
      className={`position-absolute top-50 start-50 translate-middle profildiv`}
    >
      <div className="title-button-container">
        <div className="titreprofil">Mon Profil</div>
        <div className="boutoneditprofil">
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            style={{ marginTop: "-10px" }}
            component={NavLink} // Use NavLink as the component
            to="/dashboard/choriste/updateprofil"
          >
            Update Profile
          </Button>
        </div>
      </div>
      <Paper className="paperprofil">
        {loading ? ( // Conditionally render loader while loading is true
          <div className="loader-container">
            <CircularProgress />
          </div>
        ) : (
          <Grid spacing={2}>
            <div style={{ marginLeft: "330px", marginTop: "-20px" }}>
              <Grid item className="avatarprofil">
                {renderUserAvatar()}
              </Grid>
              <Grid
                item
                className="fullnameprofil"
                style={{ marginTop: "-20px", marginLeft: "60px" }}
              >
                {capitalizeFirstLetter(user?.prenom)}
                &nbsp;
                {user?.nom?.toUpperCase()}
              </Grid>
            </div>

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
                    <Tooltip title="Cliquer ici pour consulter votre historique complet depuis votre intégration au choeur.">
                      <Accordion
                        expanded={expanded}
                        onChange={handleExpand}
                        style={{ marginLeft: "-10px" }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="body1" className="lesinfos">
                            <RotateRightIcon
                              onClick={() => handleUpdateClick()}
                            />
                            <b>L'historique du statut :</b>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          {/* Contenu du tableau */}
                          {historiqueStatut.length > 0 ? (
                            <table>
                              <thead>
                                <tr>
                                  <th>Saison</th>
                                  <th>Niveau d'expérience</th>
                                </tr>
                              </thead>
                              <tbody>
                                {historiqueStatut.map((item, index) => (
                                  <tr key={index}>
                                    <td>{item.saison}</td>
                                    <td>{item.niveauExperience}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <p>Aucun historique du statut trouvé.</p>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    </Tooltip>
                    <div></div>
                    <div></div>
                    <div></div>
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
                      <b>Pupitre : </b> {user?.pupitre}
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
                      <b>Niveau Experience :</b> {user?.niveauExperience}
                    </Typography>
                    <Typography
                      variant="body1"
                      className="lesinfos"
                      style={{ paddingBottom: "10px" }}
                    >
                      <b>Date d'intégration au choeur :</b>{" "}
                      {getDateFromCreatedAt()}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Paper>
    </div>
  );
}
export default Profile;
