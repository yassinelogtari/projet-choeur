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
  const [candidatsPerHour, setCandidatsPerHour] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [generateAdditional, setGenerateAdditional] = useState(false);
  const [candidatsList, setCandidatsList] = useState([]);
  const [failingCandidats, setFailingCandidats] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});
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
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          startDate: "Date expirée, veuillez choisir une autre date.",
        }));
      } else {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          startDate: "",
        }));
      }
      setStartDate(e.target.value);
    };
    const handleCandidatsPerHourChange = (e) => {
      const value = e.target.value;
      if (value <= 0) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          candidatsPerHour: "Veuillez saisir un nombre de candidat valide.",
        }));
      }else{
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          candidatsPerHour: "",
        }));
      }
      setCandidatsPerHour(value);
    };
    const handleStartTime = (e) => {
      const value = e.target.value;
      if (value) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          startTime: "",
        }));
      }
      setStartTime(value);
    };
    const handleEndTime = (e) => {
      const value = e.target.value;
      if (value) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          endTime: "",
        }));
      }
      setEndTime(value);
    };
    const handleFailingCandidats = (e) => {
      const value = e.target.value;
      if (value) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          failingCandidats: "",
        }));
      }
      setFailingCandidats(value);
    };
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!startDate) {
      errors.startDate = "Veuillez sélectionner une date de début.";
    }

    if (!candidatsPerHour) {
      errors.candidatsPerHour = "Veuillez saisir le nombre de candidats par heure.";
    }

    if (!startTime) {
      errors.startTime = "Veuillez saisir l'heure de début.";
    }

    if (!endTime) {
      errors.endTime = "Veuillez saisir l'heure de fin.";
    }

    if (generateAdditional && failingCandidats.length === 0) {
      errors.failingCandidats = "Veuillez sélectionner au moins un candidat défaillant.";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
    
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
}

  return (
    <div>
      <h4 className="audition-title">
        <span class="text-muted fw-light">AUDITION /</span> Générer un planning
        d'auditions
      </h4>
      <Card className="white-card">
        <CardContent>
          <form onSubmit={handleSubmit} className="formConteneur">
            <TextField
              label="Date de début"
              type="date"
              value={startDate}
              onChange={handleDateChange}
              error={!!formErrors.startDate}
              helperText={formErrors.startDate}
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
              onChange={handleCandidatsPerHourChange}
              error={!!formErrors.candidatsPerHour}
              helperText={formErrors.candidatsPerHour}
            />
            <TextField
              label="Heure de début"
              type="time"
              value={startTime}
              onChange={handleStartTime}
              error={!!formErrors.startTime}
              helperText={formErrors.startTime}
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
              onChange={handleEndTime}
              error={!!formErrors.endTime}
              helperText={formErrors.endTime}
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
                  value={failingCandidats}
                  onChange={handleFailingCandidats}
                  error={!!formErrors.failingCandidats}
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
                <FormHelperText error>
                  {formErrors.failingCandidats}
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
        className="pop-upPlanning"
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
