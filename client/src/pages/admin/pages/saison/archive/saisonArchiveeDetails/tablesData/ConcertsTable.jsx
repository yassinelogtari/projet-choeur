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
  {
    title: 'Titre',
    dataIndex: 'titre',
    render: (text) => <a>{text}</a>,
    width: 150,
  },
  {
    title: 'Lieu',
    dataIndex: 'lieu',
    render: (text) => <a>{text}</a>,
    width: 150, 
  },
  {
    title: 'Date',
    dataIndex: 'date',
    render: (text) => formatDate(text), 
    width: 150, 
  },

  {
    title: 'Membres',
    children: [
      {
        title: 'Membre',
        dataIndex: 'listeMembres',
        render: (listeMembres) => (
          <span>
            {listeMembres.map((membre) => (
              <div key={membre._id}>
                <p>{membre.membre.nom} {membre.membre.prenom}</p>
              </div>
            ))}
          </span>
        ),
        width: 200,
      },
      {
        title: 'Présence',
        dataIndex: 'listeMembres',
        render: (listeMembres) => (
          <span>
            {listeMembres.map((membre) => (
              <div key={membre._id}>
                <p>{membre.presence ? 'Présent' : 'Absent'}</p>
              </div>
            ))}
          </span>
        ),
        width: 150,
      },
    ],
  },
  
  {
    title: 'Programme',
    children: [
      {
        title: 'Oeuvre',
        dataIndex: 'programme',
        render: (programme) => (
          <span>
            {programme.map((prog) => (
              <div key={prog._id}>
                <p>{prog.oeuvre.titre}</p>
              </div>
            ))}
          </span>
        ),
        width: 150,
      },
      {
        title: 'Thème',
        dataIndex: 'programme',
        render: (programme) => (
          <span>
            {programme.map((prog) => (
              <div key={prog._id}>
                <p>{prog.theme}</p>
              </div>
            ))}
          </span>
        ),
        width: 150,
      },
    ],
  },
  

 
];


const ConcertsTable = ({ concerts }) => {

 

  console.log("concerts : " , concerts)
return (
  <div style={{ maxWidth: '1200px' , margin: '0 auto' }}>
    <Table columns={columns} dataSource={concerts} bordered  />
  </div>
);
};

export default ConcertsTable;