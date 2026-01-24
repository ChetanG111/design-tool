"use client";

import React, { createContext, useContext, useState } from 'react';

interface DesignState {
    intent: string | null;
    accentColor: string;
    navbarStyle: string | null;
}

interface DesignContextType {
    state: DesignState;
    updateState: (updates: Partial<DesignState>) => void;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export const DesignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, setState] = useState<DesignState>({
        intent: 'saas',
        accentColor: '#ffffff',
        navbarStyle: 'floating',
    });

    const updateState = (updates: Partial<DesignState>) => {
        setState((prev) => ({ ...prev, ...updates }));
    };

    return (
        <DesignContext.Provider value={{ state, updateState }}>
            {children}
        </DesignContext.Provider>
    );
};

export const useDesign = () => {
    const context = useContext(DesignContext);
    if (!context) {
        throw new Error('useDesign must be used within a DesignProvider');
    }
    return context;
};
