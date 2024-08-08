import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import Player from "./Player";
import List from "./List";
import logoIcon from "./Logo.svg";

const MainPlayer = () => {
  const [onSelectTrack, setOnSelectTrack] = useState(null);
  const [selectedTrckId, setSelectedTrckId] = useState(null);
  const [bgColor, setBgColor] = useState("#000");
  const [activeTab, setActiveTab] = useState("For you");
  const [trackList, setTrackList] = useState([]);
  const [filteredTracksList, setFilteredTrackList] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const adjustColorBrightness = (color, percent) => {
    const usePound = color[0] === "#";
    let r = parseInt(color.slice(1, 3), 16);
    let g = parseInt(color.slice(3, 5), 16);
    let b = parseInt(color.slice(5, 7), 16);

    r = Math.min(255, Math.max(0, r + (r * percent) / 100));
    g = Math.min(255, Math.max(0, g + (g * percent) / 100));
    b = Math.min(255, Math.max(0, b + (b * percent) / 100));

    return (
      (usePound ? "#" : "") +
      ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()
    );
  };

  const extraLighterShade = adjustColorBrightness(bgColor, 50);
  const lighterShade = adjustColorBrightness(bgColor, 30);
  const darkerShade = adjustColorBrightness(bgColor, -30);

  const springProps = useSpring({
    background: `linear-gradient(to right, ${lighterShade}, ${bgColor}, ${darkerShade})`,
    config: { duration: 500 },
  });

  const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
  };

  const { width } = useWindowSize();
  const isMobile = width < 768;

  return (
    <animated.div
      style={springProps}
      className="min-h-screen relative flex flex-col"
    >
      <header className="fixed top-0 left-0 right-0 bg-opacity-75 w-full">
        <div className="flex items-center space-x-2 p-4 justify-between">
          <img
            src={logoIcon}
            alt="Spotify Logo"
            className={`h-8 ${
              isMobile ? "h-6" : "h-8"
            } transition-all duration-300`}
          />
          {isMobile && (
            <button
              className="text-gray-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? "Close" : "Menu"}
            </button>
          )}
        </div>
      </header>
      <main className="pt-16 flex-1 overflow-y-auto">
        <div className="grid grid-cols-6 gap-3">
          {!isMobile && <div className="col-span-1"></div>}

          <div className={!isMobile ? "col-span-2" : "col-span-6"}>
            <div
              className={`flex gap-3 text-gray-200 mt-4 ${
                isMobile && "justify-center"
              }`}
            >
              <button
                className={`px-4 py-2 ${
                  activeTab === "For you" ? "text-gray-200" : "text-gray-600"
                }`}
                onClick={() => setActiveTab("For you")}
              >
                For you
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "Top Tracks" ? "text-gray-200" : "text-gray-600"
                }`}
                onClick={() => setActiveTab("Top Tracks")}
              >
                Top Tracks
              </button>
            </div>
            {!isMobile && (
              <animated.div>
                <List
                  extraLighterShade={extraLighterShade}
                  activeTab={activeTab}
                  setOnSelectTrack={setOnSelectTrack}
                  setSelectedTrckId={setSelectedTrckId}
                  trackList={trackList}
                  setTrackList={setTrackList}
                  filteredTracksList={filteredTracksList}
                  setFilteredTrackList={setFilteredTrackList}
                />
              </animated.div>
            )}
          </div>

          {isMobile && isMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-white z-10 shadow-lg">
              <List
                extraLighterShade={extraLighterShade}
                activeTab={activeTab}
                setOnSelectTrack={setOnSelectTrack}
                setSelectedTrckId={setSelectedTrckId}
                trackList={trackList}
                setTrackList={setTrackList}
                filteredTracksList={filteredTracksList}
                setFilteredTrackList={setFilteredTrackList}
              />
            </div>
          )}
          <div className={!isMobile ? "col-span-3 p-4" : "col-span-6 p-4"}>
            <Player
              onSelectTrack={onSelectTrack}
              setOnSelectTrack={setOnSelectTrack}
              setBgColor={setBgColor}
              bgColor={bgColor}
              selectedTrckId={selectedTrckId}
              setSelectedTrckId={setSelectedTrckId}
              filteredTracksList={filteredTracksList}
            />
          </div>
        </div>
      </main>
    </animated.div>
  );
};

export default MainPlayer;
