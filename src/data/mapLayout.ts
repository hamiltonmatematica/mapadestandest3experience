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
// NOVO LAYOUT DO MAPA (ROTACIONADO 90º HORÁRIO)
// ViewBox permanece: 0 0 1100 950
// ============================================

// Dimensões trocadas porque o estande girou
const SW = 54;  // stand width após giro (era altura)
const SH = 52;  // stand height após giro (era largura)
const VS = 4;   // gap
const startX = 60;
const startY = 30;

// O maxRow original era 15. Usamos 15 - oldRow para inverter o eixo Y, 
// transformando-o no novo eixo X. E o oldCol vira o novo eixo Y.
const oldMaxRow = 15;

const gX_old = (col: number) => startX + col * (SH + VS); // antes era SW
const gY_old = (row: number) => startY + row * (SW + VS); // antes era SH

const gX = (oldCol: number, oldRow: number) => startX + (oldMaxRow - oldRow) * (SW + VS);
const gY = (oldCol: number, oldRow: number) => startY + oldCol * (SH + VS);

export const standPositions: StandPosition[] = [
    // ═══════════════════════════════════════════
    // ANTES: Left column (01-10) -> Col 0, Rows 14 a 5
    // AGORA: Top Row (Horizontal em y=gY(0), da esquerda pra direita)
    // ═══════════════════════════════════════════
    // Stands 3, 5, 6, 7, 8, 9, 10 — sem gap (3 encostado no 5)
    ...([3, 5, 6, 7, 8, 9, 10].map((num, i) => ({ 
        numero: num, tipo: 'ouro' as StandType, 
        x: gX(0, 11 - i), y: gY(0, 11 - i), 
        width: SW, height: SH 
    }))),
  
    // ═══════════════════════════════════════════
    // ANTES: Top Row (11-22) -> Row 0, Cols 1 a 12
    // AGORA: Right Column (Vertical em x fixo à direita, descendo)
    // ═══════════════════════════════════════════
    ...Array.from({length: 12}, (_, i) => ({ 
        numero: 11 + i, tipo: 'ouro' as StandType, 
        x: gX(1 + i, 0), y: gY(1 + i, 0), 
        width: SW, height: SH 
    })),

    // ═══════════════════════════════════════════
    // ANTES: Top Block (84-95) -> Rows 4 e 3, Cols 3-8
    // AGORA: Right Block
    // ═══════════════════════════════════════════
    // fileira 1: 95 a 90 (estavam na linha 3)
    ...Array.from({length: 6}, (_, i) => ({ 
        numero: [85, 84, 86, 87, 76, 75][i], tipo: 'master' as StandType, 
        x: gX(3 + i, 3), y: gY(3 + i, 3), width: SW, height: SH 
    })),
    // fileira 2: 89 a 84 (estavam na linha 4)
    ...Array.from({length: 6}, (_, i) => ({ 
        numero: [65, 66, 67, 68, 69, 74][i], tipo: 'master' as StandType, 
        x: gX(3 + i, 4), y: gY(3 + i, 4), width: SW, height: SH 
    })),

    // ═══════════════════════════════════════════
    // ANTES: Bottom Block (63-74) -> Rows 11 e 12, Cols 3-8
    // AGORA: Left Block
    // ═══════════════════════════════════════════
    // fileira 1: 74 a 69 (estavam na linha 11)
    ...Array.from({length: 6}, (_, i) => ({ 
        numero: [64, 63, 62, 61, 60, 55][i], tipo: 'ouro' as StandType, 
        x: gX(3 + i, 11), y: gY(3 + i, 11), width: SW, height: SH 
    })),
    // fileira 2: 68 a 63 (estavam na linha 12)
    ...Array.from({length: 6}, (_, i) => ({ 
        numero: [45, 46, 47, 48, 49, 50][i], tipo: 'ouro' as StandType, 
        x: gX(3 + i, 12), y: gY(3 + i, 12), width: SW, height: SH 
    })),

    // ═══════════════════════════════════════════
    // ANTES: Bottom Row (30-43) -> Row 15, Cols 1 a 14
    // AGORA: Left Column (Vertical em x fixo à esquerda, descendo)
    // ═══════════════════════════════════════════
    ...Array.from({length: 12}, (_, i) => ({ 
        numero: 30 + i, tipo: 'prata' as StandType, 
        x: gX(1 + i, 15), y: gY(1 + i, 15), 
        width: SW, height: SH 
    })),
];

const ouroStands = [30, 68, 63, 62, 61, 60];
const masterStands = [87, 17, 18, 19, 20, 21, 22, 31, 38, 39, 40, 41];
const bronzeStands = [32, 33, 34, 35, 36, 37];

standPositions.forEach(stand => {
    if (ouroStands.includes(stand.numero)) stand.tipo = 'ouro';
    if (masterStands.includes(stand.numero)) stand.tipo = 'master';
    if (bronzeStands.includes(stand.numero)) stand.tipo = 'bronze';
});

// ═══════════════════════════════════════════
// ÁREAS ESPECIAIS (Também Rotacionadas)
// ═══════════════════════════════════════════
export interface SpecialArea {
    id: string; label: string; x: number; y: number; width: number; height: number;
    color: string; textColor?: string; fontSize?: number; borderRadius?: number;
}

export const specialAreas: SpecialArea[] = [
    {
        id: 'lounge',
        label: 'LOUNGE',
        // Antes era de (col=3, row=5) a (col=8, row=10)
        // O top left agora é derivado do top right de antes? 
        // Não, a rotação faz x_new = gX(col_min, row_max), y_new = gY(col_min, row_min)
        x: gX(3, 10), y: gY(3, 5),
        // A largura rotacionada absorve a altura de antes!
        width: (10 - 5) * (SW + VS) + SW, 
        height: (8 - 3) * (SH + VS) + SH,
        color: '#4f46e5', textColor: '#c7d2fe', fontSize: 18, borderRadius: 0,
    },
    {
        id: 'palco',
        label: 'PALCO',
        // Antes estava aprox. em col=14, row=6, com w=160, h=260
        // Nova X = gerada de old row end (fundo approx 6+4.5 ~ 10.5 -> 10)
        // Nova Y = gerada de old col 14
        x: gX(14, 10), y: gY(14, 6),
        width: 260, height: 160,
        color: '#1e293b', textColor: '#e2e8f0', fontSize: 18, borderRadius: 6,
    },
    {
        id: 'barracas1',
        label: 'BARRACAS',
        // Antes em (col=14, row=2..4)
        x: gX(14, 4), y: gY(14, 2),
        width: (4 - 2) * (SW + VS) + SW, 
        height: SH * 2,
        color: '#0e7490', textColor: '#e0f2fe', fontSize: 10, borderRadius: 4,
    },
    {
        id: 'barracas2',
        label: 'BARRACAS',
        // Antes em (col=14, row=11..13)
        x: gX(14, 13), y: gY(14, 11),
        width: (13 - 11) * (SW + VS) + SW, 
        height: SH * 2,
        color: '#0e7490', textColor: '#e0f2fe', fontSize: 10, borderRadius: 4,
    }
];

// ═══════════════════════════════════════════
// CORREDORES (Rotacionados)
// ═══════════════════════════════════════════
export interface Corridor {
    x: number; y: number; width: number; height: number;
}

export const corridors: Corridor[] = [
    // Antigo top horizontal tendas (row=1, col=1 a 12)
    { x: gX(1, 2) - 2, y: gY(1, 1), width: 1 * (SW + VS) + SW + 4, height: (12 - 1) * (SH + VS) + SH },
    // Antigo bottom horizontal tendas (row=13, col=1 a 12)
    { x: gX(1, 14) - 2, y: gY(1, 13), width: 1 * (SW + VS) + SW + 4, height: (12 - 1) * (SH + VS) + SH },
    // Antigo left vertical tendas (col=1, row=1 a 14)
    { x: gX(1, 14), y: gY(1, 1) - 2, width: (14 - 1) * (SW + VS) + SW, height: 1 * (SH + VS) + SH + 4 },
    // Antigo right vertical tendas (col=9, row=1 a 14)
    { x: gX(9, 14), y: gY(9, 1) - 2, width: (14 - 1) * (SW + VS) + SW, height: 1 * (SH + VS) + SH + 4 },
];

export interface MapAnnotation { type: 'text' | 'arrow' | 'entrance'; label: string; x: number; y: number; rotation?: number; fontSize?: number; color?: string; }
export const annotations: MapAnnotation[] = [
    // PÓRTICO (Antes X=-1, Y=9 -> Agora X=gX(-1,9), Y=gY(-1,9))
    { type: 'entrance', label: 'PÓRTICO DE ENTRADA', x: gX(-1, 9), y: gY(-1, 9), rotation: 0, fontSize: 11, color: '#60a5fa' },
];

export function generateMockStands(): Stand[] {
    const statuses: Stand['status'][] = ['disponivel', 'reservado', 'vendido'];
    const empresas = ['Tech Solutions', 'Digital Wave', 'InnovateTech', 'Smart Systems', 'DataFlow', 'CloudPeak', 'NetBridge', 'CodeForge', 'CyberCore', 'PixelHub', 'LogiTech Pro', 'MegaByte'];
    return standPositions.map((pos, i) => {
        const randomStatus = statuses[Math.floor(Math.random() * 3)];
        return {
            id: `stand-${pos.numero}`, numero: pos.numero, status: randomStatus,
            empresa: randomStatus === 'vendido' ? empresas[i % empresas.length] : randomStatus === 'reservado' ? empresas[(i + 5) % empresas.length] : null,
            tipo: pos.tipo, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        };
    });
}
