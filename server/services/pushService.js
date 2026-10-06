import webpush from "web-push";

export function createPushService({ publicKey, privateKey, contact = "mailto:contact@teranga-patrimoine.sn", client = webpush, repository } = {}) {
  const subscriptions = new Map();
  const configured = Boolean(publicKey && privateKey);
  if (configured) client.setVapidDetails(contact, publicKey, privateKey);

  return {
    configured,
    publicKey: configured ? publicKey : null,
    async subscribe(subscription) {
      if (repository) { await repository.save(subscription); return null; }
      subscriptions.set(subscription.endpoint, subscription);
      return subscriptions.size;
    },
    async unsubscribe(endpoint) {
      if (repository) return repository.delete(endpoint);
      subscriptions.delete(endpoint);
    },
    async sendTest(endpoint) {
      const targets = repository
        ? await repository.find(endpoint)
        : endpoint && subscriptions.has(endpoint) ? [subscriptions.get(endpoint)] : [...subscriptions.values()];
      const results = await Promise.allSettled(targets.map((subscription) => client.sendNotification(subscription, JSON.stringify({
        title: "Téranga Patrimoine",
        body: "Un nouveau portrait du jour vous attend sur Téranga. Jërëjëf de votre fidélité !",
        url: "/#portrait-du-jour",
      }))));
      const expired = results.flatMap((result, index) => result.status === "rejected" && [404, 410].includes(result.reason?.statusCode) ? [targets[index].endpoint] : []);
      if (repository) await Promise.all(expired.map((expiredEndpoint) => repository.delete(expiredEndpoint)));
      else expired.forEach((expiredEndpoint) => subscriptions.delete(expiredEndpoint));
      const sent = results.filter((result) => result.status === "fulfilled").length;
      return { total: targets.length, sent, failed: results.length - sent };
    },
  };
}
