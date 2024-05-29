/*import React, { useState } from 'react';
import { Table, Button, Modal } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
};

const ConcertsChoristeTable = ({ concerts }) => {
    const [visible, setVisible] = useState(false);
    const [selectedQRCode, setSelectedQRCode] = useState('');
    const [presenceConfirmed, setPresenceConfirmed] = useState(false);
    const [waitForConcert, setWaitForConcert] = useState(false);
    const [missedConcert, setMissedConcert] = useState(false);

    const handleShowQRCode = (record) => {
        console.log(JSON.stringify(record, null, 2));
        const isPresent = record.listeMembres.some((membre) => membre.presence === true);
        setPresenceConfirmed(isPresent);

        
       
        const currentDate = new Date();
        const concertDate = new Date(record.date);
        console.log('currentDate : ' , currentDate)
        console.log('concertDate : ' , concertDate)
       const isSameConcertDate =
  currentDate.getFullYear() === concertDate.getFullYear() &&
  currentDate.getMonth() === concertDate.getMonth() &&
  currentDate.getDate() === concertDate.getDate();

        console.log("isSameConcertDate : " , isSameConcertDate)
      

        // Si l'utilisateur est présent, afficher un message indiquant qu'il est déjà présent
        if (isPresent) {
            setVisible(true);
            return;
        }

         // Si la date actuelle est le jour du concert et que l'utilisateur n'est pas présent
         if (isSameConcertDate && !isPresent) {
            setSelectedQRCode(record.QrCode);
            setVisible(true);
            return;
        }

        // Si la date actuelle est après la date du concert et que l'utilisateur n'est pas présent
        if (currentDate > concertDate && !isPresent) {
            setMissedConcert(true);
            setVisible(true);
            return;
        }

        // Si la date actuelle n'est pas le jour du concert
        if (!isSameConcertDate) {
            setWaitForConcert(true);
            setVisible(true);
            return;
        }

       

    };

    const handleCancel = () => {
        setVisible(false);
        setPresenceConfirmed(false);
        setWaitForConcert(false);
        setMissedConcert(false);
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
        {
            title: 'Absence',
            key: 'action',
            render: (record) => (
                
                <Button
                type="primary"
                style={{ width: '100%', height: 'auto', padding: '14px 20px', fontSize: 'medium', fontWeight: '500', marginBottom: '20px', backgroundColor: '#00b27a' }}
            >
                Marquer Absence
                </Button>
            ),
            width: 50,
        },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Table
                columns={columns}
                dataSource={concerts}
                bordered
            />
            <Modal visible={visible} footer={null} onCancel={handleCancel}>
                {presenceConfirmed ? (
                    <div style={{ marginTop: '50px', textAlign: 'center' }}>
                        <CheckCircleOutlined style={{ fontSize: '50px', color: 'green', marginBottom: '20px' }} />
                        <p style={{ fontSize: 'x-large' }}>Votre présence est déjà enregistrée pour ce concert.</p>
                    </div>
                ) : missedConcert ? (
                    <div style={{ marginTop: '50px', textAlign: 'center' }}>
                        <ExclamationCircleOutlined style={{ fontSize: '50px', color: 'red', marginBottom: '20px' }} />
                        <p style={{ fontSize: 'x-large' }}>Vous avez manqué ce concert. Vous ne pouvez plus marquer votre présence.</p>
                    </div>
                ) : waitForConcert ? (
                    <div style={{ marginTop: '50px', textAlign: 'center' }}>
                        <ExclamationCircleOutlined style={{ fontSize: '50px', color: '#999', marginBottom: '20px' }} />
                        <p style={{ fontSize: 'x-large' }}>Veuillez attendre la date du concert pour marquer votre présence.</p>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 'x-large', color: '#9999ff', marginTop: '50px' }}>Scanner le QR Code pour marquer votre présence dans ce concert</p>
                        <img src={selectedQRCode} alt="QR Code" style={{ width: '100%', height: 'auto' }} />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ConcertsChoristeTable;
*/
import React, { useState } from 'react';
import { Table, Button, Modal, Input, notification } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
};

const ConcertsChoristeTable = ({ concerts }) => {
    const [visible, setVisible] = useState(false);
    const [selectedQRCode, setSelectedQRCode] = useState('');
    const [presenceConfirmed, setPresenceConfirmed] = useState(false);
    const [waitForConcert, setWaitForConcert] = useState(false);
    const [missedConcert, setMissedConcert] = useState(false);
    const [absenceVisible, setAbsenceVisible] = useState(false);
    const [absenceReason, setAbsenceReason] = useState('');
    const [selectedConcert, setSelectedConcert] = useState(null);

    const handleShowQRCode = (record) => {
        console.log(JSON.stringify(record, null, 2));
        const isPresent = record.listeMembres.some((membre) => membre.presence === true);
        setPresenceConfirmed(isPresent);

        const currentDate = new Date();
        const concertDate = new Date(record.date);
        console.log('currentDate : ', currentDate);
        console.log('concertDate : ', concertDate);
        const isSameConcertDate =
            currentDate.getFullYear() === concertDate.getFullYear() &&
            currentDate.getMonth() === concertDate.getMonth() &&
            currentDate.getDate() === concertDate.getDate();

        console.log("isSameConcertDate : ", isSameConcertDate);

        if (isPresent) {
            setVisible(true);
            return;
        }

        if (isSameConcertDate && !isPresent) {
            setSelectedQRCode(record.QrCode);
            setVisible(true);
            return;
        }

        if (currentDate > concertDate && !isPresent) {
            setMissedConcert(true);
            setVisible(true);
            return;
        }

        if (!isSameConcertDate) {
            setWaitForConcert(true);
            setVisible(true);
            return;
        }
    };

    const handleCancel = () => {
        setVisible(false);
        setPresenceConfirmed(false);
        setWaitForConcert(false);
        setMissedConcert(false);
    };

    const handleMarkAbsence = (record) => {
        setSelectedConcert(record);
        setAbsenceVisible(true);
    };

    const handleAbsenceOk = async () => {
        if (!absenceReason) {
            notification.error({
                message: 'Erreur',
                description: 'Veuillez fournir une raison pour votre absence.',
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/concerts/addAbsence', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    concertId: selectedConcert._id,
                    raison: absenceReason,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                notification.success({
                    message: 'Succès',
                    description: data.message,
                });
                setAbsenceVisible(false);
                setAbsenceReason('');
            } else {
                notification.error({
                    message: 'Erreur',
                    description: data.error,
                });
            }
        } catch (error) {
            console.error('Erreur:', error);
            notification.error({
                message: 'Erreur',
                description: 'Erreur lors de la tentative de marquer votre absence.',
            });
        }
    };

    const handleAbsenceCancel = () => {
        setAbsenceVisible(false);
        setAbsenceReason('');
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
        {
            title: 'Absence',
            key: 'action',
            render: (record) => (
                <Button
                    type="primary"
                    style={{ width: '100%', height: 'auto', padding: '14px 20px', fontSize: 'medium', fontWeight: '500', marginBottom: '20px', backgroundColor: '#00b27a' }}
                    onClick={() => handleMarkAbsence(record)}
                >
                    Marquer Absence
                </Button>
            ),
            width: 50,
        },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Table
                columns={columns}
                dataSource={concerts}
                bordered
            />
            <Modal visible={visible} footer={null} onCancel={handleCancel}>
                {presenceConfirmed ? (
                    <div style={{ marginTop: '50px', textAlign: 'center' }}>
                        <CheckCircleOutlined style={{ fontSize: '50px', color: 'green', marginBottom: '20px' }} />
                        <p style={{ fontSize: 'x-large' }}>Votre présence est déjà enregistrée pour ce concert.</p>
                    </div>
                ) : missedConcert ? (
                    <div style={{ marginTop: '50px', textAlign: 'center' }}>
                        <ExclamationCircleOutlined style={{ fontSize: '50px', color: 'red', marginBottom: '20px' }} />
                        <p style={{ fontSize: 'x-large' }}>Vous avez manqué ce concert. Vous ne pouvez plus marquer votre présence.</p>
                    </div>
                ) : waitForConcert ? (
                    <div style={{ marginTop: '50px', textAlign: 'center' }}>
                        <ExclamationCircleOutlined style={{ fontSize: '50px', color: '#999', marginBottom: '20px' }} />
                        <p style={{ fontSize: 'x-large' }}>Veuillez attendre la date du concert pour marquer votre présence.</p>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 'x-large', color: '#9999ff', marginTop: '50px' }}>Scanner le QR Code pour marquer votre présence dans ce concert</p>
                        <img src={selectedQRCode} alt="QR Code" style={{ width: '100%', height: 'auto' }} />
                    </div>
                )}
            </Modal>
            <Modal
                
                visible={absenceVisible}
                onOk={handleAbsenceOk}
                onCancel={handleAbsenceCancel}
                closable={false} 
            >
                <Input
                    placeholder="Raison"
                    value={absenceReason}
                    onChange={(e) => setAbsenceReason(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default ConcertsChoristeTable;
