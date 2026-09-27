/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DETECTION_API_URL: string;
  readonly VITE_INGESTION_API_URL: string;
  readonly VITE_GENERATOR_API_URL: string;
  readonly VITE_OLLAMA_URL: string;
  readonly VITE_POLLING_INTERVAL_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
