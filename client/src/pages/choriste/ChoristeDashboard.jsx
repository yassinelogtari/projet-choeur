import React from "react";
import Sidebar from "../../components/sidebarAdmin/Sidebar";
import Navbar1 from "../../components/navbar1/Nabar1";
import SidebarChoriste from "../../components/sidebarChoriste/SidebarChoriste";
import Home from "../chefPupitre/pages/Home";
import PresenceRepetition from "../../routes/PresenceRepetititon";
import AllRepetitionToMarquePresence from "./pages/presenceRepetition/AllRepetitionToMarquePresence";
import AllConcertsToMarquePresence from "./pages/presenceConcert/AllConcertsToMarquePresence";
import Historique from "./pages/historique/Historique";
import DemandeConge from "./pages/demandeConge/DemandeConge";
//import Historique from "./pages/historique/Historique";
import CongeChoristePage from "../admin/pages/conges/CongeChoristePage";
import HistoriqueActivite from "../../components/historiqueContent/HistoriqueActivite";

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
            {props.load === "allRepetitions" && (
              <AllRepetitionToMarquePresence />
            )}
            {props.load === "allConcerts" && <AllConcertsToMarquePresence />}
            {props.load === "demandeConge" && <DemandeConge />}
            {props.load === "historique" && <HistoriqueActivite />}
            {props.load === "allRepetitions" && (
              <AllRepetitionToMarquePresence />
            )}
            {props.load === "allConcerts" && <AllConcertsToMarquePresence />}
            {props.load === "historique" && <Historique />}
            {props.load === "conge Choriste" && <CongeChoristePage />}
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
