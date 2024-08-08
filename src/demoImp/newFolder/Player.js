import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSpring, animated } from "@react-spring/web";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";

const Player = ({
  onSelectTrack,
  setOnSelectTrack,
  setBgColor,
  bgColor,
  selectedTrckId,
  setSelectedTrckId,
  filteredTracksList,
}) => {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [volumeIcon, setVolumeIcon] = useState(<VolumeUpIcon />);
  const audioRef = useRef(null);

  useEffect(() => {
    if (onSelectTrack) {
      axios
        .get(onSelectTrack.url)
        .then((response) => {
          setCurrentTrack(onSelectTrack);
          setBgColor(onSelectTrack.accent || "#000");
          setPlaying(true);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [onSelectTrack, setBgColor]);

  useEffect(() => {
    if (audioRef.current) {
      if (playing) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }

      const updateTime = () => {
        setCurrentTime(audioRef.current.currentTime);
      };

      const updateDuration = () => {
        setDuration(audioRef.current.duration);
      };

      const handleEnded = () => {
        setPlaying(false);
      };

      audioRef.current.addEventListener("timeupdate", updateTime);
      audioRef.current.addEventListener("loadedmetadata", updateDuration);
      audioRef.current.addEventListener("ended", handleEnded);

      return () => {
        audioRef.current.removeEventListener("timeupdate", updateTime);
        audioRef.current.removeEventListener("loadedmetadata", updateDuration);
        audioRef.current.removeEventListener("ended", handleEnded);
      };
    }
  }, [playing, currentTrack]);

  const playPauseHandler = () => {
    setPlaying(!playing);
  };

  const nextTrackHandler = () => {
    if (filteredTracksList.length === 0) return;

    const nextIndex = (selectedTrckId + 1) % filteredTracksList.length;
    setCurrentTrack(filteredTracksList[nextIndex]);
    setSelectedTrckId(nextIndex);
    setPlaying(true);
    setOnSelectTrack(filteredTracksList[nextIndex]);
  };

  const prevTrackHandler = () => {
    if (filteredTracksList.length === 0) return;

    const prevIndex =
      (selectedTrckId - 1 + filteredTracksList.length) %
      filteredTracksList.length;
    setCurrentTrack(filteredTracksList[prevIndex]);
    setSelectedTrckId(prevIndex);
    setPlaying(true);
    setOnSelectTrack(filteredTracksList[prevIndex]);
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleVolume = () => {
    const newVolume = volume === 0 ? 1 : 0;
    setVolume(newVolume);
    setVolumeIcon(newVolume === 0 ? <VolumeMuteIcon /> : <VolumeUpIcon />);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <>
      <animated.div className="p-4">
        {currentTrack ? (
          <div className="flex justify-center">
            <div className="grid gap-3">
              <div className=" ">
                <h2 className="text-xl text-gray-400 font-semibold">
                  {currentTrack?.name}
                </h2>
                <p className="text-gray-400">{currentTrack?.artist}</p>
              </div>
              <div className="">
                <div className="mb-4 flex justify-center">
                  <img
                    src={`https://cms.samespace.com/assets/${currentTrack.cover}`}
                    alt={currentTrack.name}
                    className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 object-cover rounded-md"
                  />
                </div>
                <div className="text-center mb-4 w-full sm:w-80 md:w-96">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(currentTime / duration) * 100}
                    onChange={handleSeek}
                    className="w-full "
                  />
                  <div className="flex justify-between w-full mt-2">
                    <span className="text-gray-400">
                      {Math.floor(currentTime / 60)}:
                      {Math.floor(currentTime % 60)
                        .toString()
                        .padStart(2, "0")}
                    </span>
                    <span className="text-gray-400">
                      {Math.floor(duration / 60)}:
                      {Math.floor(duration % 60)
                        .toString()
                        .padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between space-x-4 w-full sm:w-80 md:w-96">
                  <button
                    className="p-2 text-gray-400 hover:text-gray-300"
                    aria-label="More Info"
                  >
                    <MoreHorizIcon />
                  </button>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={prevTrackHandler}
                      className="p-2 text-gray-400 hover:text-gray-300"
                      aria-label="Previous Track"
                    >
                      <SkipPreviousIcon />
                    </button>
                    <button
                      onClick={playPauseHandler}
                      className={`p-2 ${
                        playing ? "text-red-500" : "text-gray-400"
                      } hover:text-gray-300`}
                      aria-label={playing ? "Pause" : "Play"}
                    >
                      {playing ? <PauseIcon /> : <PlayArrowIcon />}
                    </button>
                    <button
                      onClick={nextTrackHandler}
                      className="p-2 text-gray-400 hover:text-gray-300"
                      aria-label="Next Track"
                    >
                      <SkipNextIcon />
                    </button>
                  </div>
                  <button
                    onClick={toggleVolume}
                    className="p-2 text-gray-400 hover:text-gray-300"
                    aria-label={volume === 0 ? "Unmute" : "Mute"}
                  >
                    {volumeIcon}
                  </button>
                </div>
                <audio ref={audioRef} src={currentTrack.url} volume={volume} />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No track selected</p>
        )}
      </animated.div>
    </>
  );
};

export default Player;
