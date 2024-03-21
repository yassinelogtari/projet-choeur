import React, { useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar1 from "../../components/navbar1/Nabar1";

import "../admin/adminDashboard.css";
import HomePage from "./pages/HomePage";
import AdminAudition from "./pages/auditions/AdminAudition";
import NouvelleSaison from "./pages/saison/NouvelleSaison";
import SaisonActuelle from "./pages/saison/SaisonActuelle";
import Archive from "./pages/saison/Archive";
import CandidatesList from "./pages/candidates/CandidatesList";
import AdminAuditionInfo from "../admin/pages/auditions/AdminAddAuditionInfo";
import AuditionUpdate from "../admin/pages/auditions/AuditionUpdate";
import { io } from "socket.io-client";

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

            <Navbar1/>

            {props.load === "home" && <HomePage />}
            {props.load === "adminAudition" && <AdminAudition />}
            {props.load === "nouvelleSaison" && <NouvelleSaison />}
            {props.load === "saisonActuelle" && <SaisonActuelle />}
            {props.load === "auditionAddInfo" && <AdminAuditionInfo />}
            {props.load === "archives" && <Archive />}
            {props.load === "candidatesList" && <CandidatesList />}
            {props.load === "updateAudition" && <AuditionUpdate />}
          </div>
          <div className="layout-overlay layout-menu-toggle" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
