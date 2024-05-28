import React, { useState, useEffect } from "react";
import axios from "axios";
import "./congeChoriste.css";

const CongeChoriste = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [storedToken, setStoredToken] = useState("");

  useEffect(() => {
    const storedTokenValue = String(localStorage.getItem("token"));

    if (storedTokenValue && storedTokenValue !== "null") {
      setStoredToken(storedTokenValue);
    }
  }, []);

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

    if (!storedToken) {
      setMessage({ text: "Please sign in first", type: "error" });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDateObj = new Date(startDate);

    if (startDateObj.getTime() < today.getTime()) {
      setMessage({ text: "Start date cannot be in the past", type: "error" });
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
        setMessage({
          text: "le congé a été ajouté avec succès",
          type: "success",
        });
        console.log("Congé saved successfully:", response.data);
      })
      .catch((error) => {
        setMessage({ text: "le conge deja existe", type: "error" });
        console.log("error", error);
      });
  };

  return (
    <>
      <h2 className="title">Congé Choriste</h2>
      <div className="content">
        <div className="message-container">
          {message.text && (
            <p
              className={
                message.type === "error" ? "error-message" : "success-message"
              }
            >
              {message.text}
            </p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="form">
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
      </div>
    </>
  );
};

export default CongeChoriste;
