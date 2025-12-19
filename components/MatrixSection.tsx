'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MatrixRow } from '@/types';

interface MatrixSectionProps {
    title: string;
    subtitle: string;
    data: MatrixRow[];
}

export const MatrixSection: React.FC<MatrixSectionProps> = ({ title, subtitle, data }) => (
    <div className="bg-[#1E1E20] rounded-3xl border border-white/5 overflow-hidden transition-colors hover:border-white/10">
        <div className="p-6 border-b border-white/5 bg-[#1E1E20]/40">
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-zinc-600 tracking-widest">
                        <th className="px-6 py-4">Item / Segment</th>
                        <th className="px-6 py-4">Conversion Rate</th>
                        <th className="px-6 py-4">Sales Cycle (Mo)</th>
                        <th className="px-6 py-4">Quality Index</th>
                        <th className="px-6 py-4">Est. ROI</th>
                        <th className="px-6 py-4">Effort</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {data.map((row) => (
                        <motion.tr
                            key={row.id}
                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.015)' }}
                            transition={{ duration: 0.1 }}
                            className="group cursor-default"
                        >
                            <td className="px-6 py-5 text-sm font-semibold text-zinc-300">{row.item}</td>
                            <td className="px-6 py-5 text-sm font-medium text-zinc-500">{row.variableA}</td>
                            <td className="px-6 py-5 text-sm font-medium text-zinc-500">{row.variableB}</td>
                            <td className="px-6 py-5 text-sm font-medium text-zinc-500">{row.variableC}</td>
                            <td className="px-6 py-5 text-sm font-bold text-[#E3FF93]">{row.roi}</td>
                            <td className="px-6 py-5">
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${row.effort === 'Low' ? 'bg-[#E3FF93]/5 border-[#E3FF93]/20 text-[#E3FF93]' :
                                        row.effort === 'Med' ? 'bg-amber-400/5 border-amber-400/20 text-amber-400' :
                                            'bg-rose-500/5 border-rose-500/20 text-rose-500'
                                    }`}>
                                    {row.effort}
                                </span>
                            </td>
                        </motion.tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
