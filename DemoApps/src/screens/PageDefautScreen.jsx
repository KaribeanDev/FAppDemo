import React from "react";
import defautImg from "/images/PageDefaut.jpg";

export default function PageDefautScreen({ onNavigate }) {
    return (
        <div
            className="screen"
            style={{
                backgroundImage: `url(${defautImg})`,
            }}
        >
            {/* Toute la page) */}
            <div
                className="hotspot"
                style={{ width: "100%", height: "100%" }}
                onClick={() => onNavigate("sign")}
            ></div>





        </div>
    );
}