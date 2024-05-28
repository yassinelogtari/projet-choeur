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

const StatistiquesParChoriste = () => {
  const [members, setMembers] = useState([]);
  const [selectedMember, setselectedMember] = useState("");
  const [memberStats, setMemberStats] = useState({});

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/membre/getAllMembers"
        );
        console.log(response.data.model);
        setMembers(response.data.model);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    const fetchMemberstats = async () => {
      if (selectedMember) {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/statistics/choriste"
          );
          
          const selectedStats = response.data.find(
            (member) => member.member_id === selectedMember
          );
          setMemberStats(selectedStats || {});
        } catch (error) {
          console.error("Error fetching member stats:", error);
        }
      }
    };

    fetchMemberstats();
  }, [selectedMember]);

  const handleChangeMember = (event) => {
    setselectedMember(event.target.value);
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
          value={selectedMember}
          onChange={handleChangeMember}
          displayEmpty
          className="selectForm"
        >
          <MenuItem value="" disabled>
            Sélectionner une membre
          </MenuItem>
          {members.map((member) => (
            <MenuItem key={member._id} value={member._id}>
              {member.prenom} {member.nom}
            </MenuItem>
          ))}
        </Select>
      </div>
      {selectedMember && (
        <Table>
          <TableBody>
            {memberStats && (
              <React.Fragment >
              <TableRow>
                <TableCell>
                    <Card>
                    <CardContent>
                    <span className="titre-card">Nom et prénom du membre</span>
                    <h6 className="text-muted fw-light">{members.find(member => member._id === selectedMember)?.prenom} {members.find(member => member._id === selectedMember)?.nom}</h6>
                    </CardContent>
                    </Card>
                    
                   
                </TableCell>

                <TableCell>
                    <Card>
                            <CardContent>
                            <span className="titre-card">Nombre de présence et d'absence du membre au concert</span>
                            {renderPresenceAbsenceChart(
                                memberStats.presenceInConcert,
                                memberStats.absenceInConcert
                            )}
                            </CardContent>
                    </Card>
                </TableCell>
                <TableCell>
                <Card>
                  <CardContent>
                      <span className="titre-card">Nombre de présence et d'absence du membre aux répétitions du concert</span>
                      {renderBarChart(memberStats)}
                    </CardContent>
                    
                  </Card>
                </TableCell>
                    
                </TableRow>
                <TableRow>
                <TableCell>
                  
                <Card>
                    <CardContent>
                    <h5 className="titre-card">Pourcentage de présences et d'absences du membre au concert</h5>
                      {renderCircularChart(
                        memberStats.presencePercentageInConcert,
                        memberStats.absencePercentageInConcert
                      )}
                    </CardContent>
                  </Card>

                </TableCell>
                <TableCell>
                <Card>
                      <CardContent>
                        <h5 className="titre-card">Pourcentage de présences et d'absences du membre au répétition du concert</h5>
                        {renderCircularChart(
                          memberStats.presencePercentageInRepetitionOfConcert,
                          memberStats.absencePercentageInRepetitionOfConcert
                        )}
                      </CardContent>
                    </Card>
                </TableCell>
                <TableCell> 
                      {memberStats.masteringOeuvreCount && (
                        <Card>
                            <CardContent>
                            <span className="titre-card">Fréquence des œuvres</span>
                            {renderFrequencyChart(memberStats.masteringOeuvreCount)}
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

export default StatistiquesParChoriste; 

