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

const AuditionUpdate = () => {
  const location = useLocation();
  const [auditionIdParam, setAuditionIdParam] = useState("");
  const [tessiture, setTessiture] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [decision, setDecision] = useState("");
  const [candidatInfoId, setCandidatInfoId] = useState("");
  const [candidateOptions, setCandidateOptions] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("auditionId");
    setAuditionIdParam(id);
    fetchCandidates(id);
  }, [location.search]);

  const fetchCandidates = async (auditionId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/auditions/${auditionId}`
      );
      const candidatesForAudition = response.data.audition.candidatsInfo.map(
        (candidate) => ({
          _id: candidate._id,
        })
      );
      setCandidateOptions(candidatesForAudition);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTessitureChange = (event) => {
    setTessiture(event.target.value);
  };

  const handleEvaluationChange = (event) => {
    setEvaluation(event.target.value);
  };

  const handleDecisionChange = (event) => {
    setDecision(event.target.value);
  };

  const handleCandidatInfoId = (event) => {
    setCandidatInfoId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let errors = {};
    let hasErrors = false;

    if (!candidatInfoId) {
      errors.candidatInfoId = "Veuillez sélectionner une tessiture.";
      hasErrors = true;
    }

    if (!tessiture) {
      errors.tessiture = "Veuillez sélectionner une tessiture.";
      hasErrors = true;
    }
    if (!evaluation) {
      errors.evaluation = "Veuillez sélectionner une évaluation.";
      hasErrors = true;
    }
    if (!decision) {
      errors.decision = "Veuillez sélectionner une décision.";
      hasErrors = true;
    }

    const extraitChante = event.target.extraitChante.value.trim();
    if (!extraitChante) {
      errors.extraitChante = "Veuillez saisir un extrait chanté.";
      hasErrors = true;
    }
    const remarque = event.target.remarque.value.trim();
    if (!remarque) {
      errors.remarque = "Veuillez saisir une remarque.";
      hasErrors = true;
    }
    if (hasErrors) {
      setFormErrors(errors);
      return;
    }

    try {
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
      // Clear form and errors on successful submission
      setCandidatInfoId("");
      setTessiture("");
      setEvaluation("");
      setDecision("");
      setFormErrors({});
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
                <FormControl className="auditionField">
                  <InputLabel id="candidatId-label">ID du Candidat</InputLabel>
                  <Select
                    labelId="candidatId-label"
                    id="candidatId"
                    value={candidatInfoId}
                    onChange={handleCandidatInfoId}
                    className="auditionField selectCandidatId"
                    error={!!formErrors.candidatInfoId}
                  >
                    {candidateOptions.map((candidate) => (
                      <MenuItem key={candidate._id} value={candidate._id}>
                        {candidate._id}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.candidatInfoId && (
                    <p className="error">{formErrors.candidatInfoId}</p>
                  )}
                </FormControl>
                <div>
                  <TextField
                    id="extraitChante"
                    label="Extrait chanté"
                    variant="outlined"
                    className="auditionField selectExtraitChante"
                    error={!!formErrors.extraitChante}
                  />
                  {formErrors.extraitChante && (
                    <p className="error">{formErrors.extraitChante}</p>
                  )}
                </div>
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
                    error={!!formErrors.tessiture}
                  >
                    <MenuItem value="alto">alto</MenuItem>
                    <MenuItem value="basse">basse</MenuItem>
                    <MenuItem value="soprano">soprano</MenuItem>
                    <MenuItem value="ténor">ténor</MenuItem>
                  </Select>
                  {formErrors.tessiture && (
                    <p className="error">{formErrors.tessiture}</p>
                  )}
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
                    error={!!formErrors.evaluation}
                  >
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                  </Select>
                  {formErrors.evaluation && (
                    <p className="error">{formErrors.evaluation}</p>
                  )}
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
                    error={!!formErrors.decision}
                  >
                    <MenuItem value="Retenu">Retenu</MenuItem>
                    <MenuItem value="Refusé">Refusé</MenuItem>
                    <MenuItem value="En attente">En attente</MenuItem>
                  </Select>
                  {formErrors.decision && (
                    <p className="error">{formErrors.decision}</p>
                  )}
                </FormControl>
              </div>
              <div className="ButtonAndRemarqueAudition">
                <TextField
                  id="remarque"
                  label="Remarque"
                  multiline
                  rows={4}
                  className="RemarqueAudition"
                  error={!!formErrors.remarque}
                />
                {formErrors.remarque && (
                  <p className="error">{formErrors.remarque}</p>
                )}
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

export default AuditionUpdate;
