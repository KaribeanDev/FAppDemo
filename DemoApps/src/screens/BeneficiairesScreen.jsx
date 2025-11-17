import React from "react";
import beneficiairesImg from "/images/beneficiaires.jpg";

export default function BeneficiairesScreen({ onNavigate }) {
  return (
    <div
      className="screen" 
      style={{
        backgroundImage: `url(${beneficiairesImg})`,
      }}
    >
      {/* Bouton retour */}
      <div
        className="hotspot"
        style={{ top: "4%", left: "4%", width: "10%", height: "5%" }}
        onClick={() => onNavigate("virements")}
      ></div>

      {/* Claire Martin */}
      <div
        className="hotspot"
        style={{ top: "26%", left: "8%", width: "84%", height: "7%" }}
        onClick={() => alert("Claire Martin")}
      ></div>

      {/* John Doe */}
      <div
        className="hotspot"
        style={{ top: "36%", left: "8%", width: "84%", height: "7%" }}
        onClick={() => alert("John Doe")}
      ></div>

      {/* Julien Dupont */}
      <div
        className="hotspot"
        style={{ top: "46%", left: "8%", width: "84%", height: "7%" }}
        onClick={() => alert("Julien Dupont")}
      ></div>

      {/* Ajouter un bénéficiaire */}
      <div
        className="hotspot"
        style={{ bottom: "4%", left: "15%", width: "70%", height: "8%" }}
        onClick={() => alert("Ajouter un bénéficiaire")}
      ></div>
    </div>
  );
}