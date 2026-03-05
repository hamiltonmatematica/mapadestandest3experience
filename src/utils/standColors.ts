import { StandStatus, StandType } from '@/types/stand';

// ═══════════════════════════════════════════
// CORES POR TIPO (core visual identity)
// Baseado na legenda do mapa T3 Experience
// ═══════════════════════════════════════════
export const standTypeColors: Record<StandType, string> = {
    ouro: '#f9bf1b',     // amarelo dourado
    prata: '#36b5b0',    // teal/cyan
    bronze: '#b8b0d4',   // lavanda/lilás
    master: '#d14d8f',   // rosa/magenta
    bar: '#0e7490',
    palco: '#1e293b',
    area: '#059669',
};

// ═══════════════════════════════════════════
// CORES DE STATUS (indicador de ocupação)
// ═══════════════════════════════════════════
export const standStatusColors: Record<StandStatus, string> = {
    disponivel: '#22c55e',
    reservado: '#eab308',
    vendido: '#ef4444',
};

export const standStatusLabels: Record<StandStatus, string> = {
    disponivel: 'Disponível',
    reservado: 'Reservado',
    vendido: 'Vendido',
};

export const standTypeLabels: Record<StandType, string> = {
    ouro: 'Stand Ouro',
    prata: 'Stand Prata',
    bronze: 'Stand Bronze',
    master: 'Stand Master',
    bar: 'Bar',
    palco: 'Palco',
    area: 'Área',
};

// Cor da borda/glow por tipo
export const standTypeBorderColors: Record<StandType, string> = {
    ouro: '#d4960e',
    prata: '#2a8a86',
    bronze: '#8a82a8',
    master: '#a83c70',
    bar: '#0e7490',
    palco: '#1e293b',
    area: '#059669',
};
