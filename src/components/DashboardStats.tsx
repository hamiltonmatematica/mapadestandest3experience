'use client';

import React from 'react';

interface DashboardStatsProps {
    stats: {
        total: number;
        disponivel: number;
        reservado: number;
        vendido: number;
    };
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
    const cards = [
        {
            label: 'Total',
            value: stats.total,
            color: 'from-blue-500 to-blue-700',
            icon: '📊',
        },
        {
            label: 'Disponíveis',
            value: stats.disponivel,
            color: 'from-green-500 to-green-700',
            icon: '✅',
            percent: stats.total ? Math.round((stats.disponivel / stats.total) * 100) : 0,
        },
        {
            label: 'Reservados',
            value: stats.reservado,
            color: 'from-yellow-500 to-yellow-700',
            icon: '⏳',
            percent: stats.total ? Math.round((stats.reservado / stats.total) * 100) : 0,
        },
        {
            label: 'Vendidos',
            value: stats.vendido,
            color: 'from-red-500 to-red-700',
            icon: '🔥',
            percent: stats.total ? Math.round((stats.vendido / stats.total) * 100) : 0,
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
                <div
                    key={card.label}
                    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} p-5 shadow-lg`}
                >
                    <div className="absolute top-3 right-3 text-2xl opacity-30">{card.icon}</div>
                    <p className="text-sm font-medium text-white/80">{card.label}</p>
                    <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
                    {card.percent !== undefined && (
                        <div className="mt-2">
                            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white/60 rounded-full transition-all duration-700"
                                    style={{ width: `${card.percent}%` }}
                                />
                            </div>
                            <p className="text-xs text-white/70 mt-1">{card.percent}%</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
