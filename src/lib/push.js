const STATUS_KEY = "teranga_push_status";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function isPushSupported() {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export function getStoredPushStatus() {
  try {
    return window.localStorage.getItem(STATUS_KEY) === "true";
  } catch {
    return false;
  }
}

function setStoredPushStatus(active) {
  try {
    window.localStorage.setItem(STATUS_KEY, String(active));
  } catch {
    // Sans conséquence si le stockage local est indisponible.
  }
}

/**
 * Active les notifications : demande la permission au visiteur, récupère la
 * clé publique VAPID du serveur, puis crée l'abonnement push du navigateur
 * et l'enregistre côté serveur. Chaque étape peut échouer proprement (refus
 * de permission, backend non configuré...) sans casser le reste de l'app.
 */
export async function enablePush() {
  if (!isPushSupported()) {
    throw new Error("Les notifications ne sont pas prises en charge sur cet appareil ou ce navigateur.");
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Vous avez refusé les notifications. Vous pouvez changer cela dans les réglages du navigateur.");
  }

  const keyResponse = await fetch("/api/push/public-key");
  const keyData = await keyResponse.json();
  if (!keyData.configured) {
    throw new Error("Les notifications ne sont pas encore configurées côté serveur (clés VAPID absentes).");
  }

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(keyData.publicKey),
    });
  }

  await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription }),
  });

  setStoredPushStatus(true);
  return subscription;
}

export async function disablePush() {
  if (!isPushSupported()) return;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    await fetch("/api/push/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });
    await subscription.unsubscribe();
  }
  setStoredPushStatus(false);
}

export async function sendTestPush() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  const response = await fetch("/api/push/test", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint: subscription?.endpoint }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "L'envoi de la notification de test a échoué.");
  return data;
}
