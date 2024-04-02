import React from "react";
import Sidebar from "../components/sidebarAdmin/Sidebar";
import Navbar1 from "../components/navbar1/Nabar1";

const AdminDashboard = () => {
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
              <Sidebar />
            </aside>
            <Navbar1 />
            {/* / Layout page */}
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
