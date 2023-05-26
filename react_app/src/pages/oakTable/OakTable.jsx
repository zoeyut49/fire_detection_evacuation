import "./oakTable.css";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { userRows } from "../../dummyData";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function OakTable() {

  const data = [
    { name: "Anom", age: 19, gender: "Male" },
    { name: "Megha", age: 19, gender: "Female" },
    { name: "Subham", age: 25, gender: "Male"},
  ]

  return (
    <div className="OakApp">
      <div className="table1">
        <p className="header">Oak-D Occupancy Logs</p>
      <table className="OakTable1 ">
        <tr className="trOak">
          <th className="thOak">Room Name</th>
          <th className="thOak">Date</th>
          <th className="thOak">Time</th>
          <th className="thOak">People Count</th>
        </tr>
        <tr className="trOak">
          <td className="tdOak">Tiberius</td>
          <td className="tdOak">7-27-2022</td>
          <td className="tdOak">20:24:10</td>
          <td className="tdOak">0</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">Tiberius</td>
          <td className="tdOak">7-27-2022</td>
          <td className="tdOak">20:23:48</td>
          <td className="tdOak">0</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">Tiberius</td>
          <td className="tdOak">7-27-2022</td>
          <td className="tdOak">20:28:54</td>
          <td className="tdOak">0</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">Tiberius</td>
          <td className="tdOak">7-27-2022</td>
          <td className="tdOak">20:25:37</td>
          <td className="tdOak">0</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">Tiberius</td>
          <td className="tdOak">7-27-2022</td>
          <td className="tdOak">20:25:28</td>
          <td className="tdOak">0</td>
        </tr>   
      </table>
      <p className="results">Results (5 - )</p>
      </div>
    </div>
    
  );
}

