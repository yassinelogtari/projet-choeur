import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Typography, Container, Grid, Card, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { FcTodoList } from 'react-icons/fc';

const HistoriqueActivite = ({ memberId }) => {
  const [historique, setHistorique] = useState([]);
  const [filtre, setFiltre] = useState('');
  const [nbRepetitions, setNbRepetitions] = useState(0);
  const [nbConcerts, setNbConcerts] = useState(0);
  const [filteredHistorique, setFilteredHistorique] = useState([]);
  const [notifications, setNotifications] = useState([]);
  let { id } = useParams(); // Récupérer l'ID de l'URL


  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!memberId) return; // Check if memberId is defined
        const response = await axios.get(`/api/history/${memberId}?oeuvre=${filtre}`);
        const data = response.data;
        setHistorique(data.concerts);
        setNbRepetitions(data.number_of_repetition);
        setNbConcerts(data.number_of_concerts);
        setFilteredHistorique(data.concerts);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'historique :', error);
      }
    };

    fetchHistory();
  }, [memberId, filtre]);

  // Simulated notification fetching
  useEffect(() => {
    // Fetch notifications here
    const fetchNotifications = async () => {
      try {
        // Example: fetching notifications
        const response = await axios.get('/api/notifications');
        const data = response.data;
        setNotifications(data.notifications);
      } catch (error) {
        console.error('Erreur lors de la récupération des notifications :', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleChangeFiltre = (event) => {
    setFiltre(event.target.value);
  };

  const handleFilterClick = async () => {
    try {
      const response = await axios.get(`/api/history/${memberId}?oeuvre=${filtre}`);
      const data = response.data;
      setHistorique(data.concerts);
      setNbRepetitions(data.number_of_repetition);
      setNbConcerts(data.number_of_concerts);
      setFilteredHistorique(data.concerts);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique :', error);
    }
  };

  return (
    <Container>
      <Grid container spacing={2} >
        <Grid item xs={12} md={8} >
          <Typography variant="h4" gutterBottom>
            Historique de l'activité
          </Typography>
          <Card variant="outlined" style={{borderRadius: '15px'}}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Nombre de Répétitions
              </Typography>
              <Typography variant="h3" color="primary" sx={{ borderRadius: '10px', padding: '10px', backgroundColor: '#f0f0f0' }}>
  {nbRepetitions}
</Typography>
              <Typography variant="h6" gutterBottom>
                Nombre de Concerts
              </Typography>
              <Typography variant="h3" color="primary" sx={{ borderRadius: '10px', padding: '10px', backgroundColor: '#f0f0f0' }}>
  {nbConcerts}
</Typography> 
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} style={{marginTop: "7%"}}>
  <Card variant="outlined" sx={{ borderRadius: '10px', maxHeight: '300px', overflowY: 'auto' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
      <FcTodoList /> Notifications 

      </Typography>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>
            <Typography variant="body1">{notification.content}</Typography>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
</Grid>
        <Grid item xs={12}>
          <TextField
            label="Filtrer par nom d'œuvre"
            variant="outlined"
            fullWidth
            value={filtre}
            onChange={handleChangeFiltre}
          />
          <Button 
            variant="contained"
            onClick={handleFilterClick}
            sx={{
              borderRadius: '20px', 
              backgroundColor: 'seagreen', 
              '&:hover': {
                backgroundColor: 'lightgreen',
              },
              marginTop: '10px'
            }}
          >
            Filtrer
          </Button>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom de l'œuvre</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Nom du concert</TableCell>
                  <TableCell>Membres du concert</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHistorique.map((concert, index) => (
                  <TableRow key={index}>
                    <TableCell>{concert.oeuvre.nom}</TableCell>
                    <TableCell>{concert.date}</TableCell>
                    <TableCell>{concert.nom}</TableCell>
                    <TableCell>
                      <ul>
                        {concert.listeMembres.map((membre, index) => (
                          <li key={index}>{membre.nom}</li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HistoriqueActivite;
