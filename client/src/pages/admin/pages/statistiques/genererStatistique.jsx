import React, { useState, useEffect } from "react";
import {
  Card,
  Tabs,
  Tab,
  CardContent,

} from "@mui/material";
import  "./genererStatistique.css"
import StatistiquesParConcert from "./statistiquesParConcert";
import StatistiquesParOeuvre from "./statistiquesParOeuvre";
import StatistiquesParChoriste from "./statistiquesParChoriste";

const GenererStatistique = () => {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <h4 className="stat-title">
        <span class="text-muted fw-light">STATISTIQUES /</span> Générer des statistiques
      </h4>
      <Card className="Card-white-stat">
        <CardContent>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Par concert" />
            <Tab label="Par oeuvre" />
            <Tab label="Par choriste" />
          </Tabs>
          {tabValue === 0 && (<StatistiquesParConcert/>)}
          {tabValue === 1 && (<StatistiquesParOeuvre/>)}
          {tabValue === 2 && (<StatistiquesParChoriste/>)}

        </CardContent>
      </Card>
      
    </div>
  );
};

export default GenererStatistique;
