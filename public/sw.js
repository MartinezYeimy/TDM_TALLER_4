const CACHE_VERSION = "v4"; // (subir versión para limpiar caches viejas)
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const OFFLINE_URL = "/offline.html";

const PRECACHE = [
  "/",
  "/index.html",
  "/catalog.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/css/styles.css",
  "/js/main.js",
  "/js/catalog.js",
  "/js/theme.js",
  "/js/services/api.js",
  "/js/ui/ui.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-512-maskable.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter(k => k !== STATIC_CACHE && k !== API_CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.url.includes("/api/")) {
    if (request.method === "GET") {
      // Network-first con cache para GET
      event.respondWith(
        fetch(request)
          .then((res) => {
            const clone = res.clone();
            caches.open(API_CACHE).then((cache) => cache.put(request, clone));
            return res;
          })
          .catch(() => caches.match(request))
      );
    } else {
      event.respondWith(fetch(request));
    }
  } else {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).catch(async () => {
          if (request.mode === "navigate") {
            const offlinePage = await caches.match(OFFLINE_URL);
            if (offlinePage) return offlinePage;
          }
          return new Response("Offline resource not available", {
            status: 503,
            headers: { "Content-Type": "text/plain" }
          });
        });
      })
    );
  }
});