import { useEffect, useState } from "react";
import { BookOpen, Compass, Drama, ListChecks, ArrowRight, CheckCircle2, Lock, Trophy, X } from "lucide-react";
import { quizzes, badges, leaderboard as fallbackLeaderboard } from "../data/content";
import { vibrate } from "../lib/mobile";

const ICONS = { book: BookOpen, compass: Compass, mask: Drama };
const LEVEL_STYLES = {
  gold: "bg-gold/15 text-gold-dark",
  forest: "bg-forest/10 text-forest",
  terracotta: "bg-terracotta/10 text-terracotta",
};

const QUESTION_BANKS = {
  "Quiz d'Histoire": [
    { question: "Quel empire a fondé Soundiata Keita ?", answers: ["Empire du Mali", "Empire du Ghana", "Royaume du Cayor"], correct: "Empire du Mali" },
    { question: "Quel royaume Lat Dior a-t-il dirigé en tant que Damel ?", answers: ["Le Cayor", "Le Baol", "Le Sine"], correct: "Le Cayor" },
    { question: "En quelle année le Sénégal a-t-il proclamé son indépendance ?", answers: ["1960", "1958", "1965"], correct: "1960" },
  ],
  "Quiz de Géographie": [
    { question: "Combien de régions compte le Sénégal ?", answers: ["14", "10", "20"], correct: "14" },
    { question: "Quel fleuve délimite la frontière nord du Sénégal ?", answers: ["Le fleuve Sénégal", "Le fleuve Gambie", "Le fleuve Casamance"], correct: "Le fleuve Sénégal" },
    { question: "Quel parc national sénégalais est classé au patrimoine mondial de l'UNESCO ?", answers: ["Le Parc national du Djoudj", "Le Parc de Bandia", "La Réserve de Popenguine"], correct: "Le Parc national du Djoudj" },
  ],
  "Quiz Culturel": [
    { question: "Quelle ethnie pratique traditionnellement le Kankurang ?", answers: ["Les Mandingues", "Les Peuls", "Les Sérères"], correct: "Les Mandingues" },
    { question: "Quelle tradition transmet l'histoire par la parole et la musique ?", answers: ["Le griotisme", "La lutte", "La teinture"], correct: "Le griotisme" },
    { question: "Quel sport traditionnel sénégalais mêle rituels et combat ?", answers: ["La lutte sénégalaise", "Le judo", "La capoeira"], correct: "La lutte sénégalaise" },
  ],
};

export default function Quiz() {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState("");
  const [scoreSaved, setScoreSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [onlineLeaderboard, setOnlineLeaderboard] = useState(null); // null = pas encore su, [] = vide, array = chargé

  // Le classement réel vit en base de données (voir server/infrastructure/database.js). Tant que
  // la requête n'a pas répondu, ou si aucune base n'est configurée, on
  // affiche les scores de démonstration pour que la section ne soit jamais vide.
  useEffect(() => {
    fetch("/api/quiz/leaderboard")
      .then((response) => response.json())
      .then((data) => setOnlineLeaderboard(data.configured ? data.leaderboard : null))
      .catch(() => setOnlineLeaderboard(null));
  }, [scoreSaved]);

  const displayedLeaderboard = onlineLeaderboard?.length
    ? onlineLeaderboard.map((entry) => ({ name: entry.player_name, role: entry.quiz_title, points: entry.score }))
    : fallbackLeaderboard;

  const questions = activeQuiz ? QUESTION_BANKS[activeQuiz.title] || QUESTION_BANKS["Quiz d'Histoire"] : [];
  const startQuiz = (quiz) => { setActiveQuiz(quiz); setQuestionIndex(0); setScore(0); setScoreSaved(false); setPlayerName(""); };
  const answer = (value) => {
    const correct = value === questions[questionIndex].correct;
    vibrate(correct ? 18 : [10, 30, 10]);
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);
    setQuestionIndex((current) => current + 1);
  };

  const submitScore = async (event) => {
    event.preventDefault();
    if (!playerName.trim() || saving) return;
    setSaving(true);
    try {
      const response = await fetch("/api/quiz/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: playerName.trim(), quizTitle: activeQuiz.title, score, total: questions.length }),
      });
      if (response.ok) {
        vibrate([10, 30, 10, 30, 10]);
        setScoreSaved(true);
      }
    } catch {
      // Hors-ligne ou serveur indisponible : le score reste local, sans casser l'expérience.
    } finally {
      setSaving(false);
    }
  };
  return (
    <section id="quiz" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.2em] text-forest">
          <span className="h-px w-8 bg-forest" aria-hidden="true" />
          L'ESPRIT DE LA TERANGA PAR LE JEU
          <span className="h-px w-8 bg-forest" aria-hidden="true" />
        </div>
        <h2 className="font-display text-3xl text-forest sm:text-4xl">
          Quiz Interactifs — Testez vos Connaissances
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">
          Découvrez la richesse historique, la diversité géographique et
          l'éclat culturel du Sénégal à travers des défis conçus pour les
          passionnés et les curieux.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {quizzes.map((quiz) => {
          const Icon = ICONS[quiz.icon];
          return (
            <article
              key={quiz.title}
              className="rounded-lg border border-ink/10 bg-white/60 p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-gold-dark">
                  <Icon size={18} />
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold ${LEVEL_STYLES[quiz.levelColor]}`}
                >
                  {quiz.level}
                </span>
              </div>
              <h3 className="font-display text-xl text-forest">{quiz.title}</h3>
              <p className="mt-1 text-sm text-ink/60">{quiz.subtitle}</p>
              <div className="mt-4 rounded border border-ink/10 bg-cream-dark/60 p-3">
                <p className="text-[10px] font-semibold tracking-wide text-terracotta">
                  EXEMPLE DE QUESTION
                </p>
                <p className="mt-1 text-sm italic text-ink/70">{quiz.example}</p>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-sm text-ink/60">
                  <ListChecks size={15} /> {quiz.count}
                </span>
                <button type="button" onClick={() => startQuiz(quiz)} className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-cream hover:bg-terracotta-dark">
                  Commencer
                  <ArrowRight size={14} />
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {activeQuiz && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5" role="dialog" aria-modal="true" aria-label={activeQuiz.title}><div className="relative w-full max-w-lg rounded bg-cream p-7 text-ink"><button type="button" onClick={() => setActiveQuiz(null)} className="absolute right-3 top-3 rounded-full bg-ink/10 p-2" aria-label="Fermer"><X size={18} /></button>{questionIndex < questions.length ? <><p className="text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">{activeQuiz.title} · Question {questionIndex + 1}/{questions.length}</p><h3 className="mt-4 font-display text-2xl">{questions[questionIndex].question}</h3><div className="mt-6 grid gap-3">{questions[questionIndex].answers.map((answerOption) => <button type="button" key={answerOption} onClick={() => answer(answerOption)} className="rounded border border-ink/15 px-4 py-3 text-left text-sm hover:border-terracotta hover:text-terracotta">{answerOption}</button>)}</div></> : <div className="py-8 text-center"><CheckCircle2 size={44} className="mx-auto text-forest" /><h3 className="mt-4 font-display text-3xl">Quiz terminé</h3><p className="mt-3 text-sm text-ink/60">Votre score : {score}/{questions.length}</p>{!scoreSaved ? <form onSubmit={submitScore} className="mx-auto mt-5 flex max-w-xs items-center gap-2"><label className="sr-only" htmlFor="player-name">Votre nom</label><input id="player-name" value={playerName} onChange={(event) => setPlayerName(event.target.value)} placeholder="Votre nom pour le classement" className="min-w-0 flex-1 rounded border border-ink/15 px-3 py-2.5 text-sm outline-none focus:border-terracotta" /><button type="submit" disabled={!playerName.trim() || saving} className="shrink-0 rounded bg-gold-dark px-3.5 py-2.5 text-xs font-semibold text-cream disabled:opacity-50">{saving ? "..." : "Enregistrer"}</button></form> : <p className="mt-4 text-sm font-semibold text-forest">✓ Score enregistré au classement</p>}<button type="button" onClick={() => setActiveQuiz(null)} className="mt-6 rounded bg-forest px-5 py-3 text-sm font-semibold text-cream">Terminer</button></div>}</div></div>}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-lg border border-ink/10 bg-white/60 p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-xl text-forest">Votre Progression</h3>
            <span className="text-sm font-semibold text-ink/60">
              Niveau 3 · Historien du Sahel
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink/10">
            <div className="h-full w-[74%] rounded-full bg-forest" />
          </div>
          <div className="mt-2 flex justify-between text-xs text-ink/50">
            <span>1850 XP</span>
            <span>Prochain palier : 2500 XP (Maître du Patrimoine)</span>
          </div>

          <h4 className="mt-6 mb-3 font-display text-lg text-forest">
            Badges à Débloquer
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {badges.map((badge) => (
              <div
                key={badge.title}
                className="flex items-start gap-3 rounded border border-ink/10 p-3"
              >
                {badge.status === "Débloqué" ? (
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-forest" />
                ) : (
                  <Lock size={18} className="mt-0.5 shrink-0 text-ink/30" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink">{badge.title}</p>
                    <span
                      className={`text-[10px] font-semibold ${
                        badge.status === "Débloqué" ? "text-forest" : "text-ink/40"
                      }`}
                    >
                      {badge.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink/60">
                    {badge.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-ink/10 bg-white/60 p-6">
          <div className="mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-gold-dark" />
            <h3 className="font-display text-xl text-forest">
              Classement de la Teranga
            </h3>
          </div>
          <p className="mb-4 text-xs text-ink/50">
            Affrontez la communauté des passionnés du Sénégal
          </p>
          <ol className="flex flex-col divide-y divide-ink/10">
            {displayedLeaderboard.map((entry, i) => (
              <li key={`${entry.name}-${i}`} className="flex items-center gap-3 py-3">
                <span className="w-5 text-sm font-semibold text-ink/40">
                  {i + 1}
                </span>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-cream ${
                    i === 0 ? "bg-gold-dark" : i === 1 ? "bg-ink/40" : "bg-terracotta/70"
                  }`}
                  aria-hidden="true"
                >
                  {entry.name.charAt(0)}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{entry.name}</p>
                  <p className="text-xs text-terracotta">{entry.role}</p>
                </div>
                <span className="text-sm font-semibold text-ink">
                  {entry.points} <span className="text-xs font-normal text-ink/40">pts</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
