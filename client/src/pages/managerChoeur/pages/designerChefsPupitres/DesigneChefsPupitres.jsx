import React, { useEffect, useState } from 'react';
import MembresOfPupitresTable from './MembresOfPupitresTable';
import ChoosePupitreType from './ChoosePupitreType';
import axios from 'axios';

function DesigneChefsPupitres() {
  const [choristes, setChoristes] = useState([]);

  const handleMenuClick = async (pupitre) => {
    try {
      const response = await axios.post('http://localhost:8000/api/membre/getMembersByPupitre', { pupitre });
      if (response.status === 200) { // Vérifier si la requête a abouti
        if (response.data.membres && response.data.membres.length > 0) {
          setChoristes(response.data.membres);
          console.log("Choristes récupérés :", response.data.membres);
        } else {
          setChoristes([]); // Réinitialiser la liste des choristes à une liste vide
        }
      } else if (response.status === 404) { // Gérer le cas où aucun membre n'est trouvé pour le pupitre
        setChoristes([]);
      } else {
        console.error('Erreur lors de la récupération des choristes :', response.data.erreur);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des choristes :', error);
    }
  };
  
  return (
    <div className="position-absolute top-50 start-50 translate-middle">
      <ChoosePupitreType onMenuClick={handleMenuClick} />
      {/* Passer la liste des choristes mise à jour au composant MembresOfPupitresTable */}
      <MembresOfPupitresTable choristes={choristes} />
    </div>
  );
}

export default DesigneChefsPupitres;
