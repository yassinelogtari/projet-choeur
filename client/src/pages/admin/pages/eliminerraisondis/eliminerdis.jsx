import React, { useState } from "react";
import "./elimination.css";
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

function EliminerDes() {
  const [openDialog, setOpenDialog] = useState(false);
  const [raison, setRaison] = useState("");

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleEliminer = () => {
    // Mettez ici la logique pour effectuer l'élimination
    // Exemple: console.log("Éliminer l'utilisateur");
    handleCloseDialog(); // Fermer le dialogue après l'élimination
  };

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
            ></select>
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
