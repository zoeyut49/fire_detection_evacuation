// import logo from './logo.svg';
// import map from './map.svg';
import './App.css';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Auth } from 'aws-amplify';

//----------------------------------------------------------------------------------

import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Switch, Route, Routes } from "react-router-dom";
import OakTable from "./pages/oakTable/OakTable";
import User from "./pages/user/User";
import ButlrTable from "./pages/butlrTable/ButlrTable";
import SonosTable from "./pages/sonosTable/SonosTable";
import SpotTable from "./pages/spotTable/SpotTable";
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { marshall } from "@aws-sdk/util-dynamodb";
import React, { useState } from 'react';
import { SettingsInputAntennaSharp, SmokingRooms } from '@material-ui/icons';

// -------------------------------------------------------------------------------------

function App({ signOut, user }) {
  var AWS = require("aws-sdk");
  AWS.config.region = 'us-east-1';

  const [oakRoom, setOakRoom] = React.useState(1);
  const [butlrRoom, setButlrRoom] = React.useState(1);
  const [butlrRoomNeo, setButlrRoom2] = React.useState(1);
  const [roomName3, setRoomValue3] = React.useState(1);
  const [sonosRoom, setSonosRoom] = React.useState(1);
  const [sonosRoom2, setSonosRoom2] = React.useState(1);
  const [spotStatus, setSpotStatus] = React.useState(1);
  const [spotDate, setSpotDate] = React.useState(1);
  const [sonosStatus1, setSonosStatus1] = React.useState(1);
  const [sonosStatus2, setSonosStatus2] = React.useState(1);
  const [butlrDate, setButlrDate] = React.useState(1);
  const [butlrTime, setButlrTime] = React.useState(1);
  const [oakDate, setOakDate] = React.useState(1);
  const [spotTrigger, setSpotTrigger] = React.useState(1);
  const [sonosDate, setSonosDate] = React.useState(1);
  const [sonosTime, setSonosTime] = React.useState(1);
  const [song, setSonosFile] = React.useState(1);
  const [song2, setSonosFile2] = React.useState(1);
  const [responseTime, setOakTrigger] = React.useState(1);
  const [peopleCount, setPeopleCount] = React.useState(1);
  const [butlrOccupancy, setButlrOccupancyCount] = React.useState(1);
  const [butlrOccupancy2, setButlrOccupancyCount2] = React.useState(1);
  
  Auth.currentSession()
    .then(function (result) {
      console.log(result)
      // Add the User's Id Token to the Cognito credentials login map.
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-1:4d23040a-df63-4efd-8a96-23f6e8c4db2f',
        Logins: {
          'cognito-idp.us-east-1.amazonaws.com/us-east-1_EQTj2nG8t': result.getIdToken().getJwtToken()
        }
      });

      //Sample code to execute lambda function
      // console.log('CREDENTIALS', AWS.config.credentials)
      // const lambda = new AWS.Lambda()
      // var params = {
      //   FunctionName: 'arn:aws:lambda:us-east-1:122160600554:function:core-trigger-lambda', /* required */
      //   Payload: JSON.stringify({'drill': false, 'spot': false, 'sonos': false})
      // };
      // lambda.invoke(params, function (err, data) {
      //   if (err) console.log(err, err.stack); // an error occurred
      //   else console.log(data);           // successful response
      // });
    })

    .catch(err => console.log(err));

  //--------------------------------------------------------------------------------------------------------

  Auth.currentCredentials().then(credentials => {

    var AWS = require("aws-sdk");

    AWS.config.region = 'us-east-1';
  
    const docClient = new AWS.DynamoDB.DocumentClient({

      region: "us-east-1",

      credentials: Auth.essentialCredentials(credentials)

    })

    console.log(docClient)

//---------------------------------------------------------------------------------------------------
  //RETURNING THE HEADCOUNT AND ROOM FOR OAK HEADCOUNT WIDGET

  var paramsOakHeadcount = {
    
    TableName: "oakd-headcount",
    KeyConditionExpression: 'roomName = :roomName',
    ExpressionAttributeValues:{
      ":roomName": `Tiberius`,
    },
    
    Limit: 1,
    ScanIndexForward:false
}

  console.log(paramsOakHeadcount)


  docClient.query(paramsOakHeadcount, function (err, data) {

    console.log(data)
    console.log(err)

    if (!err) {

      const v1 = data
      setOakRoom(v1.Items.length>0 ? v1.Items[0].roomName : "")
      setPeopleCount(v1.Items.length>0 ? v1.Items[0].peopleCount : "")
      console.log("oakRoom",oakRoom)
      console.log(peopleCount)
    }
  })

  //------------------------------------------------------------------------------------------------------------
  // RETURNING BUTLR HEADCOUNT
  
  var paramsButlrTrigger = {
      
    TableName: "butlr-occupancy",
    KeyConditionExpression: 'roomName = :roomName',
    ExpressionAttributeValues:{
      ":roomName": `ShowroomTA`,
    },
   
    Limit: 1,
    ScanIndexForward:false
}

  docClient.query(paramsButlrTrigger, function (err, data2) {

  console.log(data2)
  console.log(err)

  if (!err) {

    const v2 = data2
    setButlrRoom(v2.Items.length>0 ? v2.Items[0].roomName: "")
    setButlrOccupancyCount(v2.Items.length>0 ? v2.Items[0].occupancy : "")
    setButlrDate(v2.Items.length>0 ? v2.Items[0].invokeDate : "")
    setButlrTime(v2.Items.length>0 ? v2.Items[0].invokeTime : "")
    console.log(butlrRoom)
    console.log(butlrOccupancy)
    console.log(butlrDate)
    console.log(butlrTime)
  }
})

//--------------------------------------------------------------------------------------------------------------
//NEO BUTLR

var paramsButlrTrigger2 = {
      
  TableName: "butlr-occupancy",
  KeyConditionExpression: 'roomName = :roomName',
  ExpressionAttributeValues:{
    ":roomName": `Neo`,
  },
 
  Limit: 1,
  ScanIndexForward:false
}

docClient.query(paramsButlrTrigger2, function (err, dataNEO) {

console.log(dataNEO)
console.log(err)

if (!err) {

  const vNEO = dataNEO
  setButlrRoom2(vNEO.Items.length>0 ? vNEO.Items[0].roomName: "")
  setButlrOccupancyCount2(vNEO.Items.length>0 ? vNEO.Items[0].occupancy : "")
  console.log("ROOM:", butlrRoomNeo)
  console.log("neo occupancy:", butlrOccupancy2)

}
})

//-----------------------------------------------------------------------------------------
//RETURNING OAK TRIGGER TIME

var paramsOakTrigger = {
      
  TableName: "oakd-events",
  KeyConditionExpression: 'roomName = :roomName',
  ExpressionAttributeValues:{
    ":roomName": `Showroom-TA`,
  },
 
  Limit: 1,
  ScanIndexForward:false
}

docClient.query(paramsOakTrigger, function (err, data3) {

  console.log(data3)
  console.log(err)

  if (!err) {

    const v3 = data3
    setRoomValue3(v3.Items.length>0 ? v3.Items[0].roomName: "")
    setOakTrigger(v3.Items.length>0 ? v3.Items[0].responseTime : "")
    setOakDate(v3.Items.length>0 ? v3.Items[0].responseDate : "")
    console.log(roomName3)
    console.log(responseTime)
    console.log(oakDate)
  }
})

//-----------------------------------------------------------------------------------------
//RETURNING SONOS SPEAKERS FILES

var paramsSonosFiles = {
      
  TableName: "sonos-events",
  KeyConditionExpression: 'roomName = :roomName',
  ExpressionAttributeValues:{
    ":roomName": `Tiberius`,    
  },
 
  Limit: 1,
  ScanIndexForward:false
}

docClient.query(paramsSonosFiles, function (err, data4) {

  console.log(data4)
  console.log(err)

  if (!err) {

    const v4 = data4
    setSonosRoom(v4.Items.length>0 ? v4.Items[0].roomName: "")
    setSonosFile(v4.Items.length>0 ? v4.Items[0].song : "")
    setSonosDate(v4.Items.length>0 ? v4.Items[0].responseTime : "")
    setSonosTime(v4.Items.length>0 ? v4.Items[0].responseDate : "")
    setSonosStatus1(v4.Items.length>0 ? v4.Items[0].playing : "")
    console.log(sonosRoom)
    console.log(song)
    console.log(sonosDate)
    console.log(sonosStatus1)
  }
})

//RETURNING SONOS SPEAKERS FILES2

var paramsSonosFiles2 = {
      
  TableName: "sonos-events",
  KeyConditionExpression: 'roomName = :roomName',
  ExpressionAttributeValues:{
    ":roomName": `General`,    
  },
 
  Limit: 1,
  ScanIndexForward:false
}

docClient.query(paramsSonosFiles2, function (err, data5) {

  console.log(data5)
  console.log(err)

  if (!err) {

    const v5 = data5
    setSonosRoom2(v5.Items.length>0 ? v5.Items[0].roomName: "")
    setSonosFile2(v5.Items.length>0 ? v5.Items[0].song : "")
    setSonosStatus2(v5.Items.length>0 ? v5.Items[0].playing : "")
    console.log(sonosRoom2)
    console.log(song2)
    console.log(sonosStatus2)
  }
})

//RETURNING SPOT STATUS

var paramsSpotStatus= {
      
  TableName: "spot-dockinfo",
  KeyConditionExpression: 'uid = :uid',
  ExpressionAttributeValues:{
    ":uid": `spot1`,    
  },
 
  Limit: 1,
  ScanIndexForward:false
}

docClient.query(paramsSpotStatus, function (err, data6) {

  console.log(data6)
  console.log(err)

  if (!err) {

    const v6 = data6
    setSpotStatus(v6.Items.length>0 ? v6.Items[0].spotStatus: "")
    setSpotTrigger(v6.Items.length>0 ? v6.Items[0].eventTime : "")
    setSpotDate(v6.Items.length>0 ? v6.Items[0].eventDate : "")
    console.log(spotStatus)
    console.log(spotTrigger)
    console.log(spotDate)
  }
})

    return 1

  }) //Auth.currentCredentials
  


  return (
    <div>
      <Router>
        <Topbar />
        <div className="container">
          <Sidebar />
          <Routes>
            <Route exact path="/" element={<Home 
            oakRoom={oakRoom} 
            butlrRoom={butlrRoom} 
            butlrRoomNeo={butlrRoomNeo} 
            roomName3={roomName3}
            butlrDate={butlrDate}
            butlrTime={butlrTime}
            sonosDate={sonosDate}
            sonosTime={sonosTime}
            spotDate={spotDate}
            oakDate={oakDate}
            sonosStatus1={sonosStatus1}
            sonosStatus2={sonosStatus2}
            responseTime={responseTime}
            peopleCount={peopleCount} 
            song={song}
            song2={song2}
            spotTrigger={spotTrigger}
            spotStatus={spotStatus}
            butlrOccupancy={butlrOccupancy} 
            butlrOccupancy2={butlrOccupancy2} 
            sonosRoom2 ={sonosRoom2}
            sonosRoom ={sonosRoom}/> } />
            <Route path="oakLogs" element={<OakTable />} />
            <Route path="/user/:userId" element={<User />} />
            <Route path="butlrLogs" element={<ButlrTable />} />
            <Route path="sonosLogs" element={<SonosTable />} />
            <Route path="spotLogs" element={<SpotTable />} />
          </Routes>
        </div>
      </Router>
      <p class="hi">.</p>
      <p class="hi">.</p>
      {/* <p class="hi">.</p> */}
      {/* <p class="hi">.</p> */}
      <Button class="signout"onClick={signOut}>Sign out</Button>
    </div>


  );

}
export default withAuthenticator(App);