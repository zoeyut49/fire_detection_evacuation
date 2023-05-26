import "./spotTable.css";
import zoeSpotCapture from "./zoeSpotCapture.jpg";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { userRows } from "../../dummyData";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function SpotTable() {

  const data = [
    { name: "Anom", age: 19, gender: "Male" },
    { name: "Megha", age: 19, gender: "Female" },
    { name: "Subham", age: 25, gender: "Male"},
  ]

  return (
    <div className="OakApp">
      <div className="table1">
      <p className="header">Spot Docked + AutoWalk Logs</p>
      <table className="OakTable1 ">
        <tr className="trOak">
          <th className="thOak">SpotID</th>
          <th className="thOak">Date</th>
          <th className="thOak">Time</th>
          <th className="thOak">Spot Status</th>
        </tr>
        <tr className="trOak">
          <td className="tdOak">spot1</td>
          <td className="tdOak">7-27-2022</td>
          <td className="tdOak">17:37:23</td>
          <td className="tdOak">Docked</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">spot1</td>
          <td className="tdOak">7-27-2022</td>
          <td className="tdOak">17:36:21</td>
          <td className="tdOak">Running</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">spot1</td>
          <td className="tdOak">7-27-2022</td>
          <td className="tdOak">17:21:47</td>
          <td className="tdOak">Docked</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">spot1</td>
          <td className="tdOak">7-27-2022</td>
          <td className="tdOak">17:20:47</td>
          <td className="tdOak">Running</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">spot1</td>
          <td className="tdOak">7-27-2022</td>
          <td className="tdOak">15:38:04</td>
          <td className="tdOak">Docked</td>
        </tr>
      </table>
      <p className="results">Results (5 - )</p>
      <p className="header2">Spot Human Detection Logs</p>
      <table className="OakTable1 ">
        <tr className="trOak">
          <th className="thOak">SpotID</th>
          <th className="thOak">Date</th>
          <th className="thOak">Time</th>
          <th className="thOak">Number of Humans Detected</th>
        </tr>
        <tr className="trOak">
          <td className="tdOak">spot1</td>
          <td className="tdOak">07-21-2022</td>
          <td className="tdOak">17:14:10</td>
          <td className="tdOak">1</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">spot1</td>
          <td className="tdOak">07-21-2022</td>
          <td className="tdOak">17:13:41</td>
          <td className="tdOak">1</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">spot1</td>
          <td className="tdOak">07-21-2022</td>
          <td className="tdOak">17:13:17</td>
          <td className="tdOak">1</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">spot1</td>
          <td className="tdOak">07-21-2022</td>
          <td className="tdOak">11:55:45</td>
          <td className="tdOak">1</td>
        </tr>
        <tr className="trOak">
          <td className="tdOak">spot1</td>
          <td className="tdOak">07-21-2022</td>
          <td className="tdOak">11:51:31</td>
          <td className="tdOak">1</td>
        </tr>
      </table>
      <p className="results">Results (5 - )</p>
      <p className="header2">Spot Human Detection Captures</p>
      <img class="img" src={zoeSpotCapture} alt="Logo" />
      <p className="imgCaption">Capture: 7-14-2022, 11:34:14</p>
      </div>
    </div>
    
  );
}

