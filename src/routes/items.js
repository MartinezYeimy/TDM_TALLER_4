import { Router } from "express";
import { getAllItems, findItem, insertItem, modifyItem, removeItem } from "../db/db.js";
import { validateItem } from "../middlewares/validate.js";

const router = Router();

router.param("id", (req, res, next, value) => {
  const id = Number(value);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "The id must be an integer" });
  }
  req.itemId = id;
  next();
});

router.get("/", (req, res) => {
  let items = getAllItems();
  const { q, category, sort } = req.query;

  if (q) {
    items = items.filter(i =>
      i.name?.toLowerCase().includes(q.toLowerCase()) ||
      i.description?.toLowerCase().includes(q.toLowerCase())
    );
  }
  if (category) {
    const allowedCategories = [
      "Agendas",
      "Escritura",
      "Organización",
      "Medición y dibujo",
      "Útiles escolares",
      "Adhesivos y pegantes",
      "Papelería general",
      "Arte y manualidades",
      "Tecnología escolar",
      "Archivadores y carpetas"
    ];
    if (!allowedCategories.map(c => c.toLowerCase()).includes(category.toLowerCase())) {
      return res.status(400).json({ error: `Invalid category. Must be one of: ${allowedCategories.join(", ")}` });
    }
    items = items.filter(i => i.category?.toLowerCase() === category.toLowerCase());
  }

  if (sort) {
    if (!["price", "stock"].includes(sort)) {
      return res.status(400).json({ error: "Invalid sort field. Use 'price' or 'stock'" });
    }
    items = items.sort((a, b) => Number(a[sort]) - Number(b[sort]));
  } else {
    items = items.sort((a, b) => Number(a.id) - Number(b.id));
  }

  res.json(items);
});

router.get("/:id", (req, res) => {
  const item = findItem(req.itemId);
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
});

router.post("/", validateItem, async (req, res) => {
  const { name, description, price, stock, category, date } = req.body ?? {};
  const newItem = await insertItem({
    name: name.trim(),
    description: description?.trim(),
    price: Number(price),
    stock: Number(stock),
    category,
    date
  });
  res.status(201).json(newItem);
});

router.put("/:id", validateItem, async (req, res) => {
  const { name, description, price, stock, category, date } = req.body ?? {};
  const changes = {};
  if (name !== undefined) changes.name = name.trim();
  if (description !== undefined) changes.description = description.trim();
  if (price !== undefined) changes.price = Number(price);
  if (stock !== undefined) changes.stock = Number(stock);
  if (category !== undefined) changes.category = category;
  if (date !== undefined) changes.date = date;

  const updated = await modifyItem(req.itemId, changes);
  if (!updated) return res.status(404).json({ error: "Item not found" });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const deleted = await removeItem(req.itemId);
  if (!deleted) return res.status(404).json({ error: "Item not found" });
  res.json({ message: "Item deleted", id: req.itemId });
});

export default router;
