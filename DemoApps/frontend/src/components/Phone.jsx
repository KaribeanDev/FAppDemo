import React from "react";

export default function Phone({ children }) {
  return (
    <div
      style={{
        width: 375,
        height: 812,
        border: "16px solid #000",
        borderRadius: 40,
        margin: "0 auto",
        background: "#000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#111",
        }}
      >
        {children}
      </div>
    </div>
  );
}
