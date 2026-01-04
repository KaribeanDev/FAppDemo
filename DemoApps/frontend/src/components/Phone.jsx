import React from "react";
import "../styles/Phone.css"; 

export default function Phone({ children }) {
  return (
    <div className="iphone">
      {/* Notch */}
      <div className="iphone-notch"></div>

      {/* Écran */}
      <div className="iphone-screen">
        {children}
      </div>

      {/* Bouton bas */}
      <div className="iphone-button"></div>
    </div>
  );
}
