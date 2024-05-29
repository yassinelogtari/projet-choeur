import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./candidatesList.css";

const CandidatesList = () => {
  const [allCandidates, setAllCandidates] = useState();

  const PF = "http://localhost:5000/images/";

  const fetchCandidates = async () => {
    try {
      const data = await axios
        .get("http://localhost:8000/api/saison/getSaisonActuelle")
        .then((res) => {
          const modifiedRes = res.data.saison.candidats.map((obj, index) => {
            const { _id, ...rest } = obj;
            return { id: index + 1, ...rest };
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
   
  ];

  const handleViewProfile = (id) => {
    console.log(id);
  };

  const handleDeletepost = async (id) => {
    console.log(id);
  };

  return allCandidates ? (
    <div className="position-absolute top-50 start-50 translate-middle auditionTable">
      <div
        style={{
          marginLeft: "10px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          position: "absolute",
          top: "-50vh",
          right: "-77vh",
        }}
      >
        <div style={{ marginBottom: "50px" }}>Liste des candidatures</div>

        <DataGrid
          style={{ background: "white" }}
          className="datagrid"
          rows={allCandidates}
          columns={userColumns.concat(actionColumn)}
          initialState={{
            ...allCandidates.initialState,
            pagination: { paginationModel: { pageSize: 7 } },
          }}
          checkboxSelection={false}
          disableSelection={true}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  ) : (
    <div>loading .....</div>
  );
};

export default CandidatesList;
