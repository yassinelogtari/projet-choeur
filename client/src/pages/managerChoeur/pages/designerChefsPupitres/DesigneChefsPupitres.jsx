import React, { useEffect, useState } from 'react'
import MembresOfPupitresTable from './MembresOfPupitresTable'
import ChoosePupitreType from './ChoosePupitreType'
import axios from "axios";

function DesigneChefsPupitres() {

    const [choristes, setChoristes] = useState([]);

    const handleMenuClick = async (pupitre) => {
      try {
        const response = await axios.post('http://localhost:8000/api/membre/getMembersByPupitre', { pupitre });
        console.log("pupitre choisi : " , pupitre)
        console.log("juste réponse : " , response)
        console.log("la réponse : " , response.data)
        if (response.status === 404) {
          setChoristes([]); // Vider le tableau des choristes
        } else {
          setChoristes(response.data.membres);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des choristes :', error);
      }
    };


  return (
    <div className="position-absolute top-50 start-50 translate-middle">
    <ChoosePupitreType  onMenuClick={handleMenuClick} />
    
    <MembresOfPupitresTable  choristes={choristes} />

    </div>
  )
}

export default DesigneChefsPupitres