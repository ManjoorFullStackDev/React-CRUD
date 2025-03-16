import React from "react";
import { Link } from "react-router-dom";
const NavBar = () => {
  return (
    <div>
      <ul style={{ display: "flex", gap: "20px", marginLeft: "1400px" }}>
        <Link to="/About">
          <li>About</li>
        </Link>
      </ul>
    </div>
  );
};

export default NavBar;
