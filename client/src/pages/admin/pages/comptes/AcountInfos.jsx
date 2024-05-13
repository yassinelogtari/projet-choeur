import React, { useEffect, useState } from "react";
import adminIcon from "../../../../assets/img/avatars/admin-icon.png";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./accountInfo.css";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const AcountInfos = (props) => {
  const [candidateinfos, setAllCandidateInfos] = useState();
  const { id } = useParams();
  const fetchCandidateInfos = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/membre/getMembreById/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res) {
        console.log(res);
        setAllCandidateInfos(res.data.model);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCandidateInfos();
    console.log(candidateinfos);
  }, []);

  return candidateinfos ? (
    <div className="position-absolute top-50 start-50 translate-middle auditionTable">
      <div className="contentuinfoprofile">
        <div style={{ height: "50px" }}></div>
        <div className="contentuinfopart1">
          <img src={adminIcon} className="contentuinfopart1image" />
          <h1 className="contentuinfopart1h1">{candidateinfos.prenom}</h1>
        </div>
        <div className="content-columns">
          {Object.entries(candidateinfos)
            .filter(
              ([key]) =>
                key !== "_id" &&
                key !== "notifications" &&
                key !== "historiqueStatut" &&
                key !== "__v" &&
                key !== "isBanned" &&
                key !== "updatedAt"
            )
            .map(([key, value]) => (
              <div
                key={key}
                className="content-item"
                style={{ marginTop: "2%" }}
              >
                <span style={{ color: "#696CFF" }}>{key}: </span>

                {typeof value === "boolean" ? (
                  value ? (
                    <CheckIcon style={{ color: "green",marginTop:"6px",marginLeft:"6px" }} />
                  ) : (
                    <CloseIcon style={{ color: "red" }} />
                  )
                ) : (
                  <span
                    style={{ color: "black", marginLeft: "2%" }}
                  >
                    {value}
                  </span>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  ) : (
    <div>loading</div>
  );
};

export default AcountInfos;
