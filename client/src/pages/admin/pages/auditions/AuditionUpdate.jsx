import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import "./auditionUpdate.css";

const AdminAdAuditionInfo = () => {
  const location = useLocation();
  const [auditionIdParam, setAuditionIdParam] = useState("");

  const [tessiture, setTessiture] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [decision, setDecision] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("auditionId");
    setAuditionIdParam(id);
  }, [location.search]);

  const handleTessitureChange = (event) => {
    setTessiture(event.target.value);
  };

  const handleEvaluationChange = (event) => {
    setEvaluation(event.target.value);
  };

  const handleDecisionChange = (event) => {
    setDecision(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      console.log(auditionIdParam);
      const candidatId = event.target.candidatId.value;
      const candidatInfoId = candidatId;
      const requestBody = {
        candidatInfoId,
        updateFields: {
          extraitChante: event.target.extraitChante.value,
          tessiture,
          evaluation,
          decision,
          remarque: event.target.remarque.value,
        },
      };

      await axios.patch(
        `http://localhost:8000/api/auditions/update-audition/${auditionIdParam}`,
        requestBody
      );

      setTessiture("");
      setEvaluation("");
      setDecision("");
      event.target.reset();
    } catch (error) {
      console.error("Error updating audition info:", error);
    }
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
            onSubmit={handleSubmit}
          >
            <div className="form-row">
              <div className="addAuditionInfoForm">
                <TextField
                  id="candidatId" // Ajoutez l'ID de l'input
                  label="ID du Candidat" // Ajoutez le label approprié
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
              <div className="bottonFormAddAuddition">
                <FormControl className="auditionField selectTessiture">
                  <InputLabel id="tessiture-label">Tessiture</InputLabel>
                  <Select
                    labelId="tessiture-label"
                    id="tessiture-select"
                    value={tessiture}
                    label="Tessiture"
                    onChange={handleTessitureChange}
                    className="auditionField"
                  >
                    <MenuItem value="alto">alto</MenuItem>
                    <MenuItem value="basse">basse</MenuItem>
                    <MenuItem value="soprano">soprano</MenuItem>
                    <MenuItem value="ténor">ténor</MenuItem>
                  </Select>
                </FormControl>

                <FormControl className="auditionField selectEvaluation">
                  <InputLabel id="evaluation-label">Evaluation</InputLabel>
                  <Select
                    labelId="evaluation-label"
                    id="evaluation-select"
                    value={evaluation}
                    label="Evaluation"
                    onChange={handleEvaluationChange}
                    className="auditionField"
                  >
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                  </Select>
                </FormControl>

                <FormControl className="auditionField selectDecisionUpdate">
                  <InputLabel id="decision-label">Decision</InputLabel>
                  <Select
                    labelId="decision-label"
                    id="decision-select"
                    value={decision}
                    label="Decision"
                    onChange={handleDecisionChange}
                    className="auditionField"
                  >
                    <MenuItem value="Retenu">Retenu</MenuItem>
                    <MenuItem value="Refusé">Refusé</MenuItem>
                    <MenuItem value="En attente">En attente</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div className="ButtonAndRemarqueAudition">
                <TextField
                  id="remarque"
                  label="Remarque"
                  multiline
                  rows={4}
                  className="RemarqueAudition"
                />
                <Button
                  type="submit"
                  variant="contained"
                  className="auditionFormButtonUpdate"
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
};

export default AdminAdAuditionInfo;
