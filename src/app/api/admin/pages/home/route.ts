import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('page_content')
            .select('content')
            .eq('page_id', 'home')
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return NextResponse.json({ content: data?.content || {} });
    } catch (error) {
        console.error('Error fetching home content:', error);
        return NextResponse.json({ content: {} });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const { error } = await supabase
            .from('page_content')
            .upsert({
                page_id: 'home',
                content: body.content,
                updated_at: new Date().toISOString(),
            });

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving home content:', error);
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
    }
}
