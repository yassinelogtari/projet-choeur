import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';


function Elimination() {
    const [eliminatedMembers, setEliminatedMembers] = useState([]);

    useEffect(() => {
        const fetchEliminatedMembers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/profile/listedeselimines');
                const eliminatedWithIds = response.data.eliminatedMembers.map((eliminated, index) => ({
                    ...eliminated.memberId,
                    id: index
                }));
                setEliminatedMembers(eliminatedWithIds);
            } catch (error) {
                console.error('Erreur lors de l\'affichage des membres éliminés:', error);
            }
        };

        fetchEliminatedMembers();
    }, []);

    const columns = [
        { field: 'nom', headerName: 'Nom', width: 300 },
        { field: 'prenom', headerName: 'Prénom', width: 300 },
    ];

    return (
        <div className="position-absolute top-50 start-50 translate-middle auditionTable">
            <div style={{ marginLeft: "30px", display: "flex", alignItems: "center", flexDirection: "column", marginTop: "-350px" }}>
                <div style={{ marginTop: "80px", marginBottom: "30px" }}>Liste des choristes éliminés</div>
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={eliminatedMembers}
                        columns={columns}
                        pageSize={2}
                        rowsPerPageOptions={[2]}
                    />
                </div>
            </div>
        </div>
    );
}

export default Elimination;
