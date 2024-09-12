import React, { useEffect, useRef, useState } from "react";
import cls from "./MoviePlayer.module.scss";
import ReactPlayer from "react-player";
import axios from "axios";

function MoviePlayer({
  moviePlayer,
  isPlayerOpen,
  setIsPlayerOpen,
  setMoviePlayer,
}) {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const playerRef = useRef(null);
  const timeoutIdRef = useRef(null);
  const saveIntervalRef = useRef(null);
  const [show, setShow] = useState(false);
  const [width, setWidth] = useState(0);
  const [timeWatched, setTimeWatched] = useState("");

  const saveMovieTime = async (time) => {
    try {
      if (!show) {
        const token = JSON.parse(localStorage.getItem("token"));
        if (token !== "") {
          await axios.post("http://localhost:3001/movieTime/save", {
            token,
            id: moviePlayer.id,
            time: Math.floor(time),
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMovieTime = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      if (token !== "") {
        const { data } = await axios.post(
          "http://localhost:3001/movieTime/get",
          {
            token,
            id: moviePlayer.id,
          }
        );
        if (data !== false) {
          if (data > 100) {
            setShow(true);
            setIsPlaying(false);
            setSeconds(data - 5);
          } else {
            if (playerRef.current) {
              playerRef.current.seekTo(0, "seconds");
            }
          }
        } else {
          if (playerRef.current) {
            playerRef.current.seekTo(0, "seconds");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getProcents = () => {
    const timeArr = moviePlayer.duration ? moviePlayer.duration.split(" ") : "";
    const hours = parseInt(timeArr[0]);
    const minutes = parseInt(timeArr[2]);

    const totalSeconds = hours * 3600 + minutes * 60;

    const procents = (seconds / totalSeconds) * 100;

    setWidth(procents);
  };

  function getTimeWatched() {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    let result = "";

    if (hours > 0) {
      result += `${hours} ч `;
    }
    if (minutes > 0 || hours === 0) {
      result += `${minutes} мин`;
    }

    setTimeWatched(result.trim());
  }

  useEffect(() => {
    if (!moviePlayer.trailer && moviePlayer.trailer !== true) {
      getMovieTime();

      saveIntervalRef.current = setInterval(() => {
        if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime();

          saveMovieTime(currentTime);
        }
      }, 300000);
    }

    setIsPlaying(true);

    return () => {
      clearInterval(saveIntervalRef.current);
      clearTimeout(timeoutIdRef.current);
      setSeconds(0);
      setShow(false);
    };
  }, [isPlayerOpen, moviePlayer.id, moviePlayer]);

  useEffect(() => {
    if (!moviePlayer.trailer && moviePlayer.trailer !== true) {
      getTimeWatched();
      getProcents();
    }
  }, [seconds]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(0, "seconds");
    }
  }, [moviePlayer]);

  const handleMouseMove = () => {
    setIsMouseOver(true);
    clearTimeout(timeoutIdRef.current);
    timeoutIdRef.current = setTimeout(() => {
      setIsMouseOver(false);
    }, 2600);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      saveMovieTime(currentTime);
    }
  };

  const handleExit = () => {
    setIsPlaying(false);
    setIsPlayerOpen(false);
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      saveMovieTime(currentTime);
    }
  };

  const handlePlus = () => {
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + 15, "seconds");
  };
  const handleMinus = () => {
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime - 15, "seconds");
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!document.activeElement.matches("input, textarea")) {
        if (event.code === "Space") {
          event.preventDefault();
          setIsPlaying((prev) => !prev);
        }
        if (event.code === "ArrowRight") {
          event.preventDefault();
          handlePlus();
        }
        if (event.code === "ArrowLeft") {
          event.preventDefault();
          handleMinus();
        }
        if (event.code === "KeyF") {
          event.preventDefault();
          if (playerRef.current) {
            const player = playerRef.current.getInternalPlayer();
            if (player) {
              if (player.requestFullscreen) {
                player.requestFullscreen();
              }
            }
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={cls.playerSection}>
      {isPlayerOpen && (
        <div className={cls.player} onMouseMove={handleMouseMove}>
          {show ? (
            <div className={cls.continueContainer}>
              <div className={cls.continue}>
                <img
                  src={moviePlayer.pngTitle}
                  alt=""
                  className={cls.pngTitle}
                />
                <div className={cls.progres}>
                  <div className={cls.progresBar}>
                    <div
                      className={cls.bar}
                      style={{
                        width: `${seconds && playerRef.current ? width : 0}%`,
                      }}
                    ></div>
                  </div>
                  <div className={cls.durAndTime}>
                    {timeWatched}

                    <span className={cls.duration}>
                      {` / `}
                      {moviePlayer.duration}
                    </span>
                  </div>
                </div>
                <div className={cls.btns}>
                  <div
                    onClick={() => {
                      setShow(false);
                      setIsPlaying(true);
                      playerRef.current.seekTo(seconds, "seconds");
                    }}
                    className={cls.continueBtn}
                  >
                    Продолжить просмотр
                  </div>
                  <div
                    onClick={() => {
                      playerRef.current.seekTo(0, "seconds");
                      setShow(false);
                      setIsPlaying(true);
                    }}
                    className={cls.restartBtn}
                  >
                    Смотреть сначала
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <i
            className={`fa-solid fa-xmark ${
              isMouseOver || !isPlaying ? cls.show : cls.hide
            }`}
            id={cls.xBtn}
            onClick={handleExit}
          ></i>
          <ReactPlayer
            className={cls.reactPlayer}
            ref={playerRef}
            url={moviePlayer.video}
            width={"100%"}
            controls
            onEnded={() => setIsPlayerOpen(false)}
            playing={isPlaying}
            height={"100%"}
            onPlay={handlePlay}
            onPause={handlePause}
          />
        </div>
      )}
    </div>
  );
}

export default MoviePlayer;
