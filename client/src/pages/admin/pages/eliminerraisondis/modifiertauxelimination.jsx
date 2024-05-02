import React, { useEffect, useState } from "react";

import "./elimination.css";
import {
  Paper,
  Grid,
  Button,
  TextField,
  Snackbar,
  Alert,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
function ModifierTauxElimination() {
  const [dureeOut, setDureeOut] = useState("");
  const [nouvelleDuree, setNouvelleDuree] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");

  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    const fetchTauxOut = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/saison/tauxOut"
        );
        setDureeOut(response.data.dureeOut.toString());
        setLoading(false);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération du taux d'élimination:",
          error
        );
        setError("Erreur lors de la récupération du taux d'élimination");
      }
    };

    fetchTauxOut();
  }, []);
  const handleUpdateTauxOut = async () => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/saison/tauxOut",
        {
          dureeOut: nouvelleDuree,
        }
      );
      setMessage(response.data.message);
      setDureeOut(nouvelleDuree);
      setOpenAlert(true);
      setAlertSeverity("success");
    } catch (error) {
      setAlertSeverity("error");
      setOpenAlert(true);
      setMessage(
        error?.response?.data?.message ||
          "Une erreur s'est produite lors de l'élimination de ce choriste."
      );
      setLoading(false);
      console.error(
        "Erreur lors de la mise à jour du taux d'élimination:",
        error
      );
      setError("Erreur lors de la mise à jour du taux d'élimination");
    }
  };

  return (
    <div
      className={`position-absolute top-50 start-50 translate-middle modifiertauxeliminationdiv`}
    >
      <div className="titreModifierTauxElimination">
        <ChangeCircleIcon />
        &nbsp; Modifier le taux d'élimination
      </div>
      <Paper className="paperModifierTauxElimination">
        {loading ? ( // Display CircularProgress while loading
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <>
            <Typography style={{ fontSize: "20px" }}>
              <b>Le taux d'élimination actuel : </b>
              {dureeOut}
            </Typography>
            <Grid container spacing={2} style={{ paddingTop: "50px" }}>
              <Typography style={{ fontSize: "20px", marginLeft: "16px" }}>
                <b>Modifier le taux d'élimination : </b>
              </Typography>

              <div style={{ marginLeft: "350px", marginTop: "-50px" }}>
                <TextField
                  label="Nouveau taux d'élimination"
                  variant="outlined"
                  value={nouvelleDuree}
                  type="number"
                  onChange={(e) => setNouvelleDuree(e.target.value)}
                />
              </div>

              <Grid
                item
                xs={6}
                style={{ paddingTop: "100px", marginLeft: "250px" }}
              >
                <Button variant="contained" onClick={handleUpdateTauxOut}>
                  Mettre à jour
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </Paper>
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={alertSeverity}>
          {alertSeverity === "success"
            ? "Le taux d'élimination a été bien modifié!"
            : message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default ModifierTauxElimination;
