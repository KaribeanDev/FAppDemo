import React, { useState, useEffect } from "react";
import {
  listImages,
  getImageWithZones,
  saveImageWithHotspots,
  deleteImage,
  listCategories,
  createCategory,
  deleteCategory,
  setPrimaryImage,
} from "../services/imageService.js";

import Phone from "../components/Phone.jsx";
import GridEditor from "../components/GridEditor.jsx";
import HotspotEditor from "../components/HotspotEditor.jsx";

import "../styles/styles.css";
import "../styles/Phone.css";

export default function AdminScreen() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [availableImages, setAvailableImages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [notification, setNotification] = useState(null);
  const [currentImageId, setCurrentImageId] = useState(null);
  const [imageName, setImageName] = useState("");

  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const groupSize = 4;

  /* ============================
     🔄 LOAD IMAGES + CATEGORIES
  ============================= */
  useEffect(() => {
    async function load() {
      try {
        const imgs = await listImages();
        const cats = await listCategories();
        setAvailableImages(imgs);
        setCategories(cats);
        setCarouselIndex(0);
      } catch (err) {
        setNotification({ type: "error", text: "Impossible de charger les données." });
      }
    }
    load();
  }, []);

  /* ============================
     📌 SELECT IMAGE
  ============================= */
  async function handleSelectImage(img) {
    const fullImg = await getImageWithZones(img.id);

    setPreviewUrl(fullImg.url);
    setHotspots((fullImg.zones || []).map(z => ({
      ...z,
      targetImageId: z.target_image_id
    })));

    setSelectedFile(null);
    setSelectedIndex(null);
    setCurrentImageId(img.id);
    setImageName(fullImg.name || "");

    setSelectedCategoryId(fullImg.categories?.[0]?.id || "");
  }

  /* ============================
     📁 FILE SELECT
  ============================= */
  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = ev => setPreviewUrl(ev.target.result);
    reader.readAsDataURL(file);

    setHotspots([]);
    setSelectedIndex(null);
    setCurrentImageId(null);
    setImageName(file.name.replace(/\.[^/.]+$/, ""));
    setSelectedCategoryId("");
  }

  /* ============================
     💾 SAVE IMAGE
  ============================= */
  async function handleSave() {
    await saveImageWithHotspots(
      selectedFile || null,
      hotspots,
      currentImageId || null,
      imageName,
      selectedCategoryId,
      [selectedCategoryId]
    );

    setAvailableImages(await listImages());
    setNotification({ type: "success", text: "Sauvegarde effectuée." });
    scheduleClearNotification();
  }

  /* ============================
     🗑 DELETE IMAGE
  ============================= */
  async function handleDelete(imgId) {
    await deleteImage(imgId);
    setAvailableImages(await listImages());

    if (currentImageId === imgId) {
      setPreviewUrl(null);
      setHotspots([]);
      setSelectedIndex(null);
      setCurrentImageId(null);
      setImageName("");
      setSelectedCategoryId("");
    }

    setNotification({ type: "success", text: "Image supprimée." });
    scheduleClearNotification();
  }

  /* ============================
     ➕ CREATE CATEGORY
  ============================= */
  async function handleCreateCategory() {
    if (!newCategoryName.trim()) {
      setNotification({ type: "error", text: "Nom requis." });
      return scheduleClearNotification();
    }

    try {
      await createCategory(newCategoryName, newCategoryDesc);
      setCategories(await listCategories());
      setNewCategoryName("");
      setNewCategoryDesc("");
      setNotification({ type: "success", text: "Catégorie créée." });
    } catch (err) {
      setNotification({ type: "error", text: err.message });
    }

    scheduleClearNotification();
  }

  /* ============================
     🗑 DELETE CATEGORY
  ============================= */
  async function handleDeleteCategory(catId) {
    if (confirm("Supprimer cette catégorie ?")) {
      await deleteCategory(catId);
      setCategories(await listCategories());
      setNotification({ type: "success", text: "Catégorie supprimée." });
      scheduleClearNotification();
    }
  }

  /* ============================
     ⭐ SET PRIMARY IMAGE
  ============================= */
  async function handleSetPrimary(catId, imgId) {
    await setPrimaryImage(catId, imgId);
    setCategories(await listCategories());
    setNotification({ type: "success", text: "Image primaire définie." });
    scheduleClearNotification();
  }

  /* ============================
     🔔 NOTIFICATION TIMER
  ============================= */
  function scheduleClearNotification() {
    setTimeout(() => setNotification(null), 3000);
  }

  /* ============================
     🎠 CAROUSEL
  ============================= */
  const maxIndex = Math.max(0, availableImages.length - groupSize);
  const slideLeft = () => setCarouselIndex(prev => Math.max(0, prev - groupSize));
  const slideRight = () => setCarouselIndex(prev => Math.min(maxIndex, prev + groupSize));

  const categoryLabel = selectedCategoryId
    ? categories.find(c => c.id === Number(selectedCategoryId))?.name
    : "Aucune catégorie";

  /* ============================
     🎨 RENDER
  ============================= */
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>
          {imageName
            ? `${imageName} — Catégorie : ${categoryLabel}`
            : "📱 Admin Panel"}
        </h1>

        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.text}
          </div>
        )}
      </header>

      <main className="dashboard-main">

        {/* ============================
            🟦 BLOC 1 : INFOS IMAGE
        ============================= */}
        <div className="upload-section">

          <input type="file" accept="image/*" onChange={handleFileSelect} />

          <input
            type="text"
            placeholder="Nom de l'image"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
          />

          <select
            value={selectedCategoryId || ""}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">-- Choisir une catégorie --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {currentImageId && selectedCategoryId && (
            <button
              className="primary-btn"
              onClick={() => handleSetPrimary(selectedCategoryId, currentImageId)}
            >
              ⭐ Définir primaire
            </button>
          )}
        </div>

        {/* ============================
            🎠 CAROUSEL
        ============================= */}
        <div className="carousel-section">
          <button onClick={slideLeft} disabled={carouselIndex === 0}>◀</button>

          {availableImages.slice(carouselIndex, carouselIndex + groupSize).map(img => {
            const isPrimary = categories.some(cat => cat.primary_image_id === img.id);

            return (
              <div key={img.id} className="carousel-item">

                {isPrimary && <div className="primary-icon">⭐</div>}

                <button
                  className="delete-btn"
                  onClick={(e) => { e.stopPropagation(); handleDelete(img.id); }}
                >
                  ✖
                </button>

                <div onClick={() => handleSelectImage(img)} className="carousel-click">
                  <img src={img.url} alt={img.name} />
                  <div className="carousel-name">{img.name}</div>
                </div>
              </div>
            );
          })}

          <button onClick={slideRight} disabled={carouselIndex >= maxIndex}>▶</button>
        </div>

        {/* ============================
            🟩 BLOC 2 : HOTSPOTS
        ============================= */}
        <div className="dashboard-grid">
          <div className="dashboard-preview">
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
                <div className="empty-screen">Aucune image chargée</div>
              )}
            </Phone>

            {previewUrl && (
              <button onClick={handleSave} className="save-btn">
                💾 Sauvegarder
              </button>
            )}
          </div>

          <div className="dashboard-config">
            {previewUrl && (
              <HotspotEditor
                hotspots={hotspots}
                setHotspots={setHotspots}
                availableImages={availableImages}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
                onSave={handleSave}
                currentImageId={currentImageId}
              />
            )}
          </div>
        </div>

        {/* ============================
            🟧 BLOC 3 : GESTION CATÉGORIES
        ============================= */}
        <div className="category-section">
          <h3>Gestion des catégories</h3>

          <div className="category-form">
            <input
              type="text"
              placeholder="Nom"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={newCategoryDesc}
              onChange={(e) => setNewCategoryDesc(e.target.value)}
            />
            <button onClick={handleCreateCategory}>➕ Créer</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td>{cat.description}</td>
                  <td>
                    <div className="category-actions">
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="delete-cat-btn"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </main>
    </div>
  );
}
