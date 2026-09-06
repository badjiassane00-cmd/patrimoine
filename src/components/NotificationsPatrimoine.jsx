import { useState } from "react";
import { Bell, BellOff, BellRing, Loader2 } from "lucide-react";
import { disablePush, enablePush, getStoredPushStatus, isPushSupported, sendTestPush } from "../lib/push";
import { vibrate } from "../lib/mobile";

export default function NotificationsPatrimoine() {
  const [active, setActive] = useState(getStoredPushStatus());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testSent, setTestSent] = useState(false);

  if (!isPushSupported()) return null;

  const toggle = async () => {
    setLoading(true);
    setError("");
    try {
      if (active) {
        await disablePush();
        setActive(false);
      } else {
        await enablePush();
        setActive(true);
        vibrate([10, 30, 10]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const test = async () => {
    setError("");
    setTestSent(false);
    try {
      await sendTestPush();
      setTestSent(true);
      vibrate(15);
      window.setTimeout(() => setTestSent(false), 4000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section id="notifications-patrimoine" className="mx-auto max-w-7xl px-6 pb-14">
      <div className="rounded-lg border border-ink/10 bg-white/60 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
              {active ? <BellRing size={17} /> : <Bell size={17} />}
            </span>
            <div>
              <h2 className="font-display text-xl text-ink sm:text-2xl">Notifications du patrimoine</h2>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink/65">
                Recevez une alerte pour le portrait du jour ou un nouveau récit du Conteur — directement sur
                votre téléphone, même l'application fermée.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggle}
            disabled={loading}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
              active ? "border border-ink/15 text-ink/60 hover:border-ink/30" : "bg-terracotta text-cream hover:bg-terracotta-dark"
            } disabled:opacity-60`}
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : active ? <BellOff size={15} /> : <Bell size={15} />}
            {active ? "Désactiver" : "Activer les notifications"}
          </button>
        </div>

        {error && <p className="mt-4 rounded border border-terracotta/30 bg-terracotta/5 p-3 text-sm text-terracotta">{error}</p>}
        {testSent && <p className="mt-4 text-sm font-semibold text-forest">✓ Notification de test envoyée.</p>}

        {active && (
          <button
            type="button"
            onClick={test}
            className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3.5 py-1.5 text-xs font-semibold text-ink/60 hover:border-ink/30"
          >
            Envoyer une notification de test
          </button>
        )}
      </div>
    </section>
  );
}
