import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, STORAGE_BUCKET } from '@/lib/supabase';

// GET /api/alumni — public: fetch approved alumni
export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('alumni')
    .select('*')
    .eq('status', 'approved')
    .order('batch_year', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ alumni: data });
}

// POST /api/alumni — public: submit new alumni
export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const name = formData.get('name') as string;
  const batch_year = parseInt(formData.get('batch_year') as string, 10);
  const department = formData.get('department') as string;
  const description = formData.get('description') as string;
  const quote = formData.get('quote') as string;
  const current_role = formData.get('current_role') as string;
  const current_company = formData.get('current_company') as string;
  const linkedin_url = formData.get('linkedin_url') as string;
  const imageFile = formData.get('image') as File | null;

  if (!name || !batch_year) {
    return NextResponse.json({ error: 'Name and batch year are required.' }, { status: 400 });
  }

  let image_url: string | null = null;
  let image_path: string | null = null;

  if (imageFile && imageFile.size > 0) {
    const db = supabaseAdmin();
    const ext = imageFile.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await db.storage
      .from(STORAGE_BUCKET)
      .upload(filename, buffer, {
        contentType: imageFile.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ error: `Image upload failed: ${uploadError.message}` }, { status: 500 });
    }

    image_path = filename;
    const { data: urlData } = db.storage.from(STORAGE_BUCKET).getPublicUrl(filename);
    image_url = urlData.publicUrl;
  }

  const db = supabaseAdmin();
  const { data, error } = await db
    .from('alumni')
    .insert({
      name,
      batch_year,
      department: department || null,
      description: description || null,
      quote: quote || null,
      current_role: current_role || null,
      current_company: current_company || null,
      linkedin_url: linkedin_url || null,
      image_url,
      image_path,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ alumni: data }, { status: 201 });
}
