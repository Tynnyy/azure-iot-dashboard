import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: sensors, error } = await supabase
      .from('sensors')
      .select(`
        *,
        location:locations(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data: sensors }, { status: 200 });

  } catch (error) {
    console.error('Error fetching sensors:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}
