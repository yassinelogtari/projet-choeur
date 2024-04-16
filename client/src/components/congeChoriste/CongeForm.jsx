import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const CongeForm = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [raison, setRaison] = useState('');
  const [memberInfo, setMemberInfo] = useState({});
  const [storedToken, setStoredToken] = useState();
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const storedTokenValue = localStorage.getItem("token");
    if (storedTokenValue) {
      setStoredToken(storedTokenValue);
      console.log("stored token ",storedTokenValue)
    }
  }, []);

  const getAuthenticatedUserId = () => {
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      console.log("member id", decodedToken.membreId )

      return decodedToken.membreId;
    } else {
      return null;
    }
  };

  const fetchMemberId = async () => {
    try {
      const membreId = getAuthenticatedUserId();
      if (!membreId) {
        throw new Error("ID du membre non trouvé dans le token.");
      }
      const response = await axios.post(`http://localhost:8000/api/conge`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      });
      const data = response.data;
      console.log("Données récupérées depuis l'API :", data); // Ajout du console.log()
      setMemberInfo(data.member_info);
    
    } catch (error) {
      setError(error.message);
    }
  };


  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    setError('');
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    setError('');
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const today = new Date();
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    if (startDate === '' || endDate === '' || reason === '') {
      setError('Veuillez remplir tous les champs.');
    } else if (startDateObj <= today) {
      setError("La date de début doit être après aujourd'hui.");
    } else if (endDateObj <= startDateObj) {
      setError('La date de fin doit être après la date de début.');
    } else {
      try {
        const membreId = getAuthenticatedUserId();
        if (!membreId) {
          throw new Error('ID du membre non trouvé dans le token.');
        }

        const response = await axios.post(
          'http://localhost:8000/api/conge',
          {
            dateDebut: startDate,
            dateFin: endDate,
            raison: reason,
          },
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        console.log('Réponse du serveur:', response.data);
        setSuccessMessage(response.data.message); // Définir le message de succès

        setStartDate('');
        setEndDate('');
        setReason('');
        setError('');
        
      } catch (error) {
        console.error("Erreur lors de l'envoi de la demande de congé:", error.response.data.error);
        setError(error.response.data.error);
      }
    }
  };


  return (
    <div className="conge-container">
      
       <style>
        {`
          .conge-container {
            border: 2px solid #ccc;
            border-radius: 20px;
            padding: 30px;
            max-width: 500px;
            margin: 0 auto;
            
          }

          h2 {
            text-align: center;
            margin-bottom: 30px;
            color: #23BFCB;
            font-size: 24px;
          }

          form {
            display: flex;
            flex-direction: column;
          }

          .input-group {
            margin-bottom: 25px;
          }

          label {
            font-weight: bold;
            color: #97FA77;
            margin-bottom: 10px;
            font-size: 18px;
          }

          input[type="date"],
          input[type="text"] {
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 10px;
            font-size: 16px;
            outline: none;
            width: 100%;
            transition: border-color 0.3s;
          }

          input[type="date"]:focus,
          input[type="text"]:focus {
            border-color: dodgerblue;
          }

          button {
            background-color: dodgerblue;
            color: white;
            padding: 15px;
            border: none;
            border-radius: 10px;
            font-size: 18px;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          button:hover {
            background-color: #007bff;
          }

          .error-msg {
            color: red;
            margin-top: 5px;
            font-size: 16px;
          }
        `}
      </style>

      <h2>Demande de congé</h2>
     
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Date de début :</label>
          <input type="date" value={startDate} onChange={handleStartDateChange} />
        </div>
        <div className="input-group">
          <label>Date de fin :</label>
          <input type="date" value={endDate} onChange={handleEndDateChange} />
        </div>
        <div className="input-group">
          <label>Raison :</label>
          <input type="text" value={reason} onChange={handleReasonChange} />
        </div>
        <button type="submit">Envoyer</button>
      </form>
      {error && <p className="error-msg">{error}</p>}
      {successMessage && (
        <Alert severity="success">
        <AlertTitle>Success</AlertTitle>
        Votre demande de congé est envoyée avec succès. Veuillez attendre la validation ! 
      </Alert>
      )}
      
    </div>
  );
};

export default CongeForm;
