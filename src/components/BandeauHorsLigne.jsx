import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function BandeauHorsLigne() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div className="sticky top-0 z-[60] flex items-center justify-center gap-2 bg-ink px-4 py-2 text-center text-xs font-semibold text-cream">
      <WifiOff size={13} aria-hidden="true" />
      Vous êtes hors-ligne — le contenu déjà consulté ou téléchargé reste accessible.
    </div>
  );
}
