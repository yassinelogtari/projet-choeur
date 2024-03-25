import React, { useState, useEffect } from "react";
import {
  TextField,
  Checkbox,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormControlLabel,
  Chip,
  FormHelperText,
  Card,
  CardContent,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import axios from "axios";
import "./genererPlanning.css";

const GenererPlanning = () => {
  const [startDate, setStartDate] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [candidatsPerHour, setCandidatsPerHour] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [generateAdditional, setGenerateAdditional] = useState(false);
  const [candidatsList, setCandidatsList] = useState([]);
  const [failingCandidats, setFailingCandidats] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  useEffect(() => {
    const fetchCandidatsList = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/candidats");
        setCandidatsList(response.data);
      } catch (error) {
        console.error("Error fetching candidats list:", error);
      }
    };

    fetchCandidatsList();
    
  }, []);
  const openModalWithMessage = (message) => {
        setModalMessage(message);
        setOpenModal(true);
    };
    
  const handleDateChange = (e) => {
      const selectedDate = new Date(e.target.value);
      const currentDate = new Date();
  
      if (selectedDate < currentDate) {
        setStartDateError("Date expirée, veuillez choisir une autre date.");
      } else {
        setStartDateError("");
      }
  
      setStartDate(e.target.value);
    };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedDate = new Date(startDate);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      setStartDateError("Date expirée, veuillez choisir une autre date.");
      return; 
    }
    
    let formData = {
      startDate,
      CandidatsPerHour: parseInt(candidatsPerHour),
      startTime: parseInt(startTime)-1,
      endTime: parseInt(endTime)-1,
    };
    if (generateAdditional) {
      formData = {
        ...formData,
        failingCandidats: failingCandidats.map((candidat) => candidat._id),
      };
    }
    openModalWithMessage("Veuillez patienter pendant que nous générons le planning...");
    try {
      const response = await axios.post(
        generateAdditional
          ? "http://localhost:8000/api/auditions/generate/additional"
          : "http://localhost:8000/api/auditions/generate",
        formData
      );
      console.log(response.data);
      openModalWithMessage(response.data.message);
    } catch (error) {
      console.error("Error:", error.response.data.msg);
    }
  };

  return (
    <div>
      <h4 className="audition-title">
        <span class="text-muted fw-light">AUDITION /</span> Générer un planning
        d'auditions
      </h4>
      <Card className="white-card">
        <CardContent>
          <form onSubmit={handleSubmit} className="form-container">
            <TextField
              label="Date de début"
              type="date"
              value={startDate}
              onChange={handleDateChange}
              required
              error={!!startDateError}
              helperText={startDateError}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                placeholder: "",
              }}
            />
            <TextField
              label="Nombre de candidats par heure"
              type="number"
              value={candidatsPerHour}
              onChange={(e) => setCandidatsPerHour(e.target.value)}
              required
              inputProps={{
                min: 1, 
                step: 1, 
              }}
            />
            <TextField
              label="Heure de début"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                placeholder: "",
               
              }}
            />
            <TextField
              label="Heure de fin"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                placeholder: "",
              
              }}
            />

            <FormControlLabel
              className="SupplementaireCheck"
              control={
                <Checkbox
                  checked={generateAdditional}
                  onChange={(e) => setGenerateAdditional(e.target.checked)}
                />
              }
              label="Générer un planning d'audition supplémentaire pour les défaillants"
            />

            {generateAdditional && (
              <FormControl>
                <InputLabel>Candidats défaillants</InputLabel>
                <Select
                  multiple
                  required
                  value={failingCandidats}
                  onChange={(e) => setFailingCandidats(e.target.value)}
                  renderValue={(selected) => (
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                      {selected.map((candidat) => (
                        <Chip
                          key={candidat._id}
                          label={`${candidat.prenom} ${candidat.nom}`}
                          style={{ margin: 2 }}
                        />
                      ))}
                    </div>
                  )}
                >
                  {candidatsList.map((candidat) => (
                    <MenuItem key={candidat._id} value={candidat}>
                      {candidat.nom} {candidat.prenom}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Sélectionnez les candidats défaillants
                </FormHelperText>
              </FormControl>
            )}

            <Button
              type="submit"
              className="btnPlanning"
              variant="contained"
              color="primary"
            >
              Générer le planning
            </Button>
          </form>
        </CardContent>
      </Card>
      <Modal
        className="pop-up"
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ width: 400, bgcolor: "background.paper", p: 2 }}>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            {modalMessage}
          </Typography>
          {modalMessage === "Veuillez patienter pendant que nous générons le planning..." ? null : (
          <Button
            className="pop-upBtn"
            onClick={() => {
              setOpenModal(false);
              setStartDate("");
              setCandidatsPerHour("");
              setStartTime("");
              setEndTime("");
              setGenerateAdditional(false);
              setFailingCandidats([]);
            }}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            OK
          </Button>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default GenererPlanning;
