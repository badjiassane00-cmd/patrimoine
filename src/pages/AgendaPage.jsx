import Hebergements from "../components/Hebergements";
import PatrimoineUnesco from "../components/PatrimoineUnesco";
import Evenements from "../components/Evenements";
import Contribution from "../components/Contribution";

export default function AgendaPage() {
  return <div className="page-shell"><Hebergements /><PatrimoineUnesco /><Evenements /><Contribution /></div>;
}
