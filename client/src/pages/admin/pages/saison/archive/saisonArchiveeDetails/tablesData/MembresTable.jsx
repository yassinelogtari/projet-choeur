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

const columns = [
  {
    title: 'Num° ligne',
    dataIndex: 'key',
    render: (text, record, index) => index + 1, 
    rowScope: 'row',
    width: 100, 
  },
  {
    title: 'Nom',
    dataIndex: 'nom',
    render: (text) => <a>{text}</a>,
    width: 150,
  },
  {
    title: 'Prénom',
    dataIndex: 'prenom',
    render: (text) => <a>{text}</a>,
    width: 150, 
  },
  {
    title: 'E-mail',
    dataIndex: 'email',
    render: (text) => <a>{text}</a>,
    width: 150, 
  },
  {
    title: 'Rôle ',
    dataIndex: 'role',
    render: (text) => <a>{text}</a>,
    width: 150, 
  },
  {
    title: 'Statut',
    dataIndex: 'statut',
    render: (text) => <a>{text}</a>,
    width: 150, 
  },
  {
    title: 'Téléphone',
    dataIndex: 'telephone',
    width: 150, 
  },
];


const MembresTable = ({ membres }) => {

    console.log("membres : " , membres)
  return (
    <div style={{ maxWidth: '1200px' , margin: '0 auto' }}>
      <Table columns={columns} dataSource={membres} bordered  />
    </div>
  );
};

export default MembresTable;
