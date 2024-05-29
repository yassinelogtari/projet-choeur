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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tooltip,
  TextareaAutosize,
} from "@mui/material";
import axios from "axios";

const AddOeuvre = () => {
  const [oeuvreData, setOeuvreData] = useState({
    titre: "",
    compositeurs: "",
    arrangeurs: "",
    pupitre: [],
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

    if (name === "pupitre") {
      const selectedPupitre = Array.isArray(value) ? value : [value];
      setOeuvreData((prevData) => ({
        ...prevData,
        [name]: selectedPupitre,
      }));
    } else if (
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
        pupitre: [],
        anneeComposition: "",
        genre: "",
        paroles: "",
        partition: "",
        presenceChoeur: false,
      });
    } catch (error) {
      setOpenAlert(true);
      setAlertSeverity("error");
      console.error("Error adding oeuvre:", error.response?.data);

      setMessage(
        error?.response?.data?.message ||
          "Une erreur s'est produite lors de l'ajout de l'oeuvre."
      );
    }
  };

  const handleAlertClose = () => {
    setOpenAlert(false);
  };
  const years = [];
  const startYear = 1900;
  const endYear = new Date().getFullYear();

  for (let year = startYear; year <= endYear; year++) {
    years.push(year.toString());
  }
  const genres = [
    "Classique",
    "Jazz",
    "Blues",
    "Pop",
    "Rock",
    "Metal",
    "Folk",
    "Country",
    "Rap",
    "Hip-Hop",
    "Reggae",
    "Electronique",
    "Techno",
    "House",
    "Ambient",
    "Soul",
    "Funk",
    "Disco",
    "Gospel",
    "Alternative",
    "Indie",
    "Punk",
    "Ska",
    "R&B",
    "Latin",
    "World",
    "Experimental",
    "Ambient",
    "Chill",
    "Trap",
    "Dubstep",
    "Dance",
    "Acoustic",
    "Instrumental",
    "Opera",
    "Musique de film",
    "Musique de jeu vidéo",
    "Musique folklorique",
    "Musique spirituelle",
    "Musique traditionnelle",
  ];
  return (
    <>
      <div
        className="position-absolute  positionabsolute2"
        style={{ width: "900px", marginLeft: "440px", marginTop: "80px" }}
      >
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
                    helperText="Séparez les compositeurs multiples par une virgule."
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
                    helperText="Séparez les arrangeurs multiples par une virgule."
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="pupitre-label">Pupitre</InputLabel>
                    <Select
                      labelId="pupitre-label"
                      id="pupitre"
                      name="pupitre"
                      multiple
                      value={oeuvreData.pupitre}
                      onChange={handleChange}
                      label="Pupitre"
                      fullWidth
                      disabled={!oeuvreData.presenceChoeur}
                    >
                      {["alto", "soprano", "basse", "ténor"].map((pupitre) => (
                        <MenuItem key={pupitre} value={pupitre}>
                          {pupitre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                {/*
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Pupitre"
                      name="pupitre"
                      value={oeuvreData.pupitre}
                      onChange={handleChange}
                      fullWidth
                      helperText="Separate multiple sections with a comma"
                      disabled={!oeuvreData.presenceChoeur}
                    />
                  </Grid>*/}
                <Grid item xs={12} sm={6}>
                  <FormControl style={{ width: "427px" }}>
                    <InputLabel id="annee-composition-label">
                      Année de la composition
                    </InputLabel>
                    <Select
                      labelId="annee-composition-label"
                      id="annee-composition-select"
                      name="anneeComposition"
                      value={oeuvreData.anneeComposition}
                      onChange={handleChange}
                      label="Année de la composition"
                    >
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {/*
                    <TextField
                      label="Année de composition"
                      name="anneeComposition"
                      required="true"
                      value={oeuvreData.anneeComposition}
                      onChange={handleChange}
                      fullWidth
                    />*/}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl style={{ width: "223px" }}>
                    <InputLabel variant="outlined" id="genre">
                      Genre
                    </InputLabel>
                    <Select
                      displayEmpty
                      id="genre"
                      name="genre"
                      required
                      value={oeuvreData.genre}
                      onChange={handleChange}
                      fullWidth
                      style={{ width: "427px" }}
                    >
                      {genres.map((genre) => (
                        <MenuItem key={genre} value={genre}>
                          {genre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Tooltip title="Paroles">
                    <TextareaAutosize
                      minRows={2}
                      maxRows={2}
                      aria-label="empty textarea"
                      placeholder="Paroles.."
                      name="paroles"
                      value={oeuvreData.paroles}
                      onChange={handleChange}
                      style={{ width: "427px", height: "40px" }}
                      variant="outlined"
                      label="Genre"
                    />
                  </Tooltip>
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
