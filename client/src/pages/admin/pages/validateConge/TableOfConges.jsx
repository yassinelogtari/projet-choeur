import React, { useState , useEffect } from 'react';
import { Table, Button , message , Modal} from 'antd';
import axios from 'axios';





const TableOfConges = () => {
  
    const [conges, setConges] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [congeToDelete, setCongeToDelete] = useState(null);

    useEffect(() => {
      const fetchConges = async () => {
        try {
          const response = await axios.get('http://localhost:8000/api/conge/getConges');
          setConges(response.data.conges);
          console.log("response : ", response.data)
          console.log("conges : " , response.data.conges);
        } catch (error) {
          console.error('Erreur lors de la récupération des congés : ', error);
        }
      };
  
      fetchConges();
    }, []);


    
    const handleValiderConge = async (id, dateDebut) => {
        const currentDate = new Date();
        const startDate = new Date(dateDebut);


        if (currentDate > startDate) {
            setModalVisible(true);
            setCongeToDelete(id);
        } else {
            try {
                await axios.post(`http://localhost:8000/api/conge/valider/${id}`);
                message.success('Congé validé avec succès');
                // Rafraîchir la liste des congés après validation
                const updatedConges = conges.filter(conge => conge._id !== id);
                setConges(updatedConges);            
            } catch (error) {
                console.error('Erreur lors de la validation du congé : ', error);
                message.error('Erreur lors de la validation du congé');
            }
        }
    };

    const handleDeleteConge = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/conge/deleteConge/${congeToDelete}`);
            message.success('Congé supprimé avec succès');
            // Rafraîchir la liste des congés après suppression
            const updatedConges = conges.filter(conge => conge._id !== congeToDelete);
            setConges(updatedConges);
        } catch (error) {
            console.error('Erreur lors de la suppression du congé : ', error);
            message.error('Erreur lors de la suppression du congé');
        } finally {
            setModalVisible(false);
            setCongeToDelete(null);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setCongeToDelete(null);
    };



    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
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
            title: 'Demandé par',
            dataIndex: 'membre',
            render: (membre) => <span>{membre.prenom}  {membre.nom}</span>,
            width: 150, 
        },
        {
            title: 'Date Début',
            dataIndex: 'dateDebut',
            render: (text) => formatDate(text), 
            width: 150, 
        },
        {
            title: 'Date Fin ',
            dataIndex: 'dateFin',
            render: (text) => formatDate(text), 
            width: 150, 
        },
        {
            title: 'Raison',
            dataIndex: 'raison',
            render: (text) => <a>{text}</a>,
            width: 150, 
        },
       
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Button type="primary" ghost onClick={() => handleValiderConge(record._id, record.dateDebut)}>
                   Valider
                </Button>
            ),
            width: 50,
        },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Table
                columns={columns}
                dataSource={conges}
                bordered
            />

<Modal
                title="Attention"
                visible={modalVisible}
                onOk={handleDeleteConge}
                onCancel={handleCloseModal}
                okText="Supprimer"
                cancelText="Annuler"
                centered // Centrer le modal
                bodyStyle={{ textAlign: 'center' }}
            >
                <p style={{marginTop:"50px" , fontSize:"medium"}}>Vous ne pouvez pas valider ce congé car la date de début est déjà dépassée. Souhaitez-vous supprimer ce congé?</p>
            
            </Modal>
            
        </div>
    );
};

export default TableOfConges;
