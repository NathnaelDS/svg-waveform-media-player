import React from "react";
import "./App.css";
import PlayerContext from "./PlayerContext";
import Player from "./Player";

const trackOne = {
  src: "/sample.mp3",
  visualizationSVG: "./gemscapes/sample.svg",
  title: "Sample Song",
  artist: "Bon Nuit",
  thumb: "thumb.png"
};
const trackTwo = {
  src: "/shame.mp3",
  visualizationSVG: "./gemscapes/shame.svg",
  title: "It's a shame",
  artist: "The Spinners",
  thumb: "thumb2.png"
};
const trackThree = {
  src: "/mess.mp3",
  visualizationSVG: "./gemscapes/mess.svg",
  title: "Mess",
  artist: "Cage the Elephant",
  thumb: "thumb3.png"
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTrack: {
        src: "/sample.mp3",
        visualizationSVG: "./gemscapes/sample.svg",
        title: "Sample Song",
        artist: "Bon Nuit",
        thumb: "thumb.png"
      }
    };
  }

  playTrack = track => {
    // TODO: Check if the currentTrack state is the same as the track parameter
    // So that the currently playing track is not interrupted
    this.setState({ currentTrack: track });
  };

  playOne = () => this.setState({ currentTrack: trackOne });

  playTwo = () => this.setState({ currentTrack: trackTwo });

  playThree = () => this.setState({ currentTrack: trackThree });

  render() {
    return (
      <>
        <button onClick={this.playOne}>Track One</button>
        <button onClick={this.playTwo}>Track Two</button>
        <button onClick={this.playThree}>Track Three</button>
        <PlayerContext.Provider value={this.state.currentTrack}>
          <div className="App">
            <Player />
          </div>
        </PlayerContext.Provider>
      </>
    );
  }
}

export default App;
