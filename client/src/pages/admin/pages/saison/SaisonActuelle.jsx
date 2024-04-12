import React from "react";
import ModifArchivForm from "../../../../components/formSaison/ModifArchivForm";

const SaisonActuelle = () => {
  return (
    <div className="position-absolute top-50 start-50 translate-middle" style={{width : "50vw", marginLeft: "100px" }}>
       <ModifArchivForm/>
    </div>
  );
};

export default SaisonActuelle;
