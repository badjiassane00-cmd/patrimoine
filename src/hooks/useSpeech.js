import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Narration à voix haute basée sur la Web Speech API du navigateur.
 * Aucune dépendance externe, aucun coût serveur : fonctionne même hors-ligne.
 * Choisit automatiquement une voix française si le système en propose une.
 */
export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const [supported] = useState(() => typeof window !== "undefined" && "speechSynthesis" in window);
  const utteranceRef = useRef(null);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const pickVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((voice) => voice.lang?.toLowerCase().startsWith("fr") && /senegal|wolof/i.test(voice.name)) ||
      voices.find((voice) => voice.lang?.toLowerCase() === "fr-fr") ||
      voices.find((voice) => voice.lang?.toLowerCase().startsWith("fr")) ||
      voices[0]
    );
  }, []);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const speak = useCallback(
    (text) => {
      if (!supported || !text) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "fr-FR";
      utterance.rate = 0.96;
      utterance.pitch = 1;
      const voice = pickVoice();
      if (voice) utterance.voice = voice;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    },
    [supported, pickVoice]
  );

  const toggle = useCallback(
    (text) => {
      if (speaking) stop();
      else speak(text);
    },
    [speaking, speak, stop]
  );

  return { speak, stop, toggle, speaking, supported };
}
