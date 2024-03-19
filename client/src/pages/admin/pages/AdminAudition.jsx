import React from "react";
import Table from "../../../components/table/Table";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { NavLink } from "react-router-dom";

const AdminAudition = () => {
  return (
    <div className="position-absolute top-50 start-50 translate-middle auditionTable">
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
      <Table />
    </div>
  );
};

export default AdminAudition;
