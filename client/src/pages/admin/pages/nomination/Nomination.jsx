import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import "./Nomination.css";

function Nomination() {
    const [nomines, setNomines] = useState([]);

    useEffect(() => {
        const fetchNomines = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/profile/listedesnomines');
                const nominesWithIds = response.data.nominatedMembers.map((nomine, index) => ({
                    ...nomine.memberId,  
                    id: index 
                }));
                setNomines(nominesWithIds);
            } catch (error) {
                console.error('Erreur lors de l\'affichage des nominés:', error);
            }
        };
        

        fetchNomines();
    }, []);

    const columns = [
        { field: 'nom', headerName: 'Nom', width: 300 },
        { field: 'prenom', headerName: 'Prénom', width: 300 },
    ];

    return (    <div className="position-absolute top-50 start-50 translate-middle auditionTable">
    <div style={{ marginLeft: "30px", display: "flex", alignItems: "center", flexDirection: "column", marginTop: "-350px" }}>
    <div style={{ marginTop: "80px",marginBottom: "30px" }}>Liste des choristes nominés</div>
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={nomines}
                columns={columns}
                pageSize={2}
                rowsPerPageOptions={[2]}
            />
        </div>
   </div> </div>);
}

export default Nomination;
