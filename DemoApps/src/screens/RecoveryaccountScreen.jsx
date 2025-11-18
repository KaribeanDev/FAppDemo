import React from "react";
import recoveryImg from "/images/recuperationCompte.jpg";

export default function RecoveryaccountScreen({ onNavigate }) {
    return (
        <div
            className="screen slide-in-right"
            style={{
                backgroundImage: `url(${recoveryImg})`,
            }}
        >

            {/* Flèche retour */}
            <div
                className="hotspot"
                style={{ top: "4%", left: "5%", width: "10%", height: "5%" }}
                onClick={() => onNavigate("logTrans")}
            ></div>


            {/* Code secret oublié  */}
            <div
                className="hotspot"
                style={{ top: "76%", left: "3%", width: "36%", height: "3%" }}
                onClick={() => alert("Code secret oublié")}
            ></div>


            {/* Connexion */}
            <div
                className="hotspot"
                style={{ top: "91%", left: "6%", width: "87%", height: "6%" }}
                onClick={() => alert("Continuer")}
            ></div>

        </div>
    );
}