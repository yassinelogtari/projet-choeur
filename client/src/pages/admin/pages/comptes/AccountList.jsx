import "./accountList.css";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "@mui/material";
import axios from "axios";
import { NavLink } from "react-router-dom";

const AccountList = () => {
  const [allCandidates, setAllCandidates] = useState();
  const [auditionId, setAuditionId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const handleAudition = (id) => {
    setAuditionId(id);
  };
  const PF = "http://localhost:5000/images/";

  const fetchCandidates = async () => {
    try {
      // const data = await axios
      //   .get("http://localhost:8000/api/saison/getSaisonActuelle")
      //   .then((res) => {
      //     console.log(res);
      //     const modifiedRes = res.data.saison.membres.map((obj, index) => {
      //       return { id: index + 1, ...obj };
      //     });

      const data = await axios
        .get("http://localhost:8000/api/membre/getAllMembers")
        .then((res) => {
          console.log(res);
          const modifiedRes = res.data.model.map((obj, index) => {
            return { id: index + 1, ...obj };
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
      width: 50,
    },
    {
      field: "nom",
      headerName: "Nom",
      width: 80,
    },
    {
      field: "prenom",
      headerName: "Prenom",
      width: 80,
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
    },
    {
      field: "sexe",
      headerName: "sexe",
      width: 80,
    },
    {
      field: "dateNaissance",
      headerName: "DateN",
      width: 100,
    },
    {
      field: "nationalite",
      headerName: "Nationalite",
      width: 80,
    },
    {
      field: "CIN",
      headerName: "CIN",
      width: 80,
    },
    {
      field: "telephone",
      headerName: "Tlph",
      width: 80,
    },
    {
      field: "role",
      headerName: "Role",
      width: 80,
    },
    {
      field: "pupitre",
      headerName: "Pupitre",
      width: 80,
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Actions",
      width: 170,
      renderCell: (params) => {
        return (
          <div className="cellActiondash" style={{ display: "flex" }}>
            <NavLink
              to={`http://localhost:3000/dashboard/admin/accounts/infos/${params.row._id}`}
            >
              <div
                className="viewButtondash"
                onClick={() => handleViewProfile(params.row)}
              >
                View
              </div>
            </NavLink>

            <NavLink
              to={`http://localhost:3000/dashboard/admin/accounts/infos/edit/${params.row._id}`}
              style={{ textDecoration: "none", marginRight: "5px" }}
            >
              <div
                className="updateButtondash"
                onClick={() => handleAudition(params.row._id)}
              >
                update
              </div>
            </NavLink>
            <div
              className="deleteButtondash "
              style={{ marginRight: "5px" }}
              onClick={() => handleDeletAudition(params.row._id)}
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
        `http://localhost:8000/api/membre/deleteMember/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response) {
        const updatedCandidates = allCandidates.filter(
          (candidate) => candidate._id !== id
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
            flexDirection: "column",
            position: "absolute",
            top: "-50vh",
            right: "-72vh",
          }}
        >
          <div
            style={{
              marginBottom: "50px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span>Liste des comptes</span>
          </div>

          <DataGrid
            style={{ background: "white" }}
            className="datagrid"
            rows={allCandidates}
            columns={userColumns.concat(actionColumn)}
            initialState={{
              ...allCandidates.initialState,
              pagination: { paginationModel: { pageSize: 7 } },
            }}
          />
        </div>
        {showModal && (
          <div className="popup1">
            <div className="popup1-container">
              <div className="popup1-content">
                <p>{popupMessage}</p>
                <span className="close" onClick={() => setShowModal(false)}>
                  &times;
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPopup && <div className="popup-overlay"></div>}

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
                  <p>Date: {selectedCandidate.DateAud}</p>
                  <p>Heure de début: {selectedCandidate.HeureDeb}</p>
                  <p>Heure de fin: {selectedCandidate.HeureFin}</p>

                  <h3>Informations des candidats:</h3>
                  {selectedCandidate.candidatsInfo.map((info, index) => (
                    <div key={index}>
                      <p className="candidaIdPopup">
                        Candidat info :
                        {selectedCandidate.candidats[index].nom +
                          " " +
                          selectedCandidate.candidats[index].prenom}
                      </p>
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

export default AccountList;
