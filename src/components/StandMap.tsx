'use client';

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { Stand } from '@/types/stand';
import { standPositions, specialAreas, corridors, annotations } from '@/data/mapLayout';
import { standTypeLabels } from '@/utils/standColors';
import StandItem from './StandItem';

interface StandMapProps {
    stands: Stand[];
    onStandClick: (stand: Stand) => void;
    selectedStandId?: string | null;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4;
const SVG_W = 985;
const SVG_H = 930;

export default function StandMap({ stands, onStandClick, selectedStandId }: StandMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgContainerRef = useRef<HTMLDivElement>(null);

    /* ── state ── */
    const [tooltip, setTooltip] = useState<{ x: number; y: number; stand: Stand } | null>(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStartRef = useRef({ x: 0, y: 0 });
    const lastPanRef = useRef({ x: 0, y: 0 });

    // Search
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedStand, setHighlightedStand] = useState<number | null>(null);

    // Touch state
    const lastTouchDistRef = useRef<number | null>(null);
    const lastTouchCenterRef = useRef<{ x: number; y: number } | null>(null);
    const touchStartTimeRef = useRef(0);
    const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

    const getStandByNumero = useCallback(
        (numero: number) => stands.find((s) => s.numero === numero),
        [stands]
    );

    /* ── helpers to get SVG rect ── */
    const getSvgRect = useCallback(() => {
        return svgContainerRef.current?.getBoundingClientRect() ?? null;
    }, []);

    /* ── Clamp pan to keep map in view ── */
    const clampPan = useCallback((px: number, py: number, z: number) => {
        const container = svgContainerRef.current;
        if (!container) return { x: px, y: py };
        const rect = container.getBoundingClientRect();
        const scaledW = rect.width * z;
        const scaledH = rect.height * z;
        const maxPanX = Math.max(0, (scaledW - rect.width) / 2);
        const maxPanY = Math.max(0, (scaledH - rect.height) / 2);
        return {
            x: Math.max(-maxPanX, Math.min(maxPanX, px)),
            y: Math.max(-maxPanY, Math.min(maxPanY, py)),
        };
    }, []);

    /* ── Tooltip handlers ── */
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

    /* ── Zoom helpers ── */
    const zoomAtPoint = useCallback((newZoom: number, clientX: number, clientY: number) => {
        const rect = getSvgRect();
        if (!rect) return;
        const cx = clientX - rect.left - rect.width / 2;
        const cy = clientY - rect.top - rect.height / 2;
        setZoom(prevZoom => {
            const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
            const scale = clamped / prevZoom;
            setPan(prev => {
                const nx = cx - scale * (cx - prev.x);
                const ny = cy - scale * (cy - prev.y);
                return clampPan(nx, ny, clamped);
            });
            return clamped;
        });
    }, [getSvgRect, clampPan]);

    const handleZoomIn = () => {
        const rect = getSvgRect();
        if (rect) {
            zoomAtPoint(zoom + 0.3, rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    };
    const handleZoomOut = () => {
        const rect = getSvgRect();
        if (rect) {
            const newZoom = zoom - 0.3;
            if (newZoom <= 1) {
                setZoom(Math.max(MIN_ZOOM, newZoom));
                setPan({ x: 0, y: 0 });
            } else {
                zoomAtPoint(newZoom, rect.left + rect.width / 2, rect.top + rect.height / 2);
            }
        }
    };
    const handleZoomReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

    /* ── Wheel zoom (attached via useEffect for passive:false) ── */
    useEffect(() => {
        const el = svgContainerRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.12 : 0.12;
            const rect = el.getBoundingClientRect();
            const cx = e.clientX - rect.left - rect.width / 2;
            const cy = e.clientY - rect.top - rect.height / 2;
            setZoom(prev => {
                const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev + delta));
                const scale = newZoom / prev;
                setPan(prevPan => {
                    const nx = cx - scale * (cx - prevPan.x);
                    const ny = cy - scale * (cy - prevPan.y);
                    if (newZoom <= 1) return { x: 0, y: 0 };
                    return { x: nx, y: ny };
                });
                return newZoom;
            });
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, []);

    /* ── Mouse pan ── */
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (zoom > 1) {
            e.preventDefault();
            setIsPanning(true);
            panStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
            lastPanRef.current = { x: pan.x, y: pan.y };
        }
    }, [zoom, pan]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (isPanning) {
            const nx = e.clientX - panStartRef.current.x;
            const ny = e.clientY - panStartRef.current.y;
            const clamped = clampPan(nx, ny, zoom);
            setPan(clamped);
        }
    }, [isPanning, zoom, clampPan]);

    const handleMouseUp = useCallback(() => {
        setIsPanning(false);
    }, []);

    /* ── Touch handlers ── */
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            // Pinch start
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            lastTouchDistRef.current = Math.hypot(dx, dy);
            lastTouchCenterRef.current = {
                x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
                y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
            };
        } else if (e.touches.length === 1) {
            // Single finger drag or tap
            touchStartTimeRef.current = Date.now();
            touchStartPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            if (zoom > 1) {
                setIsPanning(true);
                panStartRef.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y };
            }
        }
    }, [zoom, pan]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.hypot(dx, dy);
            const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
            const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

            if (lastTouchDistRef.current !== null) {
                const scale = dist / lastTouchDistRef.current;
                const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * scale));
                zoomAtPoint(newZoom, centerX, centerY);
            }
            lastTouchDistRef.current = dist;
            lastTouchCenterRef.current = { x: centerX, y: centerY };
        } else if (e.touches.length === 1 && isPanning && zoom > 1) {
            const nx = e.touches[0].clientX - panStartRef.current.x;
            const ny = e.touches[0].clientY - panStartRef.current.y;
            const clamped = clampPan(nx, ny, zoom);
            setPan(clamped);
        }
    }, [zoom, isPanning, zoomAtPoint, clampPan]);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        lastTouchDistRef.current = null;
        lastTouchCenterRef.current = null;
        if (e.touches.length === 0) {
            setIsPanning(false);
            // Detect tap (not drag) for tooltip on mobile
            if (touchStartPosRef.current) {
                const elapsed = Date.now() - touchStartTimeRef.current;
                if (elapsed < 300) {
                    // It was a tap — handled by click on StandItem
                }
            }
        }
    }, []);

    /* ── Search ── */
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase().trim();
        // Search by number
        const num = parseInt(q, 10);
        if (!isNaN(num)) {
            const stand = stands.find(s => s.numero === num);
            return stand ? [stand] : [];
        }
        // Search by company name
        return stands.filter(s =>
            s.empresa?.toLowerCase().includes(q)
        ).slice(0, 5);
    }, [searchQuery, stands]);

    const focusOnStand = useCallback((numero: number) => {
        const pos = standPositions.find(p => p.numero === numero);
        if (!pos) return;
        setHighlightedStand(numero);
        const targetZoom = 2.5;
        setZoom(targetZoom);
        const rect = getSvgRect();
        if (rect) {
            // Center on stand position in SVG coordinates
            const standCenterX = (pos.x + pos.width / 2) / SVG_W;
            const standCenterY = (pos.y + pos.height / 2) / SVG_H;
            const panX = (0.5 - standCenterX) * rect.width * targetZoom;
            const panY = (0.5 - standCenterY) * rect.height * targetZoom;
            setPan(clampPan(panX, panY, targetZoom));
        }
        // Clear highlight after 3 seconds
        setTimeout(() => setHighlightedStand(null), 3000);
    }, [getSvgRect, clampPan]);

    const handleSearchSelect = (stand: Stand) => {
        focusOnStand(stand.numero);
        setSearchQuery('');
    };

    const tipoColors: Record<string, string> = {
        ouro: '#f59e0b',
        prata: '#94a3b8',
        bronze: '#b45309',
        master: '#a855f7',
    };

    /* ── Zoom percentage ── */
    const zoomPercent = Math.round(zoom * 100);

    return (
        <div ref={containerRef} className="relative w-full overflow-hidden bg-gray-950 rounded-2xl border border-gray-700/50 shadow-2xl">
            {/* ═══ TOP BAR: Search + Zoom Controls ═══ */}
            <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between gap-2 px-3 py-2 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/30">
                {/* Search */}
                <div className="relative flex-1 max-w-[220px]">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="🔍 Buscar stand..."
                        className="w-full bg-gray-800/90 border border-gray-600/50 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    {/* Search dropdown */}
                    {searchQuery.trim() && searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600/50 rounded-lg shadow-2xl overflow-hidden z-50">
                            {searchResults.map(s => (
                                <button
                                    key={s.id}
                                    onClick={() => handleSearchSelect(s)}
                                    className="w-full text-left px-3 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors flex items-center gap-2"
                                >
                                    <span className="font-bold text-white">#{String(s.numero).padStart(2, '0')}</span>
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-gray-600/50 capitalize">{s.tipo}</span>
                                    {s.empresa && <span className="text-gray-400 text-xs truncate">{s.empresa}</span>}
                                </button>
                            ))}
                        </div>
                    )}
                    {searchQuery.trim() && searchResults.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600/50 rounded-lg shadow-2xl px-3 py-2 z-50">
                            <p className="text-gray-500 text-xs">Nenhum stand encontrado</p>
                        </div>
                    )}
                </div>

                {/* Zoom controls */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleZoomOut}
                        className="w-8 h-8 rounded-lg bg-gray-800/90 hover:bg-gray-700 text-white flex items-center justify-center text-base font-bold border border-gray-600/50 transition-all active:scale-95"
                        title="Diminuir zoom"
                    >
                        −
                    </button>

                    {/* Zoom bar */}
                    <div className="hidden sm:flex items-center gap-1.5 px-1">
                        <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden relative">
                            <div
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-200"
                                style={{ width: `${((zoom - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100}%` }}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleZoomReset}
                        className="h-8 px-2 rounded-lg bg-gray-800/90 hover:bg-gray-700 text-white flex items-center justify-center text-xs font-bold border border-gray-600/50 transition-all active:scale-95 min-w-[44px]"
                        title="Resetar zoom"
                    >
                        {zoomPercent}%
                    </button>

                    <button
                        onClick={handleZoomIn}
                        className="w-8 h-8 rounded-lg bg-gray-800/90 hover:bg-gray-700 text-white flex items-center justify-center text-base font-bold border border-gray-600/50 transition-all active:scale-95"
                        title="Aumentar zoom"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* ═══ Map container ═══ */}
            <div
                ref={svgContainerRef}
                className="w-full overflow-hidden pt-11"
                style={{
                    cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'default',
                    touchAction: 'none',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <svg
                    viewBox={`0 0 ${SVG_W} ${SVG_H}`}
                    className="w-full h-auto"
                    style={{
                        maxHeight: '76vh',
                        transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                        transformOrigin: 'center center',
                        transition: isPanning ? 'none' : 'transform 0.25s ease-out',
                        willChange: 'transform',
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
                        {/* Highlight glow filter */}
                        <filter id="highlight-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feFlood floodColor="#3b82f6" floodOpacity="0.6" result="color" />
                            <feComposite in="color" in2="blur" operator="in" result="glow" />
                            <feMerge>
                                <feMergeNode in="glow" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* ═══ BACKGROUND ═══ */}
                    <rect x="0" y="0" width={SVG_W} height={SVG_H} fill="url(#bg-gradient)" rx="12" />
                    <rect width={SVG_W} height={SVG_H} fill="url(#grid)" rx="12" />

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
                                filter={highlightedStand === pos.numero ? 'url(#highlight-glow)' : undefined}
                            >
                                <StandItem
                                    position={pos}
                                    stand={stand}
                                    onClick={onStandClick}
                                    isSelected={stand?.id === selectedStandId}
                                    isHighlighted={highlightedStand === pos.numero}
                                />
                            </g>
                        );
                    })}

                    {/* ═══ BORDA ═══ */}
                    <rect x="1" y="1" width={SVG_W - 2} height={SVG_H - 2} fill="none" stroke="#334155" strokeWidth="1.5" rx="12" opacity="0.5" />
                </svg>
            </div>

            {/* ═══ TOOLTIP ═══ */}
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

            {/* ═══ Mobile hint (shown only on small screens at zoom 1) ═══ */}
            {zoom <= 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 sm:hidden z-10">
                    <p className="text-[10px] text-gray-500 bg-gray-900/80 px-3 py-1 rounded-full backdrop-blur-sm border border-gray-700/30">
                        Pinch para zoom • Toque para ver detalhes
                    </p>
                </div>
            )}
        </div>
    );
}
