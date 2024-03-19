import React from "react";
import Table from "../../../components/table/Table";

const AdminAudition = () => {
  return (
    <div className="position-absolute top-50 start-50 translate-middle auditionTable">
      <p className="auditionTableTitle">Audition List</p>
      <Table />
    </div>
  );
};

export default AdminAudition;
