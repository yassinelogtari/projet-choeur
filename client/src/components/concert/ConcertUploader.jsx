import { useState } from "react";
import axios from "axios";
import "./concertUploader.css";
const ConcertUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  // Function to handle file selection
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Function to handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select an Excel file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("excelFilePath", selectedFile);
      const response = await axios.post(
        "http://localhost:8000/api/concerts/concert",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && response.data.success) {
        const updatedMembers = response.data.data.listeMembres.map(
          (member) => ({
            ...member,
            disponibility: { isAvailable: true },
          })
        );

        console.log("Updated Members:", updatedMembers);

        response.data.data.listeMembres = updatedMembers;
      }
      console.log("Upload response:", response.data);
      setUploadStatus("Concert data uploaded successfully.");
    } catch (error) {
      console.error("Error uploading concert data:", error);
      setUploadStatus("Failed to upload concert data. Please try again.");
    }
  };

  return (
    <div className="content">
      <div>
        <h2 className="titre1">Concert Uploader</h2>
        <label htmlFor="fileInput" className="custom-file-input">
          Choose File
          <input type="file" id="fileInput" onChange={handleFileChange} />
        </label>
        <button onClick={handleUpload}>Upload</button>

        <p>{uploadStatus}</p>
      </div>
    </div>
  );
};

export default ConcertUploader;
