-- =====================================================
-- STAND MANAGER - Schema do Banco de Dados
-- Execute este SQL no Supabase SQL Editor
-- =====================================================

-- Tabela principal de stands
CREATE TABLE IF NOT EXISTS stands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero INTEGER NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'reservado', 'vendido')),
  empresa TEXT,
  tipo TEXT NOT NULL DEFAULT 'prata' CHECK (tipo IN ('ouro', 'prata', 'bronze', 'master', 'bar', 'palco', 'area')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de expositores (opcional)
CREATE TABLE IF NOT EXISTS expositores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  stand_id UUID REFERENCES stands(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de admins
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_stands_status ON stands(status);
CREATE INDEX IF NOT EXISTS idx_stands_numero ON stands(numero);
CREATE INDEX IF NOT EXISTS idx_expositores_stand_id ON expositores(stand_id);

-- Inserir 100 stands (todos disponíveis inicialmente)
INSERT INTO stands (numero, status, tipo) VALUES
  -- Top row (1-10) - Ouro
  (1, 'disponivel', 'ouro'), (2, 'disponivel', 'ouro'), (3, 'disponivel', 'ouro'),
  (4, 'disponivel', 'ouro'), (5, 'disponivel', 'ouro'), (6, 'disponivel', 'ouro'),
  (7, 'disponivel', 'ouro'), (8, 'disponivel', 'ouro'), (9, 'disponivel', 'ouro'),
  (10, 'disponivel', 'ouro'),
  -- Top right (11-14) - Prata
  (11, 'disponivel', 'prata'), (12, 'disponivel', 'prata'),
  (13, 'disponivel', 'prata'), (14, 'disponivel', 'prata'),
  -- Right column (15-25) - Bronze
  (15, 'disponivel', 'bronze'), (16, 'disponivel', 'master'),
  (17, 'disponivel', 'bronze'), (18, 'disponivel', 'bronze'),
  (19, 'disponivel', 'bronze'), (20, 'disponivel', 'bronze'),
  (21, 'disponivel', 'bronze'), (22, 'disponivel', 'bronze'),
  (23, 'disponivel', 'bronze'), (24, 'disponivel', 'bronze'),
  (25, 'disponivel', 'bronze'),
  -- Bottom right (26-31) - Prata
  (26, 'disponivel', 'prata'), (27, 'disponivel', 'prata'),
  (28, 'disponivel', 'prata'), (29, 'disponivel', 'prata'),
  (30, 'disponivel', 'prata'), (31, 'disponivel', 'ouro'),
  -- Bottom + Left (32-44)
  (32, 'disponivel', 'ouro'),
  (33, 'disponivel', 'ouro'), (34, 'disponivel', 'ouro'),
  (35, 'disponivel', 'ouro'), (36, 'disponivel', 'ouro'),
  (37, 'disponivel', 'ouro'), (38, 'disponivel', 'ouro'),
  (39, 'disponivel', 'ouro'), (40, 'disponivel', 'ouro'),
  (41, 'disponivel', 'ouro'), (42, 'disponivel', 'ouro'),
  (43, 'disponivel', 'prata'), (44, 'disponivel', 'ouro'),
  -- Second left (45-54) - Prata
  (45, 'disponivel', 'prata'), (46, 'disponivel', 'prata'),
  (47, 'disponivel', 'prata'), (48, 'disponivel', 'prata'),
  (49, 'disponivel', 'prata'), (50, 'disponivel', 'prata'),
  (51, 'disponivel', 'prata'), (52, 'disponivel', 'prata'),
  (53, 'disponivel', 'prata'), (54, 'disponivel', 'prata'),
  -- Third left (55-64)
  (55, 'disponivel', 'prata'), (56, 'disponivel', 'prata'),
  (57, 'disponivel', 'prata'), (58, 'disponivel', 'ouro'),
  (59, 'disponivel', 'ouro'), (60, 'disponivel', 'ouro'),
  (61, 'disponivel', 'ouro'), (62, 'disponivel', 'ouro'),
  (63, 'disponivel', 'ouro'), (64, 'disponivel', 'ouro'),
  -- Center left (65-74) - Prata
  (65, 'disponivel', 'prata'), (66, 'disponivel', 'prata'),
  (67, 'disponivel', 'prata'), (68, 'disponivel', 'prata'),
  (69, 'disponivel', 'prata'), (70, 'disponivel', 'prata'),
  (71, 'disponivel', 'prata'), (72, 'disponivel', 'prata'),
  (73, 'disponivel', 'prata'), (74, 'disponivel', 'prata'),
  -- Center right (75-84) - Master
  (75, 'disponivel', 'master'), (76, 'disponivel', 'master'),
  (77, 'disponivel', 'master'), (78, 'disponivel', 'master'),
  (79, 'disponivel', 'master'), (80, 'disponivel', 'master'),
  (81, 'disponivel', 'master'), (82, 'disponivel', 'master'),
  (83, 'disponivel', 'master'), (84, 'disponivel', 'master'),
  -- Right inner (85-92) - Prata
  (85, 'disponivel', 'prata'), (86, 'disponivel', 'prata'),
  (87, 'disponivel', 'prata'), (88, 'disponivel', 'prata'),
  (89, 'disponivel', 'prata'), (90, 'disponivel', 'prata'),
  (91, 'disponivel', 'prata'), (92, 'disponivel', 'prata'),
  -- Second right (93-100) - Prata
  (93, 'disponivel', 'prata'), (94, 'disponivel', 'prata'),
  (95, 'disponivel', 'prata'), (96, 'disponivel', 'prata'),
  (97, 'disponivel', 'prata'), (98, 'disponivel', 'prata'),
  (99, 'disponivel', 'prata'), (100, 'disponivel', 'prata')
ON CONFLICT (numero) DO NOTHING;

-- Habilitar Realtime na tabela stands
ALTER PUBLICATION supabase_realtime ADD TABLE stands;

-- Row Level Security
ALTER TABLE stands ENABLE ROW LEVEL SECURITY;
ALTER TABLE expositores ENABLE ROW LEVEL SECURITY;

-- Política: todos podem ler stands
CREATE POLICY "Stands são visíveis publicamente" ON stands
  FOR SELECT USING (true);

-- Política: somente autenticados podem editar
CREATE POLICY "Autenticados podem editar stands" ON stands
  FOR ALL USING (auth.role() = 'authenticated');

-- Política de expositores
CREATE POLICY "Expositores visíveis publicamente" ON expositores
  FOR SELECT USING (true);

CREATE POLICY "Autenticados podem editar expositores" ON expositores
  FOR ALL USING (auth.role() = 'authenticated');
