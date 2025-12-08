import React from "react";

export default function HotspotEditor({
  hotspots,
  setHotspots,
  availableImages,
  selectedIndex,
  setSelectedIndex,
  onSave,
  currentImageId,
}) {
  const updateHotspot = (index, field, value) => {
    const updated = [...hotspots];
    updated[index][field] = value;
    setHotspots(updated);

    // Sauvegarde automatique si on change la cible
    if (field === "targetImageId" && onSave && currentImageId) {
      onSave(currentImageId);
    }
  };

  const removeHotspot = (index) => {
    const updated = [...hotspots];
    updated.splice(index, 1);
    setHotspots(updated);

    if (onSave && currentImageId) {
      onSave(currentImageId);
    }

    if (selectedIndex === index) setSelectedIndex(null);
    else if (selectedIndex > index) setSelectedIndex(selectedIndex - 1);
  };

  return (
    <div style={{ width: 360 }}>
      <h3>Zones définies</h3>
      {hotspots.length === 0 && <p>Aucune zone</p>}
      {hotspots.map((h, i) => (
        <div
          key={i}
          onClick={() => setSelectedIndex(i)}
          style={{
            marginBottom: 12,
            padding: 10,
            border: selectedIndex === i ? "2px solid orange" : "1px solid #ccc",
            borderRadius: 6,
            cursor: "pointer",
            background: selectedIndex === i ? "#fff8e1" : "#fff",
          }}
        >
          {/* Nom de la zone */}
          <div style={{ marginBottom: 8 }}>
            <strong>Nom :</strong>{" "}
            <input
              type="text"
              value={h.label || ""}
              onChange={(e) => updateHotspot(i, "label", e.target.value)}
              placeholder={`Zone ${i + 1}`}
              style={{ width: "65%" }}
            />
          </div>

          {/* Cible */}
          <div style={{ marginBottom: 8 }}>
            <strong>Cible :</strong>{" "}
            <select
              value={h.targetImageId || ""}
              onChange={(e) => {
                updateHotspot(
                  i,
                  "targetImageId",
                  e.target.value ? parseInt(e.target.value, 10) : null
                );
                if (onSave && currentImageId) {
                  onSave(currentImageId); // sauvegarde immédiate
                }
              }}
            >
              <option value="">— Aucune —</option>
              {availableImages.map((img) => (
                <option key={img.id} value={img.id}>
                  {img.name}
                </option>
              ))}
            </select>
          </div>

          {/* Coordonnées */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
            <label style={{ fontSize: 12 }}>
              X:
              <input
                type="number"
                value={h.x || 0}
                onChange={(e) => updateHotspot(i, "x", parseInt(e.target.value, 10))}
                style={{ marginLeft: 4, width: 60 }}
              />
            </label>
            <label style={{ fontSize: 12 }}>
              Y:
              <input
                type="number"
                value={h.y || 0}
                onChange={(e) => updateHotspot(i, "y", parseInt(e.target.value, 10))}
                style={{ marginLeft: 4, width: 60 }}
              />
            </label>
            <label style={{ fontSize: 12 }}>
              Largeur:
              <input
                type="number"
                value={h.width || 0}
                onChange={(e) => updateHotspot(i, "width", parseInt(e.target.value, 10))}
                style={{ marginLeft: 4, width: 60 }}
              />
            </label>
            <label style={{ fontSize: 12 }}>
              Hauteur:
              <input
                type="number"
                value={h.height || 0}
                onChange={(e) => updateHotspot(i, "height", parseInt(e.target.value, 10))}
                style={{ marginLeft: 4, width: 60 }}
              />
            </label>
          </div>

          {/* Boutons Supprimer + Sauvegarder */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeHotspot(i);
              }}
              style={{
                background: "#ff4d4f",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Supprimer
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onSave && currentImageId) {
                  onSave(currentImageId); // sauvegarde manuelle
                }
              }}
              style={{
                background: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Sauvegarder
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
