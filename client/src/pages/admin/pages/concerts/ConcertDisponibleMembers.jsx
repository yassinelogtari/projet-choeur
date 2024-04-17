import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "@mui/material";
import "./concertDisponibleMembers.css";
import axios from "axios";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { NavLink, useParams } from "react-router-dom";

const ConcertDisponibleMembers = () => {
  const [allCandidates, setAllCandidates] = useState();
  const [filterBy, setFilterBy] = useState("");
  const [concertTitle, setConcertTitle] = useState("");
  
  const { idC } = useParams();
  const PF = "http://localhost:5000/images/";



  const fetchCandidates = async () => {
    try {
        const conc = await axios
          .get(`http://localhost:8000/api/concerts/${idC}`,{
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          if (conc) {
            console.log(conc)
            setConcertTitle(conc.data.titre)
          }
      if (filterBy == "" || !filterBy) {
        const data = await axios
          .get(`http://localhost:8000/api/disponibility/cancert/disponibleMembers/${idC}`,{
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            const modifiedRes = res.data.map((obj, index) => {
              return { id: index + 1, ...obj };
            });
            console.log(modifiedRes);
            setAllCandidates(modifiedRes);
            console.log(res);
          });
      } else {
        const data1 = await axios
          .get(`http://localhost:8000/api/disponibility/cancert/disponibleMembers/${idC}?pupitre=${filterBy}`,{
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            const modifiedRes = res.data.map((obj, index) => {
              return { id: index + 1, ...obj };
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
  }, [filterBy]);

  useEffect(() => {
   console.log(filterBy)
  }, [filterBy]);


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

  const fileringArray = [
    { title: "soprano" },
    { title: "alto" },
    { title: "ténor" },
    { title: "basse" },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Actions",
      width: 70,
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
          right: "-66vh",
        }}
      >
        <div style={{ marginBottom: "50px" }}>Liste des membres disponibles pour le concert "{concertTitle}"</div>
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
                <TextField {...params} label="Filter by Pupitre" />
              )}
            />

          
          </div>
        </div>
        <DataGrid
          style={{ background: "white" }}
          className="datagrid"
          rows={allCandidates}
          columns={userColumns.concat(actionColumn)}
          initialState={{
            ...allCandidates.initialState,
            pagination: { paginationModel: { pageSize: 5 } },
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

export default ConcertDisponibleMembers;
