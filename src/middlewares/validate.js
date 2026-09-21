export function validateItem(req, res, next) {
  const { price, stock, category } = req.body;
  const errors = [];

  if (isNaN(Number(price)) || Number(price) < 0) {
    errors.push("Price must be a number ≥ 0");
  }
  if (isNaN(Number(stock)) || Number(stock) < 0) {
    errors.push("Stock must be a number ≥ 0");
  }
//categorias fijas
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

  if (!allowedCategories.includes(category)) {
    errors.push(`Category must be one of: ${allowedCategories.join(", ")}`);
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
}