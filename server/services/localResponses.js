const TONE_LABELS = {
  enfant: "conte pour enfants, simple et malicieux",
  griot: "poème de griot, rythmé et oral",
  historique: "récit historique, sobre et documentaire",
  legende: "légende mystique, empreinte de mystère",
};

export function createLocalChatResponder() {
  return {
    answer(question) {
      const normalized = question.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalized.includes("griot")) return "Dans les archives de Téranga, les griots sont les gardiens de la mémoire orale. Ils transmettent les histoires, les généalogies et les récits des royaumes par la parole et la musique. Explorez la section « La sagesse de la tradition orale » pour découvrir nos contes et notre documentaire.";
      if (normalized.includes("lat dior")) return "Lat Dior Ngoné Latir Diop (1842–1886) fut le Damel du Cayor. Il est présenté sur Téranga comme un souverain emblématique et un résistant acharné à la pénétration coloniale française. Consultez la section « Les Grandes Figures de notre Histoire ».";
      if (["ou se trouve le senegal", "situe le senegal", "situe se le senegal"].some((term) => normalized.includes(term))) return "Le Sénégal se trouve en Afrique de l'Ouest, sur la façade atlantique. Il est bordé par la Mauritanie au nord, le Mali à l'est, la Guinée et la Guinée-Bissau au sud, et entoure presque entièrement la Gambie. Sur Téranga, vous pouvez parcourir ses régions grâce à la section « Voyage Géographique à travers l'Histoire ».";
      if (normalized.includes("saint-louis") || normalized.includes("saint louis")) return "Saint-Louis, ou Ndar, est une ancienne capitale située sur une île du fleuve Sénégal. Le site met en avant son architecture aux façades ocres, ses balcons en bois et son patrimoine mondial de l'UNESCO. Retrouvez-la dans « Voyage Géographique à travers l'Histoire ».";
      if (normalized.includes("goree")) return "L'île de Gorée est un lieu de mémoire au large de Dakar, associé à la Maison des Esclaves et classé au patrimoine mondial de l'UNESCO. Téranga propose une exposition dédiée : « L'Île de Gorée : Mémoire et Résilience ».";
      if (normalized.includes("unesco") || normalized.includes("patrimoine")) return "Téranga présente notamment l'île de Gorée, Saint-Louis, le Delta du Saloum, le Parc national du Djoudj et les Pays Bassari. Utilisez la carte interactive et le Passeport Patrimoine pour construire votre parcours.";
      return "Je peux vous renseigner sur les contes, les griots, les grandes figures historiques, les sites UNESCO, les destinations et les expositions présents dans les archives de Téranga. Posez-moi une question plus précise.";
    },
  };
}

export function createLocalStoryGenerator(random = Math.random) {
  const openings = [
    (subject) => `On raconte, sous le grand fromager, qu'il faut parler de ${subject}.`,
    (subject) => `Écoute bien, car voici ce que les anciens racontent au sujet de ${subject}.`,
    (subject) => `Quand le tam-tam se tait à la tombée du jour, on évoque toujours ${subject}.`,
  ];
  const middles = [
    () => "Le vent du fleuve portait cette mémoire d'un village à l'autre, et chacun y ajoutait sa propre couleur.",
    (subject) => `Ni la pluie ni le temps n'ont réussi à effacer ce que ${subject} a laissé dans le cœur des Sénégalais.`,
    () => "Les femmes qui pilent le mil au crépuscule en parlent encore, entre deux chants.",
  ];
  const closings = [
    "Ainsi parle la mémoire : ce qui est raconté ne meurt jamais tout à fait.",
    "Voilà ce que disent les anciens, et voilà ce que nous transmettons à notre tour.",
    "Et le conteur referma son récit, comme on referme doucement une calebasse pleine.",
  ];
  const pick = (items, subject) => items[Math.floor(random() * items.length)](subject);

  return {
    generate(subject, tone) {
      const styleLabel = TONE_LABELS[tone] || TONE_LABELS.enfant;
      return [pick(openings, subject), `(récit généré hors-ligne, sans clé API — dans le style : ${styleLabel})`, "", pick(middles, subject), "", pick(closings)].join("\n");
    },
  };
}
