import React, { useState } from 'react';
import { Divider, Table, Button } from 'antd';

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
    title: 'Statut',
    dataIndex: 'statut',
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

  const onSelectChange = (record, selected) => {
    const newSelectedRowKeys = selected ? [...selectedRowKeys, record.key] : selectedRowKeys.filter(key => key !== record.key);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
    onSelect: (record, selected) => onSelectChange(record, selected),
    selectedRowKeys,
  };

  return (
    <div>
      <Divider />
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={choristes}
      />
      <Button type="primary" ghost>
        Désigner
      </Button>
    </div>
  );
};

export default MembresOfPupitresTable;
