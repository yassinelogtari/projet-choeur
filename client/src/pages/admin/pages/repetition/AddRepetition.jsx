import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent, 
    TextField,
    Select,
    MenuItem, 
    FormControl,
    InputLabel,
    Button,
    FormHelperText,
    Modal,
    Box,
    Typography,
} from "@mui/material";
import axios from 'axios';
import './AddRepetition.css';
import { useNavigate } from 'react-router-dom';

function AddRepetition () {
    const [concerts, setConcerts] = useState([]);
    const [concert, setconcert] = useState('');
    const [lieu, setLieu] = useState("");
    const [DateRep, setDateRep] = useState("");
    const [HeureDeb, setHeureDeb] = useState("");
    const [HeureFin, setHeureFin] = useState("");
    const [pourcentages, setPourcentages] = useState({
        soprano: "",
        alto: "",
        tenor: "",
        basse: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchConcerts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/concerts/get-concerts');
                setConcerts(response.data);
            } catch (error) {
                console.error('Erreur lors du chargement des concerts :', error);
            }
        };
    
        fetchConcerts();
    }, []);
    const openModalWithMessage = (message) => {
        setModalMessage(message);
        setOpenModal(true);
    };
    const handleOKClick = () => {
        setOpenModal(false);
        navigate('/dashboard/admin/repetition/liste-repetition'); 
    };

    const handlePourcentage = (e, type) => {
        const value = e.target.value;
        setPourcentages((prevPourcentages) => ({
            ...prevPourcentages,
            [type]: value,
        }));

        if (value < 0 || value > 100) {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [type]: "Veuillez saisir un nombre entre 0 et 100.",
            }));
        } else {
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [type]: "",
            }));
        }
    };
   const handleDateChange = (e) => {
        const selectedDate = new Date(e.target.value);
        const currentDate = new Date();
        const selectedDateWithoutTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        
        if (selectedDateWithoutTime < currentDateWithoutTime) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            DateRep: "Date expirée, veuillez choisir une autre date.",
          }));
        } else {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            DateRep: "",
          }));
        }
        setDateRep(e.target.value);
      };
      
      const handleConcert = (e) => {
        const value = e.target.value;
        if (value) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            concert: "",
          }));
        }
        setconcert(value);
      };
      const handleLieu = (e) => {
        const value = e.target.value;
        if (value) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            lieu: "",
          }));
        }
        setLieu(value);
      };
      const handleHeureDeb = (e) => {
        const value = e.target.value;
        if (value) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            HeureDeb: "",
          }));
        }
        setHeureDeb(value);
      };
      const handleHeureFin = (e) => {
        const value = e.target.value;
        if (value) {
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            HeureFin: "",
          }));
        }
        setHeureFin(value);
      };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        if (!concert) {
            errors.concert = "Veuillez sélectionner un concert.";
        }

        if (!DateRep) {
            errors.DateRep = "Veuillez sélectionner une date.";
        }

        if (!lieu) {
            errors.lieu = "Veuillez saisir un lieu.";
        }

        if (!HeureDeb) {
            errors.HeureDeb = "Veuillez saisir l'heure de début.";
        }

        if (!HeureFin) {
            errors.HeureFin = "Veuillez saisir l'heure de fin.";
        }

        if (!pourcentages.soprano) {
            errors.soprano = "Veuillez saisir le pourcentage Soprano.";
        }

        if (!pourcentages.alto) {
            errors.alto = "Veuillez saisir le pourcentage Alto.";
        }

        if (!pourcentages.tenor) {
            errors.tenor = "Veuillez saisir le pourcentage Ténor.";
        }

        if (!pourcentages.basse) {
            errors.basse = "Veuillez saisir le pourcentage Basse.";
        }

        setFormErrors(errors);
        if (Object.keys(errors).length === 0) {
            const heureDebComplete = new Date(`${DateRep}T${HeureDeb}`).toISOString();
            const heureFinComplete = new Date(`${DateRep}T${HeureFin}`).toISOString();
            let heureDeb = new Date(heureDebComplete);
            let heureFin = new Date(heureFinComplete);
            heureDeb.setHours(heureDeb.getHours() + 1);
            heureFin.setHours(heureFin.getHours() + 1);
            const heureDebModifieeUTC = heureDeb.toISOString();
            const heureFinModifieeUTC = heureFin.toISOString();
           
            let formData = {
                concert,
                lieu,
                DateRep,
                HeureDeb: heureDebModifieeUTC,
                HeureFin: heureFinModifieeUTC,
                pourcentages
            };
            
            console.log(formData);
            openModalWithMessage("Veuillez patienter s'il vous plait...");
            try {
              const response = await axios.post(
                 "http://localhost:8000/api/repetition/create",
                formData
              );
              
              openModalWithMessage(response.data.message);
            } catch (error) {
              console.error("Error:", error.response.data.msg);
            }
          };
        
    }
    
    
    
    return ( 
        <div>
        <h4 className="rep-title-add">
            <span class="text-muted fw-light">REPETITION /</span> Ajouter une répétition
        </h4>
      <Card className="white-card-rep-add">
        <CardContent>
          <form onSubmit={handleSubmit} className="formConteneurAddRep">
         
            <FormControl>
            <InputLabel>Titre du concert</InputLabel>
            <Select
                value={concert}
                onChange={handleConcert}
                error={!!formErrors.concert}
            >
                {concerts.map((con) => (
                    <MenuItem key={con._id} value={con._id}>
                        {con.titre}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText error>
                  {formErrors.concert}
            </FormHelperText>
            </FormControl>
            
            
            
            <div className="two-inputs-row">
            
            <TextField
              label="Date"
              type="date"
              className="half-width-input"
              value={DateRep}
              onChange={handleDateChange}
              error={!!formErrors.DateRep}
              helperText={formErrors.DateRep}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                placeholder: "",
              }}
            />
            <TextField
              label="Lieu"
              type="text"
              className="half-width-input"
              value={lieu}
              onChange={handleLieu}
              error={!!formErrors.lieu}
              helperText={formErrors.lieu}
            />
            </div>
            
            <div className="two-inputs-row">
            <TextField
              label="Heure de début"
              type="time"
              className="half-width-input"
              value={HeureDeb}
              onChange={handleHeureDeb}
              error={!!formErrors.HeureDeb}
              helperText={formErrors.HeureDeb}
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
              className="half-width-input"
              value={HeureFin}
              onChange={handleHeureFin}
              error={!!formErrors.HeureFin}
              helperText={formErrors.HeureFin}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                placeholder: "",
              
              }}
              
            />
            </div>
            <div className="two-inputs-row">
            
            
            <TextField
              label="Pourcentage Soprano"
              type="number" 
              className="half-width-input"
              value={pourcentages.soprano}
              onChange={(e) => handlePourcentage(e, 'soprano')}
              error={!!formErrors.soprano}
              helperText={formErrors.soprano}
            />
            
             <TextField
              label="Pourcentage Alto"
              type="number" 
              className="half-width-input"
              value={pourcentages.alto}
              onChange={(e) => handlePourcentage(e, 'alto')}
              error={!!formErrors.alto}
              helperText={formErrors.alto}
            />
            </div>
         
            <div className="two-inputs-row">
             <TextField
              label="Pourcentage Ténor"
              type="number" 
              className="half-width-input"
              value={pourcentages.tenor}
              onChange={(e) => handlePourcentage(e, 'tenor')}
              error={!!formErrors.tenor}
              helperText={formErrors.tenor}
            />
             <TextField
              label="Pourcentage Basse"
              type="number" 
              className="half-width-input"
              value={pourcentages.basse}
              onChange={(e) => handlePourcentage(e, 'basse')}
              error={!!formErrors.basse}
              helperText={formErrors.basse}
            />
            
            </div>
            
          
            <Button
              type="submit"
              className="btnCreate"
              variant="contained"
              color="primary"
            >
              Créer
            </Button>
            
            </form>
           
           
        </CardContent>
        </Card>
        <Modal
        className="pop-upRepetition"
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ width: 400, bgcolor: "background.paper", p: 2 }}>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            {modalMessage}
          </Typography>
          {modalMessage === "Veuillez patienter s'il vous plait..." ? null : (
          <Button
            className="pop-upBtnOK"
            onClick={handleOKClick}
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
}

export default AddRepetition ;