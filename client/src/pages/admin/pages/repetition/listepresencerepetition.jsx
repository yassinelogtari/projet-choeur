import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Modal, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const ListePresenceRepetition = () => {
  const [repetitions, setRepetitions] = useState([]);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRepetition, setSelectedRepetition] = useState(null);
  const [selectedPupitre, setSelectedPupitre] = useState('');
  const [presenceList, setPresenceList] = useState([]);

  useEffect(() => {
    fetchRepetitions();
  }, []);

  const fetchRepetitions = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/repetition/getAllRepetition`);
      const dataWithIds = response.data.model.map((item, index) => ({
        ...item,
        autoIncrementedId: index + 1, // Ajout d'un ID auto-incrémenté
      }));
      setRepetitions(dataWithIds); 
    } catch (error) {
      console.error("Error fetching repetitions:", error);
      setError("Erreur lors de la récupération des répétitions");
      setRepetitions([]);
    }
  };

  const handleViewPresence = async (id) => {
    setSelectedRepetition(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRepetition(null);
    setSelectedPupitre('');
    setPresenceList([]);
  };

  const handlePupitreChange = async (event) => {
    setSelectedPupitre(event.target.value);
    try {
      const response = await axios.get(`http://localhost:8000/api/repetition/${selectedRepetition}/presence?pupitre=${event.target.value}`);
      setPresenceList(response.data.presenceList);
    } catch (error) {
      console.error('Error fetching presence list:', error);
    }
  };

const columns = [
  { field: 'autoIncrementedId', headerName: 'ID', width: 70 },
  { field: 'lieu', headerName: 'Lieu', width: 200 },
  { field: 'DateRep', headerName: 'Date Début', width: 200 },
  { field: 'HeureDeb', headerName: 'Date Fin', width: 200 },
  { field: 'HeureFin', headerName: 'Date Fin', width: 200 },
  { field: 'lieu', headerName: 'Lieu', width: 200 },
  
  {
    field: 'action',
    headerName: 'Actions',
    width: 180,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => handleViewPresence(params.row._id)}
      >
        Voir liste présence
      </Button>
    ),
  },
];

  return (
    <div className="position-absolute top-50 start-50 translate-middle auditionTable">
      <div style={{ marginLeft: "10px", display: "flex", alignItems: "center", flexDirection: "column", marginTop: "-350px" }}>
        <div style={{ marginTop: "100px" }}>Liste présence répétitions</div>
        <Box sx={{ height: 400, width: '100%' }}>
          {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}
          <DataGrid
            rows={repetitions}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row._id}
          />
        </Box>
      </div>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{ width: 400, bgcolor: 'background.paper', p: 2, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <FormControl fullWidth>
            <InputLabel id="pupitre-select-label">Choisir un pupitre</InputLabel>
            <Select
              labelId="pupitre-select-label"
              id="pupitre-select"
              value={selectedPupitre}
              label="Choisir un pupitre"
              onChange={handlePupitreChange}
            >
              <MenuItem value="">Choisir un pupitre</MenuItem>
              <MenuItem value="alto">Alto</MenuItem>
              <MenuItem value="soprano">Soprano</MenuItem>
              <MenuItem value="tenor">Tenor</MenuItem>
              <MenuItem value="basse">Basse</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ height: 300, mt: 2, overflowY: 'auto' }}>
            <ul>
              {presenceList.map((item, index) => (
                <li key={index}>{item.nom} {item.prenom}</li>
              ))}
            </ul>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default ListePresenceRepetition;
