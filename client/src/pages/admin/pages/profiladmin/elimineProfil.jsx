import React, { useEffect, useState } from "react";
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
  TablePagination,
} from "@mui/material";
import axios from "axios";
import { NavLink } from "react-router-dom";

function ElimineProfil() {
  const [eliminatedMembers, setEliminatedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchEliminatedMembers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/profile/listedeselimines"
        );
        const eliminatedList = response.data.eliminatedMembers;

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

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentEliminatedMembers = eliminatedMembers.slice(
    startIndex,
    endIndex
  );

  return (
    <div className="position-absolute top-50 start-50 translate-middle exlurechordiv">
      <div className="title-button-container">
        <div className="titreprofil">Liste des éliminés</div>
        <div className="boutoneditprofil">
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "-10px" }}
            component={NavLink}
            to="/dashboard/admin/profileadmin"
          >
            Retourner au profil
          </Button>
        </div>
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
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Prénom</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentEliminatedMembers.map((member, index) => (
                    <TableRow key={member.memberId?._id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{member.nom}</TableCell>
                      <TableCell>{member.prenom}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
          </>
        )}
      </Paper>
    </div>
  );
}

export default ElimineProfil;
