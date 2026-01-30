import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LayoutType = 'hero' | 'section' | 'card' | 'feature' | 'pricing' | 'footer' | 'navbar'
export type StyleType = 'glass' | 'solid' | 'minimal' | 'playful' | 'brutal'
export type ThemeType = 'light' | 'dark'
export type AnimationType = 'none' | 'slide' | 'fade' | 'bounce'

export interface DesignTokens {
    font: string
    primaryColor: string
    secondaryColor: string
    shadow: string
    borderRadius: string
}

export interface DesignConfig {
    layout: LayoutType
    style: StyleType
    theme: ThemeType
    animation: AnimationType
    tokens: DesignTokens
}

export interface DesignState {
    config: DesignConfig
    code: string
    previewId: number
    isGenerating: boolean

    // Actions
    updateConfig: (updates: Partial<DesignConfig>) => void
    updateTokens: (updates: Partial<DesignTokens>) => void
    resetConfig: () => void
    setCode: (code: string) => void
    setGenerating: (val: boolean) => void
    refreshPreview: () => void
}

const DEFAULT_CONFIG: DesignConfig = {
    layout: 'hero',
    style: 'glass',
    theme: 'dark',
    animation: 'slide',
    tokens: {
        font: 'Inter',
        primaryColor: 'indigo-600',
        secondaryColor: 'pink-500',
        shadow: 'lg',
        borderRadius: 'xl'
    }
}

export const useDesignStore = create<DesignState>()(
    persist(
        (set) => ({
            config: DEFAULT_CONFIG,
            code: `// Aura.build - Ready to generate\n\nimport React from 'react';\n\nexport default function Component() {\n  return (\n    <div className="p-8 text-center">\n      <h1 className="text-2xl font-bold">Select parameters on the left to begin</h1>\n    </div>\n  );\n}`,
            previewId: 0,
            isGenerating: false,

            updateConfig: (updates) => set((state) => ({
                config: { ...state.config, ...updates }
            })),

            updateTokens: (updates) => set((state) => ({
                config: {
                    ...state.config,
                    tokens: { ...state.config.tokens, ...updates }
                }
            })),

            resetConfig: () => set({ config: DEFAULT_CONFIG }),

            setCode: (code) => set({ code }),

            setGenerating: (val) => set({ isGenerating: val }),

            refreshPreview: () => set((state) => ({ previewId: state.previewId + 1 }))
        }),
        {
            name: 'aura-design-storage',
            partialize: (state) => ({ config: state.config, code: state.code })
        }
    )
)
