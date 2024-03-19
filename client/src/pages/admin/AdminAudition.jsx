import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar1 from "../../components/navbar1/Nabar1";
import Table from "../../components/table/Table";
import "../admin/adminDashboard.css";

const AdminAudition = () => {
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
            <div className="position-absolute top-50 start-50 translate-middle auditionTable">
              <p className="auditionTableTitle">Adution List</p>
              <Table />
            </div>
          </div>
          <div className="layout-overlay layout-menu-toggle" />
        </div>
      </div>
    </div>
  );
};

export default AdminAudition;
