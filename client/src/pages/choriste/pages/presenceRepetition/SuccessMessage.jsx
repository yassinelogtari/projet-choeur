import React from 'react';
import { Typography , Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography; // Correction ici

export default function SuccessMessage() {
  return (
    <div style={{ textAlign: 'center', padding: '10px 6px' , marginTop:"150px" }}>
      <CheckCircleOutlined style={{ fontSize: '50px', color: 'green' }} />
      <Title level={2} style={{ marginTop: '6px', marginBottom: '2px' }}>
        Confirmation de Présence Enregistrée
      </Title>
      <Text style={{ color: 'rgba(0, 0, 0, 0.45)' , fontSize:"x-large" }}>
        Votre présence a été enregistrée avec succès. Vous pouvez accéder à votre tableau de bord en cliquant 
        <Button style={{ color: 'rgba(0, 0, 0, 0.45)', fontSize: 'x-large' }} type="link">
          <Link to="/dashboard/choriste/home" style={{ textDecoration: 'underline' , color:"blue" }}>ici</Link> 
        </Button>
      </Text>
    </div>
  );
}