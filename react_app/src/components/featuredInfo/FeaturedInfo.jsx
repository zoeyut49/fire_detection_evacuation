import "./featuredInfo.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";

export default function FeaturedInfo(props) {
  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle" >Oak-D Occupancy Counter</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.peopleCount}</span>
          {/* <span className="featuredMoneyRate">
            -1<ArrowDownward className="featuredIcon negative"/>
          </span> */}
        </div>
        <span className="featuredSub">in {props.oakRoom}</span>
        {/* <dt><span className="featuredSub">Last Triggered: {props.responseTime}</span></dt> */}
      </div>
      
      <div className="featuredItem">
        <span className="featuredTitle">Butlr Occupancy Counter</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">{props.butlrOccupancy}</span>
          <span className="featuredMoneyRate">
            {/* -1 <ArrowDownward className="featuredIcon negative"/> */}
          </span>
        </div>
        <span className="featuredSub">in ShowroomTA</span>
        {/* <dt><span className="featuredSub">Last Triggered: {props.responseTime}</span></dt> */}
      </div>

      <div className="featuredItem">
      <span className="featuredTitle">Fire Detection Camera</span>
        <div className="featuredMoneyContainer">
          <span className="featuredOakDetection">OAK</span>
          <span className="featuredMoneyRate">
            {/* + <ArrowUpward className="featuredIcon"/> */}
          </span>
          {/* <div>
          <span className="featuredSub-1">Last Triggered</span>
          </div> */}
        </div>
        <span className="featuredSub">in {props.roomName3}</span>
        <dt><span className="featuredSub">Last Triggered: {props.responseTime}</span></dt>
      </div>

    </div>
  );
}