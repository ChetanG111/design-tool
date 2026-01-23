'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Column definition for dynamic matrix tables
export interface MatrixColumn {
    key: string;
    label: string;
    align?: 'left' | 'right';
    format?: (value: unknown) => string;
    highlight?: boolean; // Use accent color
}

interface MatrixSectionProps {
    title: string;
    subtitle: string;
    columns: MatrixColumn[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: Record<string, any>[];
    emptyMessage?: string;
}

// Default formatters
const formatCurrency = (cents: number): string => {
    if (cents === 0) return '—';
    return `$${(cents / 100).toLocaleString()}`;
};

const formatNumber = (n: number | null): string => {
    if (n === null || n === undefined) return '—';
    return n.toLocaleString();
};

export const MatrixSection: React.FC<MatrixSectionProps> = ({
    title,
    subtitle,
    columns,
    data,
    emptyMessage = 'No data from logged actions yet.',
}) => {
    const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

    if (data.length === 0) {
        return (
            <div className="bg-[#1E1E20] rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-[#1E1E20]/40">
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
                </div>
                <div className="p-12 text-center">
                    <p className="text-zinc-600 text-sm">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#1E1E20] rounded-3xl border border-white/5 overflow-hidden transition-colors hover:border-white/10">
            <div className="p-6 border-b border-white/5 bg-[#1E1E20]/40">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 text-[10px] uppercase font-bold text-zinc-600 tracking-widest">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={`px-6 py-4 transition-colors duration-150 ${col.align === 'right' ? 'text-right' : 'text-left'
                                        } ${hoveredColumn === col.key ? 'text-zinc-400' : ''}`}
                                    onMouseEnter={() => setHoveredColumn(col.key)}
                                    onMouseLeave={() => setHoveredColumn(null)}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {data.map((row, rowIndex) => (
                            <motion.tr
                                key={row.id || rowIndex}
                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.015)' }}
                                transition={{ duration: 0.1 }}
                                className="group cursor-default"
                            >
                                {columns.map((col, colIndex) => {
                                    const rawValue = row[col.key];
                                    let displayValue: string;

                                    if (col.format) {
                                        displayValue = col.format(rawValue);
                                    } else if (typeof rawValue === 'number') {
                                        displayValue = formatNumber(rawValue);
                                    } else if (rawValue === null || rawValue === undefined) {
                                        displayValue = '—';
                                    } else {
                                        displayValue = String(rawValue);
                                    }

                                    const isFirstCol = colIndex === 0;
                                    const isHighlighted = col.highlight;
                                    const isHoveredCol = hoveredColumn === col.key;

                                    return (
                                        <td
                                            key={col.key}
                                            className={`px-6 py-5 text-sm transition-colors duration-150 ${col.align === 'right' ? 'text-right' : 'text-left'
                                                } ${isFirstCol
                                                    ? 'font-semibold text-zinc-300'
                                                    : isHighlighted
                                                        ? 'font-bold text-[#E3FF93]'
                                                        : 'font-medium text-zinc-500'
                                                } ${isHoveredCol ? 'bg-white/[0.02]' : ''}`}
                                            onMouseEnter={() => setHoveredColumn(col.key)}
                                            onMouseLeave={() => setHoveredColumn(null)}
                                        >
                                            {displayValue}
                                        </td>
                                    );
                                })}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Pre-configured column sets for the three matrices
export const TIME_RETURN_COLUMNS: MatrixColumn[] = [
    { key: 'label', label: 'Action / Channel' },
    { key: 'actionsLogged', label: 'Actions', align: 'right' },
    { key: 'timeSpentMins', label: 'Time (min)', align: 'right' },
    { key: 'outcomes', label: 'Outcomes', align: 'right' },
    { key: 'revenue', label: 'Revenue', align: 'right', format: (v) => formatCurrency(v as number) },
    { key: 'returnPerHour', label: 'Return/hr', align: 'right', highlight: true },
];

export const SENSE_MATRIX_COLUMNS: MatrixColumn[] = [
    { key: 'label', label: 'Action / Conversation' },
    { key: 'icpClarity', label: 'ICP Clarity' },
    { key: 'problemClarity', label: 'Problem Clarity' },
    { key: 'outcome', label: 'Outcome' },
];

export const VALUE_DENSITY_COLUMNS: MatrixColumn[] = [
    { key: 'dimension', label: 'Variable' },
    { key: 'actions', label: 'Actions', align: 'right' },
    { key: 'leads', label: 'Leads', align: 'right' },
    { key: 'revenue', label: 'Revenue', align: 'right', format: (v) => formatCurrency(v as number), highlight: true },
];
