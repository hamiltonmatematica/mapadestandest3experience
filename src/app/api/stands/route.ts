import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, updates } = body;

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'ID inválido', success: false }, { status: 400 });
        }

        // Validação sanitizada simples aqui (ideal usar Zod, conforme H-Regras-de-seguranca.md)
        // Regra de Ouro: Frontend nunca atualiza diretamente via client o banco!!
        const supabaseAdmin = getSupabaseAdmin();
        const { data, error } = await supabaseAdmin
            .from('stands')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('DB Update Error:', error);
            return NextResponse.json({ error: 'Erro interno', success: false }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (e: any) {
        console.error('API / stands / route Error:', e);
        return NextResponse.json({ error: e.message || 'Erro interno do servidor', success: false }, { status: 500 });
    }
}
