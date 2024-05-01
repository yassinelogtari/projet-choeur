import React, { useEffect, useState } from "react";

import "./elimination.css";
import { Paper, Grid, Button, TextField, Snackbar, Alert } from "@mui/material";

function ModifierTauxElimination() {
  return (
    <div
      className={`position-absolute top-50 start-50 translate-middle modifiertauxeliminationdiv`}
    >
      <div className="titreModifierTauxElimination">
        Modifierle taux d'élimination
      </div>
      <Paper className="paperModifierTauxElimination"></Paper>
    </div>
  );
}

export default ModifierTauxElimination;
