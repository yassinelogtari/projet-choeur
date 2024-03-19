import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar1 from "../../components/navbar1/Nabar1";
import { Box, TextField, Button } from "@mui/material";
import "../admin/adminDashboard.css";

const AdminAudition = () => {
  return (
    <div>
      <div>
        <div className="layout-wrapper layout-content-navbar">
          <div className="layout-container">
            <aside
              id="layout-menu"
              className="layout-menu menu-vertical menu bg-menu-theme"
            >
              <Sidebar />
            </aside>
            <Navbar1 />

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
      </div>
    </div>
  );
};

export default AdminAudition;
