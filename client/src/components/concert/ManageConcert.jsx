import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageConcert.css";
import { MdDelete, MdEdit, MdSave } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import disponibleMembersIcon from "../../assets/img/avatars/authentication.svg";

const ManageConcert = () => {
  const [concerts, setConcerts] = useState([]);
  const [editConcertId, setEditConcertId] = useState(null);
  const [editedDate, setEditedDate] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [excelFile, setExcelFile] = useState(null); // State for the uploaded Excel file
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/concerts/get-concerts"
        );
        setConcerts(response.data);
        console.log("donees", response.data);
      } catch (error) {
        console.error("Error fetching concerts:", error);
      }
    };

    fetchConcerts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/concerts/${id}`);
      setConcerts(concerts.filter((concert) => concert._id !== id));
    } catch (error) {
      console.error("Error deleting concert:", error);
    }
  };

  const handleEdit = (id, date, location) => {
    setEditConcertId(id);
    setEditedDate(date);
    setEditedLocation(location);
  };

  const handleSave = async (id) => {
    try {
      const formData = new FormData();
      formData.append("date", editedDate);
      formData.append("lieu", editedLocation);
      formData.append("excelFile", excelFile); // Append the uploaded Excel file to the form data

      const response = await axios.patch(
        `http://localhost:8000/api/concerts/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type to multipart form data
          },
        }
      );

      if (response.status === 200) {
        const updatedConcerts = concerts.map((concert) => {
          if (concert._id === id) {
            // Iterate over the listeMembres array to set the disponibility attribute for each member
            const updatedListeMembres = concert.listeMembres.map((member) => {
              return {
                ...member,
                disponibility: { isAvailable: true }, // Set the disponibility attribute
              };
            });

            return {
              ...concert,
              date: editedDate,
              lieu: editedLocation,
              listeMembres: updatedListeMembres, // Update the listeMembres array with updated disponibility attribute
            };
          }
          return concert;
        });
        setConcerts(updatedConcerts);
        setEditConcertId(null);
      } else {
        console.error("Failed to update concert");
      }
    } catch (error) {
      console.error("Error updating concert:", error);
    }
  };

  return (
    <div className="concert-list">
      <h1>Concert List</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Program</th>
            <th>Members</th>
            <th>Excel File</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {concerts.map((concert) => (
            <tr key={concert._id}>
              <td>{concert.titre}</td>
              <td>
                {editConcertId === concert._id ? (
                  <input
                    type="date"
                    value={editedDate}
                    onChange={(e) => setEditedDate(e.target.value)}
                  />
                ) : (
                  new Date(concert.date).toLocaleDateString()
                )}
              </td>
              <td>
                {editConcertId === concert._id ? (
                  <input
                    type="text"
                    value={editedLocation}
                    onChange={(e) => setEditedLocation(e.target.value)}
                  />
                ) : (
                  concert.lieu
                )}
              </td>
              <td>
                <ul>
                  {concert.programme.map((item) => (
                    <li key={item._id}>
                      Oeuvre: {item.oeuvre.titre}, Theme: {item.theme}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {concert.listeMembres.map((member) => (
                    <li key={member._id}>
                      Member: {member && member.membre && member.membre.nom},
                      Presence:{" "}
                      {member && member.presence ? "Present" : "Absent"}
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={(e) => setExcelFile(e.target.files[0])}
                />
              </td>
              <td>
                {editConcertId === concert._id ? (
                  <button
                    onClick={() => handleSave(concert._id)}
                    className="save-btn"
                  >
                    <MdSave />
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleEdit(concert._id, concert.date, concert.lieu)
                    }
                    className="edit-btn"
                  >
                    <MdEdit />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(concert._id)}
                  className="delete-btn"
                >
                  <MdDelete />
                </button>

                <button
                  onClick={() =>
                    navigate(
                      `/dashboard/admin/concerts/disponible-members/${concert._id}`
                    )
                  }
                  className="delete-btn"
                  style={{ width: "50%", padding: "10px 20px" }}
                  title="Consulter la liste des choristes disponibles"
                >
                  <img src={disponibleMembersIcon} style={{ width: "100%" }} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/dashboard/admin/concert/addConcert">
        <button>Ajouter un Concert</button>
      </Link>
    </div>
  );
};

export default ManageConcert;
