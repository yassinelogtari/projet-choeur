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

const StatistiquesParOeuvre = () => {
  const [oeuvres, setOeuvres] = useState([]);
  const [selectedOeuvre, setSelectedOeuvre] = useState("");
  const [oeuvreStats, setOeuvreStats] = useState({});

  useEffect(() => {
    const fetchOeuvres = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/oeuvre/getAll"
        );
        console.log(response.data.data)
        setOeuvres(response.data.data);
      } catch (error) {
        console.error("Error fetching oeuvres:", error);
      }
    };

    fetchOeuvres();
  }, []);

  useEffect(() => {
    const fetchOeuvreStats = async () => {
      if (selectedOeuvre) {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/statistics/oeuvre"
          );
          
          const selectedStats = response.data.find(
            (oeuvre) => oeuvre.titre === selectedOeuvre
          );
          setOeuvreStats(selectedStats || {});
        } catch (error) {
          console.error("Error fetching oeuvre stats:", error);
        }
      }
    };

    fetchOeuvreStats();
  }, [selectedOeuvre]);

  const handleChangeOeuvre = (event) => {
    setSelectedOeuvre(event.target.value);
  };
  const renderBarChart = (data) => {
    
    const chartData = {
      labels: ["Nombre de présents", "Nombre d'absents"],
      datasets: [
        {
          data: [data.presenceInRepetitionOfConcert, data.presenceInRepetitionOfConcert],
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
          value={selectedOeuvre}
          onChange={handleChangeOeuvre}
          displayEmpty
          className="selectForm"
        >
          <MenuItem value="" disabled>
            Sélectionner une oeuvre
          </MenuItem>
          {oeuvres.map((oeuvre) => (
            <MenuItem key={oeuvre.titre} value={oeuvre.titre}>
              {oeuvre.titre}
            </MenuItem>
          ))}
        </Select>
      </div>
      {selectedOeuvre && (
        <Table>
          <TableBody>
            {oeuvreStats && (
              <React.Fragment >
              <TableRow>
                <TableCell>
                    <Card>
                    <CardContent>
                    <span className="titre-card">Nom d'oeuvre</span>
                    <h6 className="text-muted fw-light">{oeuvreStats.titre}</h6>
                    </CardContent>
                    </Card>
                    <Card>
                        <CardContent>
                        <span className="titre-card">Fréquence de l'œuvre</span>
                        <h6 className="text-muted fw-light">{oeuvreStats.masteringCount}</h6>
                        </CardContent>
                    </Card>
                </TableCell>

                <TableCell>
                    <Card>
                            <CardContent>
                            <span className="titre-card">Nombre de présence et d'absence de l'oeuvre au concert</span>
                            {renderPresenceAbsenceChart(
                                oeuvreStats.presenceInConcert,
                                oeuvreStats.absenceInConcert
                            )}
                            </CardContent>
                    </Card>
                </TableCell>
                <TableCell>
                <Card>
                  <CardContent>
                      <span className="titre-card">Nombre de présence et d'absence de l'oeuvre aux répétitions du concert</span>
                      {renderBarChart(oeuvreStats)}
                    </CardContent>
                    
                  </Card>
                </TableCell>
                    
                </TableRow>
                <TableRow>
                <TableCell>
                  
                <Card>
                    <CardContent>
                    <h5 className="titre-card">Pourcentage de présences et d'absences de l'oeuvre au concert</h5>
                      {renderCircularChart(
                        oeuvreStats.presencePercentageInConcert,
                        oeuvreStats.absencePercentageInConcert
                      )}
                    </CardContent>
                  </Card>

                </TableCell>
                <TableCell>
                <Card>
                      <CardContent>
                        <h5 className="titre-card">Pourcentage de présences et d'absences de l'oeuvre au répétition du concert</h5>
                        {renderCircularChart(
                          oeuvreStats.presencePercentageInRepetitionOfConcert,
                          oeuvreStats.absencePercentageInRepetitionOfConcert
                        )}
                      </CardContent>
                    </Card>
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

export default StatistiquesParOeuvre; 
