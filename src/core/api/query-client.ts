/* ===========================================================================
   Instance unique de TanStack Query (cache du "server state").
   --------------------------------------------------------------------------- */
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 min : pas de refetch inutile
      gcTime: 5 * 60_000, // 5 min en cache après inactivité
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
