import React, { useEffect, useState } from 'react'
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { StopOutlined , LoadingOutlined  } from '@ant-design/icons';
import ConcertsChoristeTable from './ConcertsChoristeTable';

function AllConcertsToMarquePresence() {
       
    const [concerts, setConcerts] = useState([]);
    const [storedToken, setStoredToken] = useState();
    const [loading, setLoading] = useState(true);

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
      
      const filteredConcerts = (concerts, membreId) => {
        return concerts.filter(concert =>
          concert.listeMembres.some(member => member.membre === membreId)
        );
      };
      
      const membreId  = getAuthenticatedUserId()

   useEffect(() => {
    const fetchSeason = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/saison/getSaisonActuelle");
        const saisonData = response.data.saison;
        const filtered = filteredConcerts(saisonData.concerts, membreId);
        console.log('filtred data :' , filtered)
        console.log('données  de la saison :' , saisonData)
        console.log('données concerts de la saison :' , saisonData.concerts)

        setConcerts(filtered);
        setLoading(false);
        console.log("concerts state:" , concerts)
      } catch (error) {
        console.error("Erreur lors de la récupération des données de la saison:", error);
      }
    };

    fetchSeason();
  }, [membreId]);



  return (
    <div className="position-absolute top-50 start-50 translate-middle" style={{ marginLeft: '60px', marginTop: '30px' }}>
    {loading ? ( 
        <div style={{ textAlign: 'center' }}>
            <LoadingOutlined style={{ fontSize: '50px', color: '#999' }} />
        </div>
    ) : (
        <>
            {concerts.length > 0 ? (
                <div>
                    <p style={{ fontSize: 'xx-large', textAlign: 'center', fontWeight: 'bold', color: '#9999ff', marginBottom: '30px' }}>Marquer Présence Concerts</p>
                    <ConcertsChoristeTable concerts={concerts} />
                </div>
            ) : (
                <div>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <StopOutlined style={{ fontSize: '50px', color: '#999' }} />
                    </div>
                    <p style={{ fontSize: 'xx-large', textAlign: 'center', color: '#999' }}>Aucun concert disponible pour le moment.</p>
                </div>
            )}
        </>
    )}
</div>
);
}

export default AllConcertsToMarquePresence