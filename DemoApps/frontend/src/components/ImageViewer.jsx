export default function ImageViewer({ image, zones, onNavigate, onAddZone }) {
  function handleClick(e) {
    if (onAddZone) {
      // Exemple : créer une zone de 50x50px à l’endroit du clic
      const rect = e.target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newZone = { x, y, width: 50, height: 50, target_image_id: null };
      onAddZone(newZone);
    }
  }

  return (
    <div className="image-viewer" style={{ position: "relative" }}>
      <img
        src={image}
        alt="screen"
        style={{ width: "100%" }}
        onClick={handleClick}
      />
      {zones.map((zone, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: zone.y,
            left: zone.x,
            width: zone.width,
            height: zone.height,
            border: "2px solid red",
            cursor: onNavigate ? "pointer" : "default",
          }}
          onClick={() => onNavigate && onNavigate(zone.target_image_id)}
        />
      ))}
    </div>
  );
}
