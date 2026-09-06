import CartePatrimoine from "../components/CartePatrimoine";
import Immersions from "../components/Immersions";
import PasseportPatrimoine from "../components/PasseportPatrimoine";
import Quiz from "../components/Quiz";
import PatrimoinePresDeMoi from "../components/PatrimoinePresDeMoi";

export default function ExplorationPage() {
  return (
    <div className="page-shell">
      <PatrimoinePresDeMoi />
      <CartePatrimoine />
      <Immersions />
      <PasseportPatrimoine />
      <Quiz />
    </div>
  );
}
