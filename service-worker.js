const CACHE_VERSION = "v1";
const APP_SHELL_CACHE = `mae-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `mae-runtime-${CACHE_VERSION}`;
const SAME_ORIGIN_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg",
  "./app.css",
  "./photo-design.css",
  "./app.js",
  "./app-overrides.js",
  "./photo-design.js",
  "./nbrb.woff",
  "./nbrb.woff2",
];
const APP_SHELL_URLS = SAME_ORIGIN_ASSETS.map((path) => new URL(path, self.location.href).toString());
const INDEX_URL = new URL("./index.html", self.location.href).toString();
const FONT_ORIGINS = new Set([
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
]);
const STATIC_DESTINATIONS = new Set([
  "style",
  "script",
  "font",
  "image",
  "manifest",
  "worker",
]);

function isCacheable(response) {
  return response && (response.ok || response.type === "opaque");
}

async function addAppShell(cache) {
  await cache.addAll(
    APP_SHELL_URLS.map((url) => new Request(url, { cache: "reload" }))
  );
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (isCacheable(response)) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }

  const response = await networkPromise;
  if (response) {
    return response;
  }

  return Response.error();
}

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (isCacheable(response)) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached =
      (await cache.match(request)) ||
      (await caches.match(request)) ||
      (fallbackUrl ? await caches.match(fallbackUrl) : null);

    if (cached) {
      return cached;
    }

    throw error;
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => addAppShell(cache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin === self.location.origin) {
    if (request.mode === "navigate") {
      event.respondWith(networkFirst(request, RUNTIME_CACHE, INDEX_URL));
      return;
    }

    if (STATIC_DESTINATIONS.has(request.destination)) {
      event.respondWith(staleWhileRevalidate(request, APP_SHELL_CACHE));
      return;
    }

    return;
  }

  if (FONT_ORIGINS.has(url.origin)) {
    event.respondWith(staleWhileRevalidate(request, RUNTIME_CACHE));
  }
});
