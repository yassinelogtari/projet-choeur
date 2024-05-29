import React, { useState, useEffect } from "react";
import { TextField, MenuItem } from "@mui/material";
import axios from "axios";
import "./presenceMainConcert.css";
import DialogComponent from "../../../../components/dialog/Dialog";

const PresenceMainRepetition = () => {
  const [repetitions, setRepetitions] = useState([]);
  const [selectedRepetitionId, setSelectedRepetitionId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchRepetitions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/repetition/getAllRepetition"
        );
        setRepetitions(response.data.model);
        console.log(response.data.model[0]);
      } catch (error) {
        console.error("Error fetching repetitions:", error);
      }
    };

    fetchRepetitions();
  }, []);

  const handleRepetitionChange = (event) => {
    setSelectedRepetitionId(event.target.value);
    setSelectedMemberId("");
  };

  const handleMemberChange = (event) => {
    setSelectedMemberId(event.target.value);
  };

  const handlePresenceMarking = async () => {
    try {
      await axios.put(
        "http://localhost:8000/api/presence/manually/repetition",
        {
          idRepetition: selectedRepetitionId,
          idMember: selectedMemberId,
        }
      );
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
        <h3>Repetitions Presence</h3>
        <TextField
          select
          label="Select Repetition"
          value={selectedRepetitionId}
          onChange={handleRepetitionChange}
          variant="outlined"
          fullWidth
          className="concertFieldMain"
        >
          {repetitions.map((rep) => (
            <MenuItem key={rep._id} value={rep._id}>
              {rep.DateRep}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Select Member"
          value={selectedMemberId}
          onChange={handleMemberChange}
          variant="outlined"
          fullWidth
          disabled={!selectedRepetitionId}
        >
          {selectedRepetitionId &&
            Object.keys(
              repetitions.find((rep) => rep._id === selectedRepetitionId)
                ?.membres || []
            ).map((sectionName) =>
              repetitions
                .find((rep) => rep._id === selectedRepetitionId)
                ?.membres[sectionName].map((member) => (
                  <MenuItem key={member._id} value={member._id}>
                    {member.nom} {member.prenom}
                  </MenuItem>
                ))
            )}
        </TextField>
        <button onClick={handlePresenceMarking}>Mark Presence</button>
        <div>
          <DialogComponent
            open={openDialog}
            handleClose={handleCloseDialog}
            successMessage="Presence marked successfully!"
          />
        </div>
      </div>
    </div>
  );
};

export default PresenceMainRepetition;
