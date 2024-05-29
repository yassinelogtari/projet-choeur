import React, { useState } from 'react';
import { Divider, Table, Button, message } from 'antd';
import axios from 'axios';

const columns = [
  {
    title: 'Nom',
    dataIndex: 'nom',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Prénom',
    dataIndex: 'prenom',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'E-mail',
    dataIndex: 'email',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Rôle',
    dataIndex: 'role',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Activité',
    dataIndex: 'activite',
    render: (isActive) => isActive ? <span style={{ color: 'green' }}>Actif</span> : <span style={{ color: 'red' }}>Inactif</span>,
  },
  {
    title: 'Téléphone',
    dataIndex: 'telephone',
    render: (text) => <a>{text}</a>,
  },
];

const MembresOfPupitresTable = ({ choristes }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (selectedRowKey) => {
    if (selectedRowKeys.includes(selectedRowKey)) {
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== selectedRowKey));
    } else if (selectedRowKeys.length < 2) {
      setSelectedRowKeys([...selectedRowKeys, selectedRowKey]);
    } else {
      message.error("Vous ne pouvez sélectionner que deux choristes");
    }
  };

  const handleDesignation = async () => {
    const selectedMembers = choristes.filter(member => selectedRowKeys.includes(member._id));
    if (selectedMembers.length === 2) {
      try {
        const response = await axios.post('http://localhost:8000/api/saison/designerChefsdePupitre', {
          pupitre: selectedMembers[0].pupitre,
          membre1Id: selectedMembers[0]._id,
          membre2Id: selectedMembers[1]._id
        });
        if (response.status === 200) {
          message.success("Chefs de pupitre désignés avec succès !");
          // Réinitialiser la sélection après la désignation
          setSelectedRowKeys([]);
        } else {
          message.error("Les chefs de ce pupitre est déja désigné.");
        }
      } catch (error) {
        console.error("Erreur lors de la désignation des chefs de pupitre :", error);
        message.error("Les chefs de ce pupitre sont déjà désigné.");
      }
    } else {
      message.error("Veuillez sélectionner exactement deux choristes pour désigner les chefs de pupitre.");
    }
  };

  const rowSelection = {
    onSelect: (record, selected, selectedRows) => {
      onSelectChange(record._id);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      const selectedRowKeys = changeRows.map(row => row._id);
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys,
  };

  return (
    <div>
      <Divider />
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={choristes.map(item => ({ ...item, key: item._id }))}
      />
      <Button type="primary" ghost onClick={handleDesignation}>
        Désigner
      </Button>
    </div>
  );
};

export default MembresOfPupitresTable;
