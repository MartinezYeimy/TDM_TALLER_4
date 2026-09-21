const API_URL = "/api/items";

// lista de items y filtros opcionales
export async function getItems(params = {}) {
  const url = new URL(API_URL, window.location.origin);

  if (params.q) url.searchParams.append("q", params.q);
  if (params.category) url.searchParams.append("category", params.category);
  if (params.sort) url.searchParams.append("sort", params.sort);

  const res = await fetch(url);
  if (!res.ok) throw new Error("Error al cargar items");
  return res.json();
}

// item por id
export async function getItem(id) {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Item no encontrado");
  return res.json();
}

export async function createItem(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al crear item");
  return res.json();
}

export async function updateItem(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Error al actualizar item");
  return res.json();
}

export async function deleteItem(id) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar item");
  return res.json();
}
