import { useEffect, useState } from "react";
import axios from "axios";
import "./AddConcert.css";
import { Link } from "react-router-dom";

const AddConcert = () => {
  const [titre, setTitre] = useState("");
  const [date, setDate] = useState("");
  const [lieu, setLieu] = useState("");
  const [programme, setProgramme] = useState([{ oeuvre: "", theme: "" }]);
  const [displayOeuvre, setDisplayOeuvre] = useState([]);
  const [affiche, setAffiche] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [listeMembres, setlisteMembres] = useState([
    { membre: "", presence: false },
  ]);
  const [displayMembers, setDisplayMembers] = useState([]);

  const handleOeuvreChange = (index, value) => {
    const updatedProgramme = [...programme];
    updatedProgramme[index] = { ...updatedProgramme[index], oeuvre: value };
    setProgramme(updatedProgramme);
  };

  const handleThemeChange = (index, value) => {
    const updatedProgramme = [...programme];
    updatedProgramme[index] = { ...updatedProgramme[index], theme: value };
    setProgramme(updatedProgramme);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("date", date);
    formData.append("lieu", lieu);
    formData.append("affiche", affiche);

    formData.append("programme", JSON.stringify(programme));
    formData.append("listeMembresLength", listeMembres.length);
    listeMembres.forEach((member, index) => {
      formData.append(`listeMembres[${index}][membre]`, member.membre);
      formData.append(`listeMembres[${index}][presence]`, member.presence);
    });
    try {
      const response = await axios.post(
        "http://localhost:8000/api/concerts/add-concert",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      console.log("programme", programme);
      console.log("listeMembres", listeMembres);
      console.log("Display Oeuvre:", response.data.data);
    } catch (error) {
      console.error("Error sending request to the server:", error);
    }
  };

  useEffect(() => {
    const fetchOeuvre = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/oeuvre/getAll"
        );
        setDisplayOeuvre(response.data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des oeuvres:", error);
      }
    };
    fetchOeuvre();
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/membre/getAllMembers"
        );
        setDisplayMembers(response.data.model);
      } catch (error) {
        console.error("Erreur lors de la récupération des membres:", error);
      }
    };

    fetchMembers();
  }, []);
  const handleExcelFileChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  return (
    <>
      <div className="buttitle">
        <div className="butConcert">
          <Link to="/dashboard/admin/concert">
            <button>Concerts</button>
          </Link>
        </div>

        <div className="titreContainer">
          <h2 className="titre">Ajouter un Concert</h2>
          <div />
        </div>
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
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="label">Date:</label>
              <input
                type="date"
                name="date"
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min="1000-01-01"
              />
            </div>

            <div className="form-group">
              <label className="label">Lieu:</label>
              <input
                type="text"
                name="lieu"
                className="input"
                value={lieu}
                onChange={(e) => setLieu(e.target.value)}
              />
            </div>

            <label className="labelFile">
              Affiche
              <input
                type="file"
                name="affiche"
                onChange={(e) => setAffiche(e.target.files[0])}
              />
              <span>{affiche ? affiche.name : "No file selected"}</span>
            </label>
            <label className="labelFile">
              Excel File:
              <input
                type="file"
                name="excelFile"
                onChange={handleExcelFileChange}
              />
              <span>{excelFile ? excelFile.name : "No file selected"}</span>
            </label>

            <div className="form-group">
              <label className="label">Programme:</label>
              {programme.map((item, index) => (
                <div key={index} className="programme-item">
                  <select
                    value={item.oeuvre}
                    onChange={(e) => handleOeuvreChange(index, e.target.value)}
                  >
                    <option value="">Select Oeuvre</option>
                    {displayOeuvre.map((oeuvre) => (
                      <option key={oeuvre._id} value={oeuvre._id}>
                        {oeuvre.titre}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={item.theme}
                    onChange={(e) => handleThemeChange(index, e.target.value)}
                  />
                  {index === programme.length - 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setProgramme([...programme, { oeuvre: "", theme: "" }])
                      }
                    >
                      Add More
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="form-group">
              <label className="label">Liste des Membres:</label>
              {listeMembres.map((member, index) => (
                <div key={index} className="member-item">
                  <select
                    value={member.membre}
                    onChange={(e) => {
                      const updatedlisteMembres = [...listeMembres];
                      updatedlisteMembres[index] = {
                        ...updatedlisteMembres[index],
                        membre: e.target.value,
                      };
                      setlisteMembres(updatedlisteMembres);
                    }}
                  >
                    <option value="">Select membre</option>
                    {displayMembers.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.nom}
                      </option>
                    ))}
                  </select>
                  <label>
                    Présence:
                    <input
                      type="checkbox"
                      checked={member.presence}
                      onChange={(e) => {
                        const updatedlisteMembres = [...listeMembres];
                        updatedlisteMembres[index] = {
                          ...updatedlisteMembres[index],
                          presence: e.target.checked,
                        };
                        setlisteMembres(updatedlisteMembres);
                      }}
                    />
                  </label>
                  {index === listeMembres.length - 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setlisteMembres([
                          ...listeMembres,
                          { membre: "", presence: false },
                        ])
                      }
                    >
                      Add More
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="buttonCounter">
              <button type="submit" className="button">
                Ajouter le Concert
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddConcert;
