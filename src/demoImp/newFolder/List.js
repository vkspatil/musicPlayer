import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSpring, animated } from "@react-spring/web";

const List = ({
  setOnSelectTrack,
  extraLighterShade,
  activeTab,
  setSelectedTrckId,
  trackList,
  setTrackList,
  filteredTracksList,
  setFilteredTrackList,
}) => {
  const [search, setSearch] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://cms.samespace.com/items/songs")
      .then((response) => {
        const tracksWithDuration = response.data.data.map((track) => ({
          ...track,
          duration: track.duration || 0,
        }));
        setTrackList(tracksWithDuration);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [setTrackList]);

  useEffect(() => {
    const filtered = trackList.filter(
      (track) =>
        track.name.toLowerCase().includes(search.toLowerCase()) &&
        (activeTab.toLowerCase() === "for you"
          ? !track.top_track
          : track.top_track)
    );
    setFilteredTrackList(filtered);
  }, [trackList, search, activeTab, setFilteredTrackList]);

  const inputSpringProps = useSpring({
    backgroundColor: extraLighterShade,
    border: `1px solid ${extraLighterShade}`,
    config: { duration: 300 },
  });

  const itemSpringProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 300 },
  });

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-4">
      <animated.input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="p-2 mb-4 w-full rounded-lg bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-300 ease-in-out"
        style={inputSpringProps}
      />
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-gray-500 rounded-full" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredTracksList.length > 0 ? (
            filteredTracksList.map((track) => (
              <animated.div
                key={track.id}
                className={`p-2 rounded-lg flex items-center transition cursor-pointer ${
                  hoveredId === track.id ? "bg-gray-700" : "hover:bg-gray-800"
                }`}
                onClick={() => {
                  setOnSelectTrack(track);
                  setSelectedTrckId(track.id);
                }}
                onMouseEnter={() => setHoveredId(track.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  ...itemSpringProps,
                  backgroundColor:
                    hoveredId === track.id ? extraLighterShade : "transparent",
                }}
              >
                <img
                  src={`https://cms.samespace.com/assets/${track.cover}`}
                  alt={track.name}
                  className="w-14 h-14 md:w-10 md:h-10 object-cover rounded-md"
                />
                <div className="ml-4 flex-1">
                  <h2 className="text-lg font-semibold text-gray-400">
                    {track.name}
                  </h2>
                  <p className="text-gray-400">{track.artist}</p>
                </div>
                <span className="text-gray-400 ml-4">
                  {/* {track.duration ? formatDuration(track.duration) : "--:--"} */}
                </span>
              </animated.div>
            ))
          ) : (
            <p className="text-gray-400">No tracks found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default List;
