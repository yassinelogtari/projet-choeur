import React, { useEffect, useState } from "react";
import "./elimination.css";
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";

function ExclureChoristeElimine() {
  const [eliminatedMembers, setEliminatedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [message, setMessage] = useState("");
  const handleAlertClose = () => {
    setOpenAlert(false);
  };
  useEffect(() => {
    const fetchEliminatedMembers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/profile/listedeselimines"
        );
        const eliminatedList = response.data.eliminatedMembers;
        console.log(eliminatedList, "eliminatedList");
        const uniqueIds = new Set();
        const uniqueEliminatedMembers = eliminatedList.filter((member) => {
          if (uniqueIds.has(member.memberId?._id)) {
            return false;
          } else {
            uniqueIds.add(member.memberId?._id);
            return true;
          }
        });

        setEliminatedMembers(uniqueEliminatedMembers);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching eliminated members:", error);
        setLoading(false);
      }
    };

    fetchEliminatedMembers();
  }, []);
  const handleExclude = async (memberId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/profile/banChoriste/${memberId}`
      );
      console.log("choriste banned:");
      setOpenAlert(true);
      setAlertSeverity("success");
    } catch (error) {
      console.error("Error excluding member:", error);
      setAlertSeverity("error");
      setMessage(
        error?.response?.data?.message ||
          "Une erreur s'est produite lors bannir ce choriste."
      );
    }
  };

  return (
    <div
      className={`position-absolute top-50 start-50 translate-middle exlurechordiv`}
    >
      <div className="titreExclureChoristeElimine">
        Exclure un choriste éliminé pour la saison actuelle
      </div>
      <Paper className="paperExclureChoristeElimine">
        {loading ? ( // Display CircularProgress while loading
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <CircularProgress />
          </div>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Prénom</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {eliminatedMembers.map((member, index) => (
                  <TableRow key={member.memberId?._id}>
                    {/*<TableCell>{member.memberId?._id}</TableCell>*/}
                    <TableCell>{index + 1}</TableCell>

                    <TableCell>{member.nom}</TableCell>
                    <TableCell>{member.prenom}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleExclude(member.memberId?._id)}
                      >
                        Exclure définitivement
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Snackbar
          open={openAlert}
          autoHideDuration={6000}
          onClose={handleAlertClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert severity={alertSeverity}>
            {alertSeverity === "success"
              ? "Ce choriste est bien banni!"
              : message}
          </Alert>
        </Snackbar>
      </Paper>
    </div>
  );
}

export default ExclureChoristeElimine;

/*
<div>
      <h1>Liste des utilisateurs éliminés uniques :</h1>
      <ul>
        {eliminatedMembers.map((member) => (
          <li key={member.memberId?._id}>
            ID: {member.memberId?._id}, Nom: {member.nom}, Prénom:{" "}
            {member.prenom}
          </li>
        ))}
      </ul>
    </div>
///////////////////////////
    <div
      className={`position-absolute top-50 start-50 translate-middle exlurechordiv`}
    >
      <div className="titreExclureChoristeElimine">
        Exclure un choriste éliminé pour la saison actuelle
      </div>
      <Paper className="paperExclureChoristeElimine">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Prénom</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eliminatedMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.nom}</TableCell>
                  <TableCell>{member.prenom}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleExclude(member.id)}
                    >
                      Exclure définitivement
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}

export default ExclureChoristeElimine;
*/
