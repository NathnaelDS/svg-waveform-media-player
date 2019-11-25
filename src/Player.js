import React, { Component } from "react";
import { Popover, Button } from "antd";
import PlayerContext from "./PlayerContext";
import "./player.css";

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      percentagePlayed: 0,
      seeking: false,
      playing: false,
      currentTime: 0,
      duration: 0,
      volume: 0.3
    };
    this.myRef = React.createRef();
  }

  setCurrentTime = () => {
    const audioPlayer = this.myRef.current;
    this.setState({
      currentTime: audioPlayer.currentTime,
      duration: audioPlayer.duration
    });
  };

  showTime = () => {
    const audioPlayer = this.myRef.current;

    // If the audio metadata is not retrieved, do NOT show the track's duration
    if (audioPlayer.readyState === 0) {
      /* 
        showTime is called onTimeChange which happens when audio src is changed.
        When the audio file is changed set the seekbar(percentagePlayed) back to 0.
        readyState is 0 before the audio file is retrieved.
        Using this as an indication that the track has been changed
      */
      this.setState({ percentagePlayed: 0 });

      return;
    }

    this.setCurrentTime();

    // console.log(audioPlayer.currentTime, audioPlayer.duration);
    let percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    this.setState({ percentagePlayed: percent.toFixed(5) });
  };

  seek = evt => {
    evt.preventDefault();
    var e = evt.currentTarget;
    // console.log({ e });
    var dim = e.getBoundingClientRect();
    var x = evt.clientX - dim.left;
    var y = evt.clientY - dim.top;

    if (y <= 2 || y >= 63) {
      this.setState({ seeking: false });
    } else {
      const audioPlayer = this.myRef.current;

      const seekTo = (x / dim.width) * 100;
      audioPlayer.currentTime = audioPlayer.duration * (seekTo / 100);

      console.log({ seekTo });
      this.setState({ percentagePlayed: seekTo });
    }
  };

  togglePlay = () => {
    this.setState({ playing: !this.state.playing }, () => {
      const audioPlayer = this.myRef.current;
      this.state.playing ? audioPlayer.play() : audioPlayer.pause();
    });
  };

  setVolume = event => {
    const audioPlayer = this.myRef.current;
    audioPlayer.volume = event.target.value / 100;
    this.setState({ volume: event.target.value / 100 });
  };

  render() {
    return (
      <PlayerContext.Consumer>
        {value => (
          <div className="player">
            <div className="details">
              <img
                className="thumbnail"
                src={`${value.thumb}`}
                alt="Album cover"
              />
              <div className="title">{value.title}</div>
              <div className="artist">{value.artist}</div>
            </div>
            <div className="playback-controls">
              {this.state.playing ? (
                <img src="pause.svg" alt="pause" onClick={this.togglePlay} />
              ) : (
                <img src="play.svg" alt="play" onClick={this.togglePlay} />
              )}
            </div>
            <div className="wave">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="1024"
                height="64"
                className="waveform"
                filter="url(#grayscale)"
                onMouseDown={event =>
                  this.setState({ seeking: true }, this.seek(event))
                }
                onMouseUp={() => this.setState({ seeking: false })}
                onMouseMove={event => this.state.seeking && this.seek(event)}
              >
                <filter id="grayscale">
                  <feColorMatrix type="saturate" values="0.10" />
                </filter>
                <image
                  href={require(`${value.visualizationSVG}`)}
                  width="100%"
                />
                {/* {console.log(value.visualizationSVG)} */}
              </svg>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width="1024"
                height="64"
                clipPath="url(#clip)"
                className="waveform"
                onMouseDown={event =>
                  this.setState({ seeking: true }, this.seek(event))
                }
                onMouseUp={() => this.setState({ seeking: false })}
                onMouseMove={event => this.state.seeking && this.seek(event)}
              >
                <image
                  href={require(`${value.visualizationSVG}`)}
                  width="100%"
                />
              </svg>
              <svg
                viewBox="0 0 100 100"
                className="waveform-container"
                preserveAspectRatio="none"
                width="1024px"
                height="64px"
              >
                <defs>
                  <clipPath id="clip">
                    <rect
                      className="seekbar"
                      x="0"
                      y="0"
                      width={this.state.percentagePlayed * 8.5}
                      height="64"
                    ></rect>
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="duration">
              {`${Math.floor(this.state.currentTime / 60)}:${
                this.state.currentTime % 60 >= 10 ? "" : "0"
              }${Math.floor(this.state.currentTime % 60)} / ${Math.floor(
                this.state.duration / 60
              )}:${this.state.duration % 60 >= 10 ? "" : "0"}${Math.floor(
                this.state.duration % 60
              )}`}
            </div>
            <div
              className="extra-controls"
              onMouseLeave={() => this.setState({ volumeVisible: false })}
            >
              <div className="volume">
                {this.state.volumeVisible && (
                  <input
                    onMouseLeave={() => this.setState({ volumeVisible: false })}
                    type="range"
                    name="volume"
                    min="0"
                    max="100"
                    step="1"
                    value={this.state.volume * 100}
                    onChange={this.setVolume}
                  />
                )}
                <div
                  style={{ backgroundColor: "yellow" }}
                  onMouseEnter={() => this.setState({ volumeVisible: true })}
                >
                  V
                </div>
              </div>

              <div className="playlist">P</div>
            </div>
            <div
              className="actions"
              onMouseLeave={() => this.setState({ actionsVisible: false })}
            >
              {this.state.actionsVisible && (
                <div
                  style={{
                    backgroundColor: "yellow",
                    position: "absolute",
                    zIndex: 10,
                    bottom: 160
                  }}
                  onMouseLeave={() => this.setState({ actionsVisible: false })}
                >
                  <p>Add to Cart</p>
                  <p>Add to Favorites</p>
                  <p>Download Preview</p>
                </div>
              )}
              <div
                style={{ backgroundColor: "yellow" }}
                onMouseEnter={() => this.setState({ actionsVisible: true })}
              >
                Actions
              </div>
            </div>
            <audio
              ref={this.myRef}
              src={value.src}
              controls
              onTimeUpdate={this.showTime}
              onLoadedData={this.setCurrentTime}
            ></audio>
          </div>
        )}
      </PlayerContext.Consumer>
    );
  }
}

export default Player;
