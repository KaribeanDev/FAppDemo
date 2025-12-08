import React from "react";
import signImg from "/images/SignPage.jpg"; 

export default function SignScreen({ onNavigate }) {
  return (
    <div
      className="screen slide-in-right"
      style={{
        backgroundImage: `url(${signImg})`,
      }}
    >
      {/* Opposition (haut gauche) */}
      <div
        className="hotspot"
        style={{ top: "6%", left: "5%", width: "20%", height: "5%" }}
        onClick={() => alert("Opposition")}
      ></div>

            {/* Informations (haut droite) */}
      <div
        className="hotspot"
        style={{ top: "6%", right: "5%", width: "25%", height: "5%" }}
        onClick={() => alert("Informations")}
      ></div>



      {/* Commencer la migration */}
      <div
        className="hotspot"
        style={{ top: "55%", left: "8%", width: "84%", height: "7%" }}
        onClick={() => onNavigate("startLog")}
      ></div>


      {/* Création de compte */}
      <div
        className="hotspot"
        style={{ top: "85%", left: "8%", width: "84%", height: "6%" }}
        onClick={() => alert("Je créé mon compte")}
      ></div>


      {/* Connexion */}
      <div
        className="hotspot"
        style={{ top: "92%", left: "8%", width: "84%", height: "6%" }}
        onClick={() => alert("Je me connecte")}
      ></div>

    </div>
  );
}