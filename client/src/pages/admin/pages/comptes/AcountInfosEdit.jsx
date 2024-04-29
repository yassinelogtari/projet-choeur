import React, { useEffect, useState } from "react";
import adminIcon from "../../../../assets/img/avatars/admin-icon.png";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./accountInfo.css";
import {
  Autocomplete,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const AcountInfosEdit = (props) => {
  const [inputs, setInputs] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { id } = useParams();
  const fetchCandidateInfos = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/membre/getMembreById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res) {
        console.log(res);

        setInputs(res.data.model);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updateCandidateInfos = async (e) => {
    e.preventDefault();
    if (!inputs.nom || !inputs.prenom || !inputs.email || !inputs.role || inputs.nom=="" || inputs.prenom=="" || inputs.email=="" || inputs.role=="") {
     
      setErrors({
        nom: !inputs.nom,
        prenom: !inputs.prenom,
        email: !inputs.email,
        role: !inputs.role
      });
      return; 
    }
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/membre/updateMember/${id}`,
        inputs,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res) {
        console.log(res);

        setShowPopup(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCandidateInfos();
  }, []);
  useEffect(() => {
    console.log(inputs);
  }, [inputs]);

  const roleArray = [
    { title: "admin" },
    { title: "manager" },
    { title: "chef du pupitre" },
    { title: "chef de choeur" },
    { title: "choriste" },
  ];

  const statusArray = [
    { title: "Junior" },
    { title: "Sénior" },
    { title: "Vétéran" },
    { title: "Choriste" },
    { title: "Inactif" },
    { title: "En congé" },
    { title: "éliminé" },
  ];

  const pupitreArray = [
    { title: "soprano" },
    { title: "alto" },
    { title: "ténor" },
    { title: "basse" },
  ];

  return inputs ? (
    <div className="position-absolute top-50 start-50 translate-middle auditionTable">
      <div
        className="contentuinfoprofile"
        style={{ height: "calc(100vh - 165px)" }}
      >
        <form>
          <div style={{ height: "10px" }}></div>
          <div className="contentuinfopart1">
            <img src={adminIcon} className="contentuinfopart1image" />
            <h1 className="contentuinfopart1h1">{inputs.prenom}</h1>
          </div>
          <div
            className="content-columns"
            style={{ marginTop: "0", marginRight: "20px", marginLeft: "20px" }}
          >
            {Object.entries(inputs)
              .filter(
                ([key]) =>
                  key !== "_id" &&
                  key !== "notifications" &&
                  key !== "historiqueStatut" &&
                  key !== "__v"
              )
              .map(([key, value]) => (
                <div
                  key={key}
                  className="content-item"
                  style={{
                    marginTop: "2%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {key !== "connaissanceMusic" &&
                  key !== "activite" &&
                  key !== "sexe" ? (
                    <span style={{ color: "#696CFF", marginTop: "20px" }}>
                      {key}:{" "}
                    </span>
                  ) : (
                    <span style={{ color: "#696CFF" }}>{key}: </span>
                  )}

                  {key == "connaissanceMusic" || key == "activite" ? (
                    <FormControl>
                      {value != null ? (
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          style={{ width: "100%", marginTop: "10px" }}
                          defaultValue={value.toString()}
                          onChange={(event, value) => {
                            setInputs((prevInputs) => ({
                              ...prevInputs,
                              [key]: value ? value == "true" : "",
                            }));
                          }}
                        >
                          <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label="oui"
                            style={{ color: "black", padding: "8px" }}
                          />
                          <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label="non"
                            style={{ color: "black", padding: "8px" }}
                          />
                        </RadioGroup>
                      ) : (
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          style={{ width: "100%", marginTop: "10px" }}
                          onChange={(event, value) => {
                            setInputs((prevInputs) => ({
                              ...prevInputs,
                              [key]: value ? value == "true" : "",
                            }));
                          }}
                        >
                          <FormControlLabel
                            value={true}
                            control={<Radio />}
                            label="oui"
                            style={{ color: "black", padding: "8px" }}
                          />
                          <FormControlLabel
                            value={false}
                            control={<Radio />}
                            label="non"
                            style={{ color: "black", padding: "8px" }}
                          />
                        </RadioGroup>
                      )}
                    </FormControl>
                  ) : key == "sexe" ? (
                    <FormControl>
                      {value != null ? (
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          style={{ width: "100%", marginTop: "10px" }}
                          defaultValue={value.toString()}
                          onChange={(event, value) => {
                            setInputs((prevInputs) => ({
                              ...prevInputs,
                              [key]: value ? value : "",
                            }));
                          }}
                        >
                          <FormControlLabel
                            value="Homme"
                            control={<Radio />}
                            label="Homme"
                            style={{ color: "black", padding: "8px" }}
                          />
                          <FormControlLabel
                            value="Femme"
                            control={<Radio />}
                            label="Femme"
                            style={{ color: "black", padding: "8px" }}
                          />
                        </RadioGroup>
                      ) : (
                        <RadioGroup
                          row
                          aria-labelledby="demo-row-radio-buttons-group-label"
                          name="row-radio-buttons-group"
                          style={{ width: "100%", marginTop: "10px" }}
                        >
                          <FormControlLabel
                            value="Homme"
                            control={<Radio />}
                            label="Homme"
                            style={{ color: "black", padding: "8px" }}
                          />
                          <FormControlLabel
                            value="Femme"
                            control={<Radio />}
                            label="Femme"
                            style={{ color: "black", padding: "8px" }}
                          />
                        </RadioGroup>
                      )}
                    </FormControl>
                  ) : key == "role" ? (
                    <Autocomplete
                      style={{
                        background: "white",
                        width: "80%",
                        marginLeft: "8%",
                      }}
                      options={roleArray}
                      getOptionLabel={(option) => option.title}
                      sx={{ width: 150 }}
                      value={
                        inputs.role
                          ? roleArray.find(
                              (option) => option.title === inputs.role
                            )
                          : null
                      }
                      onChange={(event, value) => {
                        setInputs((prevInputs) => ({
                          ...prevInputs,
                          role: value ? value.title : "",
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField {...params} required error={errors.role} />
                      )}
                    />
                  ) : key == "dateNaissance" ? (
                    <TextField
                      defaultValue={value}
                      type="date"
                      style={{
                        width: "45%",
                        marginLeft: "6%",
                        width: "95%",
                        height: "50%",
                      }}
                      onChange={(e) => {
                        setInputs((prevInputs) => ({
                          ...prevInputs,
                          [key]: e.target.value,
                        }));
                      }}
                    />
                  ) : key == "taille" ? (
                    <TextField
                      defaultValue={value}
                      type="number"
                      style={{
                        width: "45%",
                        marginLeft: "6%",
                        width: "95%",
                        height: "50%",
                      }}
                      onChange={(e) => {
                        setInputs((prevInputs) => ({
                          ...prevInputs,
                          [key]: parseInt(e.target.value),
                        }));
                      }}
                    />
                  ) : key == "statut" ? (
                    <Autocomplete
                      style={{
                        background: "white",
                        width: "80%",
                        marginLeft: "8%",
                      }}
                      options={statusArray}
                      getOptionLabel={(option) => option.title}
                      sx={{ width: 150 }}
                      value={
                        inputs.statut
                          ? statusArray.find(
                              (option) => option.title === inputs.statut
                            )
                          : null
                      }
                      onChange={(event, value) => {
                        setInputs((prevInputs) => ({
                          ...prevInputs,
                          statut: value ? value.title : "",
                        }));
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  ) : key == "pupitre" ? (
                    <Autocomplete
                      style={{
                        background: "white",
                        width: "80%",
                        marginLeft: "8%",
                      }}
                      options={pupitreArray}
                      getOptionLabel={(option) => option.title}
                      sx={{ width: 150 }}
                      value={
                        inputs.pupitre
                          ? pupitreArray.find(
                              (option) => option.title === inputs.pupitre
                            )
                          : null
                      }
                      onChange={(event, value) => {
                        setInputs((prevInputs) => ({
                          ...prevInputs,
                          pupitre: value ? value.title : "",
                        }));
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  ) : key == "nom" || key == "prenom" || key == "email" ? (
                    <TextField
                      error={errors[key]}
                      defaultValue={value}
                      type="text"
                      style={{
                        width: "45%",
                        marginLeft: "6%",
                        width: "95%",
                        height: "50%",
                      }}
                      onChange={(e) => {
                        setInputs((prevInputs) => ({
                          ...prevInputs,
                          [key]: e.target.value,
                        }));
                      }}
                    />
                  ) : (
                    <TextField
                      defaultValue={value}
                      type="text"
                      style={{
                        width: "45%",
                        marginLeft: "6%",
                        width: "95%",
                        height: "50%",
                      }}
                      onChange={(e) => {
                        setInputs((prevInputs) => ({
                          ...prevInputs,
                          [key]: e.target.value,
                        }));
                      }}
                    />
                  )}
                </div>
              ))}
          </div>
          <div
            style={{
              marginTop: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              type="submit"
              className="btnPlanning"
              variant="contained"
              style={{
                width: "15%",
                letterSpacing: "2px",
                background: "#696CFF",
                display: "flex",
                justifyContent: "center",
              }}
              onClick={updateCandidateInfos}
            >
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
      <Modal
        className="pop-up"
        open={showPopup}
        onClose={() => setShowPopup(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "background.paper",
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "10px",
          }}
        >
          <Typography id="modal-description" sx={{ mt: 2 }}>
            {"le compte a été modifié avec succès "}
          </Typography>

          <Button
            style={{ letterSpacing: "1px", background: "#696CFF" }}
            className="pop-upBtn"
            onClick={() => {
              navigate("/dashboard/admin/accounts/list");
            }}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            OK
          </Button>
        </Box>
      </Modal>
    </div>
  ) : (
    <div>loading</div>
  );
};

export default AcountInfosEdit;
