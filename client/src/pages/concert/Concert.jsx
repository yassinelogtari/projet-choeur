import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import ManageConcert from "../../components/concert/ManageConcert";

function Concert() {
  return (
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
          {/* Main content */}
          <main className="layout-content">
           
            {/* Render ManageConcert component here */}
            <ManageConcert />
          </main>
          {/* / Layout page */}
        </div>
        {/* Overlay */}
        <div className="layout-overlay layout-menu-toggle" />
      </div>
      {/* / Layout wrapper */}
    </div>
  );
}

export default Concert;
