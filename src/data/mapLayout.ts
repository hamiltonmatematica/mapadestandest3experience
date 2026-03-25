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
// LAYOUT PRECISO baseado no mapa T3 Experience
// ViewBox: 0 0 1100 950
// ============================================

const SW = 52;  // stand width
const SH = 54;  // stand height
const VS = 4;   // vertical spacing between stands

// Vertical column Y positions helper (10 stands)
const colY = (i: number, startY: number) => startY + i * (SH + VS);
// Vertical column Y positions helper (12 stands, tighter)
const colY12 = (i: number, startY: number) => startY + i * (SH + 2);

export const standPositions: StandPosition[] = [

    // ═══════════════════════════════════════════
    // FILEIRA SUPERIOR (01–10) — Ouro
    // Horizontal, topo do mapa
    // ═══════════════════════════════════════════
    { numero: 1, tipo: 'ouro', x: 62, y: 28, width: SW, height: 50 },
    { numero: 2, tipo: 'ouro', x: 118, y: 28, width: SW, height: 50 },
    { numero: 3, tipo: 'ouro', x: 174, y: 28, width: SW, height: 50 },
    { numero: 4, tipo: 'ouro', x: 230, y: 28, width: SW, height: 50 },
    { numero: 5, tipo: 'ouro', x: 286, y: 28, width: SW, height: 50 },
    { numero: 6, tipo: 'ouro', x: 342, y: 28, width: SW, height: 50 },
    { numero: 7, tipo: 'ouro', x: 398, y: 28, width: SW, height: 50 },
    { numero: 8, tipo: 'ouro', x: 454, y: 28, width: SW, height: 50 },
    { numero: 9, tipo: 'ouro', x: 510, y: 28, width: SW, height: 50 },
    { numero: 10, tipo: 'ouro', x: 566, y: 28, width: SW, height: 50 },

    // ═══════════════════════════════════════════
    // FILEIRA SUPERIOR DIREITA (11–14) — Prata
    // Após o corredor vertical
    // ═══════════════════════════════════════════
    { numero: 11, tipo: 'ouro', x: 668, y: 28, width: SW, height: 50 },
    { numero: 12, tipo: 'ouro', x: 724, y: 28, width: SW, height: 50 },
    { numero: 13, tipo: 'bronze', x: 790, y: 28, width: SW, height: 50 },
    { numero: 14, tipo: 'bronze', x: 846, y: 28, width: SW, height: 50 },

    // ═══════════════════════════════════════════
    // COLUNA DIREITA EXTREMA (15–25) — Bronze
    // Lado direito do mapa, vertical
    // ═══════════════════════════════════════════
    { numero: 15, tipo: 'bronze', x: 920, y: colY(0, 104), width: 48, height: SH },
    { numero: 16, tipo: 'bronze', x: 920, y: colY(1, 104), width: 48, height: SH },


    // ═══════════════════════════════════════════
    // CANTO INFERIOR DIREITO (26–31)
    // Formato "L": 28-27-26 horizontal, 29 abaixo de 28, 30 abaixo de 29
    // ═══════════════════════════════════════════


    // ═══════════════════════════════════════════
    // STAND 32 (canto inferior esquerdo)
    // ═══════════════════════════════════════════
    { numero: 32, tipo: 'prata', x: 62, y: 828, width: SW, height: 50 },

    // ═══════════════════════════════════════════
    // COLUNA ESQUERDA (33–44) — Prata / Ouro
    // Lateral esquerda, de baixo para cima
    // ═══════════════════════════════════════════


    // ═══════════════════════════════════════════
    // 2ª COLUNA ESQUERDA (45–54) — Prata
    // De cima para baixo
    // ═══════════════════════════════════════════
    { numero: 45, tipo: 'ouro', x: 118, y: colY(0, 128), width: SW, height: SH },
    { numero: 46, tipo: 'prata', x: 118, y: colY(1, 128), width: SW, height: SH },
    { numero: 47, tipo: 'prata', x: 118, y: colY(2, 128), width: SW, height: SH },
    { numero: 48, tipo: 'prata', x: 118, y: colY(3, 128), width: SW, height: SH },
    { numero: 49, tipo: 'prata', x: 118, y: colY(4, 128), width: SW, height: SH },
    { numero: 50, tipo: 'prata', x: 118, y: colY(5, 128), width: SW, height: SH },
    { numero: 51, tipo: 'prata', x: 118, y: colY(6, 128), width: SW, height: SH },
    { numero: 52, tipo: 'prata', x: 118, y: colY(7, 128), width: SW, height: SH },
    { numero: 53, tipo: 'prata', x: 118, y: colY(8, 128), width: SW, height: SH },
    { numero: 54, tipo: 'prata', x: 118, y: colY(9, 128), width: SW, height: SH },

    // ═══════════════════════════════════════════
    // 3ª COLUNA ESQUERDA (55–64) — Ouro
    // Faces oposta à 2ª coluna, de cima (64) p/ baixo (55)
    // ═══════════════════════════════════════════
    { numero: 64, tipo: 'ouro', x: 174, y: colY(0, 128), width: SW, height: SH },
    { numero: 63, tipo: 'ouro', x: 174, y: colY(1, 128), width: SW, height: SH },
    { numero: 62, tipo: 'ouro', x: 174, y: colY(2, 128), width: SW, height: SH },
    { numero: 61, tipo: 'ouro', x: 174, y: colY(3, 128), width: SW, height: SH },
    { numero: 60, tipo: 'ouro', x: 174, y: colY(4, 128), width: SW, height: SH },
    { numero: 59, tipo: 'ouro', x: 174, y: colY(5, 128), width: SW, height: SH },
    { numero: 58, tipo: 'ouro', x: 174, y: colY(6, 128), width: SW, height: SH },
    { numero: 57, tipo: 'ouro', x: 174, y: colY(7, 128), width: SW, height: SH },
    { numero: 56, tipo: 'ouro', x: 174, y: colY(8, 128), width: SW, height: SH },
    { numero: 55, tipo: 'ouro', x: 174, y: colY(9, 128), width: SW, height: SH },

    // ═══════════════════════════════════════════
    // COLUNA CENTRO-ESQUERDA (65–74) — Ouro
    // De cima para baixo
    // ═══════════════════════════════════════════
    { numero: 65, tipo: 'ouro', x: 478, y: colY(0, 128), width: SW, height: SH },
    { numero: 66, tipo: 'ouro', x: 478, y: colY(1, 128), width: SW, height: SH },
    { numero: 67, tipo: 'ouro', x: 478, y: colY(2, 128), width: SW, height: SH },
    { numero: 68, tipo: 'ouro', x: 478, y: colY(3, 128), width: SW, height: SH },
    { numero: 69, tipo: 'ouro', x: 478, y: colY(4, 128), width: SW, height: SH },
    { numero: 70, tipo: 'ouro', x: 478, y: colY(5, 128), width: SW, height: SH },
    { numero: 71, tipo: 'ouro', x: 478, y: colY(6, 128), width: SW, height: SH },
    { numero: 72, tipo: 'ouro', x: 478, y: colY(7, 128), width: SW, height: SH },
    { numero: 73, tipo: 'ouro', x: 478, y: colY(8, 128), width: SW, height: SH },
    { numero: 74, tipo: 'ouro', x: 478, y: colY(9, 128), width: SW, height: SH },

    // ═══════════════════════════════════════════
    // COLUNA CENTRO-DIREITA (75–84) — Master
    // De cima (84) para baixo (75)
    // ═══════════════════════════════════════════
    { numero: 84, tipo: 'ouro', x: 534, y: colY(0, 128), width: SW, height: SH },
    { numero: 83, tipo: 'master', x: 534, y: colY(1, 128), width: SW, height: SH },
    { numero: 82, tipo: 'master', x: 534, y: colY(2, 128), width: SW, height: SH },
    { numero: 81, tipo: 'master', x: 534, y: colY(3, 128), width: SW, height: SH },
    { numero: 80, tipo: 'master', x: 534, y: colY(4, 128), width: SW, height: SH },
    { numero: 79, tipo: 'master', x: 534, y: colY(5, 128), width: SW, height: SH },
    { numero: 78, tipo: 'master', x: 534, y: colY(6, 128), width: SW, height: SH },
    { numero: 77, tipo: 'master', x: 534, y: colY(7, 128), width: SW, height: SH },
    { numero: 76, tipo: 'master', x: 534, y: colY(8, 128), width: SW, height: SH },
    { numero: 75, tipo: 'master', x: 534, y: colY(9, 128), width: SW, height: SH },

    // ═══════════════════════════════════════════
    // COLUNA INTERNA DIREITA (85–92) — Master
    // De cima para baixo (somente 8 stands)
    // ═══════════════════════════════════════════
    { numero: 85, tipo: 'master', x: 690, y: colY(0, 128), width: SW, height: SH },
    { numero: 86, tipo: 'master', x: 690, y: colY(1, 128), width: SW, height: SH },
    { numero: 87, tipo: 'master', x: 690, y: colY(2, 128), width: SW, height: SH },
    { numero: 88, tipo: 'master', x: 690, y: colY(3, 128), width: SW, height: SH },
    { numero: 89, tipo: 'master', x: 690, y: colY(4, 128), width: SW, height: SH },
    { numero: 90, tipo: 'master', x: 690, y: colY(5, 128), width: SW, height: SH },
    { numero: 91, tipo: 'master', x: 690, y: colY(6, 128), width: SW, height: SH },
    { numero: 92, tipo: 'master', x: 690, y: colY(7, 128), width: SW, height: SH },

    // ═══════════════════════════════════════════
    // 2ª COLUNA INTERNA DIREITA (93–100) — Prata
    // Encostada na coluna 85-92 (sem corredor)
    // De cima (100) para baixo (93)
    // ═══════════════════════════════════════════
    { numero: 100, tipo: 'prata', x: 746, y: colY(0, 128), width: SW, height: SH },
    { numero: 99, tipo: 'bronze', x: 746, y: colY(1, 128), width: SW, height: SH },
    { numero: 98, tipo: 'bronze', x: 746, y: colY(2, 128), width: SW, height: SH },
    { numero: 97, tipo: 'bronze', x: 746, y: colY(3, 128), width: SW, height: SH },
    { numero: 96, tipo: 'bronze', x: 746, y: colY(4, 128), width: SW, height: SH },
    { numero: 95, tipo: 'bronze', x: 746, y: colY(5, 128), width: SW, height: SH },
    { numero: 94, tipo: 'bronze', x: 746, y: colY(6, 128), width: SW, height: SH },
    { numero: 93, tipo: 'bronze', x: 746, y: colY(7, 128), width: SW, height: SH },
];

// ═══════════════════════════════════════════
// ÁREAS ESPECIAIS
// ═══════════════════════════════════════════
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
    // PALCO — centro inferior
    {
        id: 'palco',
        label: 'PALCO',
        x: 280, y: 828,
        width: 210, height: 65,
        color: '#1e293b',
        textColor: '#e2e8f0',
        fontSize: 18,
        borderRadius: 6,
    },
    // BAR 01
    {
        id: 'bar01',
        label: 'BAR 01',
        x: 120, y: 833,
        width: 72, height: 48,
        color: '#0e7490',
        textColor: '#e0f2fe',
        fontSize: 9,
        borderRadius: 4,
    },
    // BAR 02
    {
        id: 'bar02',
        label: 'BAR 02',
        x: 198, y: 833,
        width: 72, height: 48,
        color: '#0e7490',
        textColor: '#e0f2fe',
        fontSize: 9,
        borderRadius: 4,
    },
    // BAR 03
    {
        id: 'bar03',
        label: 'BAR 03',
        x: 500, y: 833,
        width: 72, height: 48,
        color: '#0e7490',
        textColor: '#e0f2fe',
        fontSize: 9,
        borderRadius: 4,
    },
    // BAR 04
    {
        id: 'bar04',
        label: 'BAR 04',
        x: 578, y: 833,
        width: 72, height: 48,
        color: '#0e7490',
        textColor: '#e0f2fe',
        fontSize: 9,
        borderRadius: 4,
    },
    // PRAÇA DE ALIMENTAÇÃO — centro-baixo entre colunas
    {
        id: 'praca',
        label: 'PRAÇA DE\nALIMENTAÇÃO',
        x: 296, y: 555,
        width: 155, height: 165,
        color: '#059669',
        textColor: '#a7f3d0',
        fontSize: 10,
        borderRadius: 80,
    },
    // Lounge T3 Hub — centro-topo
    {
        id: 'expo',
        label: 'Lounge T3 Hub',
        x: 296, y: 168,
        width: 155, height: 180,
        color: '#4f46e5',
        textColor: '#c7d2fe',
        fontSize: 10,
        borderRadius: 6,
    },
];

// ═══════════════════════════════════════════
// CORREDORES (paths azuis do mapa original)
// ═══════════════════════════════════════════
export interface Corridor {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const corridors: Corridor[] = [
    // Corredor horizontal superior
    { x: 10, y: 82, width: 960, height: 18 },
    // Corredor horizontal inferior (antes do palco)
    { x: 10, y: 808, width: 960, height: 16 },

    // Corredor vertical — entre coluna esquerda (33-44) e 2ª coluna (45-54)
    { x: 70, y: 98, width: 42, height: 726 },
    // Corredor vertical — após colunas 45-54 / 64-55, antes da área central
    { x: 230, y: 98, width: 18, height: 640 },

    // Corredor vertical — antes da coluna centro-esquerda (65-74)
    { x: 456, y: 98, width: 18, height: 640 },
    // Corredor vertical — após colunas centro (65-84)
    { x: 590, y: 98, width: 50, height: 640 },

    // Corredor vertical — entre colunas internas direitas (85-100) e coluna extrema (15-25)
    { x: 804, y: 98, width: 110, height: 640 },

    // Corredor horizontal meio (entre exposição e praça)
    { x: 292, y: 360, width: 164, height: 14 },
];

// ═══════════════════════════════════════════
// SETAS de fluxo e detalhes adicionais
// ═══════════════════════════════════════════
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
    // PÓRTICO DE ENTRADA
    { type: 'entrance', label: 'PÓRTICO DE ENTRADA', x: 7, y: 450, rotation: -90, fontSize: 11, color: '#60a5fa' },

    // SAÍDAS DE EMERGÊNCIA
    { type: 'text', label: '⚡ SAÍDA DE EMERGÊNCIA', x: 165, y: 905, fontSize: 8, color: '#fbbf24' },
    { type: 'text', label: '⚡ SAÍDA DE EMERGÊNCIA', x: 400, y: 905, fontSize: 8, color: '#fbbf24' },
    { type: 'text', label: '⚡ SAÍDA DE EMERGÊNCIA', x: 830, y: 905, fontSize: 8, color: '#fbbf24' },

    // Setas de fluxo (entrada)
    { type: 'arrow', label: '→', x: 45, y: 92, fontSize: 14, color: '#ffffff' },
    { type: 'arrow', label: '→', x: 45, y: 818, fontSize: 14, color: '#ffffff' },

    // Labels de metragem nos BARs
    { type: 'text', label: '12M²', x: 153, y: 870, fontSize: 7, color: '#94a3b8' },
    { type: 'text', label: '12M²', x: 231, y: 870, fontSize: 7, color: '#94a3b8' },
    { type: 'text', label: '12M²', x: 533, y: 870, fontSize: 7, color: '#94a3b8' },
    { type: 'text', label: '12M²', x: 611, y: 870, fontSize: 7, color: '#94a3b8' },
    { type: 'text', label: '21M²', x: 382, y: 870, fontSize: 7, color: '#94a3b8' },
];

// ═══════════════════════════════════════════
// MOCK DATA GENERATOR
// ═══════════════════════════════════════════
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
