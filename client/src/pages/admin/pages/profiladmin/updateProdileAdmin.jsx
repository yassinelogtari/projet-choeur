import { useEffect, useState } from "react";

import {
  Paper,
  Grid,
  Button,
  TextField,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  FormControl,
  Radio,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, NavLink } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import manIcon from "../../../../assets/img/avatars/man.png";
import womanIcon from "../../../../assets/img/avatars/woman.png";
const UpdateProfileAdmin = () => {
  const navigate = useNavigate();
  const socket = io.connect("http://localhost:5000/");
  const [user, setUser] = useState();
  const [storedToken, setStoredToken] = useState();
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [message, setMessage] = useState("");

  const [editData, setEditData] = useState({
    nom: "",
    prenom: "",
    email: "",
    sexe: "",
    nationalite: "",
    taille: "",
    telephone: "",
    situationPerso: "",
  });

  useEffect(() => {
    const storedTokenValue = String(localStorage.getItem("token"));

    if (storedTokenValue && storedTokenValue !== "null") {
      setStoredToken(storedTokenValue);
      if (storedToken) {
        fetchUser();
      }
    }
  }, [storedToken]);

  useEffect(() => {
    if (socket && user) {
      socket.emit("setSocketId", user._id);

      return () => {
        socket.removeAllListeners();
        socket.disconnect();
      };
    }
  }, [user, socket]);
  const handleAlertClose = () => {
    setOpenAlert(false);
  };
  const fetchUser = async () => {
    try {
      const decodedToken = jwtDecode(storedToken);

      socket.emit("setSocketId", decodedToken.membreId);

      const res = await axios.get(
        `http://localhost:8000/api/profile/getUser/${decodedToken.membreId}`
      );

      if (res.data) {
        setUser(res.data);
        setEditData({
          nom: res.data.nom || "",
          prenom: res.data.prenom || "",
          email: res.data.email || "",
          sexe: res.data.sexe || "",
          nationalite: res.data.nationalite || "",
          taille: res.data.taille || "",
          telephone: res.data.telephone || "",
          situationPerso: res.data.situationPerso || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/membre/updateMember/${user._id}`,
        editData
      );
      setOpenAlert(true);
      setAlertSeverity("success");
      console.log(response.data);
    } catch (error) {
      console.error("Error updating profil:", error);
      setOpenAlert(true);
      setAlertSeverity("error");

      setMessage(
        error?.response?.data?.message ||
          "Une erreur s'est produite lors de l'update de ton profil."
      );
    }
  };

  const renderUserAvatar = () => {
    if (!user || !user.sexe) {
      return (
        <img src={manIcon} alt="" className="rounded-circle avatarprofil" />
      );
    } else if (user.sexe === "Homme") {
      return (
        <img src={manIcon} alt="" className="rounded-circle avatarprofil" />
      );
    } else if (user.sexe === "Femme") {
      return (
        <img src={womanIcon} alt="" className="rounded-circle avatarprofil" />
      );
    } else {
      return (
        <img src={manIcon} alt="" className="rounded-circle avatarprofil" />
      );
    }
  };

  const handleOpenAlert = (severity, message) => {
    setAlertSeverity(severity);
    setAlertMessage(message);
    setOpenAlert(true);
  };

  return (
    <div
      className={`position-absolute top-50 start-50 translate-middle profildiv`}
    >
      <div className="title-button-container">
        <div className="titreprofil">Modifier Mon Profil</div>
        <div className="boutoneditprofil">
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            style={{ marginTop: "-10px" }}
            onClick={() => navigate("/dashboard/admin/profileadmin")}
          >
            Retourner vers mon profil
          </Button>
        </div>
      </div>
      <Paper className="paperprofil">
        <Grid item style={{ marginLeft: "225px" }}>
          {renderUserAvatar()}
        </Grid>

        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm
            container
            style={{ marginTop: "-20px", marginLeft: "-10px" }}
          >
            <Grid item xs container direction="column" spacing={2}>
              <Grid item>
                <Grid
                  container
                  spacing={2}
                  style={{ marginLeft: "80px", marginTop: "7px" }}
                >
                  {/* Column 1 */}
                  <Grid item xs={6}>
                    <TextField
                      label="Nom"
                      name="nom"
                      value={editData.nom}
                      onChange={handleEditChange}
                      variant="outlined"
                      style={{ marginBottom: "10px", width: "350px" }}
                    />
                    <TextField
                      label="Prénom"
                      name="prenom"
                      value={editData.prenom}
                      onChange={handleEditChange}
                      variant="outlined"
                      style={{ marginBottom: "10px", width: "350px" }}
                    />
                    <TextField
                      label="Email"
                      name="email"
                      value={editData.email}
                      onChange={handleEditChange}
                      variant="outlined"
                      style={{ marginBottom: "10px", width: "350px" }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Nationalité"
                      name="nationalite"
                      value={editData.nationalite}
                      onChange={handleEditChange}
                      variant="outlined"
                      style={{ marginBottom: "10px", width: "350px" }}
                    />
                    <TextField
                      label="Numéro de téléphone"
                      name="telephone"
                      value={editData.telephone}
                      onChange={handleEditChange}
                      variant="outlined"
                      style={{ marginBottom: "10px", width: "350px" }}
                    />
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Genre</FormLabel>
                      <RadioGroup
                        aria-label="genre"
                        name="sexe"
                        value={editData.sexe}
                        onChange={handleEditChange}
                      >
                        <Grid container spacing={2}>
                          <Grid item>
                            <FormControlLabel
                              value="Femme"
                              control={<Radio />}
                              label="Femme"
                            />
                          </Grid>
                          <Grid item>
                            <FormControlLabel
                              value="Homme"
                              control={<Radio />}
                              label="Homme"
                            />
                          </Grid>
                        </Grid>
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEditSubmit}
          style={{ marginLeft: "460px", marginTop: "30px" }}
        >
          Enregistrer
        </Button>
      </Paper>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={alertSeverity}>
          {alertSeverity === "success"
            ? "Ton profil est mis à jour avec succès !"
            : message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default UpdateProfileAdmin;
