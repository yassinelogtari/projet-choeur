import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "@mui/material";
import "./candidatesList.css";
import axios from "axios";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const CandidatesList = () => {
  const [allCandidates, setAllCandidates] = useState();
  const [filterBy, setFilterBy] = useState("");
  const [filterByValue, setFilterByValue] = useState("");
  const PF = "http://localhost:5000/images/";

  const fetchCandidates = async () => {
    try {
        if(filterByValue==""){
      const data = await axios
        .get("http://localhost:8000/api/candidats")
        .then((res) => {
          const modifiedRes = res.data.map((obj) => {
            const { _id, ...rest } = obj;
            return { id: _id, ...rest };
          });
          console.log(modifiedRes);
          setAllCandidates(modifiedRes);
          console.log(res);
        });
    }else{
        const data = await axios
        .get(`http://localhost:8000/api/candidats?${filterBy}=${filterByValue}`)
        .then((res) => {
          const modifiedRes = res.data.map((obj) => {
            const { _id, ...rest } = obj;
            return { id: _id, ...rest };
          });
          console.log(modifiedRes);
          setAllCandidates(modifiedRes);
          console.log(res);
        });
    }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    
    fetchCandidates();
  },[filterByValue]);

  
  useEffect(() => {
    
    console.log(filterByValue)
  });

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

  const fileringArray = [
    { title: "id" },
    { title: "nom" },
    { title: "prenom" },
    { title: "email" },
    { title: "sexe" },
    { title: "CIN" },
    { title: "taille" },
    { title: "telephone" },
    { title: "nationalite" },
    { title: "dateNaissance" },
    { title: "activite" },
    { title: "connaisanceMusical" },
    { title: "situationPerso" },
    { title: "confirm" },
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "30px",
            marginLeft: "auto",
          }}
        >
          <FilterAltIcon
            style={{ fontSize: "16px", marginRight: "10px" }}
          ></FilterAltIcon>
          <div style={{ display: "flex" }}>
            <Autocomplete
              style={{ background: "white" }}
              id="filter-demo"
              options={fileringArray}
              getOptionLabel={(option) => option.title}
              sx={{ width: 150 }}
              value={
                filterBy
                  ? fileringArray.find((option) => option.title === filterBy)
                  : null
              }
              onChange={(event, value) => {
                if (value) {
                  setFilterBy(value.title);
                } else {
                  setFilterBy(null);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Filter by" />
              )}
            />

            <TextField
              style={{ marginLeft: "10px", background: "white" }}
              id="outlined-basic"
              label="Value"
              variant="outlined"
              value={filterByValue}
              onChange={(event) => {
                if (filterBy != "") {
                    console.log(event.target.value)
                  setFilterByValue(event.target.value);
                }
              }}
            />
          </div>
        </div>
        <DataGrid
          style={{ background: "white" }}
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
  ) : (
    <div>loading .....</div>
  );
};

export default CandidatesList;
