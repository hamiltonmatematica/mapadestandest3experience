import { Stand, StandType } from '@/types/stand';

export interface StandPosition {
    numero: number;
    tipo: StandType;
    x: number;
    y: number;
    width: number;
    height: number;
}

// ============================================
// LAYOUT PRECISO 42 Stands - Formato U
// ============================================

const SW = 66; // stand width
const SH = 60; // stand height
const START_X = 180;
const START_Y = 60;
const GAP = 2; // small gap for visual styling

export const standPositions: StandPosition[] = [];

// 1. Top Wing (1 to 7)
for (let i = 1; i <= 7; i++) {
    standPositions.push({
        numero: i,
        tipo: 'ouro',
        x: START_X + i * SW + GAP,
        y: START_Y + GAP,
        width: SW - 2 * GAP,
        height: SH - 2 * GAP,
    });
}

// 2. Right Wing (8 to 19)
for (let i = 8; i <= 19; i++) {
    standPositions.push({
        numero: i,
        tipo: 'ouro',
        x: START_X + 9.5 * SW + GAP, // Shifted outwards by 1.5 modules
        y: START_Y + (i - 7) * SH + GAP,
        width: SW - 2 * GAP,
        height: SH - 2 * GAP,
    });
}

// 3. Left Wing (30 down to 20)
// This loop pushes 20 to 30 into the array, positioning 30 at the top and 20 at the bottom.
for (let i = 20; i <= 30; i++) {
    standPositions.push({
        numero: i,
        tipo: 'ouro',
        x: START_X - 1.5 * SW + GAP, // Shifted outwards by 1.5 modules
        y: START_Y + (30 - i + 1) * SH + GAP,
        width: SW - 2 * GAP,
        height: SH - 2 * GAP,
    });
}

// 4. Center Island (31 to 42)
// Left column: 31, 33, 35, 37, 39, 41
// Right column: 32, 34, 36, 38, 40, 42
for (let i = 31; i <= 42; i++) {
    const isRight = i % 2 === 0;
    const rowIndex = Math.floor((i - 31) / 2);

    standPositions.push({
        numero: i,
        tipo: 'master',
        x: START_X + (3.5 + (isRight ? 1 : 0)) * SW + GAP,
        y: START_Y + (2.5 + rowIndex) * SH + GAP,
        width: SW - 2 * GAP,
        height: SH - 2 * GAP,
    });
}

// ============================================
// ÁREAS ESPECIAIS
// ============================================
export interface SpecialArea {
    id: string;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    textColor?: string;
    fontSize?: number;
    borderRadius?: number;
}

export const specialAreas: SpecialArea[] = [
    {
        id: 'lounge',
        label: 'LOUNGE',
        x: START_X + 3.5 * SW + GAP,
        y: START_Y + 8.5 * SH + GAP + 10,
        width: 2 * SW - 2 * GAP,
        height: 2.5 * SH - 2 * GAP,
        color: '#4f46e5',
        textColor: '#c7d2fe',
        fontSize: 14,
        borderRadius: 6,
    },
    {
        id: 'palco',
        label: 'PALCO',
        x: START_X + 2.75 * SW + GAP,  // Centered nicely around the Lounge
        y: START_Y + 11.5 * SH + GAP,  // Moved directly below the Lounge
        width: 3.5 * SW - 2 * GAP,
        height: 2.5 * SH - 2 * GAP,
        color: '#1e293b',
        textColor: '#e2e8f0',
        fontSize: 18,
        borderRadius: 6,
    }
];

// ============================================
// CORREDORES 
// ============================================
export interface Corridor {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const corridors: Corridor[] = [];

// ============================================
// ANOTAÇÕES
// ============================================
export interface MapAnnotation {
    type: 'text' | 'arrow' | 'entrance';
    label: string;
    x: number;
    y: number;
    rotation?: number;
    fontSize?: number;
    color?: string;
}

export const annotations: MapAnnotation[] = [
    { 
        type: 'entrance', 
        label: 'ENTRADA DE TODO O EVENTO', 
        x: START_X - 1.5 * SW + 40, // Keeping aligned with the new Left Wing x-position 
        y: START_Y + 12.5 * SH - 10, 
        rotation: 0, 
        fontSize: 11, 
        color: '#60a5fa' 
    },
    { 
        type: 'arrow', 
        label: '→', 
        x: START_X - 1.5 * SW + 160, 
        y: START_Y + 12.5 * SH - 10, 
        fontSize: 16, 
        color: '#ffffff' 
    },
    { 
        type: 'text', 
        label: 'SAÍDA', 
        x: START_X - 1.5 * SW + 210, 
        y: START_Y + 12.5 * SH - 10, 
        fontSize: 11, 
        color: '#ef4444' 
    }
];

// ============================================
// MOCK DATA GENERATOR
// ============================================
export function generateMockStands(): Stand[] {
    const statuses: Stand['status'][] = ['disponivel', 'reservado', 'vendido'];
    const empresas = [
        'Tech Solutions', 'Digital Wave', 'InnovateTech', 'Smart Systems',
        'DataFlow', 'CloudPeak', 'NetBridge', 'CodeForge',
        'CyberCore', 'PixelHub', 'LogiTech Pro', 'MegaByte',
    ];

    return standPositions.map((pos, i) => {
        const randomStatus = statuses[Math.floor(Math.random() * 3)];
        return {
            id: `stand-${pos.numero}`,
            numero: pos.numero,
            status: randomStatus,
            empresa: randomStatus === 'vendido' ? empresas[i % empresas.length] :
                randomStatus === 'reservado' ? empresas[(i + 5) % empresas.length] : null,
            tipo: pos.tipo,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
    });
}
