import React from "react";
import PropTypes from "prop-types";
import "./Compass.css"; // Стили для компаса

const Compass = ({ directions, onMove }) => {
  return (
    <div className="compass">
      <button disabled={!directions.north} onClick={() => onMove("north")} className="north">▲</button>
      <div className="middle-row">
        <button disabled={!directions.west} onClick={() => onMove("west")} className="west">◀</button>
        <div className="center-indicator"></div>
        <button disabled={!directions.east} onClick={() => onMove("east")} className="east">▶</button>
      </div>
      <button disabled={!directions.south} onClick={() => onMove("south")} className="south">▼</button>
    </div>
  );
};

Compass.propTypes = {
  directions: PropTypes.shape({
    north: PropTypes.bool,
    south: PropTypes.bool,
    east: PropTypes.bool,
    west: PropTypes.bool,
  }).isRequired,
  onMove: PropTypes.func.isRequired,
};

export default Compass;
