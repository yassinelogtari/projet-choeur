import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import "./ListeRepetition.css";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

function ListeRepetition() {
  const [repetitions, setRepetitions] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredRepetitions, setFilteredRepetitions] = useState([]);
  const [saisonCourante, setSaisonCourante] = useState(null);
  const [editedData, setEditedData] = useState({
    concert: "",
    lieu: "",
    DateRep: "",
    HeureDeb: "",
    HeureFin: "",
  });
  const [allConcerts, setAllConcerts] = useState([]);
  const [selectedConcert, setSelectedConcert] = useState("");
  const [detailRepetition, setDetailRepetition] = useState(null);

  useEffect(() => {
    const fetchRepetitions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/repetition/getAllRepetition"
        );

        const repetitionsWithIds = response.data.model.map(
          (repetition, index) => ({
            ...repetition,
            id: index + 1,
            _id: repetition._id,
            DateRep: new Date(repetition.DateRep).toLocaleDateString(),
            HeureDeb: decrementHour(new Date(repetition.HeureDeb)),
            HeureFin: decrementHour(new Date(repetition.HeureFin)),
          })
        );
        const filteredRepetitions = repetitionsWithIds.filter(
          (repetition) =>
            saisonCourante &&
            saisonCourante.some(
              (cons) => cons._id === repetition._id.toString()
            )
        );

        setRepetitions(filteredRepetitions);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des répétitions :",
          error
        );
      }
    };

    const fetchConcerts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/concerts/get-concerts"
        );
        setAllConcerts(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des concerts :", error);
      }
    };

    fetchRepetitions();
    fetchConcerts();
  }, [saisonCourante]);
  useEffect(() => {
    const fetchSaisonCourante = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/saison/getSaisonActuelle"
        );
        setSaisonCourante(response.data.saison.repetitions);
      } catch (error) {
        console.error("Error fetching current season:", error);
      }
    };

    fetchSaisonCourante();
  }, []);

  const handleEditClick = (row) => {
    console.log(row);
    const formattedDate = row.DateRep.split("/").reverse().join("-");
    setSelectedRow(row);
    setSelectedConcert(row.concert._id);
    setEditedData({
      concert: row.concert._id,
      lieu: row.lieu,
      DateRep: formattedDate,
      HeureDeb: row.HeureDeb,
      HeureFin: row.HeureFin,
    });
    setOpenEditDialog(true);
  };

  const handleDialogClose = () => {
    setOpenEditDialog(false);
  };
  const filterRepetitions = () => {
    const filtered = repetitions.filter(
      (repetition) =>
        repetition.lieu.toLowerCase().includes(searchValue.toLowerCase()) ||
        repetition.concert.titre
          .toLowerCase()
          .includes(searchValue.toLowerCase())
    );
    setFilteredRepetitions(filtered);
  };



  useEffect(() => {
    filterRepetitions();
  }, [repetitions, searchValue]);

  const handleEditDialogClose = () => {
    const formattedData = {
      concert: editedData.concert,
      lieu: editedData.lieu,
      DateRep: new Date(editedData.DateRep).toLocaleDateString("en-GB"),
      HeureDeb: new Date(
        `${editedData.DateRep}T${addHour(editedData.HeureDeb)}`
      )
        .toISOString()
        .substring(11, 16),
      HeureFin: new Date(
        `${editedData.DateRep}T${addHour(editedData.HeureFin)}`
      )
        .toISOString()
        .substring(11, 16),
    };

    const noneFormattedData = {
      concert: editedData.concert,
      lieu: editedData.lieu,
      DateRep: new Date(editedData.DateRep).toISOString(),
      HeureDeb: new Date(
        `${editedData.DateRep}T${addHour(editedData.HeureDeb)}`
      ).toISOString(),
      HeureFin: new Date(
        `${editedData.DateRep}T${addHour(editedData.HeureFin)}`
      ).toISOString(),
    };
    axios
      .patch(
        `http://localhost:8000/api/repetition/update/${selectedRow._id}`,
        noneFormattedData
      )
      .then((response) => {
        console.log("Data updated successfully:", response.data);
        setOpenEditDialog(false);

        const formattedData3 = {
            concert: response.data.model.concert,
            lieu: editedData.lieu,
            DateRep: new Date(editedData.DateRep).toLocaleDateString("en-GB"),
            HeureDeb: new Date(
                `${editedData.DateRep}T${addHour(editedData.HeureDeb)}`
            )
              .toISOString()
              .substring(11, 16),
            HeureFin: new Date(
                `${editedData.DateRep}T${addHour(editedData.HeureFin)}`
            )
              .toISOString()
              .substring(11, 16),
          };

        // Rafraîchir les données après la mise à jour
        setRepetitions((prevRepetitions) =>
          prevRepetitions.map((rep) =>
            rep._id === selectedRow._id ? { ...rep, ...formattedData3 } : rep
          )
        );

        
        setEditedData(formattedData3);
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });
  };

  const handleInputChange = (e) => {
    
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value,
    });
  };

  function addHour(timeStr) {
    let [hours, minutes] = timeStr.split(":").map(Number);
    hours = (hours + 1) % 24;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    axios
      .delete(`http://localhost:8000/api/repetition/annuler/${selectedRow._id}`)
      .then((response) => {
        console.log("Data deleted successfully:", response.data);
        setRepetitions((prevRepetitions) =>
          prevRepetitions.filter((rep) => rep._id !== selectedRow._id)
        );
        setOpenConfirmDialog(false);
      })
      .catch((error) => {
        console.error("Error deleting data:", error);
      });
  };

  const loadDetailRepetition = (row) => {
    axios
      .get(`http://localhost:8000/api/repetition/getRepetition/${row._id}`)
      .then((response) => {
        setDetailRepetition(response.data);
      })
      .catch((error) => {
        console.error(
          "Erreur lors du chargement des détails de répétition :",
          error
        );
      });
  };

  const decrementHour = (date) => {
    date.setHours(date.getHours() - 1);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 40 },
    {
      field: "concert",
      headerName: "Nom du concert",
      width: 170,
      valueGetter: (params) => params.row.concert.titre,
    },
    { field: "lieu", headerName: "Lieu", width: 170 },
    { field: "DateRep", headerName: "Date", width: 130 },
    { field: "HeureDeb", headerName: "Heure de début", width: 150 },
    { field: "HeureFin", headerName: "Heure de fin", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 130,
      renderCell: (params) => (
        <div>
          <IconButton
            color="error"
            onClick={() => handleDeleteClick(params.row)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            color="success"
            onClick={() => handleEditClick(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => loadDetailRepetition(params.row)}>
            <VisibilityIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h4 className="repetition-title">
        <span className="text-muted fw-light">REPETITION /</span> Liste des
        répétitions
      </h4>
      <Card className="Card-white-rep">
        <CardContent>
          <div className="button-container-rep">
            <NavLink to={`/dashboard/admin/addRepetition`}>
              <Button variant="contained" color="primary">
                Ajouter une répétition
              </Button>
            </NavLink>
            <TextField
              label="Rechercher une répétition"
              className="textFieldRep"
              variant="outlined"
              size="small"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <div className="tableRep" style={{ height: 300, width: "100%" }}>
            <DataGrid
              rows={searchValue ? filteredRepetitions : repetitions}
              columns={columns}
              pageSize={3}
            />
          </div>
        </CardContent>
      </Card>
      <Dialog open={openEditDialog} onClose={handleDialogClose}>
        <DialogTitle>Modifier Répétition</DialogTitle>
        <DialogContent>
          <Select
            label="Concert"
            value={selectedConcert}
            onChange={(e) => {
              setSelectedConcert(e.target.value);
              setEditedData({
                ...editedData,
                concert: e.target.value,
              });
            }}
            fullWidth
            margin="normal"
          >
            {allConcerts.map((concert) => (
              <MenuItem key={concert._id} value={concert._id}>
                {concert.titre}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Lieu"
            name="lieu"
            value={editedData.lieu}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date"
            type="date"
            name="DateRep"
            value={editedData.DateRep}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Heure de début"
            name="HeureDeb"
            type="time"
            value={editedData.HeureDeb}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Heure de fin"
            name="HeureFin"
            type="time"
            value={editedData.HeureFin}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Annuler</Button>
          <Button
            variant="contained"
            onClick={handleEditDialogClose}
            color="primary"
          >
            Modifier
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
      >
        <DialogContent>
          <Typography className="confirmDelete">
            Êtes-vous sûr de vouloir supprimer cette répétition ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Annuler</Button>
          <Button variant="contained" onClick={handleConfirmDelete}>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={detailRepetition !== null}
        onClose={() => setDetailRepetition(null)}
      >
        <DialogTitle>Détails de la Répétition</DialogTitle>
        <DialogContent className="detailRep">
          {detailRepetition && (
            <div>
              <Typography variant="subtitle1">
                Nom du Concert: {detailRepetition.concert.titre}
              </Typography>
              <Typography variant="subtitle1">
                Lieu: {detailRepetition.lieu}
              </Typography>
              <Typography variant="subtitle1">
                Date: {new Date(detailRepetition.DateRep).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1">
                Heure de Début:{" "}
                {decrementHour(new Date(detailRepetition.HeureDeb))}
              </Typography>
              <Typography variant="subtitle1">
                Heure de Fin:{" "}
                {decrementHour(new Date(detailRepetition.HeureFin))}
              </Typography>
              <Typography variant="subtitle1">
                Les membres sopranos:{" "}
                <ul>
                  {detailRepetition.membres.soprano.map((membre) => (
                    <li key={membre._id}>
                      {membre.nom} {membre.prenom}
                    </li>
                  ))}
                </ul>
              </Typography>
              <Typography variant="subtitle1">
                Les membres ténors:{" "}
                <ul>
                  {detailRepetition.membres.ténor.map((membre) => (
                    <li key={membre._id}>
                      {membre.nom} {membre.prenom}
                    </li>
                  ))}
                </ul>
              </Typography>
              <Typography variant="subtitle1">
                Les membres basses:{" "}
                <ul>
                  {detailRepetition.membres.basse.map((membre) => (
                    <li key={membre._id}>
                      {membre.nom} {membre.prenom}
                    </li>
                  ))}
                </ul>
              </Typography>
              <Typography variant="subtitle1">
                Les membres altos:{" "}
                <ul>
                  {detailRepetition.membres.alto.map((membre) => (
                    <li key={membre._id}>
                      {membre.nom} {membre.prenom}
                    </li>
                  ))}
                </ul>
              </Typography>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailRepetition(null)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ListeRepetition;