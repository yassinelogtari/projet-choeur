import { useState, useEffect } from "react";
import axios from "axios";
import "./addPlacement.css";
import { Link } from "react-router-dom";

const AddPlacement = () => {
  const [concertId, setConcertId] = useState("");
  const [seatsPerRow, setSeatsPerRow] = useState("");
  const [rows, setRows] = useState("");
  const [message, setMessage] = useState("");
  const [concerts, setConcerts] = useState([]);
  const [storedToken, setStoredToken] = useState("");
  useEffect(() => {
    const storedTokenValue = String(localStorage.getItem("token"));

    if (storedTokenValue && storedTokenValue != "null") {
      setStoredToken(storedTokenValue);
      if (storedToken) {
        console.log(storedToken);
      }
    }
  }, [storedToken]);
  useEffect(() => {
    fetchConcerts();
  }, []);

  const fetchConcerts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/concerts/get-concerts"
      );
      setConcerts(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching concerts:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/placement/placerMembre",
        {
          concert_id: concertId,
          nombreDePlacesParRangée: seatsPerRow,
          nombreDeRangées: rows,
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error: Placement could not be saved");
      console.error(error);
    }
  };

  return (
    <>
      <div className="contenu">
        <h2>Placement Form</h2>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Concert:
            <select
              className="inputet1"
              value={concertId}
              onChange={(e) => setConcertId(e.target.value)}
            >
              <option value="">Select a concert</option>
              {concerts.map((concert) => (
                <option key={concert._id} value={concert._id} className="item">
                  {concert.titre}
                </option>
              ))}
            </select>
          </label>
          <label>
            Places par rangée:
            <input
              className="inputet"
              type="number"
              value={seatsPerRow}
              onChange={(e) => setSeatsPerRow(e.target.value)}
            />
          </label>
          <label>
            rangées:
            <input
              className="inputet3"
              type="number"
              value={rows}
              onChange={(e) => setRows(e.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="border">
        {message && <p className="message">{message}</p>}
      </div>
      <Link to="/dashboard/admin/placement/affiche">
        <button className="bouton-affiche">Placements</button>
      </Link>
    </>
  );
};

export default AddPlacement;
