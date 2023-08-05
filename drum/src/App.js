import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import classnames from "classnames";
import "./App.scss";


function App() {
  return (
      <div id="app">
          <DrumMachine />
      </div>
  );
}

function DrumMachine() {
  return (
      <div id="drum-machine" className="drum-machine">
          <div className="title">FCC</div>
          <Drum />
      </div>
  );
}

function Drum() {
  const [powerStatus, setPowerStatus] = useState("R");
  const [message, setMessage] = useState("");
  const [soundLevel, setSoundLevel] = useState(0.3);
  const [bankStatus, setBankStatus] = useState("L");

  return (
      <div className="drum">
          <PadArea {...{ powerStatus, soundLevel, bankStatus, setMessage }} />
          <Controls
              {...{
                  message,
                  setMessage,
                  powerStatus,
                  setPowerStatus,
                  soundLevel,
                  setSoundLevel,
                  bankStatus,
                  setBankStatus
              }}
          />
      </div>
  );
}

function PadArea({ powerStatus, soundLevel, bankStatus, setMessage }) {
  const pads =
      bankStatus === "L" ? bankOne : bankStatus === "R" ? bankTwo : undefined;

  return (
      <div className="pad-area">
          <div className="grid">
              {pads.map(
                  ({
                      id: instrumentName,
                      keyCode,
                      keyTrigger,
                      url: audioUrl
                  }) => (
                      <DrumPad
                          {...{
                              powerStatus,
                              instrumentName,
                              keyCode,
                              keyTrigger,
                              audioUrl,
                              soundLevel,
                              setMessage
                          }}
                      />
                  )
              )}
          </div>
      </div>
  );
}

function DrumPad({
  powerStatus,
  instrumentName,
  keyCode,
  keyTrigger,
  audioUrl,
  soundLevel,
  setMessage
}) {
  const [hit, setHit] = useState(false);
  const audioRef = useRef();

  useEffect(() => {
      const audioEl = audioRef.current;
      audioEl.volume = soundLevel;
  }, [soundLevel]);

  useEffect(() => {
      if (powerStatus === "L") {
          const audioEl = audioRef.current;
          audioEl.pause();
          audioEl.currentTime = 0;
      }
  }, [powerStatus]);

  useEffect(() => {
      document.addEventListener("keydown", handleKeydown);

      return function cleanup() {
          document.removeEventListener("keydown", handleKeydown);
      };

      function handleKeydown(ev) {
          if (ev.keyCode === keyCode) {
              playSound();
          }
      }
  });

  return (
      <div
          id={keyTrigger}
          className={classnames("drum-pad", {
              hit,
              "with-power": powerStatus === "R"
          })}
          onClick={playSound}
      >
          {keyTrigger}
          <audio
              id={keyTrigger}
              className="clip"
              ref={audioRef}
              src={audioUrl}
          />
      </div>
  );

  function playSound() {
      setHit(true);
      setTimeout(() => setHit(false), 100);

      if (powerStatus === "R") {
          setMessage(instrumentName);
          const audioEl = audioRef.current;
          audioEl.currentTime = 0;
          audioEl.play();
      }
  }
}

function Controls({
  powerStatus,
  setPowerStatus,
  message,
  setMessage,
  soundLevel,
  setSoundLevel,
  bankStatus,
  setBankStatus
}) {
  return (
      <div className="controls">
          <Switch
              label="Power"
              status={powerStatus}
              setStatus={handleSetPowerStatus}
          />
          <Display {...{ message }} />
          <Volume
              {...{
                  level: soundLevel,
                  setLevel: handleSetSoundLevel
              }}
          />
          <Switch
              label="Bank"
              status={bankStatus}
              setStatus={handleSetBankStatus}
          />
      </div>
  );

  function handleSetSoundLevel(value) {
      if (powerStatus === "L") {
          return;
      }

      setSoundLevel(value);

      setMessage(`Volume: ${Math.round(value * 100)}`);
      setTimeout(() => setMessage(""), 1000);
  }

  function handleSetPowerStatus(value) {
      setPowerStatus(value);

      setMessage("");
  }

  function handleSetBankStatus(value) {
      if (powerStatus === "L") {
          return;
      }

      setBankStatus(value);

      setMessage(
          value === "L"
              ? "Heater Kit"
              : value === "R"
              ? "Smooth Piano Kit"
              : "Unknown"
      );
  }
}

function Switch({ label, status, setStatus }) {
  return (
      <div className="switch-container">
          <div className="label">{label}</div>
          <div
              className={classnames("switch", status)}
              onClick={handleToggle}
          >
              <div className="toggle"></div>
          </div>
      </div>
  );

  function handleToggle() {
      setStatus(status === "L" ? "R" : status === "R" ? "L" : undefined);
  }
}

function Display({ message }) {
  return (
      <div id="display" className="display">
          {message}
      </div>
  );
}

function Volume({ level = 0.5, setLevel }) {
  return (
      <div className="volume">
          <input
              type="range"
              value={level}
              min={0}
              max={1}
              step={0.01}
              onChange={handleChange}
          />
      </div>
  );

  function handleChange(ev) {
      setLevel(ev.target.value);
  }
}

const bankOne = [
  {
      keyCode: 81,
      keyTrigger: "Q",
      id: "Heater-1",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3"
  },
  {
      keyCode: 87,
      keyTrigger: "W",
      id: "Heater-2",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3"
  },
  {
      keyCode: 69,
      keyTrigger: "E",
      id: "Heater-3",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3"
  },
  {
      keyCode: 65,
      keyTrigger: "A",
      id: "Heater-4",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3"
  },
  {
      keyCode: 83,
      keyTrigger: "S",
      id: "Clap",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3"
  },
  {
      keyCode: 68,
      keyTrigger: "D",
      id: "Open-HH",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"
  },
  {
      keyCode: 90,
      keyTrigger: "Z",
      id: "Kick-n'-Hat",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3"
  },
  {
      keyCode: 88,
      keyTrigger: "X",
      id: "Kick",
      url: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3"
  },
  {
      keyCode: 67,
      keyTrigger: "C",
      id: "Closed-HH",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3"
  }
];

const bankTwo = [
  {
      keyCode: 81,
      keyTrigger: "Q",
      id: "Chord-1",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3"
  },
  {
      keyCode: 87,
      keyTrigger: "W",
      id: "Chord-2",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3"
  },
  {
      keyCode: 69,
      keyTrigger: "E",
      id: "Chord-3",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3"
  },
  {
      keyCode: 65,
      keyTrigger: "A",
      id: "Shaker",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3"
  },
  {
      keyCode: 83,
      keyTrigger: "S",
      id: "Open-HH",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3"
  },
  {
      keyCode: 68,
      keyTrigger: "D",
      id: "Closed-HH",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3"
  },
  {
      keyCode: 90,
      keyTrigger: "Z",
      id: "Punchy-Kick",
      url: "https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3"
  },
  {
      keyCode: 88,
      keyTrigger: "X",
      id: "Side-Stick",
      url: "https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3"
  },
  {
      keyCode: 67,
      keyTrigger: "C",
      id: "Snare",
      url: "https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3"
  }
];

export default App;
