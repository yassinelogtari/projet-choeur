import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Table, notification } from 'antd';
import React, { useState } from 'react';

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
    const [missedRepetition, setMissedRepetition] = useState(false);
    const [waitForRehearsal, setWaitForRehearsal] = useState(false);
    const [absenceVisible, setAbsenceVisible] = useState(false);
    const [absenceReason, setAbsenceReason] = useState('');
    const [selectedRepetition, setSelectedRepetition] = useState(null);

    const handleShowQRCode = (record) => {
        const isPresent = record.membres.some((membre) => membre.presence === true);
        setPresenceConfirmed(isPresent);

        // Convertir les dates en objets Date
        const currentDate = new Date();
        const rehearsalStartDate = new Date(record.DateRep);
        const rehearsalStartTime = new Date(record.HeureDeb);
        const rehearsalEndTime = new Date(record.HeureFin);
        

        // Vérifier si la date actuelle est le même jour que la date de répétition
        const isSameRehearsalDate = currentDate.toDateString() === rehearsalStartDate.toDateString();

        // Vérifier si la date actuelle est comprise entre HeureDeb et HeureFin et que c'est le même jour que la date de répétition
        const isBetweenRehearsalHours = isSameRehearsalDate && currentDate >= rehearsalStartTime && currentDate <= rehearsalEndTime;

        // Si l'utilisateur est absent et que la date actuelle est entre HeureDeb et HeureFin
        if (!isPresent && isBetweenRehearsalHours) {
            setSelectedQRCode(record.QrCode);
            setVisible(true);
            return;
        }

        // Si l'utilisateur est absent mais que la date actuelle est avant HeureDeb
        if (!isPresent && isSameRehearsalDate && currentDate < rehearsalStartTime) {
            setWaitForRehearsal(true);
            setVisible(true);
            return;
        }

         // Si l'utilisateur est absent mais que la date actuelle est après HeureFin
    if (!isPresent && isSameRehearsalDate && currentDate > rehearsalEndTime) {
        setMissedRepetition(true); // Ajout de cette ligne pour gérer missedRepetition
        setVisible(true);
        return;
    }

        // Si la date actuelle n'est pas le même jour que la date de répétition
        // Afficher un message indiquant d'attendre la date et l'heure de la répétition
        setMissedRepetition(true);
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        setMissedRepetition(false);
        setPresenceConfirmed(false);
        setWaitForRehearsal(false);
    };

    const handleMarkAbsence = (record) => {
        setSelectedRepetition(record);
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
            const response = await fetch('http://localhost:8000/api/repetition/addAbsence', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    repetitionId: selectedRepetition._id,
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
                dataSource={repetitions}
                bordered
            />
            <Modal visible={visible} footer={null} onCancel={handleCancel}>
                {presenceConfirmed ? (
                    <div style={{ marginTop: '50px', textAlign: 'center' }}>
                        <CheckCircleOutlined style={{ fontSize: '50px', color: 'green', marginBottom: '20px' }} />
                        <p style={{ fontSize: 'x-large' }}>Votre présence est déjà enregistrée pour cette répétition.</p>
                    </div>
                ) : missedRepetition ? (
                    <div style={{ marginTop: '50px', textAlign: 'center' }}>
                        <ExclamationCircleOutlined style={{ fontSize: '50px', color: 'red', marginBottom: '20px' }} />
                        <p style={{ fontSize: 'x-large' }}>Vous avez manqué cette répétition. Vous ne pouvez plus marquer votre présence.</p>
                    </div>
                ) : waitForRehearsal ? (
                    <div style={{ marginTop: '50px', textAlign: 'center' }}>
                        <ExclamationCircleOutlined style={{ fontSize: '50px', color: '#9999ff', marginBottom: '20px' }} />
                        <p style={{ fontSize: 'x-large' }}>Veuillez attendre la date et l'heure de la répétition pour enregistrer votre présence.</p>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: 'x-large', color: '#9999ff', marginTop: '50px' }}>Scanner le QR Code pour marquer votre présence à cette répétition</p>
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

export default RepetitionsChoristeTable;
