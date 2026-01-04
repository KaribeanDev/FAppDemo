const API_URL = import.meta.env.VITE_API_URL;

/* ============================
   📸 IMAGES
============================ */

// Liste toutes les images
export async function listImages() {
  try {
    const res = await fetch(`${API_URL}/api/images`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur lors du chargement des images");
    return data;
  } catch (err) {
    console.error("[listImages] Exception:", err);
    throw err;
  }
}

// Récupère une image avec ses hotspots + catégories
export async function getImageWithZones(id) {
  try {
    const res = await fetch(`${API_URL}/api/images/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur lors du chargement de l'image");
    return data;
  } catch (err) {
    console.error("[getImageWithZones] Exception:", err);
    throw err;
  }
}

// Sauvegarde ou met à jour une image avec hotspots + catégories
export async function saveImageWithHotspots(file, hotspots, id, name, categoryId, categoryIds) {
  try {
    let res, data;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("hotspots", JSON.stringify(hotspots || []));
      if (name) formData.append("name", name);

      // Harmonisation : backend attend "category_id" ou "category_ids"
      if (categoryId) formData.append("category_id", categoryId);
      if (categoryIds) formData.append("category_ids", JSON.stringify(categoryIds));

      const url = id ? `${API_URL}/api/images/${id}` : `${API_URL}/api/images`;
      const method = id ? "PUT" : "POST";

      res = await fetch(url, { method, body: formData });
    } else {
      res = await fetch(`${API_URL}/api/images/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotspots,
          name,
          category_id: categoryId,
          category_ids: categoryIds
        }),
      });
    }

    data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur lors de la sauvegarde/mise à jour de l'image");
    return data;
  } catch (err) {
    console.error("[saveImageWithHotspots] Exception:", err);
    throw err;
  }
}

// Supprime une image
export async function deleteImage(id) {
  try {
    const res = await fetch(`${API_URL}/api/images/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur lors de la suppression de l'image");
    return data;
  } catch (err) {
    console.error("[deleteImage] Exception:", err);
    throw err;
  }
}

/* ============================
   📂 CATEGORIES
============================ */

// Liste toutes les catégories
export async function listCategories() {
  try {
    const res = await fetch(`${API_URL}/api/images/category`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur lors du chargement des catégories");
    return data;
  } catch (err) {
    console.error("[listCategories] Exception:", err);
    throw err;
  }
}

// Crée une nouvelle catégorie
export async function createCategory(name, description) {
  try {
    const res = await fetch(`${API_URL}/api/images/category`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur lors de la création de la catégorie");
    return data;
  } catch (err) {
    console.error("[createCategory] Exception:", err);
    throw err;
  }
}

// Supprime une catégorie
export async function deleteCategory(categoryId) {
  try {
    const res = await fetch(`${API_URL}/api/images/category/${categoryId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur lors de la suppression de la catégorie");
    return data;
  } catch (err) {
    console.error("[deleteCategory] Exception:", err);
    throw err;
  }
}

// Récupère toutes les images d'une catégorie
export async function getImagesByCategory(categoryId) {
  try {
    const res = await fetch(`${API_URL}/api/images/category/${categoryId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur lors du chargement des images de la catégorie");
    return data;
  } catch (err) {
    console.error("[getImagesByCategory] Exception:", err);
    throw err;
  }
}

// Définit une image primaire pour une catégorie
export async function setPrimaryImage(categoryId, imageId) {
  try {
    const res = await fetch(`${API_URL}/api/images/category/${categoryId}/primary`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur lors de la définition de l'image primaire");
    return data;
  } catch (err) {
    console.error("[setPrimaryImage] Exception:", err);
    throw err;
  }
}

/* ============================
   📂 CATEGORIES + IMAGES
============================ */

// 🔥 Récupère toutes les catégories avec leurs images + image primaire
export async function getCategoriesWithImages() {
  try {
    const res = await fetch(`${API_URL}/api/images/categories-with-images`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur lors du chargement des catégories avec images");
    return data;
  } catch (err) {
    console.error("[getCategoriesWithImages] Exception:", err);
    throw err;
  }
}
