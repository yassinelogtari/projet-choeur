import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from "axios";
import "./modifArchivForm.css";

const MyFormItemContext = React.createContext([]);

function toArr(str) {
  return Array.isArray(str) ? str : [str];
}

const MyFormItemGroup = ({ prefix, children }) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatPath = React.useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix]);
  return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>;
};

const MyFormItem = ({ name, label, ...props }) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;
  return <Form.Item name={concatName} label={label} className='custom-label' {...props} />;
};

const ModifArchivForm = () => {
  const [nom, setNom] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [idSaison, setIdSaison] = useState("");
  const [loading, setLoading] = useState(true);
  const [seasonAvailable, setSeasonAvailable] = useState(true);
  const [seasonArchived, setSeasonArchived] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/saison/getSaisonActuelle');
        const saisonData = response.data.saison;
        if (!saisonData || response.status === 404) {
          setSeasonAvailable(false);
          console.log("saison valable:", seasonAvailable)
        } else {
          setNom(saisonData.nom);
          setDateDebut(formatDate(saisonData.dateDebut));
          setDateFin(formatDate(saisonData.dateFin));
          setIdSaison(saisonData._id);
        }
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des données de la saison:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const updateSaison = async () => {
    try {
      const response = await axios.patch(`http://localhost:8000/api/saison/updateSaison/${idSaison}`, {
        nom: nom,
        dateDebut: dateDebut,
        dateFin: dateFin
      });
      message.success('Les données de la saison ont été mises à jour avec succès.');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données de la saison:', error);
      message.error('Erreur lors de la mise à jour des données de la saison.');
    }
  };

  const archiveSeason = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/api/saison/archiveSeason/${idSaison}`);
      message.success('La saison a été archivée avec succès.');
      setSeasonArchived(true);
      console.log("data:" , response.data)
    } catch (error) {
      console.error('Erreur lors de l\'archivage de la saison:', error);
      message.error('Erreur lors de l\'archivage de la saison.');
    }
  };

  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  if (!seasonAvailable) {
    return <div className='no-season'>Aucune saison n'est disponible actuellement.</div>;
  }

  if (seasonArchived) { 
    return (
      <div className='archived-season'>
        <p>La saison a été archivée avec succès.</p>
        <a href="/nouvelle-saison">Créer une nouvelle saison</a>
      </div>
    );
  }

  return (
    <>
      <div className='title'>
        <h4 className='nomSaison'>{loading}</h4>
        <span className='dateSaison'>{dateDebut} / {dateFin}</span>
      </div>
      <Form className="form" name="form_item_path" layout="vertical" onFinish={updateSaison}>
        <MyFormItemGroup prefix={['user']}>
          <MyFormItemGroup prefix={['name']}>
            <MyFormItem name="nom" label="Nom de la saison" >
              <Input className='input' defaultValue={nom} onChange={(e) => setNom(e.target.value)} />
            </MyFormItem>
            <MyFormItem name="date debut" label="Date Début" >
              <Input className='input' type='date' defaultValue={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
            </MyFormItem>
          </MyFormItemGroup>
          <MyFormItem name="date fin" label="Date Fin" >
            <Input className='input' type='date' defaultValue={dateFin} onChange={(e) => setDateFin(e.target.value)} />
          </MyFormItem>
        </MyFormItemGroup>
        <div className='btns'>
          <Button className='btn-modification' type="primary" htmlType="submit">
            Modifier
          </Button>
          <Button className='btn-archivage' type="primary" onClick={archiveSeason}>
            Archiver
          </Button>
        </div>
      </Form>
    </>
  );
};

export default ModifArchivForm;
