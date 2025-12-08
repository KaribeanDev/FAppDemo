import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import AdminScreen from "./screens/AdminScreen";
import UserScreen from "./screens/UserScreen";
import { listImages } from "./services/imageService";

function UserWrapper() {
  const navigate = useNavigate();
  const [currentId, setCurrentId] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    listImages().then((imgs) => {
      setImages(imgs);
      if (imgs.length > 0) setCurrentId(imgs[0].id); // image par défaut
    });
  }, []);

  function onNavigate(targetId) {
    setCurrentId(targetId);
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <b>Image courante:</b>
        <select value={currentId ?? ""} onChange={(e) => setCurrentId(Number(e.target.value))}>
          {images.map((img) => (
            <option key={img.id} value={img.id}>{img.id} — {img.name}</option>
          ))}
        </select>
        <button style={{ marginLeft: 8 }} onClick={() => navigate("/admin")}>Aller à l’Admin</button>
      </div>
      <UserScreen currentImageId={currentId} onNavigate={onNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: 12, padding: 8, borderBottom: "1px solid #ddd" }}>
        <Link to="/">Utilisateur</Link>
        <Link to="/admin">Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<UserWrapper />} />
        <Route path="/admin" element={<AdminScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
