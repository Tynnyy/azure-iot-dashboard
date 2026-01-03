import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    const { data: locations, error } = await supabase
      .from('locations')
      .select('*')
      .order('location_name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ data: locations }, { status: 200 });

  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) },
      { status: 500 }
    );
  }
}
