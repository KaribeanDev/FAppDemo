import React from "react";
import logTransImg from "/images/LoginTransition.jpg";

export default function LoginTransScreen({ onNavigate }) {
    return (
        <div
            className="screen slide-in-right"
            style={{
                backgroundImage: `url(${logTransImg})`,
            }}
        >

            {/* Flèche retour */}
            <div
                className="hotspot"
                style={{ top: "4%", left: "5%", width: "10%", height: "5%" }}
                onClick={() => onNavigate("startLog")}
            ></div>


            {/* Code secret oublié  */}
            <div
                className="hotspot"
                style={{ top: "76%", left: "3%", width: "36%", height: "3%" }}
                onClick={() => onNavigate("recovery")}
            ></div>


            {/* Connexion */}
            <div
                className="hotspot"
                style={{ top: "91%", left: "6%", width: "87%", height: "6%" }}
                onClick={() => onNavigate("logVerifCode")}
            ></div>

        </div>
    );
}