import { Suspense, useState } from "react";
import {
  HashRouter,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import HomePage from "@/pages/HomePage";
import LogoutConfirm from "@/components/LogoutConfirm";
import CollabDock from "@/collab/CollabDock";
import { MODULES } from "@/core/module/registry";
import ProtectedRoute from "./guards/ProtectedRoute";

/* ===========================================================================
   Routeur applicatif. HashRouter → conserve la navigation par hash existante
   (SpaceModal pose window.location.hash = "#/<espace>", inchangé).
   Les routes des dashboards sont générées depuis le REGISTRE de modules et
   chargées en lazy (code splitting par pôle).
   --------------------------------------------------------------------------- */
export default function AppRouter() {
  return (
    <HashRouter>
      <Shell />
    </HashRouter>
  );
}

function RouteFallback() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        color: "var(--muted-foreground, #6f655b)",
      }}
    >
      Chargement…
    </div>
  );
}

/** Habillage des espaces : contenu du module + dock de collaboration. */
function DashboardChrome() {
  return (
    <>
      <Outlet />
      <CollabDock />
    </>
  );
}

function Shell() {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const confirmLogout = () => {
    setLogoutOpen(false);
    navigate("/");
  };

  return (
    <>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Espaces protégés (auth requise) + habillage commun */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardChrome />}>
              {MODULES.map((m) => {
                const Element = m.element;
                return (
                  <Route
                    key={m.id}
                    path={m.path}
                    element={<Element onLogout={() => setLogoutOpen(true)} />}
                  />
                );
              })}
            </Route>
          </Route>

          {/* Inconnu → landing */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Suspense>

      <LogoutConfirm
        open={logoutOpen}
        onConfirm={confirmLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </>
  );
}
