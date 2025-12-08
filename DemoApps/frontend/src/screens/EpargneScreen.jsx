import React from "react";
import epargneImg from "../images/EpargneScreen.jpeg"; // ton image à placer dans /public/images/

export default function EpargneScreen({ onNavigate }) {
  return (
    <div
      className="screen"
      style={{
        backgroundImage: `url(${epargneImg})`,
      }}
    >
      {/* Bouton retour (logo CL) */}
      <div
        className="hotspot"
        style={{ top: "4%", left: "5%", width: "10%", height: "5%" }}
        onClick={() => onNavigate("profil")}
      ></div>

      {/* Bouton "Découvrir les livrets" */}
      <div
        className="hotspot"
        style={{ top: "83%", left: "20%", width: "60%", height: "8%" }}
        onClick={() => alert("Ouverture de la page des livrets")}
      ></div>

      {/* Barre de navigation du bas */}
      <div
        className="hotspot"
        style={{ top: "92%", left: "0%", width: "25%", height: "8%" }}
        onClick={() => onNavigate("main")}
      ></div>

      <div
        className="hotspot"
        style={{ top: "92%", left: "25%", width: "25%", height: "8%" }}
        onClick={() => onNavigate("epargne")}
      ></div>

      <div
        className="hotspot"
        style={{ top: "92%", left: "50%", width: "25%", height: "8%" }}
        onClick={() => onNavigate("virements")}
      ></div>

      <div
        className="hotspot"
        style={{ top: "92%", left: "75%", width: "25%", height: "8%" }}
        onClick={() => onNavigate("decouvrir")}
      ></div>
    </div>
  );
}