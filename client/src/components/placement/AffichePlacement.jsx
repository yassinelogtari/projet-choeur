import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AfiichePlacement.css";
import { MdEdit } from "react-icons/md";

function AffichePlacement() {
  const [placements, setPlacements] = useState([]);
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const [memberEmails, setMemberEmails] = useState({});
  const [memberNames, setMemberNames] = useState({});
  const [memberFirstNames, setMemberFirstNames] = useState({});
  const [editedRow, setEditedRow] = useState(null);
  const [editedColumn, setEditedColumn] = useState(null);
  const [editedMemberId, setEditedMemberId] = useState(null);
  const [selectedMemberInfo, setSelectedMemberInfo] = useState(null);
  const [memberTailles, setMemberTailles] = useState({});

  const [editedData, setEditedData] = useState({
    row: null,
    column: null,
    memberId: null,
  });
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  const [memberPupitres, setMemberPupitres] = useState({});

  const fetchMemberPupitre = async (memberId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/membre/getMembreById/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.model.pupitre;
    } catch (error) {
      console.error("Error fetching member pupitre:", error);
      return "Unknown";
    }
  };
  useEffect(() => {
    // Initialize editedRow, editedColumn, and editedMemberId
    if (selectedPlacement && selectedPlacement.place.length > 0) {
      const firstPlace = selectedPlacement.place[0];
      setEditedRow(firstPlace.row);
      setEditedColumn(firstPlace.column);
      setEditedMemberId(firstPlace.membre);
    }
  }, [selectedPlacement]);
  useEffect(() => {
    const fetchToken = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/placement/getAllPlacements",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPlacements(response.data.placements);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    if (token) {
      fetchPlacements();
    }
  }, [token]);

  const fetchMemberEmail = async (memberId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/membre/getMembreById/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.model.email;
    } catch (error) {
      console.error("Error fetching member email:", error);
      return "Unknown";
    }
  };

  const fetchMemberName = async (memberId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/membre/getMembreById/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.model.nom;
    } catch (error) {
      console.error("Error fetching member name:", error);
      return "Unknown";
    }
  };

  const fetchMemberFirstName = async (memberId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/membre/getMembreById/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.model.prenom;
    } catch (error) {
      console.error("Error fetching member first name:", error);
      return "Unknown";
    }
  };
  const handleMemberClick = async (memberId) => {
    try {
      // Fetch member information from the server using memberId
      const response = await axios.get(
        `http://localhost:8000/api/membre/getMembreById/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the selected member information
      setSelectedMemberInfo(response.data.model);
      console.log("Selected member information:", response.data.model);
    } catch (error) {
      console.error("Error fetching member information:", error);
    }
  };

  useEffect(() => {
    const updateMemberEmails = async () => {
      const emails = {};
      for (const placement of placements) {
        for (const place of placement.place) {
          if (place.membre) {
            emails[place.membre] = await fetchMemberEmail(place.membre);
          }
        }
      }
      setMemberEmails(emails);
    };

    if (placements.length > 0) {
      updateMemberEmails();
    }
  }, [placements, token]);

  useEffect(() => {
    const updateMemberNames = async () => {
      const names = {};
      for (const placement of placements) {
        for (const place of placement.place) {
          if (place.membre) {
            names[place.membre] = await fetchMemberName(place.membre);
          }
        }
      }
      setMemberNames(names);
    };

    if (placements.length > 0) {
      updateMemberNames();
    }
  }, [placements, token]);

  useEffect(() => {
    const updateMemberFirstNames = async () => {
      const firstNames = {};
      for (const placement of placements) {
        for (const place of placement.place) {
          if (place.membre) {
            firstNames[place.membre] = await fetchMemberFirstName(place.membre);
          }
        }
      }
      setMemberFirstNames(firstNames);
    };

    if (placements.length > 0) {
      updateMemberFirstNames();
    }
  }, [placements, token]);

  const fetchMemberTaille = async (memberId) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/membre/getMembreById/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.model.taille;
    } catch (error) {
      console.error("Error fetching member taille:", error);
      return "Unknown";
    }
  };
  useEffect(() => {
    const fetchMemberTailles = async () => {
      const tailles = {};
      for (const placement of placements) {
        for (const place of placement.place) {
          if (place.membre) {
            // Fetch and set member taille here
            const taille = await fetchMemberTaille(place.membre);
            tailles[place.membre] = taille;
          }
        }
      }
      setMemberTailles(tailles);
    };

    if (placements.length > 0) {
      fetchMemberTailles();
    }
  }, [placements]);

  const handlePlacementSelect = (event) => {
    const selectedPlacementId = event.target.value;
    const selected = placements.find(
      (placement) => placement._id === selectedPlacementId
    );
    setSelectedPlacement(selected);
  };

  const handleEdit = (place) => {
    setEditingMemberId(place.membre);
    setEditedData({
      row: place.row,
      column: place.column,
      memberId: place.membre,
    });
  };
  const handleSave = async (place) => {
    try {
      // Get the new row and column values
      const newRow = parseInt(editedData.row);
      const newColumn = parseInt(editedData.column);

      // Find the place of the member being edited
      const editedPlaceIndex = selectedPlacement.place.findIndex(
        (p) => p.membre === editedMemberId
      );

      // If the edited place exists
      if (editedPlaceIndex !== -1) {
        const editedPlace = selectedPlacement.place[editedPlaceIndex];

        // Check if the new row and column values are different
        if (newRow !== editedPlace.row || newColumn !== editedPlace.column) {
          // Find the place of the member occupying the new row and column
          const targetPlaceIndex = selectedPlacement.place.findIndex(
            (p) => p.row === newRow && p.column === newColumn
          );

          // If there's a member in the target place, swap the places
          if (targetPlaceIndex !== -1) {
            const targetPlace = selectedPlacement.place[targetPlaceIndex];

            // Log the values being sent to the database
            console.log(
              "Updating placement for edited member:",
              JSON.stringify(
                {
                  memberId: editedMemberId,
                  newRow: targetPlace.row,
                  newColumn: targetPlace.column,
                },
                null,
                2
              )
            );

            console.log(
              "Updating placement for target member:",
              JSON.stringify(
                {
                  memberId: targetPlace.membre,
                  newRow: editedPlace.row,
                  newColumn: editedPlace.column,
                },
                null,
                2
              )
            );

            // Swap the places in the state
            const updatedPlaces = [...selectedPlacement.place];
            updatedPlaces[editedPlaceIndex] = {
              ...editedPlace,
              row: targetPlace.row,
              column: targetPlace.column,
            };
            updatedPlaces[targetPlaceIndex] = {
              ...targetPlace,
              row: editedPlace.row,
              column: editedPlace.column,
            };

            // Update the state with the swapped places
            setSelectedPlacement({
              ...selectedPlacement,
              place: updatedPlaces,
            });

            // Make API calls to update the placements in the backend
            await Promise.all([
              axios.patch(
                `http://localhost:8000/api/placement/updatePlacement/${selectedPlacement._id}`,
                {
                  row: targetPlace.row,
                  column: targetPlace.column,
                  membre: editedMemberId,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              ),
              axios.patch(
                `http://localhost:8000/api/placement/updatePlacement/${selectedPlacement._id}`,
                {
                  row: editedPlace.row,
                  column: editedPlace.column,
                  membre: targetPlace.membre,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              ),
            ]);
          } else {
            // Handle the case where there's no member in the target place
            console.error("Target place not found");
          }
        }
      } else {
        // Handle the case where the edited place doesn't exist
        console.error("Edited place not found");
      }

      // Reset the editingMemberId state after saving
      setEditingMemberId(null);
      setEditedData({
        row: null,
        column: null,
        memberId: null,
      });
    } catch (error) {
      console.error("Error updating placement:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!placements.length) {
    return <div>No placements found</div>;
  }

  const toggleGraphVisibility = async () => {
    setShowGraph(!showGraph);

    // If the "Show Graph" button is clicked, fetch member pupitres
    if (!showGraph) {
      try {
        const pupitres = {};
        // Loop through all placements to fetch member pupitres
        for (const placement of placements) {
          for (const place of placement.place) {
            if (place.membre) {
              const pupitre = await fetchMemberPupitre(place.membre);
              pupitres[place.membre] = pupitre;
            }
          }
        }
        // Update the memberPupitres state with fetched pupitres
        setMemberPupitres(pupitres);
      } catch (error) {
        console.error("Error fetching member pupitres:", error);
      }
    }
  };
  const maxSizes = {};

  for (const placement of placements) {
    for (const place of placement.place) {
      if (place.membre) {
        if (!maxSizes[place.column] || place.row > maxSizes[place.column]) {
          maxSizes[place.column] = place.row;
        }
      }
    }
  }

  return (
    <div className="afficheContenu">
      <div>
        <h2>Placements</h2>
      </div>
      <div>
        <select className="selectPlacement" onChange={handlePlacementSelect}>
          <option value="">Select a placement</option>
          {placements.map((placement) => (
            <option key={placement._id} value={placement._id}>
              {placement.concert.titre}
            </option>
          ))}
        </select>
      </div>
      {selectedPlacement && (
        <div>
          <h3> Détail de placement</h3>
          <table>
            <thead>
              <tr>
                <th>Row</th>
                <th>Column</th>
                <th>Member Email</th>
                <th>Member Name</th>
                <th>Member First Name</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {selectedPlacement.place.map((place) => (
                <tr key={place._id}>
                  <td>
                    {editingMemberId === place.membre ? (
                      <input
                        type="text"
                        value={editedData.row || ""}
                        onChange={(e) =>
                          setEditedData({ ...editedData, row: e.target.value })
                        }
                      />
                    ) : (
                      place.row
                    )}
                  </td>

                  <td>
                    {editingMemberId === place.membre ? (
                      <input
                        type="text"
                        value={editedData.column || ""}
                        onChange={(e) =>
                          setEditedData({
                            ...editedData,
                            column: e.target.value,
                          })
                        }
                      />
                    ) : (
                      place.column
                    )}
                  </td>
                  <td>{memberEmails[place.membre] || "Unknown"}</td>
                  <td>{memberNames[place.membre] || "Unknown"}</td>
                  <td>{memberFirstNames[place.membre] || "Unknown"}</td>
                  <td className="but">
                    {editedData.memberId === place.membre ? (
                      <button
                        className="butin"
                        onClick={() => handleSave(place)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="butin"
                        onClick={() => handleEdit(place)}
                      >
                        <MdEdit className="butinin" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="graph-toggle-button">
            <button onClick={toggleGraphVisibility}>
              {showGraph ? "Hide Graph" : "Show Graph"}
            </button>
          </div>
          {showGraph && (
            <div>
              <br />
              <h3> Representation</h3>
              <div className="graph-container">
                {/* Rendering buttons for each pupitre in a vertical line */}
                {["basse", "alto", "soprano", "ténor"].map((pupitre) => (
                  <div key={pupitre} className="pupitre-column">
                    <div className="pupitre-line"></div>
                    <div className="membre-container">
                      {/* Filter and sort members by pupitre and taille */}
                      {selectedPlacement.place
                        .filter(
                          (place) => memberPupitres[place.membre] === pupitre
                        )
                        .sort(
                          (a, b) =>
                            memberTailles[a.membre] - memberTailles[b.membre]
                        )
                        .map((place, index) => {
                          const memberName =
                            memberNames[place.membre] || "Unknown";
                          const pupitreColor =
                            memberPupitres[place.membre] === pupitre
                              ? (() => {
                                  switch (pupitre) {
                                    case "soprano":
                                      return "#10439F";
                                    case "alto":
                                      return "#874CCC";
                                    case "ténor":
                                      return "#C65BCF";
                                    case "basse":
                                      return "#F27BBD";
                                    default:
                                      return "black";
                                  }
                                })()
                              : "black";
                          const memberTaille =
                            memberTailles[place.membre] || "Unknown";
                          console.log(
                            `Taille of ${memberName}: ${memberTaille}`
                          );
                          const marginRight = (index + 1) * 20; // Adjust the multiplier as needed

                          if (memberName !== "Unknown") {
                            return (
                              <button
                                key={place._id}
                                className="membre-button"
                                style={{
                                  backgroundColor: pupitreColor,
                                  marginRight: `${marginRight}px`,
                                }}
                                onClick={() => handleMemberClick(place.membre)}
                              >
                                {memberName}
                              </button>
                            );
                          }
                          return null;
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showGraph && selectedMemberInfo && (
            <div className="member-info-container">
              <div className="member-info">
                <h3 className="seemore">Member Information</h3>
                <p>
                  <span>Name:</span> {selectedMemberInfo.nom}
                </p>
                <p>
                  <span>Prenom:</span> {selectedMemberInfo.prenom}
                </p>
                <p>
                  <span>Email:</span> {selectedMemberInfo.email}
                </p>
                <p>
                  <span>Role:</span> {selectedMemberInfo.role}
                </p>
                <p>
                  <span>Pupitre:</span> {selectedMemberInfo.pupitre}
                </p>
                <p>
                  <span>Taille:</span> {selectedMemberInfo.taille}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default AffichePlacement;
