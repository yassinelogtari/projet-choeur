import React from 'react';
import { Table } from 'antd';
// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0


const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
};
const sharedOnCell = (_, index) => {
  if (index === 1) {
    return {
      colSpan: 0,
    };
  }
  return {};
};
const columns = [
  {
    title: 'Num° ligne',
    dataIndex: 'key',
    render: (text, record, index) => index + 1, 
    rowScope: 'row',
    width: 100, 
  },
 /*{
    title: 'Concert',
    dataIndex: 'concert',
    render: (concert) => (
      <div>
        <p>{concert.titre}</p>
      </div>
    ),
    width: 150,
  },*/
  {
    title: 'Lieu',
    dataIndex: 'lieu',
    render: (text) => <a>{text}</a>,
    width: 150, 
  },
  {
    title: 'Date',
    dataIndex: 'DateRep',
    render: (text) => formatDate(text), 
    width: 150, 
  },
  {
    title: 'Heure Début ',
    dataIndex: 'HeureDeb',
    render: (text) => formatDate(text), 
    width: 150, 
  },
  {
    title: 'Heure Fin',
    dataIndex: 'HeureFin',
    render: (text) => formatDate(text), 
    width: 150, 
  },
  {
    title: 'Membres',
    children: [
      {
        title: 'Membre',
        dataIndex: 'membres',
        render: (membres) => (
          <span>
            {membres.map((membre) => (
              <div key={membre._id}>
                <p>{membre.member.nom} {membre.member.prenom}</p>
              </div>
            ))}
          </span>
        ),
        width: 200,
      },
      {
        title: 'Présence',
        dataIndex: 'membres',
        render: (membres) => (
          <span>
            {membres.map((membre) => (
              <div key={membre._id}>
                <p>{membre.presence ? 'Présent' : 'Absent'}</p>
              </div>
            ))}
          </span>
        ),
        width: 150,
      },
      {
        title: 'Raison',
        dataIndex: 'membres',
        render: (membres) => (
          <span>
            {membres.map((membre) => (
              <div key={membre._id}>
                <p>{membre.raison ? 'oui' : 'non'}</p>
              </div>
            ))}
          </span>
        ),
        width: 150,
      }
    ],
  },

];


const RepetitionsTable = ({ repetitions }) => {

 

  console.log("emna zayani : " , repetitions)
return (
  <div style={{ maxWidth: '1200px' , margin: '0 auto' }}>
    <Table columns={columns} dataSource={repetitions} bordered  />
  </div>
);
};
export default RepetitionsTable;