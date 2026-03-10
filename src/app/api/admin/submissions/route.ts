import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, ADMIN_COOKIE_VALUE } from '@/lib/auth';

async function requireAdmin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  return session?.value === ADMIN_COOKIE_VALUE;
}

// GET /api/admin/submissions — admin: fetch all pending submissions
export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || 'pending';

  const db = supabaseAdmin();
  const { data, error } = await db
    .from('alumni')
    .select('*')
    .eq('status', status)
    .order('submitted_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ submissions: data });
}
