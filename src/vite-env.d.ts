/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL de base de l'API NestJS (ex. https://api.taverne.ci). */
  readonly VITE_API_URL?: string;
  /** "false" pour taper la vraie API ; sinon on utilise les mocks. */
  readonly VITE_USE_MOCKS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
