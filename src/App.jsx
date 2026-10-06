import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Footer from "./components/Footer";
import GriotChat from "./components/GriotChat";
import Header from "./components/Header";
import MobileNav from "./components/MobileNav";
import InstallPrompt from "./components/InstallPrompt";
import BandeauHorsLigne from "./components/BandeauHorsLigne";
import { useSwipe } from "./hooks/useSwipe";
import { vibrate } from "./lib/mobile";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
const AccountPage = lazy(() => import("./components/AccountPage"));
const AdminSpacePage = lazy(() => import("./pages/AdminSpacePage"));
const ClientSpacePage = lazy(() => import("./pages/ClientSpacePage"));
const AgendaPage = lazy(() => import("./pages/AgendaPage"));
const CollectionsPage = lazy(() => import("./pages/CollectionsPage"));
const ExplorationPage = lazy(() => import("./pages/ExplorationPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const RecitsPage = lazy(() => import("./pages/RecitsPage"));

// Même ordre que la barre de navigation mobile (MobileNav.jsx), pour que le
// swipe suive l'ordre visuel des onglets.
const PAGE_ORDER = ["/", "/collections", "/recits", "/exploration", "/agenda"];

/**
 * Après chaque navigation : si l'URL contient une ancre (#section), on
 * attend le rendu de la page puis on scrolle jusqu'à la section visée.
 * Sinon on remonte en haut de la nouvelle page. Nécessaire depuis que
 * les liens internes (nav, footer, recherche) utilisent <Link> et ne
 * déclenchent donc plus le rechargement natif du navigateur.
 */
function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const timer = setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return () => clearTimeout(timer);
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider><AppShell /></AuthProvider>
    </BrowserRouter>
  );
}

/**
 * Sépare le contenu du <BrowserRouter> pour pouvoir utiliser useNavigate/
 * useLocation ici (ces hooks exigent d'être sous le Router).
 */
function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = PAGE_ORDER.indexOf(location.pathname);
  const inAccountSpace = ["/connexion", "/inscription"].includes(location.pathname)
    || location.pathname.startsWith("/espace")
    || location.pathname.startsWith("/admin");

  // Balayer vers la gauche/droite change de page, dans l'ordre des onglets
  // de la barre mobile — un geste natif que l'on attend d'une vraie app.
  // On ignore les gestes qui démarrent sur la carte Leaflet (Exploration) :
  // sans ce garde-fou, faire glisser la carte pour l'explorer changerait
  // accidentellement de page.
  const pageSwipe = useSwipe({
    threshold: 70,
    onSwipeLeft: () => {
      if (currentIndex === -1 || currentIndex >= PAGE_ORDER.length - 1) return;
      vibrate(8);
      navigate(PAGE_ORDER[currentIndex + 1]);
    },
    onSwipeRight: () => {
      if (currentIndex <= 0) return;
      vibrate(8);
      navigate(PAGE_ORDER[currentIndex - 1]);
    },
  });

  const guardedTouchStart = (event) => {
    if (event.target.closest(".leaflet-container, [data-no-swipe]")) return;
    pageSwipe.onTouchStart(event);
  };

  if (inAccountSpace) {
    return <><ScrollManager /><Suspense fallback={<RouteLoading />}><Routes>
      <Route path="/connexion" element={<AccountPage />} />
      <Route path="/inscription" element={<AccountPage initialMode="register" />} />
      <Route path="/espace/*" element={<ProtectedSpace role="client"><ClientSpacePage /></ProtectedSpace>} />
      <Route path="/admin/*" element={<ProtectedSpace role="admin"><AdminSpacePage /></ProtectedSpace>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes></Suspense></>;
  }

  return (
    <div className="min-h-screen bg-cream">
      <ScrollManager />
      <BandeauHorsLigne />
      <Header />
      <main onTouchStart={guardedTouchStart} onTouchEnd={pageSwipe.onTouchEnd}>
        <Suspense fallback={<RouteLoading />}><Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/recits" element={<RecitsPage />} />
          <Route path="/exploration" element={<ExplorationPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes></Suspense>
      </main>
      <Footer />
      <MobileNav />
      <InstallPrompt />
      <GriotChat />
    </div>
  );
}

function RouteLoading() {
  return <div className="grid min-h-[55vh] place-items-center text-sm text-ink/55" role="status">Chargement de la page…</div>;
}

function ProtectedSpace({ role, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="grid min-h-screen place-items-center bg-cream text-sm text-ink/55">Ouverture de votre espace…</div>;
  if (!user) return <Navigate to="/connexion" replace state={{ from: location.pathname }} />;
  if (user.role !== role) return <Navigate to={user.role === "admin" ? "/admin" : "/espace"} replace />;
  return children;
}
