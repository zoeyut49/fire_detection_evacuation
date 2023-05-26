import "./spot.css";

export default function Spot(props) {
    return (
      <div className="featured2">
        <div className="featuredItem2">
        <span className="featuredTitle2">AutoWalk Detection    
        </span>
          <div className="featuredMoneyContainer2">
            <span className="featuredOakDetection2">SPOT</span>
          </div>
          <span className="featuredSub2">Status: {props.spotStatus}</span>
          <div>
            <span className="featuredSub2">Last Triggered: {props.spotTrigger}</span>
        </div>
        </div>
  
        <div className="featuredItem2">
        <span className="featuredTitle2">Currently Playing 
        </span>
          <div className="featuredMoneyContainer2">
            <span className="featuredOakDetection2">Sonos Speakers</span>
          </div>
          <span className="featuredSub2">Tiberius: {props.song}</span>
          <dt><span className="featuredSub2">General Lab: {props.song2}</span></dt>
        </div>

        {/* <div className="featuredItem">
        <span className="featuredTitle">hu    
        </span>
          <div className="featuredMoneyContainer2">
            <span className="featuredOakDetection2">SPOT</span>
          </div>
          <span className="featuredSub2">Last Triggered: 18:02:29</span>
        </div> */}

      </div>
    );
  }