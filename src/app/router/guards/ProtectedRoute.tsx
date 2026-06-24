import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "@/core/auth/useAuth";

/* ===========================================================================
   Garde de route : exige un utilisateur authentifié, sinon redirige vers la
   landing. (Aujourd'hui l'utilisateur de démo est "authenticated" → passe ;
   le jour où le vrai login existe, la protection devient effective.)
   --------------------------------------------------------------------------- */
export default function ProtectedRoute() {
  const status = useAuthStatus();
  if (status !== "authenticated") return <Navigate to="/" replace />;
  return <Outlet />;
}
