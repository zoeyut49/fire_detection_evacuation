import "./butlrTable.css";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { productRows } from "../../dummyData";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ButlrTable(props) {

  const data = [
    { name: "Anom", age: 19, gender: "Male" },
    { name: "Megha", age: 19, gender: "Female" },
    { name: "Subham", age: 25, gender: "Male"},
  ]

  return (
    <div className="OakApp">
      <div className="table1">
        <p className="header">Butlr Logs</p>
      <table className="OakTable1 ">
        <tr className="trOak">
          <th className="thOak">Room Name</th>
          <th className="thOak">Date</th>
          <th className="thOak">Time</th>
          <th className="thOak">People Count</th>
        </tr>
        <tr className="trOak">
          <td className="tdOak">Neo</td>
          <td className="tdOak">7-28-2022</td>
          <td className="tdOak">15:22:30</td>
          <td className="tdOak">0</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">Neo</td>
          <td className="tdOak">7-28-2022</td>
          <td className="tdOak">15:22:30</td>
          <td className="tdOak">0</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">Neo</td>
          <td className="tdOak">7-28-2022</td>
          <td className="tdOak">15:22:30</td>
          <td className="tdOak">0</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">Neo</td>
          <td className="tdOak">7-28-2022</td>
          <td className="tdOak">15:22:30</td>
          <td className="tdOak">0</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">Neo</td>          
          <td className="tdOak">7-28-2022</td>
          <td className="tdOak">15:22:30</td>
          <td className="tdOak">0</td>
        </tr>
      </table>
      <p className="results">Results (5 - )</p>
      </div>
    </div>
    
  );
}
