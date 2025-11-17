import React, { useState } from "react";
import Phone from "./components/Phone";
import MainScreen from "./screens/MainScreen";
import EpargneScreen from "./screens/EpargneScreen";
import ProfilScreen from "./screens/ProfilScreen";
import VirementsScreen from "./screens/VirementsScreen";
import BeneficiairesScreen from "./screens/BeneficiairesScreen";
import "./styles.css";

export default function App() {
  const [current, setCurrent] = useState("main");

  const renderScreen = () => {
    switch (current) {
      case "epargne":
        return <EpargneScreen onNavigate={setCurrent} />;
              case "profil":
        return <ProfilScreen onNavigate={setCurrent} />;
              case "virements":
        return <VirementsScreen onNavigate={setCurrent} />;
              case "beneficiaires":
        return <BeneficiairesScreen onNavigate={setCurrent} />;

      default:
        return <MainScreen onNavigate={setCurrent} />;
    }
  };

  return (
    <div className="app-container">
      <Phone>{renderScreen()}</Phone>
    </div>
  );
}