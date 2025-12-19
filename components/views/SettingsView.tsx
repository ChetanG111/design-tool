'use client';

import React, { useState } from 'react';

export const SettingsView: React.FC = () => {
    const [selectedAccent, setSelectedAccent] = useState('#8561EF');
    const [density, setDensity] = useState('Balanced');

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto h-full overflow-y-auto custom-scrollbar pb-10">
            <header className="py-4">
                <h1 className="text-2xl font-bold tracking-tight">Operator Settings</h1>
                <p className="text-zinc-500 text-sm mt-1">Global interface configurations and security preferences</p>
            </header>
            <section className="bg-[#1E1E20] rounded-3xl border border-white/5 p-8 space-y-10 shadow-2xl">
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Global Accent Color</label>
                    <div className="flex gap-4">
                        {['#8561EF', '#E3FF93', '#FBBF24', '#F43F5E', '#06B6D4'].map((color) => (
                            <button
                                key={color}
                                onClick={() => setSelectedAccent(color)}
                                className={`w-10 h-10 rounded-full border-4 transition-all hover:scale-105 ${selectedAccent === color ? 'border-white scale-110' : 'border-transparent'
                                    }`}
                                style={{ backgroundColor: color }}
                            />
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Interface Density</label>
                    <div className="flex bg-[#131313] p-1 rounded-2xl border border-white/5 w-fit">
                        {['Compact', 'Balanced', 'Spacious'].map((d) => (
                            <button
                                key={d}
                                onClick={() => setDensity(d)}
                                className={`px-6 py-2 text-xs font-bold rounded-xl transition-all ${density === d ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-600 hover:text-zinc-300'
                                    }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
