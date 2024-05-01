import React, { useEffect, useState } from "react";
import {
  Paper,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";

function EliminerDes() {
  const [openDialog, setOpenDialog] = useState(false);
  const [raison, setRaison] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [updatedUsersList, setUpdatedUsersList] = useState([]);
  const [eliminatedMembers, setEliminatedMembers] = useState([]);
  const [eliminatedIds, setEliminatedIds] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");
  const [message, setMessage] = useState("");
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEliminer = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/profile/eliminateChoristepour-un-raison/${selectedUserId}`,
        { data: { reason: raison } }
      );
      console.log(response.data);
      handleCloseDialog();
    } catch (error) {
      console.error(error);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/membre/getAllMembers"
      );
      const allUsers = response.data.model;

      console.log("All users from API:", allUsers);
      //const filteredUsers = allUsers.filter((user) => user.role === "choriste");

      const filteredUsers = allUsers.filter((user) => {
        const isEliminated = eliminatedIds.includes(user._id);
        return user.role === "choriste" && !isEliminated;
      });

      console.log("Filtered users (choriste):", filteredUsers); // Log filtered users
      const modifiedRes = filteredUsers.map((obj, index) => ({
        id: index + 1,
        ...obj,
      }));
      setAllUsers(modifiedRes);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();

    fetchEliminatedMembers();
  }, []);
  const fetchEliminatedMembers = async () => {
    try {
      const eliminatedResponse = await axios
        .get("http://localhost:8000/api/profile/listedeselimines")
        .then((res) => {
          console.log("res", res.data);

          const eliminatedList = res.data.eliminatedMembers;
          const eliminatedIds = eliminatedList.map(
            (eliminated) => eliminated.memberId?._id
          );
          setEliminatedIds(eliminatedIds);
          //console.log(eliminatedIds);
          console.log("eliminatedList", eliminatedList);
          if (eliminatedList) {
            setEliminatedMembers(eliminatedList);
            console.log("eliminatedMembers", eliminatedMembers);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };
  {
    /*
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
    };*/
  }
  return (
    <div
      className={`position-absolute top-50 start-50 translate-middle eliminerdesdiv`}
    >
      <Paper className="paperEliminerdes">
        <div className="titreeliminerdis">
          Eliminer un choriste pour une raison disciplinaire
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <select
              className="form-select"
              aria-label="Sélectionner un utilisateur"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Sélectionner un choriste</option>
              {allUsers.map((user) => (
                <option
                  key={user._id}
                  value={user._id}
                >{`${user?.nom} ${user?.prenom}`}</option>
              ))}
            </select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Raison"
              variant="outlined"
              value={raison}
              onChange={(e) => setRaison(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenDialog}
            >
              Éliminer
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Dialogue de confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir éliminer ce choriste ?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleEliminer} color="primary" autoFocus>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EliminerDes;
