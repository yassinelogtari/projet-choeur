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
  Snackbar,
  Alert,
} from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import axios from "axios";

function EliminerDes() {
  const [openDialog, setOpenDialog] = useState(false);
  const [raison, setRaison] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [message, setMessage] = useState("");
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleAlertClose = () => {
    setOpenAlert(false);
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
      fetchUsers();
      handleCloseDialog();
      setRaison("");
      setSelectedUserId("");
      setOpenAlert(true);
      setAlertSeverity("success");
    } catch (error) {
      console.error(error);
      setOpenAlert(true);
      setAlertSeverity("error");
      setMessage(
        error?.response?.data?.message ||
          "Une erreur s'est produite lors de l'élimination de ce choriste."
      );
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/membre/getAllMembers"
      );
      const responce2 = await axios.get(
        "http://localhost:8000/api/profile/listedeselimines"
      );

      if (response && responce2) {
        console.log(response);
        console.log(responce2);
        const allUsers = response.data.model;
        const eliminatedMembers = responce2.data.eliminatedMembers;

        const eliminatedIds = new Set(
          eliminatedMembers.map((item) => item?.memberId?._id)
        );
        const choristeUsers = allUsers.filter(
          (user) => user.role === "choriste"
        );

        const remainingUsers = choristeUsers.filter(
          (item) => !eliminatedIds.has(item._id)
        );

        setAllUsers(remainingUsers);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    handleFiltering();
  }, [allUsers]);

  const handleFiltering = () => {
    console.log(allUsers);
  };

  return allUsers ? (
    <div
      className={`position-absolute top-50 start-50 translate-middle eliminerdesdiv`}
    >
      <Paper className="paperEliminerdes">
        <div className="titreeliminerdis">
          <PersonRemoveIcon /> &nbsp; Eliminer un choriste pour une raison
          disciplinaire
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <select
              className="form-select"
              required
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
              required
              label="Raison"
              variant="outlined"
              value={raison}
              onChange={(e) => setRaison(e.target.value)}
              multiline
              maxRows={4}
              sx={{
                "& .MuiOutlinedInput-input": {
                  padding: "20px",
                  manHeight: "10px",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "1rem", // Optional: Adjust label font size
                },
              }}
            />
          </Grid>
          <Grid
            item
            xs={12}
            style={{ paddingTop: "60px", marginLeft: "320px" }}
          >
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
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={alertSeverity}>
          {alertSeverity === "success"
            ? "Ce choriste est bien éliminé!"
            : message}
        </Alert>
      </Snackbar>
    </div>
  ) : (
    <div>loading</div>
  );
}

export default EliminerDes;
