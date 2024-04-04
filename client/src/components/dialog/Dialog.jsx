import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const DialogComponent = ({ open, handleClose, successMessage }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Validation</DialogTitle>
      <DialogContent>
        <p>{successMessage}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;
