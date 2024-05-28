import React from "react";
import Navbar1 from "../../components/navbar1/Nabar1";
import SidebarChoriste from "../../components/sidebarChoriste/SidebarChoriste";
import Home from "../chefPupitre/pages/Home";
import DemandeConge from "./pages/demandeConge/DemandeConge";
import Historique from "./pages/historique/Historique";
import AllConcertsToMarquePresence from "./pages/presenceConcert/AllConcertsToMarquePresence";
import AllRepetitionToMarquePresence from "./pages/presenceRepetition/AllRepetitionToMarquePresence";

import CongeChoristePage from "../admin/pages/conges/CongeChoristePage";
import Profile from "../choriste/pages/profil/profil";
import DisponibiliteConcert from "./pages/disponibilité/DisponibiliteConcert";
import UpdateProfile from "./pages/profil/UpdateProfile";

const ChoristeDashboard = (props) => {
  return (
    <div>
      <div>
        {/* Layout wrapper */}
        <div className="layout-wrapper layout-content-navbar">
          <div className="layout-container">
            {/* Menu */}
            <aside
              id="layout-menu"
              className="layout-menu menu-vertical menu bg-menu-theme"
            >
              <div className="menu-inner-shadow" />
              <SidebarChoriste />
            </aside>
            <Navbar1 />
            {props.load === "home" && <Home />}
            {props.load==="allConcerts" && <AllConcertsToMarquePresence />}
            {props.load==="demandeConge" && <DemandeConge />}
            {props.load==="historique" && <Historique />}
            {props.load === "allRepetitions" && ( <AllRepetitionToMarquePresence />
            )}
            {props.load === "conge Choriste" && <CongeChoristePage />}
            {props.load === "allRepetitions" && (
              <AllRepetitionToMarquePresence />
            )}
            {props.load === "allConcerts" && <AllConcertsToMarquePresence />}
            {props.load === "demandeConge" && <DemandeConge />}
            {/*props.load === "historique" && <HistoriqueActivite />*/}
            {props.load === "conge Choriste" && <CongeChoristePage />}
            {props.load === "disponibilté concert" && <DisponibiliteConcert />}
            {props.load === "Profil" && <Profile />}
            {props.load === "updateprofil" && <UpdateProfile />}
          </div>
          {/* Overlay */}
          <div className="layout-overlay layout-menu-toggle" />
        </div>
        {/* / Layout wrapper */}
      </div>
    </div>
  );
};

export default ChoristeDashboard;
