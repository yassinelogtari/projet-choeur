import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import 'chart.js/auto';
import { Bar } from "react-chartjs-2";

import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableRow,
  TableCell,
  MenuItem,
  Select,
  InputLabel
} from "@mui/material";

const StatistiquesParConcert = () => {
  const [concerts, setConcerts] = useState([]);
  const [selectedConcert, setSelectedConcert] = useState("");
  const [concertStats, setConcertStats] = useState({});

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/concerts/get-concerts"
        );
        setConcerts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching concerts:", error);
      }
    };

    fetchConcerts();
  }, []);

  useEffect(() => {
    const fetchConcertStats = async () => {
      if (selectedConcert) {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/statistics/concert"
          );
          
          const selectedStats = response.data.find(
            (concert) => concert.titre === selectedConcert
          );
          setConcertStats(selectedStats || {});
        } catch (error) {
          console.error("Error fetching concert stats:", error);
        }
      }
    };

    fetchConcertStats();
  }, [selectedConcert]);

  const handleChangeConcert = (event) => {
    setSelectedConcert(event.target.value);
  };
  const renderBarChart = (data) => {
    
    const chartData = {
      labels: ["Nombre de présents", "Nombre d'absents"],
      datasets: [
        {
          data: [data.presenceInRepetitionOfConcert, data.absenceInRepetitionOfConcert],
          backgroundColor: [
            "#275670", 
            "#A9DACC"
            
          ],
          borderWidth: 1,
          label: '',
          
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1, 
          precision: 0, 
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    return <Bar data={chartData} options={options} />;
  };
  const renderFrequencyChart = (masteringOeuvreCount) => {
    const oeuvresLabels = Object.keys(masteringOeuvreCount);
    const oeuvresCounts = Object.values(masteringOeuvreCount);
  
    const chartData = {
      labels: oeuvresLabels,
      datasets: [
        {
          label: 'Fréquence des œuvres',
          data: oeuvresCounts,
          backgroundColor: '#275670',
          borderWidth: 1,
        },
      ],
    };
  
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1,
          precision: 0,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  
    return <Bar data={chartData} options={options} />;
  };
  const renderPresenceAbsenceChart = (presenceInConcert, absenceInConcert) => {
    const chartData = {
      labels: ["Nombre de présents", "Nombre d'absents"],
      datasets: [
        {
          data: [presenceInConcert, absenceInConcert],
          backgroundColor: ['#275670', '#A9DACC'],
          borderWidth: 1,
        },
      ],
    };
  
    const options = {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1,
          precision: 0,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };
  
    return <Bar data={chartData} options={options} />;
  };


  const renderCircularChart = (pourcentagePresence, pourcentageAbsence) => {
    const chartData = {
      labels: ["Présence", "Absence"],
      datasets: [
        {
          data: [pourcentagePresence, pourcentageAbsence],
          backgroundColor: ["#275670", "#A9DACC"],
        },
      ],
    };

    return <Pie data={chartData} />;
  };

  return (
    <div>
        <div className="formSelect">
      <Select
        value={selectedConcert}
        onChange={handleChangeConcert}
        displayEmpty
        className="selectForm"
      >
        <MenuItem value="" disabled>
          Sélectionner un concert
        </MenuItem>
        {concerts.map((concert) => (
          <MenuItem key={concert.titre} value={concert.titre}>
            {concert.titre}
          </MenuItem>
        ))}
      </Select>
      </div>
      {selectedConcert && (
        <Table>
          <TableBody>
            {concertStats && (
              <React.Fragment >
              <TableRow>
                <TableCell>
                    <Card>
                    <CardContent>
                    <span className="titre-card">Nom du concert</span>
                    <h6 className="text-muted fw-light">{concertStats.titre}</h6>
                    </CardContent>
                    </Card>
                </TableCell>

                <TableCell>
                    <Card>
                        <CardContent>
                        <span className="titre-card">Nombre de membres présents et absents au concert</span>
                        {renderPresenceAbsenceChart(
                            concertStats.presenceInConcert,
                            concertStats.absenceInConcert
                        )}
                        </CardContent>
                    </Card>
                </TableCell>
                <TableCell>
                <Card>
                  <CardContent>
                      <span className="titre-card">Nombre de membres présents et absents aux répétitions du concert</span>
                      {renderBarChart(concertStats)}
                    </CardContent>
                    
                  </Card>
                </TableCell>
                    
                </TableRow>
                <TableRow>
                <TableCell>
                  
                  <Card>
                    <CardContent>
                    <h5 className="titre-card">Pourcentage de présences et d'absences au concert</h5>
                      {renderCircularChart(
                        concertStats.presencePercentageInConcert,
                        concertStats.absencePercentageInConcert
                      )}
                    </CardContent>
                  </Card>

                </TableCell>
                <TableCell>
                <Card>
                      <CardContent>
                        <h5 className="titre-card">Pourcentage de présences et d'absences au répétition du concert</h5>
                        {renderCircularChart(
                          concertStats.presencePercentageInRepetitionOfConcert,
                          concertStats.absencePercentageInRepetitionOfConcert
                        )}
                      </CardContent>
                    </Card>
                </TableCell>
                <TableCell> 
                      {concertStats.masteringOeuvreCount && (
                        <Card>
                            <CardContent>
                            <span className="titre-card">Fréquence des œuvres</span>
                            {renderFrequencyChart(concertStats.masteringOeuvreCount)}
                            </CardContent>
                        </Card>
                        )}  
                </TableCell>
                </TableRow>
              
            </React.Fragment>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default StatistiquesParConcert; 











