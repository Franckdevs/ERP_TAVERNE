import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import AssistantDashboard from "./pages/AssistantDashboard";
import ConseilDashboard from "./pages/ConseilDashboard";
import PersonnelDashboard from "./pages/PersonnelDashboard";
import DashboardAdmin from "./dashboard-admin/DashboardAdmin";
import ComptabiliteDashboard from "./dashboard-comptabilite/ComptabiliteDashboard";
import StockDashboard from "./dashboard-stock/StockDashboard";
import LogoutConfirm from "./components/LogoutConfirm";
import CollabDock from "./collab/CollabDock";

/* Routage minimal par hash. En attendant React Router :
   - #/assistanat → tableau de bord Assistanat
   - #/conseil    → tableau de bord Conseil client (CRM)
   - #/personnel  → tableau de bord Ressources Humaines
   - #/stock      → tableau de bord Stock (magasinier)
   - tout le reste → landing page */
function routeFromHash() {
  return window.location.hash.replace(/^#\/?/, "");
}

export default function App() {
  const [route, setRoute] = useState(routeFromHash());

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  /* La déconnexion ouvre un modal de confirmation commun à tous les espaces. */
  const [logoutOpen, setLogoutOpen] = useState(false);
  const askLogout = () => setLogoutOpen(true);
  const confirmLogout = () => {
    setLogoutOpen(false);
    window.location.hash = "";
  };

  let page;
  let onDashboard = true;
  if (route === "admin") {
    page = <DashboardAdmin onLogout={askLogout} />;
  } else if (route === "comptabilite") {
    page = <ComptabiliteDashboard onLogout={askLogout} />;
  } else if (route === "assistanat") {
    page = <AssistantDashboard onLogout={askLogout} />;
  } else if (route === "conseil") {
    page = <ConseilDashboard onLogout={askLogout} />;
  } else if (route === "personnel") {
    page = <PersonnelDashboard onLogout={askLogout} />;
  } else if (route === "stock") {
    page = <StockDashboard onLogout={askLogout} />;
  } else {
    page = <HomePage />;
    onDashboard = false;
  }

  return (
    <>
      {page}
      <LogoutConfirm
        open={logoutOpen}
        onConfirm={confirmLogout}
        onCancel={() => setLogoutOpen(false)}
      />
      {onDashboard && <CollabDock />}
    </>
  );
}
