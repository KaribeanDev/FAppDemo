import React from "react";
import homeImg from "/images/MainScreen.jpg"; // ta capture d’écran principale

export default function MainScreen({ onNavigate }) {
  return (
    <div
      className="screen"
      style={{
        backgroundImage: `url(${homeImg})`,
      }}
    >
      {/* --- En-tête --- */}

      {/* Avatar (haut gauche) */}
      <div
        className="hotspot"
        style={{ top: "4%", left: "5%", width: "10%", height: "5%" }}
        onClick={() => onNavigate("profil")}
      ></div>

      {/* Bouton "Comptes" */}
      <div
        className="hotspot"
        style={{ top: "4%", left: "40%", width: "20%", height: "5%" }}
        onClick={() => onNavigate("accounts")}
      ></div>

      {/* Icône messages (haut droite) */}
      <div
        className="hotspot"
        style={{ top: "4%", right: "5%", width: "10%", height: "5%" }}
        onClick={() => onNavigate("messages")}
      ></div>

      {/* --- Carte compte --- */}

      {/* Envoyer de l'argent */}
      <div
        className="hotspot"
        style={{ top: "43%", left: "10%", width: "25%", height: "10%" }}
        onClick={() => alert("Envoyer de l'argent")}
      ></div>

      {/* Copier IBAN */}
      <div
        className="hotspot"
        style={{ top: "43%", left: "40%", width: "25%", height: "10%" }}
        onClick={() => alert("IBAN copié !")}
      ></div>

      {/* Gérer mon compte */}
      <div
        className="hotspot"
        style={{ top: "43%", left: "70%", width: "25%", height: "10%" }}
        onClick={() => onNavigate("settings")}
      ></div>

      {/* --- Liste des transactions --- */}

      {/* Zone cliquable sur la liste */}
      <div
        className="hotspot"
        style={{ top: "65%", left: "10%", width: "80%", height: "20%" }}
        onClick={() => onNavigate("transactions")}
      ></div>

      {/* "Tout afficher" */}
      <div
        className="hotspot"
        style={{ top: "87%", left: "35%", width: "30%", height: "5%" }}
        onClick={() => onNavigate("transactions")}
      ></div>

      {/* --- Barre de navigation du bas --- */}

      {/* Accueil */}
      <div
        className="hotspot"
        style={{ top: "92%", left: "0%", width: "25%", height: "8%" }}
        onClick={() => onNavigate("home")}
      ></div>

      {/* Épargne */}
      <div
        className="hotspot"
        style={{ top: "92%", left: "25%", width: "25%", height: "8%" }}
        onClick={() => onNavigate("epargne")}
      ></div>

      {/* Virements */}
      <div
        className="hotspot"
        style={{ top: "92%", left: "50%", width: "25%", height: "8%" }}
        onClick={() => onNavigate("transfer")}
      ></div>

      {/* Découvrir */}
      <div
        className="hotspot"
        style={{ top: "92%", left: "75%", width: "25%", height: "8%" }}
        onClick={() => onNavigate("discover")}
      ></div>
    </div>
  );
}