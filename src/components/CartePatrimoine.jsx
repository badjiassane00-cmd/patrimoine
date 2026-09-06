import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, MapPin, UserRound } from "lucide-react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const REGIONS = [
  { id: "saint-louis", name: "Saint-Louis / Ndar", position: [16.0326, -16.4818], tag: "PATRIMOINE MONDIAL UNESCO", desc: "Fondée au XVIIe siècle, l'ancienne capitale coloniale du Sénégal s'étend sur une île étroite du fleuve Sénégal. Elle a conservé une architecture unique aux façades ocres et balcons en bois forgé.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Saint-Louis_maisons_coloniales.jpg?width=1200", zones: ["Île de Ndar", "Pont Faidherbe", "Langue de Barbarie"], legends: ["Le fleuve protecteur", "Le pont aux deux rives"], figures: ["Mame Coumba Bang", "Léopold Sédar Senghor"] },
  { id: "goree", name: "Gorée", position: [14.6667, -17.4], tag: "PATRIMOINE MONDIAL UNESCO", desc: "Île-mémoire au large de Dakar, symbole universel de la traite négrière et lieu de recueillement mondialement reconnu.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/La_Maison_des_Esclaves.jpg?width=1200", zones: ["Maison des Esclaves", "Castel de Gorée", "Plage de Gorée"], legends: ["Les esprits gardiens de l'île", "La porte du voyage sans retour"], figures: ["Boubacar Joseph Ndiaye", "Blaise Diagne"] },
  { id: "niokolo-koba", name: "Niokolo-Koba", position: [13.0667, -12.7167], tag: "RÉSERVE DE BIOSPHÈRE", desc: "Le plus grand parc national du Sénégal, sanctuaire de biodiversité abritant notamment lions, hippopotames, oiseaux et une population d'éléphants.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/Loves2020Africa_%2820%29.jpg?width=1200", zones: ["Mare de Simenti", "Mont Assirik", "Galerie forestière"], legends: ["Le lion du pays mandingue", "Les esprits de la brousse"], figures: ["Les gardes du parc", "Les communautés du Sénégal oriental"] },
  { id: "dakar", name: "Dakar", position: [14.7167, -17.4677], tag: "CAPITALE CULTURELLE", desc: "Ville ouverte sur l'Atlantique, Dakar rassemble la création contemporaine, les mémoires de la presqu'île et les grands rendez-vous culturels.", image: "https://images.unsplash.com/photo-1535338454770-8be927b5a00b?auto=format&fit=crop&w=1200&q=85", zones: ["Monument de la Renaissance", "Musée des Civilisations Noires", "Marché Kermel"], legends: ["La presqu'île aux esprits marins", "Le pacte de Ninki-Nanka"], figures: ["Cheikh Anta Diop", "Ousmane Sembène"] },
  { id: "saloum", name: "Delta du Saloum", position: [13.75, -16.5], tag: "BIODIVERSITÉ UNESCO", desc: "Un monde de bolongs, de mangroves et d'îles où les villages de pêcheurs vivent au rythme des marées.", image: "https://images.unsplash.com/photo-1484318571209-661cf29a69c3?auto=format&fit=crop&w=1200&q=85", zones: ["Îles du Saloum", "Toubacouta", "Réserve de Fathala"], legends: ["Le génie des bolongs", "La pirogue qui suivait la lune"], figures: ["Les reines sérères", "Les pêcheurs de Foundiougne"] },
  { id: "casamance", name: "Casamance", position: [12.5833, -16.2667], tag: "TERRE DE TRADITIONS", desc: "Une région de rizières, de forêts et de traditions diola, où l'hospitalité se partage sous les fromagers. La Casamance n'est pas présentée ici comme une zone d'éléphants : son paysage emblématique est celui des rizières, mangroves et palmeraies.", image: "https://commons.wikimedia.org/wiki/Special:FilePath/FEMME_S%27ACTIVANT_DANS_UN_CHAMPS_DE_RIZ.jpg?width=1200", zones: ["Cap Skirring", "Oussouye", "Rizières de Basse-Casamance"], legends: ["Aguène et Diambogne", "Le fromager qui parlait aux anciens"], figures: ["Aline Sitoé Diatta", "Les sages d'Oussouye"] },
];

function FocusMap({ region }) {
  const map = useMap();
  useEffect(() => { map.flyTo(region.position, 8, { duration: 1.2 }); }, [map, region]);
  return null;
}

export default function CartePatrimoine() {
  const [active, setActive] = useState(REGIONS[0].id);
  const region = REGIONS.find((item) => item.id === active) || REGIONS[0];

  return (
    <section id="carte-patrimoine" className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-3 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-terracotta"><span className="h-px w-8 bg-terracotta" /> CARTE DU PATRIMOINE</div>
      <h2 className="font-display text-3xl text-ink sm:text-4xl">Voyage Géographique à travers l'Histoire</h2>
      <p className="mt-3 max-w-2xl text-sm text-ink/60">Explorez le Sénégal sur une carte réelle, puis ouvrez les récits, les zones touristiques et les figures associées à chaque territoire.</p>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div data-no-swipe="true" className="relative z-0 min-h-[480px] overflow-hidden rounded-lg border border-ink/10 shadow-lg">
          <MapContainer center={[14.5, -14.5]} zoom={6.4} minZoom={5.5} maxZoom={12} scrollWheelZoom className="h-[480px] w-full">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <FocusMap region={region} />
            {REGIONS.map((item) => <CircleMarker key={item.id} center={item.position} radius={item.id === active ? 12 : 8} pathOptions={{ color: item.id === active ? "#C1440E" : "#1E4A34", fillColor: item.id === active ? "#D99A3D" : "#F8F3E9", fillOpacity: 1, weight: 3 }} eventHandlers={{ click: () => setActive(item.id) }}><Popup><strong>{item.name}</strong><br />{item.tag}</Popup></CircleMarker>)}
          </MapContainer>
          <div className="pointer-events-none absolute left-4 top-4 z-[400] rounded-full bg-ink/85 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cream">Carte en direct · Sénégal</div>
        </div>

        <div id={`region-${region.id}`} className="rounded-lg border border-ink/10 bg-white/70 p-6 shadow-sm">
          <span className="inline-block rounded-full bg-forest/10 px-3 py-1 text-[11px] font-semibold text-forest">LOCALITÉ SÉLECTIONNÉE</span>
          <h3 className="mt-3 font-display text-2xl text-ink">{region.name}</h3>
          <p className="mt-1 text-xs font-semibold tracking-wide text-terracotta">{region.tag}</p>
          <img src={region.image} alt={`Photographie documentaire de ${region.name}`} className="mt-4 aspect-video w-full rounded-md object-cover" />
          <p className="mt-4 text-sm leading-relaxed text-ink/70">{region.desc}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="rounded border border-terracotta/15 bg-terracotta/5 p-3"><p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-terracotta"><MapPin size={14} /> À visiter</p><ul className="mt-2 space-y-1.5 text-xs text-ink/70">{region.zones.map((zone) => <li key={zone}>• {zone}</li>)}</ul></div>
            <div className="rounded border border-gold/20 bg-gold/10 p-3"><p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-dark"><BookOpen size={14} /> Légendes</p><ul className="mt-2 space-y-1.5 text-xs text-ink/70">{region.legends.map((legend) => <li key={legend}>• {legend}</li>)}</ul></div>
            <div className="rounded border border-forest/15 bg-forest/5 p-3"><p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-forest"><UserRound size={14} /> Figures</p><ul className="mt-2 space-y-1.5 text-xs text-ink/70">{region.figures.map((figure) => <li key={figure}>• {figure}</li>)}</ul></div>
          </div>
          <button onClick={() => document.getElementById(`region-${region.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })} className="mt-6 inline-flex items-center gap-2 rounded border border-ink/20 px-5 py-2.5 text-sm font-semibold text-ink hover:border-ink">PARCOURIR LA RÉGION <ArrowRight size={14} /></button>
        </div>
      </div>
    </section>
  );
}
