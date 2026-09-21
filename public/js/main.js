import { getItems, getItem, createItem, updateItem, deleteItem } from "./services/api.js";
import { renderItems, resetForm, fillForm } from "./ui/ui.js";

const form = document.getElementById("itemForm");
const tableBody = document.getElementById("itemsTable");
const submitBtn = document.getElementById("submitBtn");
let editingId = null;

tableBody.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = Number(btn.dataset.id);

  if (btn.classList.contains("btn-delete") || btn.classList.contains("table-btn-delete")) {
    if (!navigator.onLine) {
      alert("No disponible sin conexión");
      return;
    }

    try {
      await deleteItem(id);
      loadItems();
    } catch (err) {
      console.error("Error eliminando:", err);
      alert("No se pudo eliminar el item.");
    }
  } else if (btn.classList.contains("btn-edit") || btn.classList.contains("table-btn-edit")) {
    if (!navigator.onLine) {
      alert("No disponible sin conexión");
      return;
    }

    try {
      if (editingId === id) {
        resetForm(form, submitBtn);
        editingId = null;
        return;
      }
      const item = await getItem(id);
      fillForm(form, item, submitBtn);
      editingId = id;
    } catch (err) {
      console.error("Error cargando item:", err);
      alert("No se pudo cargar el item para edición.");
    }
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!navigator.onLine) {
    alert("No disponible sin conexión");
    return;
  }

  const name = form.querySelector("#name").value;
  const description = form.querySelector("#description").value;
  const price = form.querySelector("#price").value;
  const category = form.querySelector("#category").value;
  const stock = form.querySelector("#stock").value;
  const date = form.querySelector("#date").value;

  if (!name) {
    alert("El campo nombre es obligatorio");
    return;
  }

  try {
    if (editingId) {
      await updateItem(editingId, { name, description, price, category, stock, date });
      editingId = null;
    } else {
      await createItem({ name, description, price, category, stock, date });
    }

    resetForm(form, submitBtn);
    loadItems();
  } catch (err) {
    console.error("Error guardando item:", err);
    alert("No se pudo guardar el item.");
  }
});

async function loadItems() {
  try {
    const items = await getItems();

    if (!items || items.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-[var(--color-text)]">
        No hay productos en esta categoría.
      </td></tr>`;
      return;
    }

    renderItems(items, tableBody);
  } catch (err) {
    console.error("Error cargando lista:", err);
    alert("No se pudieron cargar los items.");
  }
}

loadItems();
