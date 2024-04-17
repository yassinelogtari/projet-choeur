import React , {useState} from "react";
import ModifArchivForm from "../../../../components/formSaison/ModifArchivForm";

const SaisonActuelle = () => {

  const [nom, setNom] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  return (
    <div className="position-absolute top-50 start-50 translate-middle" style={{width : "60vw", marginTop:"50px", marginLeft: "100px" }}>
  
  <h4 class="text-muted fw-light" ><span class="fw-bold py-3 mb-4">{nom}/</span> {dateDebut}___{dateFin}</h4>
     
       <ModifArchivForm 
        nom={nom}
        setNom={setNom}
        dateDebut={dateDebut}
        setDateDebut={setDateDebut}
        dateFin={dateFin}
        setDateFin={setDateFin}/>
    </div>
  );
};

export default SaisonActuelle;
