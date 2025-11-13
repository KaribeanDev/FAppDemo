import React from "react";
import profilImg from "/images/Profil.jpg"; // mets ici ta capture d’écran de cette page

export default function ProfileScreen({ onNavigate }) {
  return (
    <div
      className="screen slide-in-right"
      style={{
        backgroundImage: `url(${profilImg})`,
      }}
    >
      {/* Flèche retour */}
      <div
        className="hotspot"
        style={{ top: "4%", left: "5%", width: "10%", height: "5%" }}
        onClick={() => onNavigate("main", "left")}
      ></div>

      {/* Informations personnelles */}
      <div
        className="hotspot"
        style={{ top: "25%", left: "8%", width: "84%", height: "7%" }}
        onClick={() => alert("Infos personnelles")}
      ></div>

      {/* Documents */}
      <div
        className="hotspot"
        style={{ top: "33%", left: "8%", width: "84%", height: "7%" }}
        onClick={() => alert("Documents")}
      ></div>

      {/* Paramètres */}
      <div
        className="hotspot"
        style={{ top: "40%", left: "8%", width: "84%", height: "7%" }}
        onClick={() => alert("Paramètres")}
      ></div>

      {/* Retour d’expérience */}
      <div
        className="hotspot"
        style={{ top: "52%", left: "8%", width: "84%", height: "7%" }}
        onClick={() => alert("Retour d'expérience")}
      ></div>

      {/* Se déconnecter (pas d’animation) */}
      <div
        className="hotspot"
        style={{ top: "91%", left: "35%", width: "30%", height: "4%" }}
        onClick={() => alert("Déconnexion effectuée")}
      ></div>
    </div>
  );
}