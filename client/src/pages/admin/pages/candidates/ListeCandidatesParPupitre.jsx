import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { MenuItem, FormControl, Select, Box } from '@mui/material';
import axios from 'axios';
import "./ListeCandidatesParPupitre.css";

const ListeCandidatesParPupitre = () => {
  const [pupitre, setPupitre] = useState('');
  const [candidates, setCandidates] = useState([]);

  const handleChange = async (event) => {
    const selectedPupitre = event.target.value;
    setPupitre(selectedPupitre);

    try {
      const response = await axios.get(`http://localhost:8000/api/candidats/listeCandidatParPupitre/${selectedPupitre}`);
      console.log(response)
      setCandidates(response.data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 90 },
    { field: 'nom', headerName: 'Nom', width: 80 },
    { field: 'prenom', headerName: 'Prénom', width: 70 },
    { field: 'email', headerName: 'Email', width: 80 },
    { field: 'sexe', headerName: 'Sexe', width: 80 },
    { field: 'CIN', headerName: 'CIN', width: 80 },
    { field: 'taille', headerName: 'Taille', width: 50 },
    { field: 'telephone', headerName: 'Téléphone', width: 70 },
    { field: 'nationalite', headerName: 'Nationalité', width: 80 },
    { field: 'dateNaissance', headerName: 'Date de Naissance', width: 90 },
    { field: 'activite', headerName: 'Activité', width: 60 },
    { field: 'situationPerso', headerName: 'Situation Perso', width: 90 },
    {  field: 'decision',
    headerName: 'Décision',
    width: 100,
    renderCell: (params) => (
      <span style={{ color: params.value === 'Retenu' ? 'green' : (params.value === 'En attente' ? 'orange' : 'red' )}}>
        {params.value}
      </span>
    ),},
  ];

  return (
    <div className="position-absolute top-50 start-50 translate-middle auditionTable">
      <div style={{ marginLeft: "10px", display: "flex", alignItems: "center", flexDirection: "column", marginTop: "-350px" }}>
        <div style={{ marginTop: "100px" }}>Liste des candidats par pupitre</div>
        {/* Select Component for pupitre */}
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Select
            value={pupitre}
            onChange={handleChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value="" disabled>Choisir un pupitre</MenuItem>
            <MenuItem value="alto">Alto</MenuItem>
            <MenuItem value="soprano">Soprano</MenuItem>
            <MenuItem value="tenor">Tenor</MenuItem>
            <MenuItem value="basse">Basse</MenuItem>
          </Select>
        </FormControl>
        {/* DataGrid */}
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={candidates}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            getRowId={(row) => row._id} 
          />
        </div>
      </div>
    </div>
  );
};

export default ListeCandidatesParPupitre;

