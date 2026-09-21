export function renderItems(items, tableBody) {
  tableBody.innerHTML = "";
  items.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.description || ""}</td>
      <td>${item.price || ""}</td>
      <td>${item.category || ""}</td>
      <td>${item.stock || ""}</td>
      <td>${item.date || ""}</td>
      <td class="flex gap-2 justify-center">
        <button class="table-btn-edit" data-id="${item.id}">Editar</button>
        <button class="table-btn-delete" data-id="${item.id}">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

export function resetForm(form, submitBtn) {
  form.reset();
  if (submitBtn) submitBtn.textContent = "Agregar";
}

// se llena el formulario con la info para editar
export function fillForm(form, item, submitBtn) {
  form.querySelector("#name").value = item.name || "";
  form.querySelector("#description").value = item.description || "";
  form.querySelector("#price").value = item.price ?? "";
  form.querySelector("#category").value = item.category || ""; 
  form.querySelector("#stock").value = item.stock ?? "";
  form.querySelector("#date").value = item.date || "";

  if (submitBtn) submitBtn.textContent = "Guardar cambios";
}
