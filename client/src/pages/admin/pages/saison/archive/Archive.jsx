import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"; // Importer NavLink depuis react-router-dom
import CardSaison from "../../../../../components/formSaison/CardSaison";
import axios from "axios";
import "./archive.css";

const Archive = () => {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/saison/SaisonArchivee"
        );
        setSeasons(response.data.saisonsArchivees);
        setLoading(false); 
        console.log("liste des saisons : ", response.data.saisonsArchivees);
      } catch (error) {
        console.error("Erreur lors de la récupération des saisons:", error);
      }
    };

    fetchSeasons();
  }, []);


  return (
    <div
      className="position-absolute top-50 start-50 translate-middle"
      style={{ width: "60vw" , marginLeft : "100px" , marginTop: "125px" }}
    >
      {loading ? (
        <p className="loading">Loading...</p> 
      ) : (
        <div className="seasons-list">
          {seasons.map((season) => (
            <NavLink to={`/saison/archive/details-saisonArchivee/${season._id}`} key={season._id}> 
              <CardSaison seasonName={season.nom} />
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default Archive;
