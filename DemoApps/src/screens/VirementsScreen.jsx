import React from "react";
import virementsImg from "/images/virements.jpg";

export default function VirementsScreen({ onNavigate }) {
  return (
    <div
      className="screen slide-in-right"
      style={{
        backgroundImage: `url(${virementsImg})`,
      }}
    >
      {/* Avatar (haut gauche) */}
      <div
        className="hotspot"
        style={{ top: "4%", left: "5%", width: "10%", height: "5%" }}
        onClick={() => onNavigate("profil")}
      ></div>


      {/* Envoyer de l’argent */}
      <div
        className="hotspot"
        style={{ top: "26%", left: "8%", width: "28%", height: "12%" }}
        onClick={() => alert("Envoyer de l'argent")}
      ></div>

      {/* Virements et prélèvements */}
      <div
        className="hotspot"
        style={{ top: "26%", left: "36%", width: "28%", height: "12%" }}
        onClick={() => alert("Virements et prélèvements")}
      ></div>

      {/* Gérer mes bénéficiaires */}
      <div
        className="hotspot"
        style={{ top: "26%", left: "64%", width: "28%", height: "12%" }}
        onClick={() => alert("Gérer mes bénéficiaires")}
      ></div>

      {/* Bénéficiaire 1 */}
      <div
        className="hotspot"
        style={{ top: "41%", left: "8%", width: "84%", height: "7%" }}
        onClick={() => alert("Albert Flores")}
      ></div>

      {/* Bénéficiaire 2 */}
      <div
        className="hotspot"
        style={{ top: "50%", left: "8%", width: "84%", height: "7%" }}
        onClick={() => alert("Kristin Watson")}
      ></div>

      {/* Bénéficiaire 3 */}
      <div
        className="hotspot"
        style={{ top: "57%", left: "8%", width: "84%", height: "7%" }}
        onClick={() => alert("Theresa Webb")}
      ></div>

      {/* Voir tout */}
      <div
        className="hotspot"
        style={{ top: "64%", left: "76%", width: "20%", height: "4%" }}
        onClick={() => onNavigate("beneficiaires")}
      ></div>

      {/* Bottom menu – Comptes */}
      <div
        className="hotspot"
        style={{ bottom: "2%", left: "5%", width: "20%", height: "8%" }}
        onClick={() => onNavigate("main", "left")}
      ></div>

      {/* Bottom menu – Épargne */}
      <div
        className="hotspot"
        style={{ bottom: "2%", left: "28%", width: "20%", height: "8%" }}
        onClick={() => onNavigate("epargne", "right")}
      ></div>

      {/* Bottom menu – Virements (déjà ici) */}
      <div
        className="hotspot"
        style={{ bottom: "2%", left: "51%", width: "20%", height: "8%" }}
      ></div>

      {/* Bottom menu – Découvrir */}
      <div
        className="hotspot"
        style={{ bottom: "2%", left: "74%", width: "20%", height: "8%" }}
        onClick={() => alert("Découvrir")}
      ></div>
    </div>
  );
}