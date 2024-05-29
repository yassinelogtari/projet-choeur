import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DialogComponent from "../../../../components/dialog/Dialog";
import "./auditionUpdate.css";

const AuditionUpdate = () => {
  const location = useLocation();
  const [auditionIdParam, setAuditionIdParam] = useState("");
  const [tessiture, setTessiture] = useState("");
  const [evaluation, setEvaluation] = useState("");
  const [decision, setDecision] = useState("");
  const [extraitChante, setExtraitChante] = useState("");
  const [remarque, setRemarque] = useState("");
  const [candidatInfoId, setCandidatInfoId] = useState("");
  const [candidateOptions, setCandidateOptions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

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
          ...candidate, // Include all candidate details
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

  const handleExtraitChanteChange = (event) => {
    setExtraitChante(event.target.value);
  };

  const handleRemarqueChange = (event) => {
    setRemarque(event.target.value);
  };

  const handleCandidatInfoId = (event) => {
    const candidateId = event.target.value;
    setCandidatInfoId(candidateId);
    
    // Find the selected candidate from candidateOptions and set the details
    const selectedCandidate = candidateOptions.find(candidate => candidate._id === candidateId);
    if (selectedCandidate) {
      setTessiture(selectedCandidate.tessiture || "");
      setEvaluation(selectedCandidate.evaluation || "");
      setDecision(selectedCandidate.decision || "");
      setExtraitChante(selectedCandidate.extraitChante || "");
      setRemarque(selectedCandidate.remarque || "");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let errors = {};
    let hasErrors = false;

    if (!candidatInfoId) {
      errors.candidatInfoId = "Veuillez sélectionner un candidat.";
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

    if (!extraitChante) {
      errors.extraitChante = "Veuillez saisir un extrait chanté.";
      hasErrors = true;
    }
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
          extraitChante,
          tessiture,
          evaluation,
          decision,
          remarque,
        },
      };

      await axios.patch(
        `http://localhost:8000/api/auditions/update-audition/${auditionIdParam}`,
        requestBody
      );
      setOpenDialog(true);
      setCandidatInfoId("");
      setTessiture("");
      setEvaluation("");
      setDecision("");
      setExtraitChante("");
      setRemarque("");
      setFormErrors({});
    } catch (error) {
      console.error("Error updating audition info:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
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
                    value={extraitChante}
                    onChange={handleExtraitChanteChange}
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
                  value={remarque}
                  onChange={handleRemarqueChange}
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
      <div>
          <DialogComponent
            open={openDialog}
            handleClose={handleCloseDialog}
            successMessage="Your audition has been successfully updated!"
          />
        </div>
      <div className="layout-overlay layout-menu-toggle" />
    </div>
  );
};

export default AuditionUpdate;
