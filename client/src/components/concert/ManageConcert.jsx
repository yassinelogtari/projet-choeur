import React, { useState } from "react";
import "./ManageConcert.css";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

const ManageConcert = () => {
  const [concerts, setConcerts] = useState([
    {
      id: 1,
      titre: "Concert 1",
      listeMembres: "Membres 1, Membres 2",
      excelFilePath: "example.xlsx",
      affiche: "poster.jpg",
      programme: "Programme 1",
      lieu: "Location 1",
      date: "2024-04-01",
    },
    {
      id: 2,
      titre: "Concert 2",
      listeMembres: "Membres 3, Membres 4",
      excelFilePath: "example2.xlsx",
      affiche: "poster2.jpg",
      programme: "Programme 2",
      lieu: "Location 2",
      date: "2024-04-15",
    },
    {
      id: 3,
      titre: "Concert 3",
      listeMembres: "Membres 1, Membres 2",
      excelFilePath: "example.xlsx",
      affiche: "poster.jpg",
      programme: "Programme 1",
      lieu: "Location 1",
      date: "2024-04-01",
    },
    {
      id: 4,
      titre: "Concert 4",
      listeMembres: "Membres 1, Membres 2",
      excelFilePath: "example.xlsx",
      affiche: "poster.jpg",
      programme: "Programme 1",
      lieu: "Location 1",
      date: "2024-04-01",
    },
    {
      id: 5,
      titre: "Concert 5",
      listeMembres: "Membres 1, Membres 2",
      excelFilePath: "example.xlsx",
      affiche: "poster.jpg",
      programme: "Programme 1",
      lieu: "Location 1",
      date: "2024-04-01",
    },
  ]);

  const [editedConcertId, setEditedConcertId] = useState(null);

  const handleDelete = (id) => {
    setConcerts(concerts.filter((concert) => concert.id !== id));
  };

  const handleEdit = (id) => {
    setEditedConcertId(id);
  };

  const handleSaveEdit = (id, field, value) => {
    const updatedConcerts = concerts.map((concert) => {
      if (concert.id === id) {
        return { ...concert, [field]: value };
      }
      return concert;
    });
    setConcerts(updatedConcerts);

    // Delay setting editedConcertId to null by a short interval
    setTimeout(() => {
      setEditedConcertId(null);
    }, 5000); // Adjust the delay time as needed
  };

  return (
    <>
      <div className="titleCounter">
        <h1 className="title">Manage concerts</h1>
      </div>
      <div className="table-container">
        <table className="concert-table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Liste des Membres</th>
              <th>Fichier Excel</th>
              <th>Affiche</th>
              <th>Programme</th>
              <th>Lieu</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {concerts.map((concert) => (
              <tr key={concert.id}>
                <td>
                  {editedConcertId === concert.id ? (
                    <input
                      type="text"
                      value={concert.titre}
                      onChange={(e) =>
                        handleSaveEdit(concert.id, "titre", e.target.value)
                      }
                      onBlur={() => setEditedConcertId(null)}
                    />
                  ) : (
                    concert.titre
                  )}
                </td>
                <td>
                  {editedConcertId === concert.id ? (
                    <input
                      type="text"
                      value={concert.listeMembres}
                      onChange={(e) =>
                        handleSaveEdit(
                          concert.id,
                          "listeMembres",
                          e.target.value
                        )
                      }
                      onBlur={() => setEditedConcertId(null)}
                    />
                  ) : (
                    concert.listeMembres
                  )}
                </td>
                <td>
                  {editedConcertId === concert.id ? (
                    <input
                      type="text"
                      value={concert.excelFilePath}
                      onChange={(e) =>
                        handleSaveEdit(
                          concert.id,
                          "excelFilePath",
                          e.target.value
                        )
                      }
                      onBlur={() => setEditedConcertId(null)}
                    />
                  ) : (
                    concert.excelFilePath
                  )}
                </td>
                <td>
                  {editedConcertId === concert.id ? (
                    <input
                      type="text"
                      value={concert.affiche}
                      onChange={(e) =>
                        handleSaveEdit(concert.id, "affiche", e.target.value)
                      }
                      onBlur={() => setEditedConcertId(null)}
                    />
                  ) : (
                    concert.affiche
                  )}
                </td>
                <td>
                  {editedConcertId === concert.id ? (
                    <input
                      type="text"
                      value={concert.programme}
                      onChange={(e) =>
                        handleSaveEdit(concert.id, "programme", e.target.value)
                      }
                      onBlur={() => setEditedConcertId(null)}
                    />
                  ) : (
                    concert.programme
                  )}
                </td>
                <td>
                  {editedConcertId === concert.id ? (
                    <input
                      type="text"
                      value={concert.lieu}
                      onChange={(e) =>
                        handleSaveEdit(concert.id, "lieu", e.target.value)
                      }
                      onBlur={() => setEditedConcertId(null)}
                    />
                  ) : (
                    concert.lieu
                  )}
                </td>
                <td>
                  {editedConcertId === concert.id ? (
                    <input
                      type="date"
                      value={concert.date}
                      onChange={(e) =>
                        handleSaveEdit(concert.id, "date", e.target.value)
                      }
                      onBlur={() => setEditedConcertId(null)}
                    />
                  ) : (
                    concert.date
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(concert.id)}
                    className="delete"
                  >
                    <FaEdit className="Fa" />
                  </button>
                  <button
                    onClick={() => handleDelete(concert.id)}
                    className="delete"
                  >
                    <MdDelete className="Md" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Link to="/addConcert">
          <button>Ajouter un Concert</button>
        </Link>
      </div>
    </>
  );
};

export default ManageConcert;
