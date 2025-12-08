import React from "react";
import LogInTransAccountSetupCoverImg from "/images/logInTransAccountSetupCover.jpg";

export default function LogInTransAccountSetupCoverScreen({ onNavigate }) {
    return (
        <div
            className="screen slide-in-right"
            style={{
                backgroundImage: `url(${LogInTransAccountSetupCoverImg})`,
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
                style={{ top: "88%", left: "6%", width: "87%", height: "7%" }}
                onClick={() => alert("Commencer")}
            ></div>

        </div>
    );
}