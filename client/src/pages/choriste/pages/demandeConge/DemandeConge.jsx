import React from 'react';
import { useParams } from 'react-router-dom';
import CongeForm from '../../../../components/congeChoriste/CongeForm';

const DemandeConge = () => {

  return (
    <div className="position-absolute top-50 start-50 translate-middle"> 
      <CongeForm />
    </div>
  );
}

export default DemandeConge;
