import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const PresenceRepetition = () => {
  const [storedToken, setStoredToken] = useState();
  const [textToShow, setTextToShow] = useState("");
  const { idR } = useParams();

  useEffect(() => {
    const storedTokenValue = localStorage.getItem("token");

    // If a value is found, set the state with that value
    if (storedTokenValue) {
      setStoredToken(storedTokenValue);
      if (storedToken) {
        markPrecenceRepetition();
      }
    }
  }, [storedToken]);

  const markPrecenceRepetition = async () => {
    try {
      
      console.log(`Bearer ${storedToken}`);
      const res = await axios.put(
        "https://projet-choeur-api.vercel.app/api/presence/repetition/",
        { idRepetition: idR },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      if(res)
      {
        setTextToShow("you are marked succefully present in this repetition :) ");
      }
    } catch (e) {
      console.log(e.response.data.error)
      if (e.response.status == 401) {
        setTextToShow("error with your token please login again");
      }
      if (e.response.status == 404) {
        setTextToShow("this Repetition does not exist please rescan the qr code");
      }
      if (e.response.status == 500) {
        setTextToShow(" an error has occured please rescan the qr code and make sure that you're a member in that repetition ");
      }
      
    }
  };

  return storedToken ? (
    <div>{textToShow}</div>
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

export default PresenceRepetition;
