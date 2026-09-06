import Hero from "../components/Hero";
import PortraitDuJour from "../components/PortraitDuJour";
import ModeHorsLigne from "../components/ModeHorsLigne";
import NotificationsPatrimoine from "../components/NotificationsPatrimoine";
import VisiteGuidee from "../components/VisiteGuidee";
import LaboratoirePatrimoine from "../components/LaboratoirePatrimoine";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PortraitDuJour />
      <ModeHorsLigne />
      <NotificationsPatrimoine />
      <VisiteGuidee />
      <LaboratoirePatrimoine />
    </>
  );
}
