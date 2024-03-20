import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "@mui/material";
import "./candidatesList.css";

const CandidatesList = () => {
  const PF = "http://localhost:5000/images/";
  const allCandidates = [
    {
      id: "42567",
      nom: "ounissi",
      prenom: "mohamed",
      email: "ounissilol@gmail.com",
      sexe: "Homme",
      CIN: "123456789",
      taille: "180",
      telephone: "46266051",
      nationalite: "tunisien",
      dateNaissance: "03/11/1998",
      activite: true,
      connaisanceMusical: true,
      situationPerso: "",
      confirm: true,
    },
    {
        id: "42524",
        nom: "test",
        prenom: "test",
        email: "test@gmail.com",
        sexe: "Homme",
        CIN: "123456789",
        taille: "180",
        telephone: "46266051",
        nationalite: "tunisien",
        dateNaissance: "03/11/1998",
        activite: false,
        connaisanceMusical: true,
        situationPerso: "",
        confirm: false,
      },
    
  ];

  const userColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "nom",
      headerName: "Nom",
      width: 100,
      //   renderCell: (params) => {
      //     return (
      //       <div className="cellWithImgdash">
      //         <img
      //           className="cellImgdash"
      //           src={PF + params.row.profilePic}
      //           alt="avatar"
      //         />
      //         {params.row.username}
      //       </div>
      //     );
      //   },
    },
    {
      field: "prenom",
      headerName: "Prenom",
      width: 100,
    },

    {
      field: "email",
      headerName: "Email",
      width: 100,
    },
    {
      field: "sexe",
      headerName: "Sexe",
      width: 80,
    },
    {
      field: "CIN",
      headerName: "CIN",
      width: 100,
    },
    {
      field: "taille",
      headerName: "Taille",
      width: 60,
    },
    {
      field: "telephone",
      headerName: "Tlph",
      width: 100,
    },
    {
      field: "nationalite",
      headerName: "Nationalite",
      width: 100,
    },
    {
      field: "dateNaissance",
      headerName: "DateN",
      width: 100,
    },
    {
      field: "activite",
      headerName: "Activite",
      type: "boolean",
      width: 50,
    },
    {
      field: "connaisanceMusical",
      headerName: "ConnaisanceMusical",
      type: "boolean",
      width: 50,
    },
    {
      field: "situationPerso",
      headerName: "SituationPerso",
      width: 50,
    },
    {
      field: "confirm",
      headerName: "Confirm",
      type: "boolean",
      width: 50,
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Actions",
      width: 70,
      renderCell: (params) => {
        return (
          <div className="cellActiondash" style={{ display: "flex" }}>
            <Link
              to={`/dashboard/profile/${params.row._id}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className="viewButtondash"
                onClick={() => handleViewProfile(params.row._id)}
              >
                View
              </div>
            </Link>
            {/* <div
              className="deleteButtondash "
              onClick={() => handleDeletepost(params.row._id)}
            >
              Delete
            </div> */}
          </div>
        );
      },
    },
  ];

  const handleViewProfile = (id) => {
    console.log(id);
  };

  const handleDeletepost = async (id) => {
    console.log(id);
  };

  return (
    <div className="position-absolute top-50 start-50 translate-middle auditionTable">
      <div
        style={{
          marginLeft: "10px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "-350px",
        }}
      >
        <div style={{ marginBottom: "50px" }}>CandidatesList</div>

        <DataGrid
          className="datagrid"
          rows={allCandidates}
          columns={userColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection={false}
          disableSelection={true}
          disableRowSelectionOnClick
          
          
        />
      </div>
    </div>
  );
};

export default CandidatesList;
