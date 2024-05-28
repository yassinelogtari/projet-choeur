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
  TablePagination,
} from "@mui/material";
import axios from "axios";

function ExclureChoristeElimine() {
  const [eliminatedMembers, setEliminatedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingB, setLoadingB] = useState(true);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [message, setMessage] = useState("");
  const [excludedMembers, setExcludedMembers] = useState([]);
  const [bannedMembers, setBannedMembers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleAlertClose = () => {
    setOpenAlert(false);
  };

  useEffect(() => {
    const fetchData = async () => {
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
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    const fetchBannedStatus = async () => {
      try {
        const bannedStatusPromises = eliminatedMembers.map(async (member) => {
          const response = await axios.get(
            `http://localhost:8000/api/profile/isBanned/${member.memberId?._id}`
          );
          return {
            memberId: member.memberId?._id,
            isBanned: response.data.isBanned,
          };
        });
        const bannedStatuses = await Promise.all(bannedStatusPromises);
        setBannedMembers(bannedStatuses);
        setLoadingB(false);

        console.log(bannedMembers, "bannedMembers");
      } catch (error) {
        console.error("Error fetching banned status:", error);
      }
    };

    fetchBannedStatus();
    fetchData();
  }, [eliminatedMembers]);

  const handleExclude = async (memberId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/profile/banChoriste/${memberId}`
      );
      console.log("choriste banned:");
      setExcludedMembers([...excludedMembers, memberId]);
      setOpenAlert(true);
      setAlertSeverity("success");
      const updatedBannedMembers = bannedMembers.map((bannedMember) => {
        if (bannedMember.memberId === memberId) {
          return { ...bannedMember, isBanned: true };
        }
        return bannedMember;
      });
      setBannedMembers(updatedBannedMembers);
    } catch (error) {
      console.error("Error excluding member:", error);
      setAlertSeverity("error");
      setMessage(
        error?.response?.data?.message ||
          "Une erreur s'est produite lors de bannir ce choriste."
      );
    }
  };

  const handleInexclude = async (memberId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/profile/unbanChoriste/${memberId}`
      );
      console.log("choriste unbanned:");
      setOpenAlert(true);
      setAlertSeverity("success2");
      setExcludedMembers(excludedMembers.filter((id) => id !== memberId));
      const updatedBannedMembers = bannedMembers.map((bannedMember) => {
        if (bannedMember.memberId === memberId) {
          return { ...bannedMember, isBanned: false };
        }
        return bannedMember;
      });
      setBannedMembers(updatedBannedMembers);
    } catch (error) {
      console.error("Error excluding member:", error);
      setAlertSeverity("error");
      setMessage(
        error?.response?.data?.message ||
          "Une erreur s'est produite lors de débannir ce choriste."
      );
    }
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentEliminatedMembers = eliminatedMembers.slice(
    startIndex,
    endIndex
  );

  return (
    <div
      className={`position-absolute top-50 start-50 translate-middle exlurechordiv`}
    >
      <div className="titreExclureChoristeElimine">
        Exclure un choriste éliminé pour la saison actuelle
      </div>
      <Paper className="paperExclureChoristeElimine">
        {loading ? (
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
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{member.nom}</TableCell>
                    <TableCell>{member.prenom}</TableCell>
                    {loadingB ? (
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
                      <TableCell>
                        {bannedMembers.find(
                          (bannedMember) =>
                            bannedMember.memberId === member.memberId?._id
                        )?.isBanned ? (
                          <Button
                            variant="contained"
                            style={{ backgroundColor: "green", color: "white" }}
                            onClick={() =>
                              handleInexclude(member.memberId?._id)
                            }
                          >
                            Débannir
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleExclude(member.memberId?._id)}
                          >
                            Exclure définitivement
                          </Button>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <TablePagination
          rowsPerPageOptions={[2]}
          component="div"
          count={eliminatedMembers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />

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
            {alertSeverity === "success2"
              ? "Ce choriste est bien débanni!"
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
