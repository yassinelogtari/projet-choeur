import React from "react";
import Navbar1 from "../../components/navbar1/Nabar1";
import SidebarManagerChoeur from "../../components/sidebarManagerChoeur/SidebarManagerChoeur";
import Home from "../chefPupitre/pages/Home";
import DesigneChefsPupitres from "./pages/designerChefsPupitres/DesigneChefsPupitres";

const AdminDashboard = (props) => {
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
              <SidebarManagerChoeur />
            </aside>
            <Navbar1 />
            {props.load === "home" && <Home />}
            {props.load==="désigniation-chefs-pupitres" && <DesigneChefsPupitres />}
          </div>
          {/* Overlay */}
          <div className="layout-overlay layout-menu-toggle" />
        </div>
        {/* / Layout wrapper */}
      </div>
    </div>
  );
};

export default AdminDashboard;
