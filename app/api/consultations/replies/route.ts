import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { consultation_id, message } = body;

    if (!consultation_id || !message) {
      return NextResponse.json(
        { error: 'Consultation ID and message are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('consultation_replies')
      .insert({
        consultation_id,
        user_id: user.id,
        message,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, reply: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create reply' },
      { status: 500 }
    );
  }
}

