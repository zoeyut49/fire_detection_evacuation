import "./sonosTable.css";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { userRows } from "../../dummyData";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function SonosTable() {

  const data = [
    { name: "Anom", age: 19, gender: "Male" },
    { name: "Megha", age: 19, gender: "Female" },
    { name: "Subham", age: 25, gender: "Male"},
  ]

  return (
    <div className="OakApp">
      <div className="table1">
        <p className="header">Sonos Speakers Logs</p>
      <table className="OakTable1 ">
        <tr className="trOak">
          <th className="thOak">Room Name</th>
          <th className="thOak">Date</th>
          <th className="thOak">Time</th>
          <th className="thOak">Function</th>
          <th className="thOak">Song File</th>
        </tr>
        <tr className="trOak">
          <td className="tdOak">Tiberius</td>
          <td className="tdOak">7-27-2022</td>
          <td className="tdOak">15:50:15</td>
          <td className="tdOak">not_drill</td>
          <td className="tdOak">tiberius_astrid_alarm.mp3</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">General</td>
          <td className="tdOak">7-27-2022</td>
          <td className="tdOak">15:48:44</td>
          <td className="tdOak">not_drill</td>
          <td className="tdOak">fireburning_trim.mp3</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">Tiberius</td>
          <td className="tdOak">7-27-2022</td>
          <td className="tdOak">15:47:59 </td>
          <td className="tdOak">not_drill</td>
          <td className="tdOak">tiberius_astrid_alarm.mp3</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">General</td>
          <td className="tdOak">7-27-2022</td>
          <td className="tdOak">15:47:59</td>
          <td className="tdOak">not_drill</td>
          <td className="tdOak">neo_astrid_alarm.mp3</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">Tiberius</td>
          <td className="tdOak">7-27-2022</td>
          <td className="tdOak">15:47:37</td>
          <td className="tdOak">not_drill</td>
          <td className="tdOak">tiberius_astrid_alarm.mp3</td>
        </tr>
      </table>
      <p className="results">Results (5 - )</p>
      </div>
    </div>
    
  );
}

