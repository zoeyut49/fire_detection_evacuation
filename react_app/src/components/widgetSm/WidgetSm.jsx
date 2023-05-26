import "./widgetSm.css";
import { Visibility } from "@material-ui/icons";
import React, {useState, useEffect} from 'react';

var AWS = require("aws-sdk");
AWS.config.region = 'us-east-1';

function sendPayload(params) {
  const lambda = new AWS.Lambda()
  var params = {
    FunctionName: 'arn:aws:lambda:us-east-1:122160600554:function:core-trigger-lambda', /* required */
    Payload: JSON.stringify(params)
  };
  lambda.invoke(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);           // successful response
  });
}

export default function WidgetSm() {
  const [payload, setPayload] = useState(null);

  useEffect (() => {
    sendPayload({payload});
  })
  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">Fire Drill Trigger</span>
      <ul className="widgetSmList">
        <li className="widgetSmListItem">
          <button className="widgetSmButton" 
          onClick={() => setPayload({'drill': true, 'sonos': true, 'spot': true})}>
            <Visibility className="widgetSmIcon" />
            Fire Drill Sequence
          </button>
        </li>
        <li className="widgetSmListItem">
          <button className="widgetSmButton"
            onClick={() => setPayload({'drill': true, 'sonos': true, 'spot': false})}>
            <Visibility className="widgetSmIcon" />
            Song on Sonos Speakers
          </button>
        </li>
        <li className="widgetSmListItem">
          <button className="widgetSmButton"
            onClick={() => setPayload({'drill': true, 'sonos': true, 'spot': false})}>
            <Visibility className="widgetSmIcon" />
            Message on Sonos Speakers
          </button>
        </li>
        <li className="widgetSmListItem">
          <button className="widgetSmButton" 
            onClick={() => setPayload({'drill': false, 'sonos': false, 'spot': true})}>
            <Visibility className="widgetSmIcon" />
            Spot AutoWalk
          </button>
        </li>
      </ul>
    </div>
  );
}
