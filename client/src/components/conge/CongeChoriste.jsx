import React, { useState, useEffect } from "react";
import axios from "axios";
import "./congeChoriste.css";

const CongeChoriste = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [storedToken, setStoredToken] = useState("");
  useEffect(() => {
    const storedTokenValue = String(localStorage.getItem("token"));

    if (storedTokenValue && storedTokenValue != "null") {
      setStoredToken(storedTokenValue);
      if (storedToken) {
        console.log(storedToken);
      }
    }
  }, [storedToken]); // Run once on component mount

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if authToken is available
    if (!storedToken) {
      setError("Please sign in first");
      return;
    }

    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours, minutes, seconds, milliseconds

    // Parse start date
    const startDateObj = new Date(startDate);

    // Check if start date is in the past
    if (startDateObj.getTime() < today.getTime()) {
      setError("Start date cannot be in the past");
      return;
    }

    const formData = {
      dateDebut: startDate,
      dateFin: endDate,
      raison: reason,
    };

    axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;

    axios
      .post("http://localhost:8000/api/conge/", formData)
      .then((response) => {
        setError("le congé a été ajouté avec succès ");
        console.log("Congé saved successfully:", response.data);
      })
      .catch((error) => {
        // Handle error
        setError("le conge deja existe ");
        console.log("error", storedToken);
      });
  };

  return (
    <>
      <h2 className="title">Congé Choriste</h2>
      <div className="content">
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={handleStartDateChange}
              required
            />
          </div>
          <div>
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={handleEndDateChange}
              required
            />
          </div>
          <div>
            <label htmlFor="reason">Reason:</label>
            <input
              type="text"
              id="reason"
              value={reason}
              onChange={handleReasonChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </>
  );
};

export default CongeChoriste;
