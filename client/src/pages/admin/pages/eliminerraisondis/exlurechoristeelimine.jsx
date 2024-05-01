import React, { useEffect, useState } from "react";

import "./elimination.css";
import { Paper, Grid, Button, TextField, Snackbar, Alert } from "@mui/material";

function ExclureChoristeElimine() {
  return (
    <div
      className={`position-absolute top-50 start-50 translate-middle exlurechordiv`}
    >
      <div className="titreExclureChoristeElimine">
        Exclure un choriste éliminé
      </div>
      <Paper className="paperExclureChoristeElimine"></Paper>
    </div>
  );
}

export default ExclureChoristeElimine;
