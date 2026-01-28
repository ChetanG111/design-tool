import { create } from 'zustand';

interface DesignConfig {
  layout: string;
  style: string;
  theme: string;
  animation: string;
}

interface DesignTokens {
  primary: string;
  radius: string;
}

interface AppState {
  designConfig: DesignConfig;
  designTokens: DesignTokens;
  generatedCode: string;
  isGenerating: boolean;
  setDesignConfig: (config: Partial<DesignConfig>) => void;
  setDesignTokens: (tokens: Partial<DesignTokens>) => void;
  setGeneratedCode: (code: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  designConfig: {
    layout: 'hero-section',
    style: 'modern',
    theme: 'dark',
    animation: 'smooth'
  },
  designTokens: {
    primary: '#3b82f6',
    radius: '0.75rem'
  },
  generatedCode: `// Your generated code will appear here
import React from 'react';

export default function Preview() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-neutral-900 rounded-xl border border-white/10">
      <h1 className="text-4xl font-bold text-white mb-4">Aura.build</h1>
      <p className="text-neutral-400 text-center max-w-md">
        Select a layout and style from the left panel to start generating production-ready code.
      </p>
    </div>
  );
}
`,
  isGenerating: false,
  setDesignConfig: (config) =>
    set((state) => ({
      designConfig: { ...state.designConfig, ...config }
    })),
  setDesignTokens: (tokens) =>
    set((state) => ({
      designTokens: { ...state.designTokens, ...tokens }
    })),
  setGeneratedCode: (code) => set({ generatedCode: code }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
}));
