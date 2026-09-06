import Contes from "../components/Contes";
import Legendes from "../components/Legendes";
import FiguresHistoriques from "../components/FiguresHistoriques";
import FriseChronologique from "../components/FriseChronologique";
import ConteurIA from "../components/ConteurIA";

export default function RecitsPage() {
  return (
    <div className="page-shell">
      <FriseChronologique />
      <Contes />
      <Legendes />
      <FiguresHistoriques />
      <ConteurIA />
    </div>
  );
}
