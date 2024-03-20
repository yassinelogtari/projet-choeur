import React from "react";
import Table from "../../../components/table/Table";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { NavLink } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
const AdminAudition = () => {
  return (
    <div className="position-absolute top-50 start-50 translate-middle auditionTable">
      <p className="auditionTableTitle">Audition List</p>
      <h6>
        el buttonet hethom tanech t7othom fi west el action fil tabelau hama
        wala souu
      </h6>
      <div className="auditionAction">
        <NavLink to="/dashboard/admin/addAudition">
          <Button variant="outlined" className="AddInfoAction">
            <div>
              <AddIcon />
            </div>
          </Button>
        </NavLink>
        <Button variant="outlined" className="editAction">
          <div>
            <ModeEditIcon className="editIcon" />
          </div>
        </Button>
        <Button variant="outlined" className="deleteAction">
          <div>
            <DeleteIcon className="deleteIcon" />
          </div>
        </Button>
        <Table />
      </div>
    </div>
  );
};

export default AdminAudition;
