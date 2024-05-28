import { useEffect, useState } from "react";
import "./profiladmin.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Paper,
  Typography,
  Grid,
  IconButton,
  Button,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, NavLink } from "react-router-dom";
import { io } from "socket.io-client";

import manIcon from "../../../../assets/img/avatars/man.png";
import womanIcon from "../../../../assets/img/avatars/woman.png";
const ProfileAdmin = () => {
  const navigate = useNavigate();
  const socket = io.connect("http://localhost:5000/");
  const [user, setUser] = useState();
  const [storedToken, setStoredToken] = useState();
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [historiqueStatut, setHistoriqueStatut] = useState([]);

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
  useEffect(() => {
    const fetchHistoriqueStatut = async () => {
      try {
        const response = await axios.post(
          `http://localhost:8000/api/saison/member/historique_statut/${user._id}`
        );
        setHistoriqueStatut(response.data.data);
        console.log(response.data.data);
      } catch (error) {
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
            component={NavLink}
            to="/dashboard/admin/updateprofileadmin"
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
                  </Grid>
                  {/* Column 2 */}
                  <Grid item xs={6}>
                    <Typography
                      variant="body1"
                      className="lesinfos"
                      style={{ paddingBottom: "10px" }}
                    >
                      <b>Numéro de Téléphone :</b>
                      {user?.telephone}
                    </Typography>
                    <Typography
                      variant="body1"
                      className="lesinfos"
                      style={{ paddingBottom: "10px" }}
                    >
                      <b>Liste des éliminés de la saison courante :</b>{" "}
                      <IconButton
                        aria-label="Arrow Forward"
                        component={NavLink}
                        to="/dashboard/admin/elimineprofil"
                      >
                        <Tooltip title="Cliquer ici pour afficher la liste des éliminés">
                          <ArrowForwardIosIcon />
                        </Tooltip>
                      </IconButton>
                    </Typography>
                    <Typography
                      variant="body1"
                      className="lesinfos"
                      style={{ paddingBottom: "10px" }}
                    >
                      <b>Liste des nominés de la saison courante :</b>
                      <Tooltip title="Cliquer ici pour afficher la liste des nominés">
                        <IconButton
                          aria-label="Arrow Forward"
                          component={NavLink}
                          to="/dashboard/admin/nomineprofil"
                        >
                          <ArrowForwardIosIcon />
                        </IconButton>
                      </Tooltip>
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
};
export default ProfileAdmin;
