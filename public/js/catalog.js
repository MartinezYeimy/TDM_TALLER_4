const API_URL = "/api/items";
const catalogContainer = document.getElementById("catalogContainer");
const modal = document.getElementById("modal");
const modalTitle = document.querySelector(".modal-title");
const modalBody = document.querySelector(".modal-body");
const closeBtn = document.querySelector(".close");

// Función principal para cargar los items desde la API
async function loadCatalog() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al cargar items");
        const items = await res.json();

        catalogContainer.innerHTML = ""; 

        items.forEach(item => renderItem(item));
    } catch (err) {
        console.error("Error cargando catálogo:", err);
        catalogContainer.innerHTML = "<p>No se pudo cargar el catálogo.</p>";
    }
}

function renderItem(item) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <h3>${item.name}</h3>
        <p>Precio: ${item.precio || "—"}</p>
        <p>Categoría: ${item.categoria || "—"}</p>
        <button class="detail-btn" data-id="${item.id}">Ver detalle</button>
    `;
    catalogContainer.appendChild(card);

    card.querySelector(".detail-btn").addEventListener("click", async () => {
        const res = await fetch(`${API_URL}/${item.id}`);
        if (!res.ok) {
            alert("No se pudo cargar el detalle");
            return;
        }
        const detail = await res.json();
        showModal(detail);
    });
}

function showModal(item) {
    modalTitle.textContent = item.name;
    modalBody.innerHTML = `
        <p>${item.description || ""}</p>
        <p>Precio: ${item.precio || "—"}</p>
        <p>Categoría: ${item.categoria || "—"}</p>
        <p>Stock: ${item.stock || "—"}</p>
        <p>Fecha: ${item.fecha || "—"}</p>
    `;
    modal.style.display = "block";
}

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});
modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
});

loadCatalog();
