import React, { useState } from 'react';
import { GiPerson } from 'react-icons/gi';
import { Transition } from 'react-transition-group';

import { FcBusinessContact,FcApproval,FcCallback ,FcCalendar,FcRuler,FcContacts,FcAddressBook,FcGlobe,FcReadingEbook} from "react-icons/fc";


const CandidatureFormulaire = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: '',
    taille: ''
  });
  const [formData2, setFormData2] = useState({
    email: '',
    telephone: '',
    nationalite: '',
    activite: false,
    situation: ''
  });
  const [errors, setErrors] = useState({});
  const [showPart2, setShowPart2] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
  };


  const validateForm = () => {
    const errors = {};
    let regexNom = /^[a-zA-Z ]+$/;

    if (!formData.nom) {
      errors.nom = "Veuillez saisir votre nom.";
    }else if (!regexNom.test(formData.nom)){
        errors.nom="Nom invalide"

    }
    if (!formData.prenom) {
      errors.prenom = "Veuillez saisir votre prénom.";
    }else if (!regexNom.test(formData.prenom)){
        errors.prenom="Prénom invalide"

    }
    if (!formData.dateNaissance) {
      errors.dateNaissance = "Veuillez sélectionner votre date de naissance.";
    }
    if (!formData.sexe) {
      errors.sexe = "Veuillez sélectionner votre sexe.";
    }
    if (!formData.taille) {
      errors.taille = "Veuillez saisir votre taille.";
    } else if (formData.taille>2.4 || formData.taille<1){
        errors.nom="Taille invalide"

    }
    setErrors(errors);
    if (Object.keys(errors).length === 0) {
      setShowPart2(true);
    }
  };

  const validateForm2 = () => {
    const errors = {};
    let regexNationalite = /^[a-zA-Z ]+$/;
    let regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
    if (!formData2.email) {
      errors.email = "Veuillez saisir votre E-mail";
    } else if (!String(formData2.email).toLowerCase().match(regexEmail)) {
      errors.email = "E-mail invalide";
    }
  
    if (!formData2.telephone) {
      errors.telephone = "Veuillez saisir votre téléphone.";
    } else if (isNaN(formData2.telephone) || formData2.telephone < 10000000 || formData2.telephone > 99999999) {
      errors.telephone = "Téléphone invalide.";
    }
  
    if (!formData2.nationalite) {
      errors.nationalite = "Veuillez saisir votre nationalité";
    } else if (!regexNationalite.test(formData2.nationalite)) {
      errors.nationalite = "Nationalité invalide.";
    }
  
    if (!formData2.activite) {
      errors.activite = "Veuillez saisir votre activité";
    } else if (!regexNationalite.test(formData2.activite)) {
      errors.activite = "Activité invalide.";
    }
  
    if (!formData2.situation) {
      errors.situation = "Veuillez choisir votre situation.";
    }
  
    setErrors(errors);
  
    if (Object.keys(errors).length === 0) {
      console.log(formData2);
    }
    if (Object.keys(errors).length === 0) {
        setSuccess(true);
      }
  };
  
  

  const handleChange2 = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData2({
      ...formData2,
      [name]: val
    });
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };
  
  
  
  

  return (
    <div style={{ 
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#ffffff',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <h2 style={{ 
        textAlign: 'center',
        fontSize: '24px',
        marginBottom: '20px',
      }}>Formulaire de Candidature</h2>
      <Transition in={!showPart2} timeout={500} mountOnEnter unmountOnExit>
        {state => (
          <div style={{ ...defaultStyle, ...transitionStyles[state] }}>
            <form>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={inputContainerStyle}>
                  <FcContacts style={iconStyle} />
                  <input
                    style={inputStyle}
                    type="text"
                    id="nom"
                    name="nom"
                    placeholder="Nom"
                    value={formData.nom}
                    onChange={handleChange}
                  />
                </div>
                {errors.nom && <span style={errorStyle}>{errors.nom}</span>}

                <div style={inputContainerStyle}>
                  <FcBusinessContact style={iconStyle} />
                  <input
                    style={inputStyle}
                    type="text"
                    id="prenom"
                    name="prenom"
                    placeholder="Prénom"
                    value={formData.prenom}
                    onChange={handleChange}
                  />
                </div>
                {errors.prenom && <span style={errorStyle}>{errors.prenom}</span>}

                <div style={inputContainerStyle}>
                  <FcCalendar style={iconStyle} />
                  <input
                    style={inputStyle}
                    type="date"
                    id="dateNaissance"
                    name="dateNaissance"
                    placeholder="Date de Naissance"
                    value={formData.dateNaissance}
                    onChange={handleChange}
                  />
                </div>
                {errors.dateNaissance && <span style={errorStyle}>{errors.dateNaissance}</span>}

                <div style={inputContainerStyle}>
                  <GiPerson style={iconStyle} />
                  <select
                    style={inputStyle}
                    id="sexe"
                    name="sexe"
                    value={formData.sexe}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez le sexe</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                  </select>
                </div>
                {errors.sexe && <span style={errorStyle}>{errors.sexe}</span>}

                <div style={inputContainerStyle}>
                  <FcRuler style={iconStyle} />
                  <input
                    style={inputStyle}
                    type="number"
                    id="taille"
                    name="taille"
                    placeholder="Taille (cm)"
                    value={formData.taille}
                    onChange={handleChange}
                  />
                </div>
                {errors.taille && <span style={errorStyle}>{errors.taille}</span>}

                <button style={{ 
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#007bff',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }} type="button" onClick={validateForm}>Suivant</button>
              </div>
            </form>
          </div>
        )}
      </Transition>

      <Transition in={showPart2} timeout={500} mountOnEnter unmountOnExit>
        {state => (
          <div style={{ ...defaultStyle, ...transitionStyles[state] }}>
            <form>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={inputContainerStyle}>
                  <FcAddressBook style={iconStyle} />
                  <input
                    style={inputStyle}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData2.email}
                    onChange={handleChange2}
                  />

                </div>
                {errors.email && <span style={errorStyle}>{errors.email}</span>}


                <div style={inputContainerStyle}>
                  <FcCallback style={iconStyle} />
                  <input
                    style={inputStyle}
                    type="tel"
                    id="telephone"
                    name="telephone"
                    placeholder="Téléphone"
                    value={formData2.telephone}
                    onChange={handleChange2}
                  />

                </div>
                {errors.telephone && <span style={errorStyle}>{errors.telephone}</span>}



                <div style={inputContainerStyle}>
                <FcGlobe style={iconStyle} />

                  <input
                    style={inputStyle}
                    type="text"
                    id="nationalite"
                    name="nationalite"
                    placeholder="Nationalité"
                    value={formData2.nationalite}
                    onChange={handleChange2}
                  />
                </div>
                {errors.nationalite && <span style={errorStyle}>{errors.nationalite}</span>}


                <div style={inputContainerStyle}>
                <FcReadingEbook style={iconStyle} />

                  <input
                    style={inputStyle}
                    type="text"
                    id="activite"
                    name="activite"
                    placeholder="Acivité"
                    checked={formData2.activite}
                    onChange={handleChange2}
                  />
                </div>
                {errors.activite && <span style={errorStyle}>{errors.activite}</span>}


                <div style={inputContainerStyle}>
                  <GiPerson style={iconStyle} />
                  <select
                    style={inputStyle}
                    id="situation"
                    name="situation"
                    value={formData2.situation}
                    onChange={handleChange2}
                  >
                    <option value="">Sélectionnez votre situation</option>
                    <option value="marié">Marié(e)</option>
                    <option value="Celibataire">Célibataire</option>
                  </select>
                </div>
                {errors.situation && <span style={errorStyle}>{errors.situation}</span>}


                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    style={{ 
                      width: '48%',
                      padding: '10px',
                      backgroundColor: '#007bff',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                    type="button"
                    onClick={() => setShowPart2(false)}
                  >
                    Retour
                  </button>
                  <button
                    style={{ 
                      width: '48%',
                      padding: '10px',
                      backgroundColor: '#007bff',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                    type="button"
                    onClick={validateForm2}
                  >
                    Valider
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </Transition>
      <Transition in={success} timeout={500} mountOnEnter unmountOnExit>
  {state => (
    <div className="success-message" style={{ ...defaultStyle, ...transitionStyles[state] }}>
      <p style={succesMessage}>Votre candidature a été envoyée avec succès! <FcApproval /></p>
      

    </div>
  )}
</Transition>

    </div>
  );
};

const inputContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px',
};
const succesMessage={
    backgroundColor: '#4caf50',
    color: 'white',
    padding: '20px' ,
    borderRadius: '5px' ,
    marginTop: '20px',
    textAlign: 'center',
}
const iconStyle = {
  marginRight: '10px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  border: '1px solid #cccccc',
  borderRadius: '5px',
  boxSizing: 'border-box',
};

const errorStyle = {
  color: 'red',
  fontSize: '14px',
};

const defaultStyle = {
  transition: 'opacity 0.5s ease-out',
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 1 },
  entered:  { opacity: 1 },
  exiting:  { opacity: 0 },
  exited:  { opacity: 0 },
};

export default CandidatureFormulaire;
