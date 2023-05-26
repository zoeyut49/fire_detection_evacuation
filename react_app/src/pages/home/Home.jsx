import Chart from "../../components/chart/Chart";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import { userData } from "../../dummyData";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import WidgetLg from "../../components/widgetLg/WidgetLg";
import Map from "../../components/map/Map"
import Spot from "../../components/spot/Spot"

export default function Home(props) {
  //console.log("home:", props)
  return ( 
      <div className="home">
        <div>
          <Map peopleCount={props.peopleCount} 
          butlrOccupancy={props.butlrOccupancy} 
          spot={props.spotStatus}
          sonosStatus1 ={props.sonosStatus1}
          sonosStatus2 ={props.sonosStatus2}
          sonosRoom2 ={props.sonosRoom2}
          sonosRoom ={props.sonosRoom}
          butlrOccupancy2={props.butlrOccupancy2}
          butlrRoomNeo={props.butlrRoomNeo} 
          />
        </div>
        <div style={{marginTop: "440px"}}>
           <FeaturedInfo 
            oakRoom={props.oakRoom} 
            butlrRoom={props.butlrRoom} 
            roomName3={props.roomName3}
            responseTime={props.responseTime}
            song={props.song}
            peopleCount={props.peopleCount} 
            butlrOccupancy={props.butlrOccupancy}
            butlrDate={props.butlrDate}
            butlrTime={props.butlrTime}
            sonosDate={props.sonosDate}
            sonosTime={props.sonosTime}
            spotDate={props.spotDate}
            oakDate={props.oakDate}
            sonosStatus={props.sonosStatus}
            butlrOccupancy2={props.butlrOccupancy2}
            butlrRoomNeo={props.butlrRoomNeo} 
            />
        <Chart data={userData} title="User Analytics for July" grid dataKey="Active User"/>
        <Spot 
        song={props.song}
        song2={props.song2}
        spotStatus={props.spotStatus}
        spotTrigger={props.spotTrigger}
        sonosStatus={props.sonosStatus}
        />
        <div className="homeWidgets">
          <WidgetSm/>
          <WidgetLg  
            oakRoom={props.oakRoom} 
            butlrRoom={props.butlrRoom} 
            roomName3={props.roomName3}
            responseTime={props.responseTime}
            song={props.song}
            peopleCount={props.peopleCount} 
            butlrOccupancy={props.butlrOccupancy}
            butlrDate={props.butlrDate}
            butlrTime={props.butlrTime}
            sonosDate={props.sonosDate}
            sonosTime={props.sonosTime}
            spotDate={props.spotDate}
            oakDate={props.oakDate}
            spotTrigger={props.spotTrigger}
            sonosStatus={props.sonosStatus}
            butlrOccupancy2={props.butlrOccupancy2}
            butlrRoomNeo={props.butlrRoomNeo} 
          />
        </div>
        </div>
       
      </div>
    
  );
}
