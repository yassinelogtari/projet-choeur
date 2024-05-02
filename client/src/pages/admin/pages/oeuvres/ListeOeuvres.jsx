import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Alert,
  Snackbar,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import SearchIcon from "@mui/icons-material/Search";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import "./listeoeuvres.css";

const ListeOeuvres = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [message, setMessage] = useState("");
  const [selectedOeuvre, setSelectedOeuvre] = useState(null);
  const [updateId, setUpdateId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [editData, setEditData] = useState({
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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/oeuvre/getAll"
      );
      setData(response.data.data); // Assuming your response object has a "data" property containing the array
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const getRowColor = (index) => {
    return index % 2 === 1 ? "#f0f0f0" : "#ffffff";
  };
  const handleDelete = async (id) => {
    try {
      setOpenAlert(true);
      setMessage("Suppression en cours...");
      setData(data.filter((oeuvre) => oeuvre.id !== id));

      await axios.delete(`http://localhost:8000/api/oeuvre/${id}`);
      setMessage("Oeuvre supprimée avec succès !");
      fetchData();
    } catch (error) {
      setData((prevData) => [...prevData, ...data]);
      setMessage("Erreur lors de la suppression de l'oeuvre.");
    }
  };

  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  const handleConsult = (oeuvre) => {
    setSelectedOeuvre(oeuvre);
  };

  const handleCloseDialog = () => {
    setSelectedOeuvre(null);
  };
  const handleUpdate = (id) => {
    setUpdateId(id);
    const selected = data.find((oeuvre) => oeuvre._id === id);
    setSelectedOeuvre(selected);

    setEditData({
      titre: selected.titre,
      compositeurs: selected.compositeurs.join(", "),
      arrangeurs: selected.arrangeurs.join(", "),
      pupitre: selected.pupitre,
      anneeComposition: selected.anneeComposition,
      genre: selected.genre,
      paroles: selected.paroles,
      partition: selected.partition,
      presenceChoeur: selected.presenceChoeur,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "pupitre") {
      const selectedPupitre = Array.isArray(value) ? value : [value];
      setEditData((prevData) => ({
        ...prevData,
        [name]: selectedPupitre,
      }));
    } else if (
      ["compositeurs", "arrangeurs", "pupitre"].includes(name) &&
      value.includes(",")
    ) {
      const arrValues = value.split(",").map((val) => val.trim());

      setEditData((prevData) => ({
        ...prevData,
        [name]: arrValues,
      }));
    } else {
      setEditData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/oeuvre/update/${updateId}`,
        editData
      );
      setOpenAlert(true);
      setMessage(response.data.message);
      fetchData();
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating oeuvre:", error);
      setMessage("Erreur lors de la mise à jour de l'oeuvre.");
    }
  };

  const handleCloseEditDialog = () => {
    setEditData({
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
    setSelectedOeuvre(null);
    setUpdateId(null);
  };
  const handleEditCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "presenceChoeur" && !checked) {
      // Si la case "presenceChoeur" est décochée, vide le champ "pupitre"
      setEditData((prevData) => ({
        ...prevData,
        [name]: checked,
        pupitre: [],
      }));
    } else {
      // Sinon, met à jour normalement
      setEditData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    }
  };

  const handleSearch = () => {
    const filteredData = data.filter((oeuvre) => {
      for (const key in oeuvre) {
        if (
          oeuvre[key] &&
          oeuvre[key]
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    });
    console.log("filteredData", filteredData);
    setData(filteredData);
  };
  const resetTable = () => {
    fetchData();
    setSearchQuery("");
  };
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery === "") {
      resetTable();
    }
  }, [searchQuery]);
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
    <div className="position-absoluteListeOeuvre">
      <div className="liste-container">
        <Typography variant="h4" className="titre">
          Liste des oeuvres
        </Typography>
        <TextField
          label="Rechercher des oeuvres.."
          className="searchbar"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon onClick={handleSearch} className="searchicon" />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <TableContainer component={Paper}>
        {loading ? ( // Conditionally render loader while loading is true
          <div className="loader-container">
            <CircularProgress />
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow className="headrowoeuvre">
                <TableCell className="headrowoeuvre headrowtext">N°</TableCell>
                <TableCell className="headrowoeuvre headrowtext">
                  Titre
                </TableCell>
                <TableCell className="headrowoeuvre headrowtext">
                  Compositeurs
                </TableCell>
                <TableCell className="headrowoeuvre headrowtext">
                  Arrangeurs
                </TableCell>
                <TableCell className="headrowoeuvre headrowtext">
                  Pupitre
                </TableCell>
                <TableCell className="headrowoeuvre headrowtext">
                  Année de la composition
                </TableCell>
                <TableCell className="headrowoeuvre headrowtext">
                  Genre
                </TableCell>
                <TableCell className="headrowoeuvre headrowtext">
                  Paroles
                </TableCell>
                <TableCell className="headrowoeuvre headrowtext">
                  Partition
                </TableCell>
                <TableCell className="headrowoeuvre headrowtext">
                  Présence Choeur
                </TableCell>
                <TableCell className="headrowoeuvre headrowtext">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow
                    key={row.id}
                    style={{ backgroundColor: getRowColor(index) }}
                    className="taboeuvre"
                  >
                    <TableCell className="taboeuvre id">
                      {index + 1 + page * rowsPerPage}
                    </TableCell>
                    <TableCell className="taboeuvre titre">
                      {row.titre}
                    </TableCell>
                    <TableCell>
                      <ul>
                        {row.compositeurs.map((compositeur, index) =>
                          compositeur
                            .split(",")
                            .map((part, partIndex) => (
                              <li key={`${index}-${partIndex}`}>
                                {part.trim()}
                              </li>
                            ))
                        )}
                      </ul>
                    </TableCell>

                    <TableCell>
                      <ul>
                        {row.arrangeurs.map((arrangeur, index) =>
                          arrangeur
                            .split(",")
                            .map((part, partIndex) => (
                              <li key={`${index}-${partIndex}`}>
                                {part.trim()}
                              </li>
                            ))
                        )}
                      </ul>
                    </TableCell>

                    {
                      <TableCell>
                        <ul>
                          {row.pupitre.map((unpupitre, index) =>
                            unpupitre
                              .split(",")
                              .map((part, partIndex) => (
                                <li key={`${index}-${partIndex}`}>
                                  {part.trim()}
                                </li>
                              ))
                          )}
                        </ul>
                      </TableCell>
                    }

                    <TableCell>{row.anneeComposition}</TableCell>
                    <TableCell>{row.genre}</TableCell>
                    <TableCell
                      style={{
                        maxWidth: "170px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.paroles}
                    </TableCell>
                    <TableCell>{row.partition}</TableCell>
                    <TableCell>{row.presenceChoeur ? "✔️" : "❌"}</TableCell>
                    <TableCell className="actions" align="center">
                      <div style={{ display: "flex", gap: "8px" }}>
                        <Tooltip title="Supprimer">
                          <DeleteIcon
                            className="actionicon"
                            color="error"
                            onClick={() => handleDelete(row._id)}
                          />
                        </Tooltip>
                        <Tooltip title="Modifier">
                          <EditIcon
                            className="actionicon"
                            color="primary"
                            onClick={() => handleUpdate(row._id)}
                          />
                        </Tooltip>

                        <Tooltip title="Consulter">
                          <VisibilityIcon
                            className="actionicon"
                            color="action"
                            onClick={() => handleConsult(row)}
                          />
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={alertSeverity}>{message}</Alert>
      </Snackbar>
      {/* Dialog consulter */}
      <Dialog open={selectedOeuvre !== null} onClose={handleCloseDialog}>
        <DialogTitle className="titreselected">
          Oeuvre : {selectedOeuvre?.titre}
        </DialogTitle>
        <DialogContent>
          <Typography>
            <b className="attributselectednumero"> N° : </b>

            {data.indexOf(selectedOeuvre) + 1 + page * rowsPerPage}
          </Typography>
          <Typography>
            <b className="attributselected"> Compositeurs : </b>
            {selectedOeuvre?.compositeurs.join(", ")}
          </Typography>
          <Typography>
            <b className="attributselected"> Arrangeurs : </b>
            {selectedOeuvre?.arrangeurs.join(", ")}
          </Typography>
          <Typography>
            <b className="attributselected"> Pupitre : </b>
            {selectedOeuvre?.pupitre.join(", ")}
          </Typography>
          <Typography>
            <b className="attributselected"> Année de la composition : </b>
            {selectedOeuvre?.anneeComposition}
          </Typography>
          <Typography>
            <b className="attributselected"> Genre : </b>
            {selectedOeuvre?.genre}
          </Typography>
          <Typography>
            <b className="attributselected"> Paroles : </b>
            <div
              style={{
                maxHeight: "100px",
                overflowY: "auto",
              }}
            >
              {selectedOeuvre?.paroles}
            </div>
          </Typography>
          <Typography>
            <b className="attributselected"> Partition : </b>
            {selectedOeuvre?.partition}
          </Typography>
          <Typography>
            <b className="attributselected">Présence au choeur : </b>
            {selectedOeuvre?.presenceChoeur ? "Oui" : "Non"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>
      {/*dialog modifier */}
      <Dialog open={updateId !== null} onClose={handleCloseEditDialog}>
        <DialogTitle>Modifier l'oeuvre</DialogTitle>
        <DialogContent className="dialogupdatecontent">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Titre"
                name="titre"
                required="true"
                value={editData.titre}
                onChange={handleEditChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Séparez les compositeurs multiples par une virgule.">
                <TextField
                  label="Compositeurs"
                  name="compositeurs"
                  required="true"
                  value={editData.compositeurs}
                  onChange={handleEditChange}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Tooltip title="Séparez les arrangeurs multiples par une virgule.">
                <TextField
                  label="Arrangeurs"
                  name="arrangeurs"
                  required="true"
                  value={editData.arrangeurs}
                  onChange={handleEditChange}
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="pupitre-label">Pupitre</InputLabel>
                <Select
                  labelId="pupitre-label"
                  id="pupitre"
                  name="pupitre"
                  value={editData.pupitre}
                  onChange={handleEditChange}
                  disabled={!editData.presenceChoeur}
                  multiple
                  fullWidth
                  style={{ width: "223px" }}
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
                  value={editData.pupitre}
                  onChange={handleEditChange}
                  disabled={!editData.presenceChoeur}
                />
              </Grid>*/}
            <Grid item xs={12} sm={6}>
              <FormControl style={{ width: "223px" }}>
                <InputLabel id="annee-composition-label">
                  Année de la composition
                </InputLabel>
                <Select
                  labelId="annee-composition-label"
                  id="annee-composition-select"
                  name="anneeComposition"
                  value={editData.anneeComposition}
                  onChange={handleEditChange}
                  label="Année de la composition"
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                variant="outlined"
                style={{ width: "223px" }}
              >
                <InputLabel id="genre-label">Genre</InputLabel>
                <Select
                  labelId="genre-label"
                  id="genre-select"
                  value={editData.genre}
                  onChange={handleEditChange}
                  label="Genre"
                  name="genre"
                  required
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
                  value={editData.paroles}
                  onChange={handleEditChange}
                  style={{ width: "223px", height: "40px" }}
                  variant="outlined"
                  label="Genre"
                />
              </Tooltip>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Partition"
                name="partition"
                value={editData.partition}
                onChange={handleEditChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editData.presenceChoeur}
                    onChange={handleEditCheckboxChange}
                    name="presenceChoeur"
                    color="primary"
                  />
                }
                label="Présence Choeur"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditSubmit} color="primary">
            Modifier
          </Button>
          <Button onClick={handleCloseEditDialog} color="primary">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListeOeuvres;
