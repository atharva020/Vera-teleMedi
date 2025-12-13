import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    if (user.user_type === 'patient') {
      const patientId = searchParams.get('patient_id') || user.id;
      const { data, error } = await supabase
        .from('consultation_requests')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ consultations: data || [] });
    } else if (user.user_type === 'doctor') {
      // Doctors see all patient consultations/assessments
      const status = searchParams.get('status');
      
      // Get all consultations with patient info
      let query = supabase
        .from('consultation_requests')
        .select(`
          *,
          patient:patient_id (
            id,
            username,
            user_type
          )
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      return NextResponse.json({ consultations: data || [] });
    }

    return NextResponse.json({ consultations: [] });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch consultations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();

    if (!user || user.user_type !== 'patient') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, form_responses, severity_level } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('consultation_requests')
      .insert({
        patient_id: user.id,
        doctor_id: null,
        title,
        description,
        form_responses: form_responses || null,
        severity_level: severity_level || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, consultation: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create consultation' },
      { status: 500 }
    );
  }
}

