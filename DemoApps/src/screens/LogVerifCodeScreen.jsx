import React from "react";
import logVerifCodeImg from "/images/logInverificationCode.jpg";

export default function logVerifCodeScreen({ onNavigate }) {
    return (
        <div
            className="screen slide-in-right"
            style={{
                backgroundImage: `url(${logVerifCodeImg})`,
            }}
        >

            {/* Flèche retour */}
            <div
                className="hotspot"
                style={{ top: "4%", left: "5%", width: "10%", height: "5%" }}
                onClick={() => onNavigate("startLog")}
            ></div>




            {/* Continuer */}
            <div
                className="hotspot"
                style={{ top: "81%", left: "6%", width: "87%", height: "6%" }}
                onClick={() => onNavigate("logSetupCover")}
            ></div>

        </div>
    );
}