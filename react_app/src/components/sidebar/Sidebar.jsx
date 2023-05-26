import "./sidebar.css";
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import {
  LineStyle,
  Timeline,
  TrendingUp,
  PermIdentity,
  Storefront,
  AttachMoney,
  BarChart,
  MailOutline,
  DynamicFeed,
  ChatBubbleOutline,
  WorkOutline,
  Report,
} from "@material-ui/icons";
import { Link } from "react-router-dom";

export default function Sidebar({signOut, user}) {
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/" className="link">
            <li className="sidebarListItem active">
              <LineStyle className="sidebarIcon" />
              Home
            </li>
            </Link>
            {/* <li className="sidebarListItem">
              <Timeline className="sidebarIcon" />
              Analytics
            </li> */}
            {/* <li className="sidebarListItem">
              <TrendingUp className="sidebarIcon" />
              Sales
            </li> */}
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Devices</h3>
          <ul className="sidebarList">
            <Link to="/oakLogs" className="link">
              <li className="sidebarListItem">
              <BarChart className="sidebarIcon" />
                Oak-D Lite
              </li>
            </Link>
            <Link to="/butlrLogs" className="link">
              <li className="sidebarListItem">
              <BarChart className="sidebarIcon" />
                Butlr
              </li>
            </Link>
            <Link to="/sonosLogs" className="link">
              <li className="sidebarListItem">
              <BarChart className="sidebarIcon" />
                Sonos Speakers
              </li>
            </Link>
            <Link to="/spotLogs" className="link">
              <li className="sidebarListItem">
              <BarChart className="sidebarIcon" />
                Spot
              </li>
            </Link>
              <li className="sidebarListItem">
              <BarChart className="sidebarIcon" />
                Fire Drill Management
              </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Notifications</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <MailOutline className="sidebarIcon" />
              Mail
            </li>
            <li className="sidebarListItem">
              <DynamicFeed className="sidebarIcon" />
              Feedback
            </li>
            <li className="sidebarListItem">
              <ChatBubbleOutline className="sidebarIcon" />
              Messages
            </li>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Staff</h3>
          <ul className="sidebarList">
            <li className="sidebarListItem">
              <WorkOutline className="sidebarIcon" />
              Manage
            </li>
            <li className="sidebarListItem">
              <Report className="sidebarIcon" />
              Reports
            </li>
            <li className="sidebarListItem">
              <Timeline className="sidebarIcon" />
              Sign Out
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
