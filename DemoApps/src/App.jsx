
import React, { useState } from "react";
import Phone from "./components/Phone";
import MainScreen from "./screens/MainScreen";
import EpargneScreen from "./screens/EpargneScreen";
import ProfilScreen from "./screens/ProfilScreen";
import VirementsScreen from "./screens/VirementsScreen";
import BeneficiairesScreen from "./screens/BeneficiairesScreen";
import PageDefautScreen from "./screens/PageDefautScreen";
import SignScreen from "./screens/SignScreen";
import StartLogScreen from "./screens/StartLogScreen";
import LoginTransScreen from "./screens/LoginTranScreen";
import RecoveryaccountScreen from "./screens/RecoveryaccountScreen";
import logVerifCodeScreen from "./screens/LogVerifCodeScreen";
import LogInTransAccountSetupCoverScreen from "./screens/LogInTransAccountSetupCoverScreen";
import "./styles.css";

export default function App() {
  const [current, setCurrent] = useState("main");

  const screens = {
    main: MainScreen,
    epargne: EpargneScreen,
    profil: ProfilScreen,
    virements: VirementsScreen,
    beneficiaires: BeneficiairesScreen,
    defaut: PageDefautScreen,
    sign: SignScreen,
    startLog: StartLogScreen,
    logTrans: LoginTransScreen,
    recovery: RecoveryaccountScreen,
    logVerifCode: logVerifCodeScreen,
    logSetupCover: LogInTransAccountSetupCoverScreen,
  };

  const ScreenComponent = screens[current] || MainScreen;

  return (
    <div className="app-container">
      <Phone>
        <ScreenComponent onNavigate={setCurrent} />
      </Phone>
    </div>
  );
}
