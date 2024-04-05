import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import "./absenceRepetition.css";

const AbsenceRepetition = () => {
  const [absenceData, setAbsenceData] = useState([]);
  const [absenceDataByPupitre, setAbsenceDataByPupitre] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupByPupitre, setShowPopupByPupitre] = useState(false);
  const [selectedRepetition, setSelectedRepetition] = useState(null);
  const [absentMembers, setAbsentMembers] = useState([]);
  const [absentMembersByPupitre, setAbsentMembersByPupitre] = useState([]);

  useEffect(() => {
    const fetchAbsenceData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/absence/repetition"
        );
        setAbsenceData(
          response.data.map((item, index) => ({
            ...item.repetition,
            autoIncrementedId: index + 1,
            absentMembers: item.absentMembers,
          }))
        );
      } catch (error) {
        console.error("Error fetching absence data:", error);
      }
    };

    fetchAbsenceData();
  }, []);

  useEffect(() => {
    const fetchAbsenceDataByPupitre = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/absence/repetition/pupitre"
        );
        const mappedDataByPupitre = response.data.reduce((acc, item) => {
          acc[item.repetition._id] = {
            ...item.repetition,
            absentMembersByPupitre: item.absentMembersByPupitre,
          };
          return acc;
        }, {});
        setAbsenceDataByPupitre(mappedDataByPupitre);
      } catch (error) {
        console.error("Error fetching absence data by pupitre:", error);
      }
    };

    fetchAbsenceDataByPupitre();
  }, []);

  const columns = [
    { field: "autoIncrementedId", headerName: "ID", width: 100 }, 
    { field: "lieu", headerName: "Lieu", width: 140 },
    { field: "date", headerName: "DateRep", width: 120 },
    { field: "heureDeb", headerName: "HeureDeb", width: 170 },
    { field: "heureFin", headerName: "HeureFin", width: 170 },
    {
      field: "Global",
      headerName: "Global Absence",
      width: 200,
      renderCell: (params) => (
        <div
          className="viewButtondash"
          style={{
            marginLeft: "30px",
          }}
          onClick={() => handleViewProfile(params.row)}
        >
          View
        </div>
      ),
    },
    {
      field: "By Pupitre",
      headerName: "By Pupitre Absence",
      width: 200,
      renderCell: (params) => (
        <div
          className="viewButtondash"
          style={{
            marginLeft: "20px",
          }}
          onClick={() => handleViewByPupitre(params.row)}
        >
          View
        </div>
      ),
    },
  ];

  const handleViewProfile = (row) => {
    setSelectedRepetition(row);
    setAbsentMembers(row.absentMembers);
    setShowPopup(true);
  };

  const handleViewByPupitre = (row) => {
    setSelectedRepetition(row);
    setAbsentMembersByPupitre(
      absenceDataByPupitre[row._id]?.absentMembersByPupitre || []
    );
    setShowPopupByPupitre(true);
  };

  return (
    <div>
      <div className={`position-absolute top-50 start-50 translate-middle auditionTable`}>
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
                getRowId={(row) => row.autoIncrementedId}
              />
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="popup-overlay-absence">
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
        </div>
      )}
      {showPopupByPupitre && (
        <div className="popup-overlay-absence">
        <div className="popup">
          <div className="popup-container">
            <div className="popup-content">
              <span
                className="close"
                onClick={() => setShowPopupByPupitre(false)}
              >
                &times;
              </span>
              {selectedRepetition && (
                <div>
                  <h3>Membres Absents par Pupitre:</h3>
                  <ul>
                    {Object.entries(absentMembersByPupitre).map(
                      ([pupitre, members]) => (
                        <div key={pupitre}>
                          <h4 className="pupitreAbsence">{pupitre}</h4>
                          <ul>
                            {members.map((member) => (
                              <li
                                className="memberAbsent"
                                key={member._id}
                              >{`${member.nom} ${member.prenom}`}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default AbsenceRepetition;
