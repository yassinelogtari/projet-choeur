import React from "react";
import Navbar1 from "../../components/navbar1/Nabar1";
import SidebarChefPupitre from "../../components/sidebarChefPupitre/SidebarChefPupitre";
import PresenceMainConcert from "../chefPupitre/pages/presenceMain/PresenceMainConcert";
import Home from "./pages/Home";

const ChefPupitreDashboard = (props) => {
  return (
    <div>
      <div>
        <div className="layout-wrapper layout-content-navbar">
          <div className="layout-container">
            <aside
              id="layout-menu"
              className="layout-menu menu-vertical menu bg-menu-theme"
            >
              <SidebarChefPupitre />
            </aside>

            <Navbar1 />
            {props.load === "home" && <Home />}
            {props.load === "presenceConcert" && <PresenceMainConcert />}
           
          </div>
          <div className="layout-overlay layout-menu-toggle" />
        </div>
      </div>
    </div>
  );
};


export default ChefPupitreDashboard;
