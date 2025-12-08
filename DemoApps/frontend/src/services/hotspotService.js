import api from "./api";

export async function createHotspot(payload) {
  const { data } = await api.post("/hotspots", payload);
  return data;
}

export async function updateHotspot(id, payload) {
  const { data } = await api.patch(`/hotspots/${id}`, payload);
  return data;
}

export async function deleteHotspot(id) {
  await api.delete(`/hotspots/${id}`);
}
