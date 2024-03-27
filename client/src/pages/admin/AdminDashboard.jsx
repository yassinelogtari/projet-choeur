import React, { useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar1 from "../../components/navbar1/Nabar1";

import "../admin/adminDashboard.css";
import HomePage from "./pages/HomePage";
import AdminAudition from "./pages/auditions/AdminAudition";
import NouvelleSaison from "./pages/saison/NouvelleSaison";
import SaisonActuelle from "./pages/saison/SaisonActuelle";

import CandidatesList from "./pages/candidates/CandidatesList";
import ListeCandidatesParPupitre from "./pages/candidates/ListeCandidatesParPupitre";
import AdminAuditionInfo from "../admin/pages/auditions/AdminAddAuditionInfo";
import AuditionUpdate from "../admin/pages/auditions/AuditionUpdate";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import Archive from "./pages/saison/archive/Archive";
>>>>>>> b33bedca7d4f8be64da255dc15ebe0b856674448
import ListeOeuvres from "./pages/oeuvres/ListeOeuvres";
=======
import PlanningAudition from "./pages/auditions/GenererPlanning";
>>>>>>> c2b6f70e505a01194f9c7baca15367fdac361a90
import { io } from "socket.io-client";
import AddOeuvre from "./pages/oeuvres/AddOeuvre";

const AdminDashboard = (props) => {
  return (
    <div>
      <div>
        <div className="layout-wrapper layout-content-navbar">
          <div className="layout-container">
            <aside
              id="layout-menu"
              className="layout-menu menu-vertical menu bg-menu-theme"
            >
              <Sidebar />
            </aside>

            <Navbar1 />

            {props.load === "home" && <HomePage />}
            {props.load === "adminAudition" && <AdminAudition />}
            {props.load === "nouvelleSaison" && <NouvelleSaison />}
            {props.load === "saisonActuelle" && <SaisonActuelle />}
            {props.load === "auditionAddInfo" && <AdminAuditionInfo />}
            {props.load === "archives" && <Archive />}
            {props.load === "candidatesList" && <CandidatesList />}
            {props.load === "updateAudition" && <AuditionUpdate />}
<<<<<<< HEAD
            {props.load === "ListeCandidatesParPupitre" && (
              <ListeCandidatesParPupitre />
            )}
            {props.load === "ListeOeuvres" && <ListeOeuvres />}
            {props.load === "AddOeuvre" && <AddOeuvre />}
=======
            {props.load === "ListeCandidatesParPupitre" && <ListeCandidatesParPupitre />}
            {props.load === "genererPlanning" && <PlanningAudition />}

            
            
            
>>>>>>> c2b6f70e505a01194f9c7baca15367fdac361a90
          </div>
          <div className="layout-overlay layout-menu-toggle" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
