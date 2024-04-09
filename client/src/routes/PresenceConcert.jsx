import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SuccessMessage from "../pages/choriste/pages/presenceRepetition/SuccessMessage";

const PresenceConcert = () => {
  const [storedToken, setStoredToken] = useState();
  const [textToShow, setTextToShow] = useState("");
  const [success, setSuccess] = useState(false);
  const { idC } = useParams();

  useEffect(() => {
    const storedTokenValue = localStorage.getItem("token");

    // If a value is found, set the state with that value
    if (storedTokenValue) {
      setStoredToken(storedTokenValue);
      if (storedToken) {
        markPrecenceConcert();
      }
    }
  }, [storedToken]);

  const markPrecenceConcert = async () => {
    try {
      console.log(idC);
      console.log(`Bearer ${storedToken}`);
      const res = await axios.put(
        "http://localhost:8000/api/presence/cancert/",
        { idCancert: idC },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      if(res)
      {
        //setTextToShow("you are marked succefully present in this concert :) ");
        setSuccess(true);
      }
    } catch (e) {
      console.log(e.response.data.error)
      if (e.response.status == 401) {
        setTextToShow("error with your token please login again");
      }
      if (e.response.status == 404) {
        setTextToShow("this Cancert does not exist please rescan the qr code");
      }
      if (e.response.status == 500) {
        setTextToShow(" an error has occured please rescan the qr code and make sure that you're a member in that concert ");
      }
      
    }
  };

  return  storedToken ? (
    success ? <SuccessMessage /> : <div>{textToShow}</div>
  ) : (
    <div>
      please click{" "}
      <Link
        to="/"
        style={{ color: "blue", cursor: "pointer", textDecoration: "none" }}
      >
        here
      </Link>{" "}
      to login to your account and mark your presence for this concert.
    </div>
  );
};

export default PresenceConcert;
