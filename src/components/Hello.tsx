import * as React from "react";
import * as Sound from "react-sound";

export interface HelloProps { compiler: string; framework: string; }

interface Song {
  url: string;
}

interface State {
  playStatus: Sound.status;
  currentSong: Song;
}

interface PlayingEvent {
  position: number;
}

export class App extends React.Component<HelloProps, State> {
  constructor(props: HelloProps) {
    super(props);
    this.state = {
      playStatus: Sound.status.PLAYING,
      currentSong: {
        url: "http://localhost:8000/test.mp3",
      },
    };
  }
  onPlaying(e: PlayingEvent) {
  }
  render() {
    return (
      <div>
        <Sound
          url={this.state.currentSong.url}
          playStatus={this.state.playStatus}
          playFromPosition={0}
          onPlaying={this.onPlaying}
        />
        <Stage />
      </div>
    );
  }
}

interface CounterProp {
  startTime: number;
}

interface CounterState {
  success?: number;
  miss?: number;
}

export class Counter extends React.Component<CounterProp, CounterState> {
  constructor(props: CounterProp) {
    super(props);
    this.state = {
      success: 0,
      miss: 0,
    };
    document.addEventListener("keydown", (e) => {
      console.log(e.keyCode, String.fromCharCode(e.keyCode));
      let now = Date.now() / 1000 - this.props.startTime;
      for (let i = 0; i < timings.length; i++) {
        let timing = timings[i];
        console.log(Math.abs(timing - now));
        if (Math.abs(timing - now) < 0.2 && e.keyCode != keyCodes[i]) {
          this.setState({ success: this.state.success + 1 });
          return
        }
      }
      this.setState({ miss: this.state.miss + 1 });
    });
  }
  render() {
    return (
      <div>
        <span>Miss: {this.state.miss}</span>
        <span> Success: {this.state.success}</span>
      </div>
    );
  }
}

interface StageProp { }

interface StageState {
  time?: number;
  startTime?: number;
}

let requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;

let bpm = 165;
let spb = 60 / bpm;
let offsetTime = spb * 16;

let remps = 1000;
let chars = "ほしがふるようで".split("");
let keyCodes = [86, 79, 188, 75, 67, 70, 65, 69];
let timings =
  [spb, spb * 1.5, spb * 2, spb * 3, spb * 3.5, spb * 4.5, spb * 5.5, spb * 6.5]
    .map((orig) => orig + offsetTime);

class Stage extends React.Component<StageProp, StageState> {
  mainLoop: (time: number) => void;
  constructor(props: StageProp) {
    super(props);
    this.state = {
      time: 0,
      startTime: Date.now() / 1000,
    };
  }
  render() {
    let mainLoop = (m: number) => {
      let time = m / 1000;
      if ((time - this.state.time) > 1 / 60) {
        this.setState({ time: time });
      }
      requestAnimationFrame(mainLoop);
    };
    requestAnimationFrame(mainLoop);

    return (
      <div>
        <Chars time={this.state.time} />
        <Counter startTime={this.state.startTime} />
      </div>
    );
  }
}

interface CharsProp {
  time: number;
}

interface CharsState { }

class Chars extends React.Component<CharsProp, CharsState> {
  constructor(props: CharsProp) {
    super(props);
  }
  render() {
    let positions = timings.map((timing) => (timing - this.props.time) * remps);
    const charElms = chars.map((char, i) => (
      <div style={{ position: "absolute", left: positions[i] }} key={i}>
        <Char value={char} />
      </div>
    ));
    return (
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, overflow: "hidden" }}>
        {charElms}
      </div>
    );
  }
}

interface CharProp {
  value: string;
}

interface CharState { }

class Char extends React.Component<CharProp, CharState> {
  render() {
    return (
      <span style={{ fontSize: "3em" }}>{this.props.value}</span>
    );
  }
}