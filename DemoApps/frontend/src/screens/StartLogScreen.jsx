import React from "react";
import startLogImg from "/images/StartLog.jpg";

export default function StartLogScreen({ onNavigate }) {
    return (
        <div
            className="screen slide-in-right"
            style={{
                backgroundImage: `url(${startLogImg})`,
            }}
        >

            {/* Flèche retour */}
            <div
                className="hotspot"
                style={{ top: "4%", left: "5%", width: "10%", height: "5%" }}
                onClick={() => onNavigate("sign")}
            ></div>


            {/* Connexion */}
            <div
                className="hotspot"
                style={{ top: "91%", left: "6%", width: "87%", height: "6%" }}
                onClick={() => onNavigate("logTrans")}
            ></div>

        </div>
    );
}