import React, { useRef, useState } from "react";

export default function GridEditor({
  imageUrl,
  hotspots,
  setHotspots,
  selectedIndex,
  setSelectedIndex,
}) {
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(null); // { index, offsetX, offsetY }
  const [resizing, setResizing] = useState(null); // { index, handle }

  const toPercent = (valuePx, totalPx) => (valuePx / totalPx) * 100;

  // --- Création d'une nouvelle zone ---
  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Si on clique sur une zone existante, ne pas dessiner
    if (e.target.dataset.hotspotIndex !== undefined) return;

    setIsDrawing(true);
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });
    setPreview({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();

    // Déplacement d'une zone
    if (dragging) {
      const { index, offsetX, offsetY } = dragging;
      const newX = e.clientX - rect.left - offsetX;
      const newY = e.clientY - rect.top - offsetY;

      const updated = [...hotspots];
      updated[index].x = toPercent(newX, rect.width);
      updated[index].y = toPercent(newY, rect.height);
      setHotspots(updated);
      return;
    }

    // Redimensionnement
    if (resizing) {
      const { index, handle } = resizing;
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;
      const updated = [...hotspots];
      const h = updated[index];

      if (handle === "right") {
        h.width = toPercent(endX - (h.x / 100) * rect.width, rect.width);
      } else if (handle === "bottom") {
        h.height = toPercent(endY - (h.y / 100) * rect.height, rect.height);
      }
      setHotspots(updated);
      return;
    }

    // Dessin d'une nouvelle zone
    if (!isDrawing || !startPos) return;
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    setPreview({
      x: Math.min(startPos.x, endX),
      y: Math.min(startPos.y, endY),
      width: Math.abs(endX - startPos.x),
      height: Math.abs(endY - startPos.y),
    });
  };

  const handleMouseUp = (e) => {
    if (dragging) {
      setDragging(null);
      return;
    }
    if (resizing) {
      setResizing(null);
      return;
    }
    if (!isDrawing || !startPos) return;
    setIsDrawing(false);

    const rect = containerRef.current.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const widthPx = endX - startPos.x;
    const heightPx = endY - startPos.y;

    if (Math.abs(widthPx) < 5 || Math.abs(heightPx) < 5) {
      setPreview(null);
      setStartPos(null);
      return;
    }

    const newHotspot = {
      x: toPercent(Math.min(startPos.x, endX), rect.width),
      y: toPercent(Math.min(startPos.y, endY), rect.height),
      width: toPercent(Math.abs(widthPx), rect.width),
      height: toPercent(Math.abs(heightPx), rect.height),
      label: `Zone ${hotspots.length + 1}`,
      targetImageId: null,
    };

    const next = [...hotspots, newHotspot];
    setHotspots(next);
    setSelectedIndex(next.length - 1);
    setPreview(null);
    setStartPos(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        cursor: isDrawing ? "crosshair" : "default",
        userSelect: "none",
      }}
    >
      {/* Image */}
      <img
        src={imageUrl}
        alt="preview"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Hotspots existants */}
      {hotspots.map((h, i) => (
        <div
          key={i}
          data-hotspot-index={i}
          onMouseDown={(e) => {
            e.stopPropagation();
            const rect = containerRef.current.getBoundingClientRect();
            const offsetX = e.clientX - rect.left - (h.x / 100) * rect.width;
            const offsetY = e.clientY - rect.top - (h.y / 100) * rect.height;
            setDragging({ index: i, offsetX, offsetY });
            setSelectedIndex(i);
          }}
          style={{
            position: "absolute",
            top: `${h.y}%`,
            left: `${h.x}%`,
            width: `${h.width}%`,
            height: `${h.height}%`,
            border: selectedIndex === i ? "2px solid orange" : "2px solid #00aaff",
            background: "rgba(0,170,255,0.25)",
            zIndex: 1,
            cursor: "move",
            boxSizing: "border-box",
          }}
        >
          {/* Label affiché */}
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 12,
              color: "#000",
              background: "rgba(255,255,255,0.7)",
              padding: "2px 4px",
              borderRadius: 4,
            }}
          >
            {h.label || `Zone ${i + 1}`}
          </span>

          {/* Poignées de redimensionnement */}
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              setResizing({ index: i, handle: "right" });
            }}
            style={{
              position: "absolute",
              right: -4,
              top: "50%",
              width: 8,
              height: 8,
              background: "#ff9900",
              cursor: "ew-resize",
            }}
          />
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              setResizing({ index: i, handle: "bottom" });
            }}
            style={{
              position: "absolute",
              bottom: -4,
              left: "50%",
              width: 8,
              height: 8,
              background: "#ff9900",
              cursor: "ns-resize",
            }}
          />
        </div>
      ))}

      {/* Preview lors du dessin */}
      {preview && (
        <div
          style={{
            position: "absolute",
            top: preview.y,
            left: preview.x,
            width: preview.width,
            height: preview.height,
            border: "2px dashed #ff9900",
            background: "rgba(255,153,0,0.2)",
            zIndex: 2,
            pointerEvents: "none",
            boxSizing: "border-box",
          }}
        />
      )}
    </div>
  );
}
