import "./adminAudition.css";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "@mui/material";
import axios from "axios";
import { NavLink } from "react-router-dom";

const CandidatesList = () => {
  const [allCandidates, setAllCandidates] = useState();
  const [auditionId, setAuditionId] = useState("");
  const [showPopup, setShowPopup] = useState(false); // State pour contrôler la visibilité de la popup
  const [selectedCandidate, setSelectedCandidate] = useState(null); // State pour stocker les données du candidat sélecti

  const handleAudition = (id) => {
    setAuditionId(id);
  };
  const PF = "http://localhost:5000/images/";

  const fetchCandidates = async () => {
    try {
      const data = await axios
        .get("http://localhost:8000/api/auditions/")
        .then((res) => {
          const modifiedRes = res.data.map((obj) => {
            const { _id, ...rest } = obj;
            return { id: _id, ...rest };
          });
          console.log(modifiedRes);
          setAllCandidates(modifiedRes);
          console.log(res);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const userColumns = [
    {
      field: "id",
      headerName: "ID",
      width: 140,
    },
    {
      field: "candidats",
      headerName: "Number of Candidats",
      width: 150,
      valueGetter: (params) => params.row.candidats.length,
    },
    {
      field: "DateAud",
      headerName: "Audition date",
      width: 140,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
      },
    },
    {
      field: "HeureDeb",
      headerName: "Starting Time",
      width: 140,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const hours = date.getHours().toString().padStart(2, "0"); // Ensure two digits
        const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure two digits
        return `${hours}:${minutes}`;
      },
    },
    {
      field: "HeureFin",
      headerName: "Ending Time",
      width: 140,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const hours = date.getHours().toString().padStart(2, "0"); // Ensure two digits
        const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure two digits
        return `${hours}:${minutes}`;
      },
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Actions",
      width: 230,
      renderCell: (params) => {
        return (
          <div className="cellActiondash" style={{ display: "flex" }}>
            <div
              className="viewButtondash"
              onClick={() => handleViewProfile(params.row)}
            >
              View
            </div>
            <NavLink
              to={`/dashboard/admin/addAudition?auditionId=${params.row.id}`}
              style={{ textDecoration: "none", marginRight: "5px" }}
            >
              <div
                className="addButtondash"
                onClick={() => handleAudition(params.row.id)}
              >
                Add
              </div>
            </NavLink>
            <NavLink
              to={`/dashboard/admin/updateAudition?auditionId=${params.row.id}`}
              style={{ textDecoration: "none", marginRight: "5px" }}
            >
              <div
                className="updateButtondash"
                onClick={() => handleAudition(params.row.id)}
              >
                update
              </div>
            </NavLink>
            <div
              className="deleteButtondash "
              style={{ marginRight: "5px" }}
              onClick={() => handleDeletAudition(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  const handleViewProfile = (row) => {
    setSelectedCandidate(row);
    setShowPopup(true);
  };
  const handleDeletAudition = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/auditions/deleteaudition/${id}`
      );

      if (response.data.success) {
        const updatedCandidates = allCandidates.filter(
          (candidate) => candidate.id !== id
        );
        setAllCandidates(updatedCandidates);
        console.log("Audition deleted successfully.");
      } else {
        console.log("Failed to delete audition.");
      }
    } catch (error) {
      console.error("Error deleting audition:", error.message);
    }
  };

  return allCandidates ? (
    <div>
      <div
        className={`position-absolute top-50 start-50 translate-middle auditionTable ${
          showPopup ? "blur-background" : ""
        }`}
      >
        <div
          style={{
            marginLeft: "10px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginTop: "-350px",
          }}
        >
          <div style={{ marginBottom: "50px" }}>Liste des auditions</div>

          <DataGrid
            style={{ background: "white" }}
            className="datagrid"
            rows={allCandidates}
            columns={userColumns.concat(actionColumn)}
            pageSize={9}
            rowsPerPageOptions={[9]}
          />
        </div>
      </div>
      {/* Popup Overlay */}
      {showPopup && <div className="popup-overlay"></div>}

      {/* Popup */}
      {showPopup && (
        <div className="popup">
          <div className="popup-container">
            <div className="popup-content">
              <span className="close" onClick={() => setShowPopup(false)}>
                &times;
              </span>
              <h2>Information de l'Audition</h2>
              {selectedCandidate && (
                <div>
                  <p className="auditionIdPopup">ID: {selectedCandidate.id}</p>
                  <p>Date: {selectedCandidate.DateAud}</p>
                  <p>Heure de début: {selectedCandidate.HeureDeb}</p>
                  <p>Heure de fin: {selectedCandidate.HeureFin}</p>
                  {/* Afficher les informations des candidats */}
                  <h3>Informations des candidats:</h3>
                  {selectedCandidate.candidatsInfo.map((info, index) => (
                    <div key={index}>
                      <p className="candidaIdPopup">Candidat ID: {info._id}</p>
                      <p>Extrait chanté: {info.extraitChante}</p>
                      <p>Tessiture: {info.tessiture}</p>
                      <p>Évaluation: {info.evaluation}</p>
                      <p>Décision: {info.decision}</p>
                      <p>Remarque: {info.remarque}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div>loading .....</div>
  );
};

export default CandidatesList;
