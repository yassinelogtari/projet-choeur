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
      console.log("authToken", storedToken);
      setError("Please sign in first");
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
        console.log("error", storedToken);
        setError("le conge deja existe ");
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
