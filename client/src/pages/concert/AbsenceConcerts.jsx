import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { PieChart } from "@mui/x-charts/PieChart";
import "./absenceConcert.css";

function AbsenceConcerts() {
  const [concerts, setConcerts] = useState([]);
  const [selectedConcertId, setSelectedConcertId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [absenceData, setAbsenceData] = useState([]);
  const [saisonCourante, setSaisonCourante] = useState(null);

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/concerts/get-concerts"
        );
        setConcerts(
          response.data.map((concert, index) => ({
            ...concert,
            autoIncrementedId: index + 1,
          }))
        );
      } catch (error) {
        console.error("Error fetching concerts:", error);
      }
    };

    fetchConcerts();
  }, []);

  useEffect(() => {
    const fetchSaisonCourante = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/saison/getSaisonActuelle"
        );
        setSaisonCourante(response.data.saison.concerts);
      } catch (error) {
        console.error("Error fetching current season:", error);
      }
    };

    fetchSaisonCourante();
  }, []);

  const handleViewClick = (concertId) => {
    setSelectedConcertId(concertId);
    setShowPopup(true);

    axios
      .get(`http://localhost:8000/api/concerts/${concertId}/participants`)
      .then((response) => {
        const tauxAbsenceParPupitre = response.data.tauxAbsenceParPupitre;
        const formattedData = Object.entries(tauxAbsenceParPupitre).map(
          ([pupitre, taux]) => ({
            id: pupitre,
            value: parseFloat(taux.replace("%", "")),
            label: pupitre,
          })
        );
        setAbsenceData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const columns = [
    { field: "autoIncrementedId", headerName: "ID", width: 100 },
    { field: "titre", headerName: "Titre", width: 170 },
    { field: "lieu", headerName: "Lieu", width: 140 },
    { field: "date", headerName: "Date", width: 115 },
    {
      field: "Action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => (
        <div
          className="viewButtondash"
          onClick={() => handleViewClick(params.row._id)}
        >
          View
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="position-absolute top-50 start-50 translate-middle auditionTable">
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
            Liste des absences dans les concerts
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={concerts.filter(
                  (concert) =>
                    saisonCourante &&
                    saisonCourante.some(
                      (cons) => cons._id === concert._id.toString()
                    )
                )}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                getRowId={(row) => row.autoIncrementedId}
                onRowClick={(row) => {
                  handleViewClick(row.row._id);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="popup-overlay-concertAbsence">
          <div className="popup">
            <div className="popup-container">
              <div className="popup-content">
                <span className="close" onClick={() => setShowPopup(false)}>
                  &times;
                </span>
                <h2>Absence par pupitre</h2>
                <div style={{ width: 400, height: 400 }}>
                  <PieChart
                    series={[
                      {
                        data: absenceData,
                        highlightScope: {
                          faded: "global",
                          highlighted: "item",
                        },
                        faded: {
                          innerRadius: 30,
                          additionalRadius: -30,
                          color: "gray",
                        },
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AbsenceConcerts;
