import React from "react";
import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

  import "./auditionUpdate.css"

function AuditionUpdate() {
    const [Evaluation, setEvaluation] = useState("");

  const handleChange = (event) => {
    setEvaluation(event.target.value);
  };
    return (  
        <div>
      <div>
        <div className="position-absolute top-50 start-50 translate-middle auditionFormContainer">
          <p>Update Audition Info</p>
          <Box
            component="form"
            sx={{
              "& .MuiTextField-root": { m: 1, width: "25ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <div className="form-row">
              <div className="AuditionUpdateInfoForm">
                <TextField
                  id="Audition"
                  label="Audition"
                  variant="outlined"
                  className="AuditionUpdateField"
                />
                <TextField
                  id="candidat"
                  label="Candidat"
                  variant="outlined"
                  className="AuditionUpdateField"
                />

                <TextField
                  id="extraitChante"
                  label="Extrait chanté"
                  variant="outlined"
                  className="AuditionUpdateField"
                />
              </div>
              <div className="bottonFormAddAuddition">
                <FormControl className="AuditionUpdateField selectTessiture">
                  <InputLabel id="demo-simple-select-label">
                    Tessiture
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={Evaluation}
                    label="Tessiture"
                    onChange={handleChange}
                    className="AuditionUpdateField"
                  >
                    <MenuItem>alto</MenuItem>
                    <MenuItem>basse</MenuItem>
                    <MenuItem>soprano</MenuItem>
                    <MenuItem>ténor</MenuItem>
                  </Select>
                </FormControl>

                <FormControl className="AuditionUpdateField selectEvaluation">
                  <InputLabel id="demo-simple-select-label">
                    Evaluation
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={Evaluation}
                    label="Evaluation"
                    onChange={handleChange}
                    className="AuditionUpdateField"
                  >
                    <MenuItem>A</MenuItem>
                    <MenuItem>B</MenuItem>
                    <MenuItem>C</MenuItem>
                  </Select>
                </FormControl>

                <FormControl className="AuditionUpdateField selectDecision">
                  <InputLabel id="demo-simple-select-label">
                    Decision
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={Evaluation}
                    label="Evaluation"
                    onChange={handleChange}
                    className="AuditionUpdateField"
                  >
                    <MenuItem>Retenu</MenuItem>
                    <MenuItem>Refusé</MenuItem>
                    <MenuItem>En attente</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="ButtonAndRemarqueAuditionUpdate">
                <TextField
                  id="outlined-multiline-static"
                  label="Remarque"
                  multiline
                  rows={4}
                  className="RemarqueAuditionUpdate"
                />
                <Button
                  type="submit"
                  variant="contained"
                  className="AuditionUpdateFormButton"
                >
                  Update
                </Button>
              </div>
            </div>
          </Box>
        </div>
      </div>
      <div className="layout-overlay layout-menu-toggle" />
    </div>
  );
    
}

export default AuditionUpdate;