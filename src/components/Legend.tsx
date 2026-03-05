'use client';

import React from 'react';
import { standStatusColors, standStatusLabels } from '@/utils/standColors';
import { StandStatus } from '@/types/stand';

interface LegendProps {
    stats: {
        total: number;
        disponivel: number;
        reservado: number;
        vendido: number;
    };
}

export default function Legend({ stats }: LegendProps) {
    const items: { status: StandStatus; count: number }[] = [
        { status: 'disponivel', count: stats.disponivel },
        { status: 'reservado', count: stats.reservado },
        { status: 'vendido', count: stats.vendido },
    ];

    return (
        <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-5 border border-gray-700/50 shadow-xl">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Legenda
            </h3>
            <div className="space-y-3">
                {items.map(({ status, count }) => (
                    <div key={status} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <div
                                className="w-4 h-4 rounded-md shadow-lg"
                                style={{ backgroundColor: standStatusColors[status] }}
                            />
                            <span className="text-sm text-gray-200 font-medium">
                                {standStatusLabels[status]}
                            </span>
                        </div>
                        <span className="text-sm font-bold text-white bg-gray-800 px-2.5 py-0.5 rounded-full min-w-[32px] text-center">
                            {count}
                        </span>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700/50">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Total</span>
                    <span className="text-lg font-bold text-white">{stats.total}</span>
                </div>
            </div>
        </div>
    );
}
