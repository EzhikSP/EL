import React, { useState, useEffect } from "react";
import Compass from "./Compass";
//import "./GameScreen.css";

const GameScreen = ({ currentLocation, onMove }) => {
  const [directions, setDirections] = useState({
    north: false,
    south: false,
    east: false,
    west: false,
  });

  useEffect(() => {
    if (currentLocation) {
      setDirections({
        north: Boolean(currentLocation.north_id),
        south: Boolean(currentLocation.south_id),
        east: Boolean(currentLocation.east_id),
        west: Boolean(currentLocation.west_id),
      });
    }
  }, [currentLocation]);

  return (
    <div className="game-screen">
      <h2>{currentLocation?.name || "Загрузка локации..."}</h2>
      <Compass directions={directions} onMove={onMove} />
    </div>
  );
};

export default GameScreen;
