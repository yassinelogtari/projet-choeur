import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import "./adminAddAuditionInfo.css";

const AdminAdAuditionInfo = () => {
  const [auditionId, setAuditionId] = useState("");
  const [allCandidates, setAllCandidates] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("auditionId");
    setAuditionId(id);
    fetchCandidates(id);
    setFormData((oldstate) => ({ ...oldstate, auditionId: id }));
  }, [location.search]);

  const [formData, setFormData] = useState({
    auditionId: "",
    selectedCandidateId: "",
    extraitChante: "",
    tessiture: "",
    evaluation: "",
    decision: "",
    remarque: "",
  });

  const fetchCandidates = async (auditionId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/auditions/${auditionId}`
      );
      const candidatesForAudition = response.data.audition.candidats.map(
        (candidate) => ({
          _id: candidate._id,
          nom: candidate.nom,
          prenom: candidate.prenom,
        })
      );
      setAllCandidates(candidatesForAudition);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const [openDialog, setOpenDialog] = useState(false);
  const [formErrors, setFormErrors] = useState({
    selectedCandidateId: "",
    extraitChante: "",
    tessiture: "",
    evaluation: "",
    decision: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auditions/addinfo",
        formData
      );
      console.log(response.data);
      setOpenDialog(true);

      setFormData({
        auditionId: "",
        selectedCandidateId: "",
        extraitChante: "",
        tessiture: "",
        evaluation: "",
        decision: "",
        remarque: "",
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate("/dashboard/admin/Audition/list");
  };

  return (
    <div>
      <div>
        <div className="position-absolute top-50 start-50 translate-middle auditionFormContainer">
          <p>Add Audition Info</p>
          <Box
            onSubmit={handleSubmit}
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
                  name="auditionId"
                  value={auditionId}
                  onChange={handleChange}
                />
                <FormControl className="auditionField candidatIDfield">
                  <InputLabel id="candidat-label">Candidat</InputLabel>
                  <Select
                    labelId="candidat-label"
                    id="candidat-select"
                    value={formData.candidatId}
                    name="candidatId"
                    onChange={handleChange}
                  >
                    {allCandidates.map((candidate) => (
                      <MenuItem key={candidate._id} value={candidate._id}>
                        {`${candidate.nom} ${candidate.prenom}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  id="extraitChante"
                  label="Extrait chanté"
                  variant="outlined"
                  className="auditionField"
                  name="extraitChante"
                  value={formData.extraitChante}
                  onChange={handleChange}
                />
              </div>
              <div className="bottonFormAddAuddition">
                <FormControl className="auditionField selectTessiture">
                  <InputLabel id="tessiture-label">Tessiture</InputLabel>
                  <Select
                    labelId="tessiture-label"
                    id="tessiture-select"
                    value={formData.tessiture}
                    name="tessiture"
                    onChange={handleChange}
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
                    value={formData.evaluation}
                    name="evaluation"
                    onChange={handleChange}
                    className="auditionField"
                  >
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="C">C</MenuItem>
                  </Select>
                </FormControl>

                <FormControl className="auditionField selectDecision">
                  <InputLabel id="decision-label">Decision</InputLabel>
                  <Select
                    labelId="decision-label"
                    id="decision-select"
                    value={formData.decision}
                    name="decision"
                    onChange={handleChange}
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
                  id="outlined-multiline-static"
                  label="Remarque"
                  multiline
                  rows={4}
                  className="RemarqueAudition"
                  name="remarque"
                  value={formData.remarque}
                  onChange={handleChange}
                />
                <Button
                  type="submit"
                  variant="contained"
                  className="auditionFormButton"
                >
                  Submit
                </Button>
              </div>
            </div>
          </Box>
        </div>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Validation</DialogTitle>
        <DialogContent>
          <p>Votre audition a été ajoutée avec succès !</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <div className="layout-overlay layout-menu-toggle" />
    </div>
  );
};

export default AdminAdAuditionInfo;
