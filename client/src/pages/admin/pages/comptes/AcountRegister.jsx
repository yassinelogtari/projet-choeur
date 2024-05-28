import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Modal,
  Box,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import "./acountRegister.css";

const AccountRegister = () => {
  const [inputs, setInputs] = useState({
    prenom: "",
    nom: "",
    email: "",
    role: "",
    pupitre: "",
  });

  const [errors, setErrors] = useState({
    prenom: null,
    nom: null,
    email: null,
    role: null,
    pupitre: null,
  });

  const [errorsText, setErrorsText] = useState({
    prenom: "",
    nom: "",
    email: "",
    role: "",
    pupitre: "",
  });

  const [openModal, setOpenModal] = useState(false);

  const roleArray = [
    { title: "admin" },
    { title: "manager" },
    { title: "chef du pupitre" },
    { title: "chef de choeur" },
    { title: "choriste" },
  ];

  const pupitreArray = [
    { title: "soprano" },
    { title: "alto" },
    { title: "ténor" },
    { title: "basse" },
  ];

  const handleCreateAccountButton = async () => {
    console.log("clicked");
    const newErrors = {};
    const newErrorsText = {};

    if (inputs.prenom == "") {
      newErrors.prenom = true;
      newErrorsText.prenom = "Ce champ est obligatoire";
    } else {
      newErrors.prenom = false;
      newErrorsText.prenom = "";
    }
    if (inputs.nom == "") {
      newErrors.nom = true;
      newErrorsText.nom = "Ce champ est obligatoire";
    } else {
      newErrors.nom = false;
      newErrorsText.nom = "";
    }

    if (validateEmail(inputs.email) == false) {
      newErrors.email = true;
      newErrorsText.email = "Veuillez entrer un email valide";
    } else {
      newErrors.email = false;
      newErrorsText.email = "";
    }
    if (inputs.role == "") {
      newErrors.role = true;
      newErrorsText.role = "Ce champ est obligatoire";
    } else {
      newErrors.role = false;
      newErrorsText.role = "";
    }
    if (
      (inputs.pupitre == "" && inputs.role == "chef du pupitre") ||
      (inputs.pupitre == "" && inputs.role == "choriste")
    ) {
      newErrors.pupitre = true;
      newErrorsText.pupitre = "Ce champ est obligatoire";
    } else {
      newErrors.pupitre = false;
      newErrorsText.pupitre = "";
    }

    setErrors(newErrors);
    setErrorsText(newErrorsText);

    if (
      newErrors.prenom == false &&
      newErrors.nom == false &&
      newErrors.email == false &&
      newErrors.role == false &&
      newErrors.pupitre == false
    ) {
      console.log(errors);
      try {
        const res = await axios.post(
          "http://localhost:8000/api/membre/register",
          {
            prenom: inputs.prenom,
            nom: inputs.nom,
            email: inputs.email,
            role: inputs.role,
            pupitre: inputs.pupitre,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res) {
          setOpenModal(true);
          console.log(openModal);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  function validateEmail($email) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return reg.test($email);
  }
  return (
    <div style={{ marginTop: "30px" }}>
      <h4 className="audition-title">
        <span class="text-muted fw-light" style={{ color: "#5456FC" }}>
          COMPTE /
        </span>{" "}
        Créer un compte
      </h4>
      <Card className="white-card" style={{ marginTop: "190px" }}>
        <CardContent style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: "100%",
              paddingLeft: "4%",
              marginBottom: "30px",
              marginTop: "20px",
            }}
          >
            <TextField
              value={inputs.prenom}
              error={errors.prenom}
              label="Prenom"
              type="text"
              helperText={errorsText.prenom}
              style={{ width: "45%" }}
              onChange={(e) =>
                setInputs((prevInputs) => ({
                  ...prevInputs,
                  prenom: e.target.value,
                }))
              }
              //   value={candidatsPerHour}
              //   onChange={handleCandidatsPerHourChange}
              //   error={!!formErrors.candidatsPerHour}
              //   helperText={formErrors.candidatsPerHour}
            />
            <TextField
              value={inputs.nom}
              error={errors.nom}
              label="Nom"
              type="text"
              style={{ width: "45%", marginLeft: "6%" }}
              helperText={errorsText.nom}
              onChange={(e) =>
                setInputs((prevInputs) => ({
                  ...prevInputs,
                  nom: e.target.value,
                }))
              }
              //   value={candidatsPerHour}
              //   onChange={handleCandidatsPerHourChange}
              //   error={!!formErrors.candidatsPerHour}
              //   helperText={formErrors.candidatsPerHour}
            />
          </div>
          <div
            style={{ width: "100%", paddingLeft: "4%", marginBottom: "30px" }}
          >
            <TextField
              value={inputs.email}
              error={errors.email}
              label="Email"
              type="text"
              style={{ width: "80%", marginLeft: "8%" }}
              helperText={errorsText.email}
              onChange={(e) =>
                setInputs((prevInputs) => ({
                  ...prevInputs,
                  email: e.target.value,
                }))
              }
              //   value={candidatsPerHour}
              //   onChange={handleCandidatsPerHourChange}
              //   error={!!formErrors.candidatsPerHour}
              //   helperText={formErrors.candidatsPerHour}
            />
          </div>
          {inputs.role == "chef du pupitre" || inputs.role == "choriste" ? (
            <div
              style={{
                width: "100%",
                paddingLeft: "4%",
                marginBottom: "30px",
                display: "flex",
              }}
            >
              <Autocomplete
                style={{ background: "white", width: "45%" }}
                options={roleArray}
                getOptionLabel={(option) => option.title}
                sx={{ width: 150 }}
                value={
                  inputs.role
                    ? roleArray.find((option) => option.title === inputs.role)
                    : null
                }
                onChange={(event, value) => {
                  setInputs((prevInputs) => ({
                    ...prevInputs,
                    role: value ? value.title : "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Role"
                    error={errors.role}
                    helperText={errorsText.role}
                  />
                )}
              />
              <Autocomplete
                style={{ background: "white", width: "45%", marginLeft: "6%" }}
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
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Pupitre"
                    error={errors.pupitre}
                    helperText={errorsText.pupitre}
                  />
                )}
              />
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                paddingLeft: "4%",
                marginBottom: "30px",
                display: "flex",
              }}
            >
              <Autocomplete
                style={{ background: "white", width: "80%", marginLeft: "8%" }}
                options={roleArray}
                getOptionLabel={(option) => option.title}
                sx={{ width: 150 }}
                value={
                  inputs.role
                    ? roleArray.find((option) => option.title === inputs.role)
                    : null
                }
                onChange={(event, value) => {
                  setInputs((prevInputs) => ({
                    ...prevInputs,
                    role: value ? value.title : "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Role"
                    error={errors.role}
                    helperText={errorsText.role}
                  />
                )}
              />
            </div>
          )}
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              type="submit"
              className="btnPlanning"
              variant="contained"
              style={{
                width: "25%",
                letterSpacing: "2px",
                background: "#696CFF",
              }}
              onClick={handleCreateAccountButton}
            >
              Créer le compte
            </Button>
          </div>
        </CardContent>
      </Card>
      <Modal
        className="pop-up"
        open={openModal}
        onClose={() => setOpenModal(false)}
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
            {"le compte a été créé avec succès "}
          </Typography>

          <Button
            style={{ letterSpacing: "1px", background: "#696CFF" }}
            className="pop-upBtn"
            onClick={() => {
              setInputs({
                prenom: "",
                nom: "",
                email: "",
                role: "",
                pupitre: "",
              });
              setOpenModal(false);
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
  );
};

export default AccountRegister;
