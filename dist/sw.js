const CACHE_NAME = "teranga-shell-v2";
const APP_SHELL = ["/", "/manifest.webmanifest", "/favicon.svg", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))));
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;
    event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
        if (event.request.url.startsWith(self.location.origin)) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
    }).catch(() => caches.match("/"))));
});

// Notifications push : le contenu vient du serveur (voir server/index.js,
// route /api/push/test) sous forme de payload JSON { title, body, url }.
self.addEventListener("push", (event) => {
    let data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch {
        data = { title: "Téranga Patrimoine", body: event.data ? event.data.text() : "" };
    }
    const title = data.title || "Téranga Patrimoine";
    event.waitUntil(
        self.registration.showNotification(title, {
            body: data.body || "",
            icon: "/icon-192.png",
            badge: "/icon-192.png",
            data: { url: data.url || "/" },
        })
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || "/";
    event.waitUntil(
        self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((openClients) => {
            const existing = openClients.find((client) => "focus" in client);
            if (existing) {
                existing.focus();
                if ("navigate" in existing) existing.navigate(targetUrl);
                return;
            }
            self.clients.openWindow(targetUrl);
        })
    );
});
