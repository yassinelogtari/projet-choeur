import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { PieChart } from "@mui/x-charts/PieChart";
import "./absenceConcert.css";

function AbsenceConcerts() {
  const [concerts, setConcerts] = useState([]);
  const [selectedConcert, setSelectedConcert] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [absenceData, setAbsenceData] = useState([]);

  const handleViewClick = (concert) => {
    if (concert && concert.id) {
      setSelectedConcert(concert.id);
      setShowPopup(true);

      const concertId = concert.id;

      axios
        .get(`http://localhost:8000/api/concerts/${concertId}/participants`)
        .then((response) => {
          const tauxAbsenceParPupitre =
            response.data.tauxAbsenceParPupitre;
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
    } else {
      console.error("Concert or concert ID is undefined");
    }
  };

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/concerts/get-concerts"
        );
        const concertsWithIds = response.data.map((concert) => ({
          ...concert,
          id: concert._id,
        }));
        setConcerts(concertsWithIds);
      } catch (error) {
        console.error("Error fetching concerts:", error);
      }
    };

    fetchConcerts();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 250 },
    { field: "titre", headerName: "Titre", width: 170 },
    { field: "lieu", headerName: "Lieu", width: 140 },
    { field: "date", headerName: "Date", width: 115 },
    {
      field: "Action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div
          className="viewButtondash"
          style={{
            marginLeft: "30px",
          }}
          onClick={() => handleViewClick(params.row)}
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
            Liste des concerts
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
               rows={concerts}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row.id}
              onRowClick={(row) => {
                handleViewClick(row.row);
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
