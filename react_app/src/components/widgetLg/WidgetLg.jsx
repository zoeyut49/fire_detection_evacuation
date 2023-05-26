import "./widgetLg.css";

export default function WidgetLg(props) {
  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Device Status</h3>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Devices</th>
          <th className="widgetLgTh">Last Triggered: Date</th>
          <th className="widgetLgTh">Last Triggered: Time</th>
          <th className="widgetLgTh">Status</th>
        </tr>
        <tr className="widgetLgTr">
          <td className="widgetLgUser">

            <span className="widgetLgName">Oak-D Lite (Fire)</span>
          </td>
          <td className="widgetLgDate">{props.oakDate}</td>
          <td className="widgetLgTime">{props.responseTime}</td>
          <td className="widgetLgStatus">
            <Button type="Online" />
          </td>
        </tr>
        <tr className="widgetLgTr">
          <td className="widgetLgUser">
            <span className="widgetLgName">Butlr</span>
          </td>
          <td className="widgetLgDate">{props.butlrDate}</td>
          <td className="widgetLgTime">{props.butlrTime}</td>
          <td className="widgetLgStatus">
          <Button type="Online" />
          </td>
        </tr>
        <tr className="widgetLgTr">
          <td className="widgetLgUser">
            <span className="widgetLgName">Sonos Speakers</span>
          </td>
          <td className="widgetLgDate">{props.sonosTime}</td>
          <td className="widgetLgTime">{props.sonosDate}</td>
          <td className="widgetLgStatus">
          <Button type="Online" />
          </td>
        </tr>
        <tr className="widgetLgTr">
          <td className="widgetLgUser">
            <span className="widgetLgName">Spot</span>
          </td>
          <td className="widgetLgDate">{props.spotDate}</td>
          <td className="widgetLgTime">{props.spotTrigger}</td>
          <td className="widgetLgStatus">
          <Button type="Docked"/>
          </td>
        </tr>
      </table>
    </div>
  );
}
