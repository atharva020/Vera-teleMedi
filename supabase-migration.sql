-- Migration Script - Add consultation_forms table and update consultation_requests
-- Run this if you already have existing tables

-- Create Consultation Forms Table (if not exists)
CREATE TABLE IF NOT EXISTS consultation_forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    questions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS on consultation_forms
ALTER TABLE consultation_forms DISABLE ROW LEVEL SECURITY;

-- Create index for consultation_forms
CREATE INDEX IF NOT EXISTS idx_consultation_forms_doctor_id ON consultation_forms(doctor_id);

-- Add form_id column to consultation_requests (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'consultation_requests' 
        AND column_name = 'form_id'
    ) THEN
        ALTER TABLE consultation_requests 
        ADD COLUMN form_id UUID REFERENCES consultation_forms(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add consultation_type column to consultation_requests (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'consultation_requests' 
        AND column_name = 'consultation_type'
    ) THEN
        ALTER TABLE consultation_requests 
        ADD COLUMN consultation_type TEXT;
    END IF;
END $$;

-- Add form_responses column to consultation_requests (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'consultation_requests' 
        AND column_name = 'form_responses'
    ) THEN
        ALTER TABLE consultation_requests 
        ADD COLUMN form_responses JSONB;
    END IF;
END $$;

-- Add prescription column to consultation_requests (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'consultation_requests' 
        AND column_name = 'prescription'
    ) THEN
        ALTER TABLE consultation_requests 
        ADD COLUMN prescription TEXT;
    END IF;
END $$;

-- Create index for form_id (if it doesn't exist)
CREATE INDEX IF NOT EXISTS idx_consultation_requests_form_id ON consultation_requests(form_id);

