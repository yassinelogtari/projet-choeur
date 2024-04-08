import React, { useState } from 'react';
import { Table, Button, Modal } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

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

const RepetitionsChoristeTable = ({ repetitions }) => {
    const [visible, setVisible] = useState(false);
    const [selectedQRCode, setSelectedQRCode] = useState('');
    const [presenceConfirmed, setPresenceConfirmed] = useState(false);

    const handleShowQRCode = (record) => {
        setSelectedQRCode(record.QrCode);
        setVisible(true);
        const isPresent = record.membres.some((membre) => membre.presence === true);
        setPresenceConfirmed(isPresent);
    };


    const handleCancel = () => {
        setVisible(false);
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
            render: (text) => formatHour(text), 
            width: 150, 
        },
        {
            title: 'Heure Fin',
            dataIndex: 'HeureFin',
            render: (text) => formatHour(text), 
            width: 150, 
        },
        {
            title: 'Action (QR Code)',
            key: 'action',
            render: (record) => (
                <Button
                    type="primary"
                    style={{ width: '100%', height: 'auto', padding: '14px 20px', fontSize: 'medium', fontWeight: '500', marginBottom: '20px', backgroundColor: '#00b27a' }}
                    onClick={() => handleShowQRCode(record)}
                >
                    Marquer Présence
                </Button>
            ),
            width: 50,
        },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Table
                columns={columns}
                dataSource={repetitions}
                bordered
            />
            <Modal visible={visible} footer={null} onCancel={handleCancel}>
                {presenceConfirmed ? (
                   <div style={{marginTop:'50px'}}>
                    <div style={{ textAlign: 'center' }}>
                    <CheckCircleOutlined style={{ fontSize: '50px', color: 'green', marginBottom:'20px' }} />
                    </div>
                    <p style={{ fontSize: "x-large", textAlign: "center"}}>Votre présence est déjà enregistrée pour cette répétition.





</p>
                    </div>
                ) : (
                    <>
                        <p style={{ fontSize: "x-large", textAlign: "center", color: "#9999ff", marginTop: "50px" }}>Scanner le QR Code pour marquer votre présence à cette répétition</p>
                        <img src={selectedQRCode} alt="QR Code" style={{ width: '100%', height: 'auto' }} />
                    </>
                )}
            </Modal>
        </div>
    );
    
    
};

export default RepetitionsChoristeTable;
