// Global type definitions for SSG implementation

// Define the global window object with __INITIAL_STATE__ property
interface Window {
  __INITIAL_STATE__?: {
    pinia: Record<string, any>;
    staticPages?: Record<string, Record<string, any>>;
  };
}

// Vite SSG environment variable
interface ImportMetaEnv {
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 