import React from 'react';
import { useParams } from 'react-router-dom';
import HistoriqueActivite from '../../../../components/historiqueContent/HistoriqueActivite';

const Historique = () => {
  const { id } = useParams();

  return (
    <div className="position-absolute top-50 start-50 translate-middle"> 
      <HistoriqueActivite id={id} />
    </div>
  );
}

export default Historique;
