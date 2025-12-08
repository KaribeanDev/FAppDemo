import React, { useState, useEffect } from "react";
import {
  listImages,
  getImageWithZones,
  saveImageWithHotspots,
  deleteImage,
} from "../services/imageService.js";
import Phone from "../components/Phone.jsx";
import GridEditor from "../components/GridEditor.jsx";
import HotspotEditor from "../components/HotspotEditor.jsx";

export default function AdminScreen() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [availableImages, setAvailableImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [notification, setNotification] = useState(null);
  const [currentImageId, setCurrentImageId] = useState(null);

  const groupSize = 3;

  useEffect(() => {
    async function load() {
      const imgs = await listImages();
      setAvailableImages(imgs);
      setCarouselIndex(0);
    }
    load();
  }, []);

  // Sélection d'une image du carousel
  async function handleSelectImage(img) {
    try {
      const fullImg = await getImageWithZones(img.id);
      setPreviewUrl("http://localhost:4000" + fullImg.url);

      // Harmoniser target_image_id → targetImageId pour le frontend
      const mappedZones = (fullImg.zones || []).map((z) => ({
        ...z,
        targetImageId: z.target_image_id,
      }));

      setHotspots(mappedZones);
      setSelectedFile(null);
      setSelectedIndex(null);
      setCurrentImageId(img.id);
    } catch (err) {
      console.error("Erreur chargement image:", err);
      setNotification({ type: "error", text: "Impossible de charger l'image." });
      scheduleClearNotification();
    }
  }

  // Sélection d'un fichier à uploader
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target.result);
    reader.readAsDataURL(file);

    setHotspots([]);
    setSelectedIndex(null);
    setCurrentImageId(null);
  }
  // Sauvegarde (nouvelle image ou mise à jour des zones)
  async function handleSave() {
    try {
      if (selectedFile) {
        const result = await saveImageWithHotspots(selectedFile, hotspots);
        setNotification({ type: "success", text: `Image sauvegardée (ID: ${result.id})` });
        const imgs = await listImages();
        setAvailableImages(imgs);
      } else if (previewUrl && currentImageId) {
        await saveImageWithHotspots(null, hotspots, currentImageId);
        setNotification({ type: "success", text: `Zones mises à jour (ID: ${currentImageId})` });
        const imgs = await listImages();
        setAvailableImages(imgs);
      }
    } catch (err) {
      console.error("Erreur sauvegarde:", err);
      setNotification({ type: "error", text: "Échec de la sauvegarde." });
    }
    scheduleClearNotification();
  }

  // Suppression d'une image
  async function handleDelete(imgId) {
    try {
      await deleteImage(imgId);
      const imgs = await listImages();
      setAvailableImages(imgs);

      // Nettoyage si l'image supprimée était affichée
      const wasCurrent =
        previewUrl &&
        imgs.every((img) => "http://localhost:4000" + img.url !== previewUrl);
      if (wasCurrent) {
        setPreviewUrl(null);
        setHotspots([]);
        setSelectedIndex(null);
        setCurrentImageId(null);
      }

      setNotification({ type: "success", text: "Image supprimée." });
    } catch (err) {
      console.error("Erreur suppression:", err);
      setNotification({ type: "error", text: "Échec de la suppression." });
    }
    scheduleClearNotification();
  }

  function scheduleClearNotification() {
    setTimeout(() => setNotification(null), 3000);
  }

  const maxIndex = Math.max(0, availableImages.length - groupSize);
  function slideLeft() {
    setCarouselIndex((prev) => Math.max(0, prev - groupSize));
  }
  function slideRight() {
    setCarouselIndex((prev) => Math.min(maxIndex, prev + groupSize));
  }
  return (
    <div style={{ padding: 20 }}>
      <h2>Admin — Gestion des images et zones</h2>

      {/* Notification */}
      {notification && (
        <div
          style={{
            marginBottom: 10,
            padding: "10px 15px",
            borderRadius: 6,
            color: notification.type === "success" ? "#155724" : "#721c24",
            background: notification.type === "success" ? "#d4edda" : "#f8d7da",
            border: `1px solid ${
              notification.type === "success" ? "#c3e6cb" : "#f5c6cb"
            }`,
          }}
        >
          {notification.text}
        </div>
      )}

      {/* Upload */}
      <input type="file" accept="image/*" onChange={handleFileSelect} />

      <div style={{ display: "flex", gap: 120, marginTop: 20, alignItems: "flex-start" }}>
        {/* Colonne gauche : carousel */}
        {availableImages.length > 0 && (
          <div style={{ width: 500, textAlign: "center", paddingRight: 40 }}>
            <h3>Images enregistrées</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
              <button onClick={slideLeft} disabled={carouselIndex === 0}>◀</button>

              <div style={{ display: "flex", gap: 20, width: groupSize * 120 + (groupSize - 1) * 20, overflow: "hidden", padding: "10px" }}>
                {availableImages.slice(carouselIndex, carouselIndex + groupSize).map((img) => (
                  <div key={img.id} style={{ position: "relative", border: "2px solid #ccc", padding: 6, width: 120, flexShrink: 0, boxSizing: "border-box" }}>
                    {/* Croix pour supprimer */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                      title="Supprimer l'image"
                      style={{ position: "absolute", top: 2, right: 2, background: "transparent", border: "none", color: "#ff4444", fontSize: 16, cursor: "pointer", lineHeight: 1 }}
                    >
                      ✖
                    </button>

                    {/* Image cliquable */}
                    <div onClick={() => handleSelectImage(img)} style={{ cursor: "pointer" }}>
                      <img src={"http://localhost:4000" + img.url} alt={img.name} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                      <div style={{ textAlign: "center", fontSize: 12, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {img.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={slideRight} disabled={carouselIndex >= maxIndex}>▶</button>
            </div>

            <div style={{ marginTop: 8, fontSize: 12, color: "#666" }}>
              {Math.floor(carouselIndex / groupSize) + 1} / {Math.max(1, Math.ceil(availableImages.length / groupSize))}
            </div>
          </div>
        )}

        {/* Colonne centre : iPhone + zones définies */}
        <div style={{ position: "relative" }}>
          {previewUrl && (
            <div style={{ position: "absolute", top: 0, right: -260, width: 240 }}>
              <HotspotEditor
                hotspots={hotspots}
                setHotspots={setHotspots}
                availableImages={availableImages}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                onSave={handleSave}
                currentImageId={currentImageId}
              />
            </div>
          )}

          <Phone>
            {previewUrl ? (
              <GridEditor
                imageUrl={previewUrl}
                hotspots={hotspots}
                setHotspots={setHotspots}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#333", color: "#fff", fontSize: 18 }}>
                Aucune image chargée
              </div>
            )}
          </Phone>
        </div>
      </div>

      {/* Bouton de sauvegarde global */}
      {previewUrl && (
        <button
          onClick={handleSave}
          style={{
            marginTop: 20,
            background: "#0077ff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "10px 16px",
            cursor: "pointer",
          }}
        >
          💾 Sauvegarder l’image et les zones
        </button>
      )}
    </div>
  );
}
