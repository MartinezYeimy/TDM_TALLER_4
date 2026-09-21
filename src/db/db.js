import path from "node:path";
import { JSONFilePreset } from "lowdb/node";

// Ruta al archivo de datos
const DATA_PATH = path.join(import.meta.dirname, "..", "data", "items.json");

const defaultData = { items: [] };

export const db = await JSONFilePreset(DATA_PATH, defaultData);

export function getAllItems() {
  return db.data.items;
}

export function findItem(id) {
  return db.data.items.find((item) => item.id === id);
}

export async function insertItem({ name, description, price, stock, category, date }) {
  const items = db.data.items;
  const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1; //id consecutivo

  const item = {
    id: newId,
    name,
    description: description ?? "",
    price: Number(price) || 0,
    stock: Number(stock) || 0,
    category: category ?? "",
    date: date ?? ""
  };

  await db.update((data) => data.items.push(item));
  return item;
}

export async function modifyItem(id, changes) {
  const index = db.data.items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updated = { ...db.data.items[index], ...changes, id };
  await db.update((data) => {
    data.items[index] = updated;
  });
  return updated;
}

export async function removeItem(id) {
  const index = db.data.items.findIndex((item) => item.id === id);
  if (index === -1) return false;

  await db.update((data) => data.items.splice(index, 1));
  return true;
}
