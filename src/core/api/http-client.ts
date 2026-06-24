/* ===========================================================================
   Client HTTP — fin wrapper autour de fetch.
   - baseURL = env.apiUrl
   - injecte le JWT (Authorization: Bearer …) s'il existe
   - normalise les erreurs en HttpError
   C'est la SEULE porte vers le réseau : les repositories l'utilisent, l'UI
   ne l'appelle jamais directement.
   --------------------------------------------------------------------------- */
import { env } from "@/core/config/env";
import { getAccessToken } from "@/core/auth/token";
import type { ApiError } from "@/core/types/result";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type Params = Record<string, string | number | boolean | undefined>;

export interface RequestOptions {
  params?: Params;
  signal?: AbortSignal;
  headers?: Record<string, string>;
}

export class HttpError extends Error implements ApiError {
  status: number;
  details?: unknown;
  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.details = details;
  }
}

function buildUrl(path: string, params?: Params): string {
  const base = env.apiUrl
    ? env.apiUrl.replace(/\/?$/, "/")
    : `${window.location.origin}/`;
  const url = new URL(path.replace(/^\//, ""), base);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function request<T>(
  method: Method,
  path: string,
  body?: unknown,
  opts?: RequestOptions,
): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(buildUrl(path, opts?.params), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...opts?.headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: opts?.signal,
  });

  if (!res.ok) {
    // TODO(NestJS) : sur 401, tenter un refresh puis rejouer la requête.
    let details: unknown;
    try {
      details = await res.json();
    } catch {
      /* corps non-JSON */
    }
    throw new HttpError(res.status, res.statusText || `HTTP ${res.status}`, details);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const httpClient = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>("GET", path, undefined, opts),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) => request<T>("POST", path, body, opts),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) => request<T>("PUT", path, body, opts),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) => request<T>("PATCH", path, body, opts),
  delete: <T>(path: string, opts?: RequestOptions) => request<T>("DELETE", path, undefined, opts),
};

export type HttpClient = typeof httpClient;
