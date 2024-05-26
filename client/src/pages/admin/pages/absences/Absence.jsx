import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import "./Absence.css";

function Absence() {
  const [absences, setAbsences] = useState([]);

  useEffect(() => {
    const fetchAbsences = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/profile/allabsences');
        console.log(response.data);
        setAbsences(Object.entries(response.data.absencesByMember).map(([key, value], index) => ({
          id: index,
          memberId: key,
          nom: value.nom,  
          prenom: value.prenom,  
          concerts: value.concerts.length,  
          repetitions: value.repetitions.length,  
          total_absences: value.total_absences
        })));
      } catch (error) {
        console.error('Error fetching absences:', error);
      }
    };

    fetchAbsences();
  }, []);

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
        <>
          <button className="Eliminer">Eliminer</button>
          <button  className="Nominer ">Nominer</button>
        </>
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
    </div></div> 
  );
}

export default Absence;

