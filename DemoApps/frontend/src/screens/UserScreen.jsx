import React, { useEffect, useState } from "react";
import {
  getImageWithZones,
  getCategoriesWithImages
} from "../services/imageService.js";

import Phone from "../components/Phone.jsx";

export default function UserScreen({ currentImageId, onNavigate }) {
  const [currentImage, setCurrentImage] = useState(null);
  const [categories, setCategories] = useState([]);

  /* ============================
     🔄 LOAD CATEGORIES
  ============================= */
  useEffect(() => {
    async function loadCats() {
      const cats = await getCategoriesWithImages();
      setCategories(cats);
    }
    loadCats();
  }, []);

  /* ============================
     🟦 AUTO-LOAD FIRST CATEGORY
  ============================= */
  useEffect(() => {
    if (!currentImageId && categories.length > 0) {
      const first = categories[0];
      if (first.primary_image_id) {
        onNavigate(first.primary_image_id);
      }
    }
  }, [categories]);

  /* ============================
     🔄 LOAD IMAGE
  ============================= */
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
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#f0f0f0"
      }}
    >
      {/* ============================
          🟦 SIDEBAR : CATEGORIES
      ============================= */}
      <div
        style={{
          width: "260px",
          background: "#ffffff",
          borderRight: "1px solid #ddd",
          padding: "20px",
          overflowY: "auto"
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>Catégories</h3>

        {categories.map(cat => {
          const primary = cat.images.find(i => i.id === cat.primary_image_id);

          return (
            <div
              key={cat.id}
              style={{
                marginBottom: "20px",
                cursor: "pointer",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                background: "#fafafa"
              }}
              onClick={() => {
                if (primary) onNavigate(primary.id);
              }}
            >
              {primary ? (
                <img
                  src={primary.url}
                  alt={cat.name}
                  style={{
                    width: "100%",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "6px"
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100px",
                    background: "#eee",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  Pas d’image
                </div>
              )}

              <h4 style={{ marginTop: "10px", textAlign: "center" }}>
                {cat.name}
              </h4>
            </div>
          );
        })}
      </div>

      {/* ============================
          🟩 IPHONE VIEWER
      ============================= */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Phone>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <img
              src={currentImage.url}
              alt={currentImage.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "32px",
                display: "block"
              }}
            />

            {Array.isArray(currentImage.zones) &&
              currentImage.zones.map((z, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: `${z.x}%`,
                    top: `${z.y}%`,
                    width: `${z.width}%`,
                    height: `${z.height}%`,
                    cursor: z.target_image_id ? "pointer" : "default"
                  }}
                  onClick={() => {
                    if (z.target_image_id) {
                      onNavigate(z.target_image_id);
                    }
                  }}
                />
              ))}
          </div>
        </Phone>
      </div>
    </div>
  );
}
