import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Alert,
  Snackbar,
  Typography,
} from "@mui/material";
import axios from "axios";

const AddOeuvre = () => {
  const [oeuvreData, setOeuvreData] = useState({
    titre: "",
    compositeurs: "",
    arrangeurs: "",
    pupitre: "",
    anneeComposition: "",
    genre: "",
    paroles: "",
    partition: "",
    presenceChoeur: false,
  });
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      ["compositeurs", "arrangeurs", "pupitre"].includes(name) &&
      value.includes(",")
    ) {
      const arrValues = value.split(",").map((val) => val.trim());

      setOeuvreData((prevData) => ({
        ...prevData,
        [name]: arrValues,
      }));
    } else {
      setOeuvreData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setOeuvreData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/oeuvre/addoeuvre",
        oeuvreData
      );
      setOpenAlert(true);
      setAlertSeverity("success");
      setOeuvreData({
        titre: "",
        compositeurs: "",
        arrangeurs: "",
        pupitre: "",
        anneeComposition: "",
        genre: "",
        paroles: "",
        partition: "",
        presenceChoeur: false,
      });
    } catch (error) {
      setOpenAlert(true);
      setAlertSeverity("error");
      console.error("Error adding oeuvre:", error.response.data);

      setMessage(
        error?.response?.data?.message || error?.response?.data?.error
      );
    }
  };

  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  return (
    <>
      <div className="position-absolute">
        <div>
          <Typography
            variant="h4"
            style={{
              textAlign: "center",
              paddingBottom: "20px",
              paddingTop: "20px",
            }}
          >
            Ajouter une oeuvre
          </Typography>
        </div>

        <Card className="custom-card">
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Titre"
                    name="titre"
                    required="true"
                    value={oeuvreData.titre}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Compositeurs"
                    name="compositeurs"
                    required="true"
                    value={oeuvreData.compositeurs}
                    onChange={handleChange}
                    fullWidth
                    helperText="Separate multiple composers with a comma"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Arrangeurs"
                    name="arrangeurs"
                    required="true"
                    value={oeuvreData.arrangeurs}
                    onChange={handleChange}
                    fullWidth
                    helperText="Separate multiple arrangers with a comma"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Pupitre"
                    name="pupitre"
                    required="true"
                    value={oeuvreData.pupitre}
                    onChange={handleChange}
                    fullWidth
                    helperText="Separate multiple sections with a comma"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Année de composition"
                    name="anneeComposition"
                    required="true"
                    value={oeuvreData.anneeComposition}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Genre"
                    name="genre"
                    required="true"
                    value={oeuvreData.genre}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Paroles"
                    name="paroles"
                    value={oeuvreData.paroles}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Partition"
                    name="partition"
                    value={oeuvreData.partition}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={oeuvreData.presenceChoeur}
                        onChange={handleCheckboxChange}
                        name="presenceChoeur"
                        color="primary"
                      />
                    }
                    label="Présence Choeur"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Ajouter Oeuvre
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
        <Snackbar
          open={openAlert}
          autoHideDuration={9000}
          onClose={handleAlertClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert severity={alertSeverity}>
            {alertSeverity === "success"
              ? "Oeuvre ajoutée avec succès !"
              : message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default AddOeuvre;
