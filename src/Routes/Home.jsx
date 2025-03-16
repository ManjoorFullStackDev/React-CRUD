import React from "react";
import "../index.css";
import PostUser from "./PostUsers";
const Home = () => {
  return (
    <div class="grid-container">
      <div class="header" style={{ backgroundColor: "rgb(93, 99, 71)" }}>
        1
      </div>
      <div class="sidebar" style={{ backgroundColor: "rgb(93, 181, 71)" }}>
        2
      </div>
      <div
        className="main"
        style={{
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <PostUser />
      </div>
      <div class="content" style={{ backgroundColor: "rgb(255, 34, 23)" }}>
        4
      </div>
      <div class="footer" style={{ backgroundColor: "rgb(255,12,90)" }}>
        5
      </div>
      {/* <!--<div class="item6"style="background-color:rgb(140,23, 78)">6</div>-->
  <!--<div class="item7"style="background-color:rgb(255, 90, 90)">7</div>--> */}
    </div>
  );
};

export default Home;
