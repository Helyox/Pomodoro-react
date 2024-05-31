import React, { useState, useEffect, useRef, useCallback } from "react";
import "./index.css";
import Button from "./Button";
import { Volume2, VolumeX, Podcast} from 'lucide-react';

function App() {
  let [time, setTime] = useState(1500);
  const [isActive, setIsActive] = useState(false);
  const [currentTimer, setCurrentTimer] = useState('Pomodoro');
  const [isPaused, setIsPaused] = useState(false);
  const [title, setTitle] = useState('Pomodoro');
  const [onvolume, setOnvolume] = useState(true);
  const audioRef = useRef(null);
  const [oncoran, setOncoran] = useState(false);
  const playerRef = useRef(null);


  useEffect(() => {
    if (time === 5 && onvolume) {
      playSound();
    }
  }, [time, onvolume]);


  const handleSessionEnd = useCallback(() => {
    if (currentTimer === 'Pomodoro') {
      setCurrentTimer('Short Break');
      setTime(300); // 5 minutes
      setParagraphText(formatTime(1500));
    } else if (currentTimer === 'Long Break') {
      setCurrentTimer('Pomodoro');
      setTime(900); // 15 minutes
      setParagraphText(formatTime(1500));
    }
    else  {
      setCurrentTimer('Pomodoro');
      setTime(1500); // 15 minutes
      setParagraphText(formatTime(300));
    }
    setIsActive(true);
    setIsPaused(false);
  }, [currentTimer]);


  useEffect(() => {
    let interval = null;
    document.title = formatTime(time);
    if (isActive && !isPaused && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    }
    if (time === 0) {
      handleSessionEnd();
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, time, title, currentTimer, handleSessionEnd]);

  const startTimer = () => {
    const WorkDisplay = document.getElementById("WorkDisplayID");
    const timeText = WorkDisplay.textContent;
    const [minutes, seconds] = timeText.split(":").map(Number); // Divise en [minutes, seconds] et convertit en nombre
    const totalTimeInSeconds = minutes * 60 + seconds;
    setTime(totalTimeInSeconds);
    setIsActive(true);
    setIsPaused(false);
  };
    
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const [newtime, setParagraphText] = useState(formatTime(300));
  const handleClick = (buttonText) => {
    if (buttonText === "Short Break") {
      setParagraphText('');
      setTime(300);
    } else if (buttonText === "Long Break") {
      setParagraphText('');
      setTime(900);
    } else if (buttonText === "Pomodoro") {
      setParagraphText(formatTime(300));
      setTime(1500);
    }
    setCurrentTimer(buttonText);
    setIsActive(false); 
  };

  const stopTimer = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      setIsActive(false);
    } else {
      setIsActive(true);
    }
  };

  const reset = () => {
    setIsActive(false);
    setIsPaused(false);
    setTime(currentTimer === 'Pomodoro' ? 1500 : currentTimer === 'Short Break' ? 300 : 900);
    const allAudioElements = document.querySelectorAll('audio');
    allAudioElements.forEach(audio => audio.pause());
  };

  const playSound = () => {
    audioRef.current.play();
  };

  const onoffvolume = () =>{
    setOnvolume(!onvolume)
  }
  
  const onPlayerReady = (event) => {
    event.target.setVolume(100); // Réglez le volume à 100
  };
  
  const coran = () => {
    setOncoran(!oncoran);
  
    if (!oncoran) { // Si le podcast est activé
      if (playerRef.current) {
        playerRef.current.playVideo();
      } else {
        const playerDiv = document.getElementById('player');
        if (playerDiv) {
          playerRef.current = new window.YT.Player(playerDiv, {
            height: '0', // Masquer la vidéo
            width: '0',  // Masquer la vidéo
            videoId: 'moQtMet7F7w', // ID de la vidéo YouTube en direct
            playerVars: {
              autoplay: 1, // Lecture automatique
              controls: 0, // Masquer les contrôles du lecteur
              loop: 1, // Lecture en boucle
              modestbranding: 1, // Masquer le logo YouTube
              playsinline: 1, // Lecture dans la même fenêtre
              origin: window.location.origin // Assurez-vous que cela correspond à votre origine
            },
            events: {
              onReady: onPlayerReady,
            },
          });
        } else {
          console.error("Element with ID 'player' not found.");
        }
      }
    } else {
      // Arrêtez le lecteur lorsque le podcast est désactivé
      if (playerRef.current && typeof playerRef.current.stopVideo === 'function') {
        playerRef.current.stopVideo();
      }
    }
  };
  return (
    <div className="main">
      <audio ref={audioRef} src={`${process.env.PUBLIC_URL}/yes.mp3`} />
      <div className="icondiv">
        {!oncoran ? <Podcast className="icon1" onClick={coran}/> : <Podcast className="icon1 white" onClick={coran}/>}
        {onvolume ? <Volume2 className="icon" onClick={onoffvolume}/> : <VolumeX className="icon hovers" onClick={onoffvolume}/> }
      </div>
      <div id="player"></div>
      <div className="container-btn">
        <Button
          text="Pomodoro"
          id="pomodoroBtn"
          classe={`btn ${currentTimer === 'Pomodoro' ? 'current' : ''}`}
          onClick={() => handleClick('Pomodoro')}
        />
        <Button
          text="Short Break"
          id="shortBtn"
          classe={`btn ${currentTimer === 'Short Break' ? 'current' : ''}`}
          onClick={() => handleClick('Short Break')}
        />
        <Button
          text="Long Break"
          id="longBtn"
          classe={`btn ${currentTimer === 'Long Break' ? 'current' : ''}`}
          onClick={() => handleClick('Long Break')}
        />
      </div>
      <div className="timer">
        {isActive && !isPaused && <p id="runningID" className="running">RUNNING</p>}
        {!isActive && isPaused && <p id="runningID" className="running">PAUSED</p>}
        <p className="work" id="WorkDisplayID" onChange={setTitle}>{formatTime(time)}</p>
        <p className="break">{newtime}</p>
      </div>
      {!isActive && !isPaused && (
        <div className="btn-start" onClick={startTimer}>
          <p>START TIMER</p>
        </div>
      )}
      {isActive || isPaused ? (
        <div className="container-btn1">
          <div className={isPaused ? 'green pause' : 'pause'} onClick={stopTimer}>
            <p>{isPaused ? 'RESUME' : 'PAUSE'}</p>
          </div>
          <div className="reset" onClick={reset}>
            <p>RESET</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
