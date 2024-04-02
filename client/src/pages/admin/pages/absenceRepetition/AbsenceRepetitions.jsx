import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import "./absenceRepetition.css";

const AbsenceRepetition = () => {
  const [absenceData, setAbsenceData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRepetition, setSelectedRepetition] = useState(null);
  const [absentMembers, setAbsentMembers] = useState([]);

  useEffect(() => {
    const fetchAbsenceData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/absence/repetition"
        );
        const mappedData = response.data.map((item) => ({
          id: item.repetition._id,
          lieu: item.repetition.lieu,
          date: item.repetition.date,
          heureDeb: item.repetition.heureDeb,
          heureFin: item.repetition.heureFin,
          absentMembers: item.absentMembers, // Ajout des membres absents
        }));
        setAbsenceData(mappedData);
      } catch (error) {
        console.error("Error fetching absence data:", error);
      }
    };

    fetchAbsenceData();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 170 },
    { field: "lieu", headerName: "Lieu", width: 140 },
    { field: "date", headerName: "DateRep", width: 120 },
    { field: "heureDeb", headerName: "HeureDeb", width: 170 },
    { field: "heureFin", headerName: "HeureFin", width: 170 },
    {
      field: "view",
      headerName: "View",
      width: 100,
      renderCell: (params) => (
        <div
          className="viewButtondash"
          onClick={() => handleViewProfile(params.row)}
        >
          View
        </div>
      ),
    },
  ];

  const handleViewProfile = (row) => {
    setSelectedRepetition(row);
    setAbsentMembers(row.absentMembers); // Mettre à jour les membres absents
    setShowPopup(true);
  };

  return (
    <div>
      <div
        className={`position-absolute top-50 start-50 translate-middle auditionTable`}
      >
        <div>
          <div
            style={{
              marginLeft: "10px",
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              marginTop: "-100px",
            }}
          >
            Liste des absences de repetitions
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={absenceData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                getRowId={(row) => row.id}
              />
            </div>
          </div>
        </div>
        {showPopup && <div className="popup-overlay"></div>}
        {showPopup && (
          <div className="popup">
            <div className="popup-container">
              <div className="popup-content">
                <span className="close" onClick={() => setShowPopup(false)}>
                  &times;
                </span>
                {selectedRepetition && (
                  <div>
                    <h3>Membres Absents:</h3>
                    <ul>
                      {absentMembers.map((member) => (
                        <li
                          className="memberAbsent"
                          key={member._id}
                        >{`${member.nom} ${member.prenom}`}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AbsenceRepetition;
