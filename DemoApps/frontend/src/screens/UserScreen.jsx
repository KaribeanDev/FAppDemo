import React, { useEffect, useState } from "react";
import { getImageWithZones } from "../services/imageService.js";
import Phone from "../components/Phone.jsx";

export default function UserScreen({ currentImageId, onNavigate }) {
  const [currentImage, setCurrentImage] = useState(null);

  // Charger l'image courante quand l'ID change
  useEffect(() => {
    async function load() {
      if (currentImageId) {
        const img = await getImageWithZones(currentImageId);
        setCurrentImage(img);
      }
    }
    load();
  }, [currentImageId]);

  if (!currentImage) return <p>Chargement...</p>;

  return (
    <Phone>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <img
          src={`http://localhost:4000${currentImage.url}`}
          alt={currentImage.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {currentImage.zones.map((z, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${z.x}%`,
              top: `${z.y}%`,
              width: `${z.width}%`,
              height: `${z.height}%`,
              cursor: z.target_image_id ? "pointer" : "default",
            }}
            onClick={() => {
              if (z.target_image_id) {
                onNavigate(z.target_image_id); // 🔑 navigation vers l’image cible
              }
            }}
          />
        ))}
      </div>
    </Phone>
  );
}
