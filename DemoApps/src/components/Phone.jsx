import React from "react";
import "../Phone.css";

export default function Phone({ children }) {
  return (
    <div className="iphone">
      <div className="iphone-notch"></div>
      <div className="iphone-screen">{children}</div>
      <div className="iphone-button"></div>
    </div>
  );
}