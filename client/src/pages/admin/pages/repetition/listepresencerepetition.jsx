import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { MenuItem, FormControl, Select, Box } from '@mui/material';
import axios from 'axios';
import "./listepresencerepetition.css";
const ListeCandidatesParPupitre = () => {
    const [pupitre, setPupitre] = useState('');
    const [candidates, setCandidates] = useState([]);

    const handleChange = async (event) => {
        const selectedPupitre = event.target.value;
        setPupitre(selectedPupitre);
    


    }}