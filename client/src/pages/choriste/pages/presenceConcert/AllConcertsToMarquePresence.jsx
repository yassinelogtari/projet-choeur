import React, { useEffect, useState } from 'react'
/*import axios from "axios";
import RepetitionsChoristeTable from './RepetitionsChoristeTable';
import { jwtDecode } from "jwt-decode";*/

function AllConcertsToMarquePresence() {
       
    /*const [repetitions, setRepetitions] = useState([]);
    const [storedToken, setStoredToken] = useState();

    useEffect(() => {
        const storedTokenValue = localStorage.getItem("token");
        if (storedTokenValue) {
          setStoredToken(storedTokenValue);
        }
      }, []);
      
      const getAuthenticatedUserId = () => {
        if (storedToken) {
          const decodedToken = jwtDecode(storedToken);
          console.log("decodedToken : " , decodedToken)
          return decodedToken.membreId;
        } else {
          return null;
        }
      };
      
      const filteredRepetitions = (repetitions, membreId) => {
        return repetitions.filter(repetition =>
          repetition.membres.some(member => member.member === membreId)
        );
      };
      
      const membreId  = getAuthenticatedUserId()

   useEffect(() => {
    const fetchSeason = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/saison/getSaisonActuelle");
        const saisonData = response.data.saison;
        const filtered = filteredRepetitions(saisonData.repetitions, membreId);
        setRepetitions(filtered);
      } catch (error) {
        console.error("Erreur lors de la récupération des données de la saison:", error);
      }
    };

    fetchSeason();
  }, [membreId]);



  return (
    <div className="position-absolute top-50 start-50 translate-middle" style={{ marginLeft: '60px', marginTop: '30px' }}>
    <p style={{ fontSize: 'xx-large', textAlign: 'center', fontWeight: 'bold', color: '#9999ff', marginBottom: '30px' }}>Marquer Présence</p>
    {repetitions.length > 0 ? (
      <RepetitionsChoristeTable repetitions={repetitions} />
    ) : (
      <p style={{ fontSize: 'large', textAlign: 'center', color: '#999' }}>Aucune répétition disponible pour le moment.</p>
    )}
  </div>
  )*/

  return(
    <div className="position-absolute top-50 start-50 translate-middle" style={{ marginLeft: '60px', marginTop: '30px' }}>
      Marquer présence pour concert
    </div>
  )
}

export default AllConcertsToMarquePresence