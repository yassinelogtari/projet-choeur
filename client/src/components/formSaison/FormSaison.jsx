import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import axios from "axios";
import "./formSaison.css"

const MyFormItemContext = React.createContext([]);

function toArr(str) {
  return Array.isArray(str) ? str : [str];
}

const MyFormItemGroup = ({ prefix, children }) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatPath = React.useMemo(() => [...prefixPath, ...toArr(prefix)], [prefixPath, prefix]);
  return <MyFormItemContext.Provider value={concatPath}>{children}</MyFormItemContext.Provider>;
};

const MyFormItem = ({ name, label, ...props }) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatName = name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;
  return <Form.Item name={concatName} label={label} className='custom-label' {...props} />;
};

const FormSaison = () => {
  const [nom, setNom] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");



  const onFinish = async (values) => {
    console.log("nom:", nom);
    console.log("dateDebut:", dateDebut);
    console.log("dateFin:", dateFin);
  
    const data = {
      nom: nom,
      dateDebut: dateDebut,
      dateFin: dateFin
    };
  
    console.log("Data:", data);
  
    try {
      const response = await axios.post('http://localhost:8000/api/saison/createSaison', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log(response.data); 
      
    } catch (error) {
      console.error("Error sending request to the server:", error);
    }
  };
  

 


  return (
    <Form  className="form" name="form_item_path" layout="vertical" onFinish={onFinish}>
      <MyFormItemGroup prefix={['user']}>
        <MyFormItemGroup prefix={['name']}>
          <MyFormItem   name="nom" label="Nom de la saison"  >
            <Input className='input'  value={nom}
          onChange={(e) => setNom(e.target.value)} />
          </MyFormItem>
          <MyFormItem  name="date debut" label="Date Début"  >
            <Input className='input' type='date'  value={dateDebut}
          onChange={(e) => setDateDebut(e.target.value)} />
          </MyFormItem>
        </MyFormItemGroup>

        <MyFormItem  name="date fin" label="Date Fin" >
          <Input className='input' type='date' value={dateFin}
          onChange={(e) => setDateFin(e.target.value)} />
        </MyFormItem>
      </MyFormItemGroup>

      <Button className='btn-creation' type="primary" htmlType="submit">
        Créer la saison
      </Button>
    </Form>
  );
};

export default FormSaison;
