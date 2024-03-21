import React from "react";
import FormSaison from "../../../../components/formSaison/FormSaison";

const NouvelleSaison = () => {
  return (
    <div className="position-absolute top-50 start-50 translate-middle" style={{width : "60vw", marginTop:"50px", marginLeft: "100px" }}>
      <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">SAISONS/</span> Nouvelle Saison</h4>
      <FormSaison />
    </div>
  );
};


export default NouvelleSaison;
