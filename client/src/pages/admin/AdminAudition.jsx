import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar1 from "../../components/navbar1/Nabar1";
import Table from "../../components/table/Table";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import "../admin/adminDashboard.css";
import { NavLink } from "react-router-dom";

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
              <div className="autionTableTitleAndButton">
                <p className="auditionTableTitle">Audition List</p>

                <NavLink
                  to="/dashboard/admin/addAudition"
                  className="auditionButton"
                >
                  <Button type="submit" variant="contained">
                    <div className="auditionButtonWords">
                      <AddIcon />
                      Audition Info
                    </div>
                  </Button>
                </NavLink>
              </div>
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
