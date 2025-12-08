const API_URL = "http://localhost:4000/api/images";

// --- Liste des images ---
export async function listImages() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Erreur lors du chargement des images");
  return await res.json();
}

// --- Récupérer une image avec ses zones ---
export async function getImageWithZones(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Erreur lors du chargement de l'image avec zones");
  return await res.json();
}

// --- Sauvegarder une image avec hotspots ---
export async function saveImageWithHotspots(file, hotspots, id = null) {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("hotspots", JSON.stringify(hotspots));

    const res = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Erreur lors de l'upload de l'image");
    return await res.json();
  } else if (id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hotspots }),
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour des zones");
    return await res.json();
  } else {
    throw new Error("Paramètres invalides pour saveImageWithHotspots");
  }
}

// --- Supprimer une image ---
export async function deleteImage(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erreur lors de la suppression de l'image");
  return await res.json();
}
