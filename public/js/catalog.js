import { getItems, getItem } from "./services/api.js";

const API_URL = "/api/items";
const catalogContainer = document.getElementById("catalogContainer");
const modal = document.getElementById("modal");
const modalTitle = document.querySelector(".modal-title");
const modalBody = document.querySelector(".modal-body");
const closeBtn = document.querySelector(".close");

// Elementos de búsqueda, filtro y orden
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const sortSelect = document.getElementById("sort");

async function loadCatalog() {
  catalogContainer.innerHTML = "<p>Cargando...</p>";

  try {
    const q = searchInput?.value.trim() || "";
    const category = filterSelect?.value || "";
    const sort = sortSelect?.value || "";

    const url = new URL(API_URL, window.location.origin);
    if (q) url.searchParams.append("q", q);
    if (category) url.searchParams.append("category", category);
    if (sort) url.searchParams.append("sort", sort);

    if (!navigator.onLine) {
      const cached = await caches.match(url);
      if (cached) {
        const items = await cached.json();
        catalogContainer.innerHTML = "<p>⚠️ Sin conexión — mostrando datos guardados</p>";
        renderItems(items);
      } else {
        catalogContainer.innerHTML = "<p>⚠️ Sin conexión y sin datos guardados</p>";
      }
      return;
    }

    const items = await getItems({ q, category, sort });

    if (!items || items.length === 0) {
      catalogContainer.innerHTML = "<p>No hay items disponibles en esta búsqueda o categoría.</p>";
      return;
    }

    catalogContainer.innerHTML = "";
    renderItems(items);

  } catch (err) {
    console.error("Error cargando catálogo:", err);
    catalogContainer.innerHTML = "<p>Error al cargar el catálogo.</p>";
  }
}

function renderItems(items) {
  items.forEach(item => renderItem(item));
}

function renderItem(item) {
  const card = document.createElement("div");
  card.classList.add("card", "card-centered");
  card.innerHTML = `
    <h3 class="font-bold mb-1">${item.name}</h3>
    <span class="badge mb-2">${item.category || "—"}</span>
    <p class="mb-2">Precio: ${item.price || "—"}</p>
    <button class="detail-btn" data-id="${item.id}">Ver detalle</button>
  `;
  catalogContainer.appendChild(card);

  card.querySelector(".detail-btn").addEventListener("click", async () => {
    try {
      const detail = await getItem(item.id); 
      showModal(detail);
    } catch (err) {
      console.error("Error cargando detalle:", err);
      alert("No se pudo cargar el detalle");
    }
  });
}

function showModal(item) {
  modalTitle.textContent = item.name;
  modalBody.innerHTML = `
    <p>${item.description || ""}</p>
    <p>Precio: ${item.price || "—"}</p>
    <p>Categoría: ${item.category || "—"}</p>
    <p>Stock: ${item.stock || "—"}</p>
    <p>Fecha: ${item.date || "—"}</p>
  `;
  modal.style.display = "block";
}

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

if (searchInput) searchInput.addEventListener("input", loadCatalog);
if (filterSelect) filterSelect.addEventListener("change", loadCatalog);
if (sortSelect) sortSelect.addEventListener("change", loadCatalog);


loadCatalog();
