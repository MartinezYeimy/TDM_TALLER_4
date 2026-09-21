function aplicarTema(tema) {
  if (tema === "oscuro") {
    document.documentElement.setAttribute("data-theme", "oscuro");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

const guardado = localStorage.getItem("theme");
const prefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;

const temaInicial = guardado ?? (prefiereOscuro ? "oscuro" : "claro");
aplicarTema(temaInicial);

document.getElementById("btn-theme").addEventListener("click", () => {
  const actual = document.documentElement.getAttribute("data-theme");
  const nuevoTema = actual === "oscuro" ? "claro" : "oscuro";
  aplicarTema(nuevoTema);
  localStorage.setItem("theme", nuevoTema);
});