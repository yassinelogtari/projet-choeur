import React from 'react';
import { Table } from 'antd';

const sharedOnCell = (_, index) => {
  if (index === 1) {
    return {
      colSpan: 0,
    };
  }
  return {};
};

const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  const formatHour = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};


const columns = [
  {
    title: 'Num° ligne',
    dataIndex: 'key',
    render: (text, record, index) => index + 1, 
    rowScope: 'row',
    width: 100, 
  },
  {
    title: 'Data',
    dataIndex: 'DateAud',
    render: (text) => <a>{formatDate(text)}</a>,
    width: 150,
  },
  {
    title: 'Heure Début',
    dataIndex: 'HeureDeb',
    render: (text) => <a>{formatHour(text)}</a>,
    width: 150, 
  },
  {
    title: 'Heure Fin ',
    dataIndex: 'HeureFin',
    render: (text) => <a>{formatHour(text)}</a>,
    width: 150, 
  },
  {
    title: 'Candidats',
    children: [
      {
        title: 'Candidat',
        dataIndex: 'candidats',
        render: (candidats) => (
          <span>
            {candidats.map((cand) => (
              <div key={cand._id}>
                <p>{cand.nom} {cand.prenom}</p>
              </div>
            ))}
          </span>
        ),
        width: 150,
      },
      {
        title: 'CIN',
        dataIndex: 'candidats',
        render: (candidats) => (
          <span>
            {candidats.map((cand) => (
              <div key={cand._id}>
                <p>{cand.CIN}</p>
              </div>
            ))}
          </span>
        ),
        width: 150,
      },
    ],
  },
  {
    title: "Résultats de l'audition",
    children: [
      {
        title: 'Extrait Chanté',
        dataIndex: 'candidatsInfo',
        render: (resultat) => (
          <span>
            {resultat.map((res) => (
              <div key={res._id}>
                <p>{res.extraitChante}</p>
              </div>
            ))}
          </span>
        ),
        width: 150,
      },
      {
        title: 'Tessiture',
        dataIndex: 'candidatsInfo',
        render: (resultat) => (
          <span>
            {resultat.map((res) => (
              <div key={res._id}>
                <p>{res.tessiture}</p>
              </div>
            ))}
          </span>
        ),
        width: 150,
      },
      {
        title: 'Evaluation',
        dataIndex: 'candidatsInfo',
        render: (resultat) => (
          <span>
            {resultat.map((res) => (
              <div key={res._id}>
                <p>{res.evaluation}</p>
              </div>
            ))}
          </span>
        ),
        width: 150,
      },
      {
        title: 'Décision',
        dataIndex: 'candidatsInfo',
        render: (resultat) => (
          <span>
            {resultat.map((res) => (
              <div key={res._id}>
                <p>{res.decision}</p>
              </div>
            ))}
          </span>
        ),
        width: 150,
      },
      
    ],
  },
  
];


const AuditionsTable = ({ auditions }) => {

    console.log("auditions : " , auditions)
  return (
    <div style={{ maxWidth: '1200px' , margin: '0 auto' }}>
      <Table columns={columns} dataSource={auditions} bordered  />
    </div>
  );
};

export default AuditionsTable;
