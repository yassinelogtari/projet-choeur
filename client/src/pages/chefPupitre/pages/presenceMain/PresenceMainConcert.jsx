import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import axios from "axios";
import "./presenceMainConcert.css";
import DialogComponent from "../../../../components/dialog/Dialog";

const PresenceMainConcert = () => {
  const [concerts, setConcerts] = useState([]);
  const [selectedConcertId, setSelectedConcertId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/concerts/get-concerts"
        );
        setConcerts(response.data);
      } catch (error) {
        console.error("Error fetching concerts:", error);
      }
    };

    fetchConcerts();
  }, []);

  const handleConcertChange = (event) => {
    setSelectedConcertId(event.target.value);
    setSelectedMemberId("");
  };

  const handleMemberChange = (event) => {
    setSelectedMemberId(event.target.value);
  };

  const handlePresenceMarking = async () => {
    try {
      await axios.put("http://localhost:8000/api/presence/manually/cancert", {
        idCancert: selectedConcertId,
        idMember: selectedMemberId,
      });
      console.log("Presence marked successfully");
      setOpenDialog(true);
      setSelectedMemberId("");
    } catch (error) {
      console.error("Error marking presence:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <div className="position-absolute top-50 start-50 translate concertPresenceManuallyForm">
        <h3>Concerts Presence</h3>
        <TextField
          select
          label="Select Concert"
          value={selectedConcertId}
          onChange={handleConcertChange}
          variant="outlined"
          fullWidth
          className="concertFieldMain"
        >
          {concerts.map((concert) => (
            <option key={concert._id} value={concert._id}>
              {concert.titre}
            </option>
          ))}
        </TextField>
        <TextField
          select
          label="Select Member"
          value={selectedMemberId}
          onChange={handleMemberChange}
          variant="outlined"
          fullWidth
          disabled={!selectedConcertId}
        >
          {selectedConcertId &&
            concerts
              .find((concert) => concert._id === selectedConcertId)
              ?.listeMembres.map((member) => (
                <option key={member.membre._id} value={member.membre._id}>
                  {member.membre.nom}
                </option>
              ))}
        </TextField>
        <button onClick={handlePresenceMarking}>Mark Presence</button>
        <div>
          <DialogComponent
            open={openDialog}
            handleClose={handleCloseDialog}
            successMessage="Presence marked successfully !"
          />
        </div>
      </div>
    </div>
  );
};

export default PresenceMainConcert;
