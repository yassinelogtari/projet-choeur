import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Typography, Container, Grid, Card, CardContent, Button,TableCell, Paper,TableContainer,TableBody,Table,TableHead ,TableRow, Dialog, DialogContent} from '@mui/material';
import { FcBusinessContact, FcContacts, FcDiploma2, FcMusic } from "react-icons/fc";
import { useParams } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const HistoriqueActivite = ({id}) => {
  //const { id } = useParams();
  const [historique, setHistorique] = useState([]);
  const [filtre, setFiltre] = useState('');
  const [nbRepetitions, setNbRepetitions] = useState(0);
  const [nbConcerts, setNbConcerts] = useState(0);
  const [filteredHistorique, setFilteredHistorique] = useState([]);
  const [memberInfo, setMemberInfo] = useState({});
  const [error, setError] = useState(null);
  const [storedToken, setStoredToken] = useState();
  const [qrCode, setQrCode] = useState('');
  const [openPopup, setOpenPopup] = useState(false);

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
      const response = await axios.get(`http://localhost:8000/api/profile/history/${membreId}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      });
      const data = response.data;
      console.log("Données récupérées depuis l'API :", data); // Ajout du console.log()
      setMemberInfo(data.member_info);
      setHistorique(data.concerts);
      setNbRepetitions(data.number_of_repetition);
      setNbConcerts(data.number_of_concerts);
      setFilteredHistorique(data.concerts);
    } catch (error) {
      setError(error.message);
    }
  };
  
  useEffect(() => {
    fetchMemberId();
  }, [storedToken]); 

  useEffect(() => {
    fetchMemberId();
  }, []);

  const handleChangeFiltre = (event) => {
    setFiltre(event.target.value);
  };

  const handleFilterClick = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/profile/history/${id}?oeuvre=${filtre}`, {
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      });
      const data = response.data;
      setHistorique(data.concerts);
      setNbRepetitions(data.number_of_repetition);
      setNbConcerts(data.number_of_concerts);
      setFilteredHistorique(data.concerts);
    } catch (error) {
      setError(error.message);
    }
  };
  const showQR = (qrCode) => {
    
    setQrCode(qrCode);
    setOpenPopup(true); 
  };
  

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={14}>
          <Typography variant="h4" gutterBottom>
            Historique de l'activité
          </Typography>
        </Grid>
        <Grid item xs={12} md={3}>
        <Card variant="outlined" sx={{ borderRadius: '15px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <FcMusic />
                Nombre de Répétitions
              </Typography>
              <Typography variant="h3" color="primary" sx={{ borderRadius: '10px', padding: '10px', backgroundColor: '#f0f0f0' }}>
                {nbRepetitions}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
        <Card variant="outlined" sx={{ borderRadius: '15px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
              <FcMusic />
                Nombre de Concerts
              </Typography>
              <Typography variant="h3" color="primary" sx={{ borderRadius: '10px', padding: '10px', backgroundColor: '#f0f0f0' }}>
                {nbConcerts}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ borderRadius: '15px' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informations du membre
              </Typography>
              <Typography variant="body1" gutterBottom >
              <FcBusinessContact style={iconStyle} />
                <strong >Nom:</strong> {memberInfo.nom}
              </Typography>
              <Typography variant="body1" gutterBottom>
              <FcContacts style={iconStyle} />
                <strong>Prénom:</strong> {memberInfo.prenom}
              </Typography>
              <Typography variant="body1" gutterBottom>
              <FcDiploma2 style={iconStyle} />
                <strong>Historique du statut:</strong>
              </Typography>
              <ul>
              

                {memberInfo.historiqueStatut && Array.isArray(memberInfo.historiqueStatut) && memberInfo.historiqueStatut.map((statut, index) => (
                  <li key={index}>{statut}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Liste des concerts
          </Typography>
          <Paper style={{ maxHeight: '230px', overflow: 'auto' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Titre</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Lieu</TableCell>
                    <TableCell>Affiche</TableCell>
                    <TableCell>Programme</TableCell>
                    <TableCell>QR Code</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHistorique.map((concert, index) => (
                    <TableRow key={index}>
                      <TableCell>{concert.titre !== null ? concert.titre : "Titre indisponible"}</TableCell>
                      <TableCell>{concert.date}</TableCell>
                      <TableCell>{concert.lieu}</TableCell>
                      <TableCell><img src={concert.affiche} alt="Affiche du concert" /></TableCell>
                      <TableCell>
                        {concert.programme.map((item, itemIndex) => (
                          <div key={itemIndex}>
                            <p><strong>Oeuvre:</strong> {item.oeuvre.titre}</p>
                            <p><strong>Theme:</strong> {item.oeuvre.theme}</p>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                      <Button onClick={() => showQR(concert.QrCode)}>Afficher QR Code</Button>

                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          <Dialog open={openPopup} onClose={handleClosePopup}>
            <DialogContent>
            <img src={qrCode} alt="QR Code" />
            </DialogContent>
          </Dialog>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HistoriqueActivite;

const iconStyle = {
  marginRight: '10px',
  fontSize: "25px",
};