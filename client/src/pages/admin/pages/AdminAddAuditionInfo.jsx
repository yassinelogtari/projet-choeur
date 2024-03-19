import React from "react";
import { Box, TextField, Button } from "@mui/material";

const AdminAudition = () => {
  return (
    <div>
      <div>
        <div className="position-absolute top-50 start-50 translate-middle auditionFormContainer">
          <p>Audition Info</p>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div className="form-row">
              <div className="addAuditionInfoForm">
                <TextField
                  id="audition"
                  label="Audition"
                  variant="outlined"
                  className="auditionField"
                />
                <TextField
                  id="candidat"
                  label="Candidat"
                  variant="outlined"
                  className="auditionField"
                />

                <TextField
                  id="extraitChante"
                  label="Extrait chanté"
                  variant="outlined"
                  className="auditionField"
                />
              </div>

              <TextField
                id="tessiture"
                label="Tessiture"
                variant="outlined"
                className="auditionField"
              />
              <TextField
                id="evaluation"
                label="Evaluation"
                variant="outlined"
                className="auditionField"
              />
              <TextField
                id="decision"
                label="Decision"
                variant="outlined"
                className="auditionField"
              />

              <Button
                type="submit"
                variant="contained"
                className="auditionFormButton"
              >
                Submit
              </Button>
            </div>
          </Box>
        </div>
      </div>
      <div className="layout-overlay layout-menu-toggle" />
    </div>
  );
};

export default AdminAudition;
