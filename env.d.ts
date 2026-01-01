/// <reference types="vite/client" />
/// <reference types="@remix-run/node" />

interface Env {
  ANTHROPIC_API_KEY?: string;
  GOOGLE_GENERATIVE_AI_API_KEY?: string;
}

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare?: {
      env: Env;
    };
  }
}
