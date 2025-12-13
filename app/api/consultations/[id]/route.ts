import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    // Check if consultation exists and user has permission
    const { data: existingConsultation, error: fetchError } = await supabase
      .from('consultation_requests')
      .select('patient_id, doctor_id')
      .eq('id', id)
      .single();

    if (fetchError || !existingConsultation) {
      return NextResponse.json(
        { error: 'Consultation not found' },
        { status: 404 }
      );
    }

    // Patients can only update their own consultations
    // Doctors can update consultations assigned to them or all consultations
    if (user.user_type === 'patient' && existingConsultation.patient_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status, doctor_id, prescription, form_responses, severity_level } = body;

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Doctors can update status, doctor_id, and prescription
    if (user.user_type === 'doctor') {
      if (status) updateData.status = status;
      if (doctor_id !== undefined) updateData.doctor_id = doctor_id;
      if (prescription !== undefined) updateData.prescription = prescription;
    }

    // Both patients and doctors can update form_responses and severity_level
    if (form_responses !== undefined) updateData.form_responses = form_responses;
    if (severity_level !== undefined) updateData.severity_level = severity_level;

    const { data, error } = await supabase
      .from('consultation_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, consultation: data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update consultation' },
      { status: 500 }
    );
  }
}

