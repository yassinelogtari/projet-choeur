import React from 'react';
import { Table } from 'antd';
// In the fifth row, other columns are merged into first column
// by setting it's colSpan to be 0
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
    title: 'Genre',
    dataIndex: 'genre',
    render: (text) => <a>{text}</a>,
    width: 150, 
  },
  {
    title: 'Arrangeurs',
    dataIndex: 'arrangeurs',
    render: (arrangeurs) => (
      <span>
        {arrangeurs.map((arrangeur) => (
          <div>
            <p>{arrangeur}</p>
          </div>
        ))}
      </span>
    ),
    width: 150,
  },
  
  {
    title: 'Compositeurs',
    dataIndex: 'compositeurs',
    render: (compositeurs) => (
      <span>
        {compositeurs.map((compositeur) => (
          <div>
            <p>{compositeur}</p>
          </div>
        ))}
      </span>
    ),
    width: 150, 
  },
  {
    title: 'Pupitre',
    dataIndex: 'pupitre',
    render: (pupitre) => (
      <span>
        {pupitre.map((pup) => (
          <div>
            <p>{pup}</p>
          </div>
        ))}
      </span>
    ),
    
    width: 150, 
  },
];


const OeuvresTable = ({ oeuvres }) => {

    console.log("oeuvres : " , oeuvres)
  return (
    <div style={{ maxWidth: '1200px' , margin: '0 auto' }}>
      <Table columns={columns} dataSource={oeuvres} bordered  />
    </div>
  );
};
export default OeuvresTable;