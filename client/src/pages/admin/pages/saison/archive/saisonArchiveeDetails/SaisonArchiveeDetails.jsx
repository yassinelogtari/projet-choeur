import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, useParams } from 'react-router-dom';
import MembresTable from './tablesData/MembresTable';
import ConcertsTable from './tablesData/ConcertsTable';
import OeuvresTable from './tablesData/OeuvresTable';
import "./saisonArchiveeDetails.css"
import RepetitionsTable from './tablesData/RepetitionsTable';
import {Button} from 'antd';
import CandidatsTable from './tablesData/CandidatsTable';
import AuditionsTable from './tablesData/AuditionsTable';

function SaisonArchiveeDetails() {
  const [season, setSeason] = useState(null);
  const [loading, setLoading] = useState(true);
  const [membres , setMembres] = useState([]);
  const [concerts , setConcerts] = useState([]);
  const [oeuvres , setOeuvres] = useState([]);
  const [repetitions , setRepetitions] = useState([]);
  const [candidats , setCandidats] = useState([]);
  const [auditions , setAuditions] = useState([]);
  
  const params= useParams();
  const id_SA= params.idSA;
  console.log("id de params : " , id_SA)

  useEffect(() => {
    const fetchSaison = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/saison/getSaison/${id_SA}`);
        setSeason(response.data.saison);
        setMembres(response.data.saison.membres);
        setConcerts(response.data.saison.concerts);
        setOeuvres(response.data.saison.oeuvres);
        setRepetitions(response.data.saison.repetitions);
        setCandidats(response.data.saison.candidats);
        setAuditions(response.data.saison.auditions);
        setLoading(false);
        console.log("je suis ici")
        console.log("la saison archivéé :" , response.data.saison)
        console.log("Détails de membres :", response.data.saison.membres);
        console.log("Détails de concerts :", response.data.saison.concerts);
        console.log("Détails de oeuvres :", response.data.saison.oeuvres);
        console.log("Détails de repetitions :", response.data.saison.repetitions);
        console.log("Détails de candidats :", response.data.saison.candidats);
        console.log("Détails de auditions :", response.data.saison.auditions);
      } catch (error) {
        console.error("Erreur lors de la récupération de la saison archivée:", error);
      }
    };

    fetchSaison();
  }, [id_SA]);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  if (loading) {
    return <div className='loading'>Chargement...</div>;
  }

  return (
    <div>
       <div className='titleArchive'>
        <h4 className='nomSaison'>Archive {season.nom}</h4>
        <span className='dateSaison'>{formatDate(season.dateDebut)} / {formatDate(season.dateFin)}</span>
      </div>
      
    <div className='contenuArchive'>
      <div >
      <hr></hr>
      <p className='tt'>Les Membres de la {season.nom}</p>
      <hr></hr>
      </div>
      <MembresTable membres={membres} />

      <div >
      <hr></hr>
      <p className='tt'>Les Concerts de la {season.nom}</p>
      <hr></hr>
      </div>
      <ConcertsTable concerts={concerts} />


      <div >
      <hr></hr>
      <p className='tt'>Les Oeuvres de la {season.nom}</p>
      <hr></hr>
      </div>
      <OeuvresTable oeuvres={oeuvres} />

      <div >
      <hr></hr>
      <p className='tt'>Les Candidats de la {season.nom}</p>
      <hr></hr>
      </div>
      <CandidatsTable candidats={candidats} />

      <div >
      <hr></hr>
      <p className='tt'>Les Auditions de la {season.nom}</p>
      <hr></hr>
      </div>
      <AuditionsTable auditions={auditions} />

      <div >
      <hr></hr>
      <p className='tt'>Les Repetitions de la {season.nom}</p>
      <hr></hr>
      </div>
      <RepetitionsTable repetitions={repetitions} />
      </div>
      
           <NavLink to={"/dashboard/admin/archive"} >
           <Button className='btn-return' type="primary">
            Retour
          </Button>
          </NavLink>

  </div>
  );
}

export default SaisonArchiveeDetails;
