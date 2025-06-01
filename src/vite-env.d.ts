/// <reference types="vite/client" />

interface Window {
  hbspt?: {
    forms: {
      create: (config: any) => void;
    };
  };
}