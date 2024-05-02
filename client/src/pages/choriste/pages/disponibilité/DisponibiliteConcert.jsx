import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import "./DisponibiliteConcert.css";

const DisponibiliteConcert = () => {
    const [concerts, setConcerts] = useState([]); // Reinstate the concerts state
    const [idCancert, setIdCancert] = useState('');
    const [isAvailable, setIsAvailable] = useState(false);
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchConcerts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/concerts/get-concerts');
                setConcerts(response.data); // Save the fetched concerts
            } catch (error) {
                console.log('Error fetching concerts', error);
            }
        };

        fetchConcerts();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Decode the token from localStorage
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const idMember = decoded.membreId;

        console.log("Selected concert ID:", idCancert);  // Debugging line

        try {
            const response = await axios.put('http://localhost:8000/api/disponibility/cancert/add', {
                idCancert,
                idMember,
                isAvailable,
                reason
            });

            setMessage(response.data.message || 'Disponibilité ajoutée avec succès!');
        } catch (error) {
            setMessage(error.response?.data?.error || 'Une erreur est survenue');
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} className="disponibility-form">
                <div className="form-group">
                    <label>Nom du Concert:</label>
                    <select 
                        value={idCancert} 
                        onChange={e => setIdCancert(e.target.value)} 
                        required
                    >
                        <option value="">Select a concert</option>
                        {concerts.map((concert) => (
                            <option key={concert._id} value={concert._id}>
                                {concert.titre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group checkbox">
                    <label>Available:</label>
                    <input type="checkbox" checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)} />
                </div>
                <div className="form-group">
                    <label>Reason (if not available):</label>
                    <textarea value={reason} onChange={e => setReason(e.target.value)} />
                </div>
                <button type="submit" className="submit-button">Submit</button>
            </form>
            {message && <p className="response-message">{message}</p>}
        </div>
    );
}

export default DisponibiliteConcert;
