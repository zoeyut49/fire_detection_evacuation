import map from './map.svg';
import "./map.css";
import { VictoryChart, VictoryScatter, VictoryAxis, VictoryArea, Background } from 'victory';

let sonos1, sonos2
function Map(props){
    if(props.sonosStatus1 == 'isPlaying') {
      sonos1 = true;
    }
    else if (props.sonosStatus1 == 'notPlaying'){
      sonos1 = false;
    }
    if(props.sonosStatus2 == 'isPlaying') {
      sonos2 = true;
    }
    else if (props.sonosStatus2 == 'notPlaying'){
      sonos2 = false;
    }

    return (
      <div style={{position: "relative"}}>
      <div style={{position: "absolute",
      height: "550px",
      width: "1120px",
      marginTop: "-55px",
      marginLeft: "-80px",
     }}>

           {/* position: absolute;
    height: 550px;
    width: 1120px;
    margin-top: -60px;
    margin-left: -170px; */}


        <VictoryChart domain={[0, 5]}>
          <VictoryAxis style={{opacity: "0", tickLabels: {opacity: "0"}}} />
          {/* <VictoryArea
              style={{data: { fill: "pink" }}}
              data={[
                { x: 0.1, y: 3.6, y0: 1.4},
                { x: 0.9, y: 3.6, y0: 1.4}
              ]}
          /> */}
          <VictoryScatter
            data={[
              { x: 0.5, y: 2.6, room: "Tiberius"},
              { x: 4.3, y: 4.3, room: "Neo"},
              { x: 4.3, y: 1.5 , room: "Leia"},
              { x: 0.6, y: 0.5, room: "Trinity"},
              { x: 3, y: 0.8, room: "Showroom TA"}
            ]}
            style={{ data:{opacity: "0"}}}
            labels={({ datum }) => `${datum.room}`}
          />
          <VictoryScatter
            data={[
              { x: 3.8, y: 0, docked: `${props.spot}`},
            ]}
            style={{ data: {opacity: "0"} }}
            labels={({ datum }) => datum.docked ? `🏠`:`🐶`}
          />
          <VictoryScatter
            data={[
              { x: 0.5, y: 2, value: `${props.peopleCount}`},
              { x: 3, y: 0.4, value: `${props.butlrOccupancy}`},
              { x: 4.2, y: 3.7, value: `${props.butlrOccupancy2}`}
            ]}
            style={{ data:{opacity: "0"} }}
            labels={({ datum }) => `🙆: ${datum.value}`}
          />
          <VictoryScatter
            data={[
              //tiberius
              { x: 0.5, y: 1.45, playing: sonos2},
              //neo
              { x: 4.7, y: 3.7, playing: sonos1},
              // leia
              { x: 4.35, y: 1, playing: sonos1},
              //trinity
              { x: 0.65, y: 0.1, playing: sonos1}
            ]}
            style={{ data:{opacity: "0"} }}
            labels={({ datum }) => datum.playing ? `🔊`:`🔇`}
          />
        </VictoryChart>
        </div>
        {/* <img src={map} className="Map-image" alt="map"/> */}
        <div style={{position: "absolute"}}>
        <img src={map} className="Map-image" alt="map"/>
        </div>

      </div>
    );
  }

 export default Map;