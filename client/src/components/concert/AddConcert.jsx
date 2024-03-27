import { useState } from "react";
import axios from "axios";
import "./AddConcert.css";
import { Link } from "react-router-dom";
const AddConcert = () => {
  const [formData, setFormData] = useState({
    titre: "",
    date: "",
    lieu: "",
    programme: "",
    affiche: null,
    excelFilePath: null,
    listeMembres: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const selectedFile = files[0];
    setFormData({ ...formData, [name]: selectedFile });
    // Clear error message when file changes
    setErrors({ ...errors, [name]: "" });

    // Update input value with file name or type
    const inputLabel = selectedFile ? selectedFile.name : "Choose a file";
    const fileInfoElement = e.target.parentNode.querySelector(".fileInfo");
    if (fileInfoElement) {
      fileInfoElement.textContent = inputLabel;
      // Hide label when file name is displayed
      fileInfoElement.style.display = selectedFile ? "inline-block" : "none";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formErrors = {};
      if (!formData.titre) {
        formErrors.titre = "Titre is required";
      }
      if (!formData.date) {
        formErrors.date = "Date is required";
      }
      if (!formData.lieu) {
        formErrors.lieu = "Lieu is required";
      }
      if (!formData.listeMembres) {
        formErrors.listeMembres = "Liste des Membres is required";
      }

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }
      const concertData = {
        titre: formData.titre,
        date: formData.date,
        lieu: formData.lieu,
        listeMembres: formData.listeMembres,
      };

      // Send POST request to backend
      const response = await axios.post("/api/add-concert", concertData);

      // Handle response
      console.log("Concert added:", response.data);
      alert("Concert ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout du concert :", error);
      alert("Une erreur s'est produite lors de l'ajout du concert.");
    }
  };

  return (
    <>
      <Link to="/dashboard/admin/home">
        <button>Home</button>
      </Link>
      <div className="frame">
        <div className="titreContainer">
          <h2 className="titre">Ajouter un Concert</h2>
        </div>
        <div className="formConcert">
          <div className="formBorder">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label">Titre:</label>
                <input
                  type="text"
                  name="titre"
                  className="input"
                  value={formData.titre}
                  onChange={handleChange}
                />
                {errors.titre && <span className="error">{errors.titre}</span>}
              </div>

              <div className="form-group">
                <label className="label">Date:</label>
                <input
                  type="date"
                  name="date"
                  className="input"
                  value={formData.date}
                  onChange={handleChange}
                />
                {errors.date && <span className="error">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label className="label">Lieu:</label>
                <input
                  type="text"
                  name="lieu"
                  className="input"
                  value={formData.lieu}
                  onChange={handleChange}
                />
                {errors.lieu && <span className="error">{errors.lieu}</span>}
              </div>

              {/* Add error handling for other fields */}

              <label className="labelFile">
                Affiche
                <input type="file" name="affiche" onChange={handleFileChange} />
                <span className="fileInfo"></span>
                {errors.affiche && (
                  <span className="error">{errors.affiche}</span>
                )}
              </label>

              <label className="labelFile">
                Fichier Excel
                <input
                  type="file"
                  name="excelFilePath"
                  onChange={handleFileChange}
                />
                <span className="fileInfo"></span>
                {errors.excelFilePath && (
                  <span className="error">{errors.excelFilePath}</span>
                )}
              </label>

              <div className="form-group">
                <label className="label">Liste des Membres:</label>
                <input
                  type="text"
                  name="listeMembres"
                  className="input"
                  value={formData.listeMembres}
                  onChange={handleChange}
                />
                {errors.listeMembres && (
                  <span className="error">{errors.listeMembres}</span>
                )}
              </div>

              <div className="buttonCounter">
                <button type="submit" className="button">
                  Ajouter le Concert
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddConcert;
