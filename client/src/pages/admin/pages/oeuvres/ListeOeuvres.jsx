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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

import "./listeoeuvres.css";
import { blue } from "@mui/material/colors";

const ListeOeuvres = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [message, setMessage] = useState("");
  const [selectedOeuvre, setSelectedOeuvre] = useState(null);
  const [updateId, setUpdateId] = useState(null);
  const [editData, setEditData] = useState({
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
    } catch (error) {
      console.error("Error fetching data:", error);
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
      pupitre: selected.pupitre.join(", "),
      anneeComposition: selected.anneeComposition,
      genre: selected.genre,
      paroles: selected.paroles,
      partition: selected.partition,
      presenceChoeur: selected.presenceChoeur,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    // Handle arrays for composers, arrangers, and pupitre
    if (
      name === "compositeurs" ||
      name === "arrangeurs" ||
      name === "pupitre"
    ) {
      setEditData((prevData) => ({
        ...prevData,
        [name]: value.split(",").map((item) => item.trim()),
      }));
      return;
    }

    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/oeuvre/update/${updateId}`,
        editData
      );

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
      pupitre: "",
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
    setEditData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  return (
    <div className="position-absolute">
      <Typography variant="h4" className="titre">
        Liste des oeuvres
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="headrow">
              <TableCell className="headrow headrowtext">ID</TableCell>
              <TableCell className="headrow headrowtext">Titre</TableCell>
              <TableCell className="headrow headrowtext">
                Compositeurs
              </TableCell>
              <TableCell className="headrow headrowtext">Arrangeurs</TableCell>
              <TableCell className="headrow headrowtext">Pupitre</TableCell>
              <TableCell className="headrow headrowtext">
                Année de la composition
              </TableCell>
              <TableCell className="headrow headrowtext">Genre</TableCell>
              <TableCell className="headrow headrowtext">Paroles</TableCell>
              <TableCell className="headrow headrowtext">Partition</TableCell>
              <TableCell className="headrow headrowtext">
                Présence Choeur
              </TableCell>
              <TableCell className="headrow headrowtext">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow
                  key={row.id}
                  style={{ backgroundColor: getRowColor(index) }}
                  className="tab"
                >
                  <TableCell className="tab id">
                    {index + 1 + page * rowsPerPage}
                  </TableCell>
                  <TableCell className="tab titre">{row.titre}</TableCell>
                  <TableCell>
                    <ul>
                      {row.compositeurs.map((compositeur, index) => (
                        <li key={index}>{compositeur}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <ul>
                      {row.arrangeurs.map((arrangeur, index) => (
                        <li key={index}>{arrangeur}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <ul>
                      {row.pupitre.map((unpupitre, index) => (
                        <li key={index}>{unpupitre}</li>
                      ))}
                    </ul>
                  </TableCell>

                  <TableCell>{row.anneeComposition}</TableCell>
                  <TableCell>{row.genre}</TableCell>
                  <TableCell>{row.paroles}</TableCell>
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
            <b className="attributselected">Id : </b>
            {selectedOeuvre?._id}
          </Typography>
          <Typography>
            <b className="attributselected">Compositeurs : </b>
            {selectedOeuvre?.compositeurs.join(", ")}
          </Typography>
          <Typography>
            <b className="attributselected"> Arrangeurs :</b>
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
            {selectedOeuvre?.paroles}
          </Typography>
          <Typography>
            <b className="attributselected"> Partition : </b>
            {selectedOeuvre?.partition}
          </Typography>
          <Typography>
            <b className="attributselected">Présence au choeur :</b>
            {selectedOeuvre?.presenceChoeur ? "True" : "False"}
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
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Titre"
                name="titre"
                value={editData.titre}
                onChange={handleEditChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Compositeurs"
                name="compositeurs"
                value={editData.compositeurs}
                onChange={handleEditChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Arrangeurs"
                name="arrangeurs"
                value={editData.arrangeurs}
                onChange={handleEditChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Pupitre"
                name="pupitre"
                value={editData.pupitre}
                onChange={handleEditChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Année de la composition"
                name="anneeComposition"
                value={editData.anneeComposition}
                onChange={handleEditChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Genre"
                name="genre"
                value={editData.genre}
                onChange={handleEditChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Paroles"
                name="paroles"
                value={editData.paroles}
                onChange={handleEditChange}
              />
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
