'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Stand } from '@/types/stand';
import { standPositions, specialAreas, corridors, annotations } from '@/data/mapLayout';
import { standTypeLabels } from '@/utils/standColors';
import StandItem from './StandItem';

interface StandMapProps {
    stands: Stand[];
    onStandClick: (stand: Stand) => void;
    selectedStandId?: string | null;
}

export default function StandMap({ stands, onStandClick, selectedStandId }: StandMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<{ x: number; y: number; stand: Stand } | null>(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });

    const getStandByNumero = useCallback(
        (numero: number) => stands.find((s) => s.numero === numero),
        [stands]
    );

    const handleMouseEnter = useCallback(
        (e: React.MouseEvent, stand: Stand) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                setTooltip({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top - 10,
                    stand,
                });
            }
        },
        []
    );

    const handleMouseLeave = useCallback(() => {
        setTooltip(null);
    }, []);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
    const handleZoomOut = () => {
        setZoom(prev => {
            const newZoom = Math.max(prev - 0.25, 0.5);
            if (newZoom <= 1) setPan({ x: 0, y: 0 });
            return newZoom;
        });
    };
    const handleZoomReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(prev => {
            const newZoom = Math.max(0.5, Math.min(3, prev + delta));
            if (newZoom <= 1) setPan({ x: 0, y: 0 });
            return newZoom;
        });
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (zoom > 1) {
            setIsPanning(true);
            setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
        }
    }, [zoom, pan]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isPanning) {
            setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
        }
    }, [isPanning, panStart]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);

    const tipoColors: Record<string, string> = {
        ouro: '#f59e0b',
        prata: '#94a3b8',
        bronze: '#b45309',
        master: '#a855f7',
    };

    return (
        <div ref={containerRef} className="relative w-full overflow-hidden bg-gray-950 rounded-2xl border border-gray-700/50 shadow-2xl">
            {/* Zoom controls */}
            <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5">
                <button
                    onClick={handleZoomIn}
                    className="w-9 h-9 rounded-lg bg-gray-800/90 hover:bg-gray-700 text-white flex items-center justify-center text-lg font-bold border border-gray-600/50 transition-all shadow-lg backdrop-blur-sm"
                    title="Zoom in"
                >
                    +
                </button>
                <button
                    onClick={handleZoomReset}
                    className="w-9 h-9 rounded-lg bg-gray-800/90 hover:bg-gray-700 text-white flex items-center justify-center text-xs font-bold border border-gray-600/50 transition-all shadow-lg backdrop-blur-sm"
                    title="Reset zoom"
                >
                    {Math.round(zoom * 100)}%
                </button>
                <button
                    onClick={handleZoomOut}
                    className="w-9 h-9 rounded-lg bg-gray-800/90 hover:bg-gray-700 text-white flex items-center justify-center text-lg font-bold border border-gray-600/50 transition-all shadow-lg backdrop-blur-sm"
                    title="Zoom out"
                >
                    −
                </button>
            </div>

            {/* Map container with zoom & pan */}
            <div
                className="w-full overflow-auto"
                style={{ cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                <svg
                    viewBox="0 0 985 930"
                    className="w-full h-auto"
                    style={{
                        maxHeight: '78vh',
                        transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                        transformOrigin: 'center center',
                        transition: isPanning ? 'none' : 'transform 0.2s ease-out',
                    }}
                >
                    {/* ═══ DEFS ═══ */}
                    <defs>
                        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0c1222" />
                            <stop offset="50%" stopColor="#111827" />
                            <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>
                        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#1e293b" strokeWidth="0.3" opacity="0.4" />
                        </pattern>
                    </defs>

                    {/* ═══ BACKGROUND ═══ */}
                    <rect x="0" y="0" width="985" height="930" fill="url(#bg-gradient)" rx="12" />
                    <rect width="985" height="930" fill="url(#grid)" rx="12" />

                    {/* ═══ CORREDORES ═══ */}
                    {corridors.map((c, i) => (
                        <rect
                            key={`corridor-${i}`}
                            x={c.x} y={c.y}
                            width={c.width} height={c.height}
                            rx={4}
                            fill="#1d4ed8"
                            opacity={0.18}
                        />
                    ))}

                    {/* ═══ PÓRTICO DE ENTRADA ═══ */}
                    <rect x="0" y="22" width="10" height="800" fill="#2563eb" opacity="0.35" rx="2" />
                    <rect x="0" y="22" width="3" height="800" fill="#3b82f6" opacity="0.6" rx="1" />

                    {/* ═══ ÁREAS ESPECIAIS ═══ */}
                    {specialAreas.map((area) => (
                        <g key={area.id}>
                            <rect
                                x={area.x} y={area.y}
                                width={area.width} height={area.height}
                                rx={area.borderRadius ?? 6}
                                fill={area.color}
                                opacity={0.15}
                                stroke={area.color}
                                strokeWidth={1.5}
                                strokeOpacity={0.4}
                                strokeDasharray={area.id === 'expo' || area.id === 'praca' ? '6 3' : 'none'}
                            />
                            {area.label.split('\n').map((line, li) => (
                                <text
                                    key={`${area.id}-line-${li}`}
                                    x={area.x + area.width / 2}
                                    y={area.y + area.height / 2 + li * 14 - ((area.label.split('\n').length - 1) * 7)}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill={area.textColor || area.color}
                                    fontSize={area.fontSize || 10}
                                    fontWeight="bold"
                                    opacity={0.7}
                                    className="select-none pointer-events-none"
                                    letterSpacing="0.5"
                                >
                                    {line}
                                </text>
                            ))}
                        </g>
                    ))}

                    {/* ═══ ANOTAÇÕES ═══ */}
                    {annotations.map((a, i) => (
                        <text
                            key={`annotation-${i}`}
                            x={a.x} y={a.y}
                            textAnchor="middle"
                            dominantBaseline="central"
                            fill={a.color || '#94a3b8'}
                            fontSize={a.fontSize || 9}
                            fontWeight={a.type === 'entrance' ? 'bold' : 'normal'}
                            opacity={a.type === 'entrance' ? 0.7 : 0.6}
                            transform={a.rotation ? `rotate(${a.rotation}, ${a.x}, ${a.y})` : undefined}
                            className="select-none pointer-events-none"
                            letterSpacing={a.type === 'entrance' ? '2' : '0.5'}
                        >
                            {a.label}
                        </text>
                    ))}

                    {/* ═══ STANDS ═══ */}
                    {standPositions.map((pos) => {
                        const stand = getStandByNumero(pos.numero);
                        return (
                            <g
                                key={pos.numero}
                                onMouseEnter={(e) => stand && handleMouseEnter(e, stand)}
                                onMouseLeave={handleMouseLeave}
                            >
                                <StandItem
                                    position={pos}
                                    stand={stand}
                                    onClick={onStandClick}
                                    isSelected={stand?.id === selectedStandId}
                                />
                            </g>
                        );
                    })}

                    {/* ═══ BORDA ═══ */}
                    <rect x="1" y="1" width="983" height="928" fill="none" stroke="#334155" strokeWidth="1.5" rx="12" opacity="0.5" />
                </svg>
            </div>

            {/* ═══ TOOLTIP com tipo ═══ */}
            {tooltip && (
                <div
                    className="absolute z-40 pointer-events-none bg-gray-900/95 border border-gray-600 rounded-xl px-3 py-2 shadow-2xl backdrop-blur-sm"
                    style={{
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: 'translate(-50%, -100%)',
                    }}
                >
                    <p className="text-white font-bold text-sm">
                        Stand {String(tooltip.stand.numero).padStart(2, '0')}
                    </p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: tipoColors[tooltip.stand.tipo] || '#94a3b8' }}>
                        {standTypeLabels[tooltip.stand.tipo] || tooltip.stand.tipo}
                    </p>
                    {tooltip.stand.empresa && (
                        <p className="text-gray-300 text-xs">{tooltip.stand.empresa}</p>
                    )}
                    <p className="text-gray-400 text-xs capitalize">{tooltip.stand.status}</p>
                </div>
            )}
        </div>
    );
}
