import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { PieChart } from "@mui/x-charts/PieChart";
import {
  TextField,
  Button,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import "./absenceConcert.css";
import DialogComponent from "../../components/dialog/Dialog";

function AbsenceConcerts() {
  const [concerts, setConcerts] = useState([]);
  const [selectedConcertId, setSelectedConcertId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopup1, setShowPopup1] = useState(false);
  const [absenceData, setAbsenceData] = useState([]);
  const [saisonCourante, setSaisonCourante] = useState(null);
  const [seuil, setSeuil] = useState(0);
  const [seuilError, setSeuilError] = useState(false);
  const [selectedConcert, setSelectedConcert] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [membresValides, setMembresValides] = useState([]);

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

  const handleSeuilChange = (event) => {
    const newValue = event.target.value;

    // Check if the new value is within the allowed range (0 to 100)
    if (newValue >= 0 && newValue <= 100) {
      setSeuil(newValue);
      setSeuilError(false); // Reset error state if within range
    } else {
      // If the value exceeds the limit, set error state to true
      setSeuilError(true);
    }
  };

  const handleConcertSelectChange = (event) => {
    setSelectedConcert(event.target.value);
  };

  const handleValiderClick = () => {
    axios
      .put(
        `http://localhost:8000/api/concerts/${selectedConcert}/valider?seuil=${seuil}`
      )
      .then((response) => {
        console.log(response.data);
        setOpenDialog(true);
        setSeuil(0);
        setSelectedConcert("");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleViewListeClick = (concertId) => {
    axios
      .get(`http://localhost:8000/api/concerts/${concertId}/membres-valides`)
      .then((response) => {
        console.log(response.data.membres);
        // Assuming response.data.membres is an array of strings
        setMembresValides(response.data.membres);
        setShowPopup1(true);
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
      });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const columns = [
    { field: "autoIncrementedId", headerName: "ID", width: 100 },
    { field: "titre", headerName: "Titre", width: 170 },
    { field: "lieu", headerName: "Lieu", width: 140 },
    { field: "date", headerName: "Date", width: 115 },
    {
      field: "Action",
      headerName: "Absence",
      width: 120,
      renderCell: (params) => (
        <div className="buttonContainerStyle">
          <div
            className="viewButtondash"
            onClick={() => handleViewClick(params.row._id)}
          >
            View
          </div>
        </div>
      ),
    },
    {
      field: "Action2",
      headerName: "Liste validé",
      width: 150,
      renderCell: (params) => (
        <div className="buttonContainerStyle">
          <div
            className="viewButtondash"
            onClick={() => handleViewListeClick(params.row._id)}
          >
            View Liste
          </div>
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
              />
            </div>
            <div style={{ marginTop: "40px" }}>
              <h3 className="ValidateConcertTitle">valider les membres</h3>
              <TextField
                label="Seuil"
                type="number"
                value={seuil}
                onChange={handleSeuilChange}
                error={seuilError} // Set error prop based on the error state
                helperText={
                  seuilError
                    ? "La valeur doit être comprise entre 0 et 100."
                    : ""
                }
              />
              <TextField
                select
                label="Concert"
                value={selectedConcert}
                onChange={handleConcertSelectChange}
                style={{ marginLeft: "10px", width: "150px" }}
              >
                {concerts
                  .filter(
                    (concert) =>
                      saisonCourante &&
                      saisonCourante.some(
                        (cons) => cons._id === concert._id.toString()
                      )
                  )
                  .map((concert) => (
                    <MenuItem key={concert._id} value={concert._id}>
                      {concert.titre}
                    </MenuItem>
                  ))}
              </TextField>
              <Button
                variant="contained"
                color="primary"
                onClick={handleValiderClick}
                style={{ marginLeft: "10px" }}
              >
                Valider
              </Button>
              <DialogComponent
                open={openDialog}
                handleClose={handleCloseDialog}
                successMessage="Your Concert list has been successfully validate!"
              />
              <div></div>
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
      {showPopup1 && (
        <div className="popup-overlay-concertAbsence">
          <div className="popup">
            <div className="popup-container">
              <div className="popup-content">
                <span className="close" onClick={() => setShowPopup1(false)}>
                  &times;
                </span>
                <h2>Liste des membres validés</h2>
                <List>
                  {membresValides.map((membre, index) => (
                    <ListItem key={index}>
                      <ListItem key={index}>
                        {membre.nom} {membre.prenom} - {membre.pupitre}
                      </ListItem>
                    </ListItem>
                  ))}
                </List>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AbsenceConcerts;
