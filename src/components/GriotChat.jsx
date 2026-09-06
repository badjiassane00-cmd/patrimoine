import { useEffect, useRef, useState } from "react";
import { Bot, Compass, MessageCircle, RotateCcw, Send, Sparkles, X } from "lucide-react";

const suggestions = [
  { label: "Une figure historique", prompt: "Parle-moi de Lat Dior" },
  { label: "Un lieu à explorer", prompt: "Que visiter à Saint-Louis ?" },
  { label: "Un récit traditionnel", prompt: "Qui sont les griots ?" },
  { label: "Générer un récit sur mesure", prompt: "Peux-tu m'orienter vers Le Conteur pour générer un récit personnalisé ?" },
];

export default function GriotChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const [messages, setMessages] = useState([{ role: "assistant", content: "Jërëjëf. Je suis le Griot Virtuel. Que souhaitez-vous découvrir dans le patrimoine sénégalais ?" }]);

  // Bug corrigé : sans ceci, la conversation grandissait sans jamais faire
  // défiler la vue vers le dernier message — il fallait scroller à la main.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  const sendMessage = async (event) => {
    event?.preventDefault();
    const content = input.trim();
    if (!content || loading) return;
    const nextMessages = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: nextMessages }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Réponse indisponible");
      setMessages((current) => [...current, { role: "assistant", content: data.message }]);
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", content: error.message }]);
    } finally {
      setLoading(false);
    }
  };

  const askSuggestion = (prompt) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const resetChat = () => {
    setMessages([{ role: "assistant", content: "Jërëjëf. Je suis le Griot Virtuel. Que souhaitez-vous découvrir dans le patrimoine sénégalais ?" }]);
    setInput("");
  };

  return <>
    {open && <aside className="fixed bottom-24 right-4 z-50 flex h-[min(650px,calc(100vh-8rem))] w-[min(410px,calc(100vw-2rem))] flex-col overflow-hidden rounded-lg border border-ink/10 bg-cream shadow-2xl" aria-label="Discussion avec le Griot Virtuel">
      <div className="flex items-center justify-between bg-forest p-4 text-cream"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-ink shadow-[0_0_0_5px_rgba(217,154,61,0.15)]"><Bot size={19} /></span><div><p className="font-display text-lg">Le Griot Virtuel</p><p className="flex items-center gap-1.5 text-[11px] text-cream/65"><span className="h-1.5 w-1.5 rounded-full bg-gold" /> Guide des archives Téranga</p></div></div><div className="flex items-center gap-1"><button type="button" onClick={resetChat} aria-label="Réinitialiser la conversation" className="rounded p-1.5 text-cream/70 hover:bg-white/10 hover:text-white"><RotateCcw size={16} /></button><button type="button" onClick={() => setOpen(false)} aria-label="Fermer le chat" className="rounded p-1.5 hover:bg-white/10"><X size={19} /></button></div></div>
      <div className="border-b border-ink/10 bg-cream-dark/60 px-4 py-3"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-terracotta"><Sparkles size={14} /> Votre entrée dans la mémoire</p><p className="mt-1 text-xs leading-relaxed text-ink/60">Posez une question, demandez un récit ou choisissez une piste.</p></div>
      <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`flex gap-2 ${message.role === "user" ? "justify-end" : "items-start"}`}>{message.role === "assistant" && <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/25 text-gold-dark"><Bot size={13} /></span>}<div className={`max-w-[86%] rounded-md px-3.5 py-3 text-sm leading-relaxed whitespace-pre-line ${message.role === "user" ? "bg-terracotta text-cream" : "bg-white text-ink shadow-sm"}`}>{message.content}</div></div>)}{loading && <div className="flex items-start gap-2"><span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/25 text-gold-dark"><Bot size={13} /></span><div className="rounded-md bg-white px-3.5 py-3 text-sm text-ink/50 shadow-sm"><span className="inline-flex items-center gap-1"><span className="animate-pulse">●</span><span className="animate-pulse [animation-delay:150ms]">●</span><span className="animate-pulse [animation-delay:300ms]">●</span> Le Griot consulte ses archives</span></div></div>}<div ref={endRef} /></div>
      {messages.length === 1 && <div className="border-t border-ink/10 px-4 pb-3 pt-2"><p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/45">Commencer par...</p><div className="grid gap-2">{suggestions.map((suggestion) => <button type="button" key={suggestion.label} onClick={() => askSuggestion(suggestion.prompt)} className="flex items-center justify-between rounded border border-ink/10 bg-white px-3 py-2 text-left text-xs font-semibold text-ink/75 transition hover:border-terracotta hover:text-terracotta"><span>{suggestion.label}</span><Compass size={14} /></button>)}</div></div>}
      <form onSubmit={sendMessage} className="flex gap-2 border-t border-ink/10 bg-white p-3"><label className="sr-only" htmlFor="griot-message">Votre question</label><input ref={inputRef} id="griot-message" value={input} onChange={(event) => setInput(event.target.value)} disabled={loading} placeholder="Posez votre question..." className="min-w-0 flex-1 rounded border border-ink/15 px-3 py-2.5 text-sm text-ink outline-none focus:border-terracotta" /><button type="submit" disabled={loading || !input.trim()} aria-label="Envoyer la question" className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-terracotta text-cream transition hover:bg-terracotta-dark disabled:opacity-40"><Send size={16} /></button></form>
    </aside>}
    {!open && <button type="button" onClick={() => setOpen(true)} className="fixed bottom-24 right-4 z-50 flex items-center gap-2 rounded-full bg-terracotta px-4 py-3 text-sm font-semibold text-cream shadow-lg transition hover:bg-terracotta-dark hover:shadow-xl lg:bottom-5 lg:right-5" aria-expanded={open} aria-label="Ouvrir le Griot Virtuel"><MessageCircle size={19} /><span className="hidden sm:inline">Interroger le Griot</span></button>}
  </>;
}
