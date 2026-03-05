'use client';

import React from 'react';
import { Stand } from '@/types/stand';
import { standTypeColors, standTypeBorderColors, standStatusColors, standTypeLabels, standStatusLabels } from '@/utils/standColors';
import { StandPosition } from '@/data/mapLayout';

interface StandItemProps {
    position: StandPosition;
    stand: Stand | undefined;
    onClick: (stand: Stand) => void;
    isSelected?: boolean;
    isHighlighted?: boolean;
}

export default function StandItem({ position, stand, onClick, isSelected, isHighlighted }: StandItemProps) {
    const status = stand?.status || 'disponivel';
    const tipo = stand?.tipo || position.tipo;
    const empresa = stand?.empresa;

    // Cor principal = TIPO do stand (como no mapa original)
    const fillColor = standTypeColors[tipo] || '#64748b';
    const borderColor = standTypeBorderColors[tipo] || '#475569';
    const statusColor = standStatusColors[status];

    // Texto escuro para ouro e bronze, branco para master e prata
    const textColor = (tipo === 'ouro' || tipo === 'bronze') ? '#1e293b' : '#ffffff';
    const subTextColor = (tipo === 'ouro' || tipo === 'bronze') ? '#374151' : '#e2e8f0';

    return (
        <g
            className="cursor-pointer"
            onClick={() => stand && onClick(stand)}
            role="button"
            tabIndex={0}
            aria-label={`Stand ${position.numero} - ${standTypeLabels[tipo]} - ${standStatusLabels[status]}${empresa ? ` - ${empresa}` : ''}`}
        >
            {/* Tipo border glow */}
            <rect
                x={position.x - 2}
                y={position.y - 2}
                width={position.width + 4}
                height={position.height + 4}
                rx={5}
                fill="none"
                stroke={borderColor}
                strokeWidth={isSelected ? 3 : 2}
                opacity={isSelected ? 1 : 0.7}
            />

            {/* Stand fill (TIPO color) */}
            <rect
                id={`stand-${String(position.numero).padStart(2, '0')}`}
                x={position.x}
                y={position.y}
                width={position.width}
                height={position.height}
                rx={3}
                fill={fillColor}
                opacity={0.92}
                className="hover:opacity-100 transition-opacity duration-150"
            />

            {/* Stand number (large, bold) */}
            <text
                x={position.x + position.width / 2}
                y={position.y + position.height / 2 - 6}
                textAnchor="middle"
                dominantBaseline="central"
                fill={textColor}
                fontSize={14}
                fontWeight="900"
                className="pointer-events-none select-none"
            >
                {String(position.numero).padStart(2, '0')}
            </text>

            {/* Tipo label */}
            <text
                x={position.x + position.width / 2}
                y={position.y + position.height / 2 + 9}
                textAnchor="middle"
                dominantBaseline="central"
                fill={subTextColor}
                fontSize={7}
                fontWeight="700"
                className="pointer-events-none select-none"
                letterSpacing="0.3"
            >
                {tipo === 'ouro' ? 'OURO' : tipo === 'prata' ? 'PRATA' : tipo === 'bronze' ? 'BRONZE' : tipo === 'master' ? 'MASTER' : ''}
            </text>

            {/* Company name */}
            {empresa && (
                <text
                    x={position.x + position.width / 2}
                    y={position.y + position.height / 2 + 19}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={subTextColor}
                    fontSize={6}
                    opacity={0.8}
                    className="pointer-events-none select-none"
                >
                    {empresa.length > 8 ? empresa.substring(0, 7) + '…' : empresa}
                </text>
            )}

            {/* Status indicator (colored dot in top-right corner) */}
            <circle
                cx={position.x + position.width - 6}
                cy={position.y + 6}
                r={4}
                fill={statusColor}
                stroke={borderColor}
                strokeWidth={1}
                opacity={0.95}
            />

            {/* Hover overlay */}
            <rect
                x={position.x}
                y={position.y}
                width={position.width}
                height={position.height}
                rx={3}
                fill="white"
                opacity={0}
                className="hover:opacity-[0.12] transition-opacity duration-150"
            />

            {/* Selection pulse */}
            {isSelected && (
                <rect
                    x={position.x - 3}
                    y={position.y - 3}
                    width={position.width + 6}
                    height={position.height + 6}
                    rx={6}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth={2}
                    opacity={0.8}
                >
                    <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1.5s" repeatCount="indefinite" />
                </rect>
            )}

            {/* Search highlight pulse */}
            {isHighlighted && !isSelected && (
                <rect
                    x={position.x - 5}
                    y={position.y - 5}
                    width={position.width + 10}
                    height={position.height + 10}
                    rx={8}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    opacity={0.9}
                >
                    <animate attributeName="opacity" values="1;0.3;1" dur="0.8s" repeatCount="indefinite" />
                    <animate attributeName="strokeWidth" values="3;5;3" dur="0.8s" repeatCount="indefinite" />
                </rect>
            )}
        </g>
    );
}
