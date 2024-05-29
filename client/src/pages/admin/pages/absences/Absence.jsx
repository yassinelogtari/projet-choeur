import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import "./Absence.css";

function Absence() {
  const [absences, setAbsences] = useState([]);
  const [popupMessage, setPopupMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAbsences = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/profile/allabsences');
        if (response.data && response.data.absencesByMember) {
            setAbsences(
                Object.entries(response.data.absencesByMember).map(([key, value], index) => ({
                  id: index,
                  memberId: key,
                  nom: value.nom,
                  prenom: value.prenom,
                  concerts: value.concerts ? value.concerts.length : 0,
                  repetitions: value.repetitions ? value.repetitions.length : 0,
                  total_absences: value.total_absences
                }))
              );
              
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (error) {
        console.error('Error fetching absences:', error);
      }
    };

    fetchAbsences();
  }, []);

  const nominateChoriste = async (memberId) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/profile/nominateChoriste/${memberId}`);
      setPopupMessage("Le choriste est nominé avec succès!");
      setShowModal(true);
    } catch (error) {
      if (error.response) {
       
        if (error.response.status === 409) {
          setPopupMessage("Le choriste est déjà nominé.");
        } else {
          setPopupMessage(error.response.data.error || "Erreur lors de la nomination du choriste.");
        }
      } else {
        setPopupMessage("Erreur lors de la nomination du choriste.");
      }
      setShowModal(true);
    }
  };
  const eliminateChoriste = async (memberId) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/profile/eliminateChoriste/${memberId}`);
      setPopupMessage("Le choriste est éliminé avec succès!");
      setShowModal(true);
    } catch (error) {
      if (error.response) {
        
        if (error.response.status === 409) {
          setPopupMessage("Le choriste est déjà éliminé.");
        } else {
          setPopupMessage(error.response.data.error || "Erreur lors de élimination du choriste.");
        }
      } else {
        setPopupMessage("Erreur lors de la élimination du choriste.");
      }
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const columns = [
    { field: 'nom', headerName: 'Nom', width: 130 },
    { field: 'prenom', headerName: 'Prénom', width: 130 },
    { field: 'concerts', headerName: 'Absences concert', width: 180 },
    { field: 'repetitions', headerName: 'Absences répétitions', width: 180 },
    { field: 'total_absences', headerName: 'Total Absences', width: 130 },
    {
      field: 'actions',
      headerName: '',
      width: 210,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button className="Eliminer" onClick={() => eliminateChoriste(params.row.memberId)}>Eliminer</button>
          <button className="Nominer" onClick={() => nominateChoriste(params.row.memberId)}>Nominer</button>
        </div>
      )
    }
  ];

  return (
    <div className="position-absolute top-50 start-50 translate-middle auditionTable">
      <div style={{ marginLeft: "10px", display: "flex", alignItems: "center", flexDirection: "column", marginTop: "-350px" }}>
      <div style={{ marginTop: "200px" }}>Liste des absences</div>
      <DataGrid
        rows={absences}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        style={{ height: 420, width: '100%' }}
      />
      <Dialog open={showModal} onClose={handleCloseModal}>
        <DialogTitle>Nomination</DialogTitle>
        <DialogContent>
          <DialogContentText>{popupMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">Fermer</Button>
        </DialogActions>
      </Dialog>
    </div>
    </div>
  );
}

export default Absence;
