-- Telemedicine Consultation App - Database Schema
-- Run this in your Supabase SQL Editor

-- Users Table (handles authentication and profiles)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    user_type TEXT NOT NULL CHECK (user_type IN ('patient', 'doctor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Patient Profiles Table (stores patient information)
CREATE TABLE IF NOT EXISTS patient_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT,
    age INTEGER,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    blood_group TEXT,
    allergies TEXT,
    current_medications TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS on patient_profiles
ALTER TABLE patient_profiles DISABLE ROW LEVEL SECURITY;

-- Create index for patient_profiles
CREATE INDEX IF NOT EXISTS idx_patient_profiles_user_id ON patient_profiles(user_id);

-- Consultation Forms Table (created by doctors)
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

-- Consultation Requests Table
CREATE TABLE IF NOT EXISTS consultation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    form_id UUID REFERENCES consultation_forms(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    consultation_type TEXT,
    form_responses JSONB,
    severity_level TEXT CHECK (severity_level IN ('green', 'yellow', 'red')),
    prescription TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultation Replies Table
CREATE TABLE IF NOT EXISTS consultation_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consultation_id UUID NOT NULL REFERENCES consultation_requests(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE patient_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_forms DISABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_replies DISABLE ROW LEVEL SECURITY;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_patient_profiles_user_id ON patient_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_consultation_forms_doctor_id ON consultation_forms(doctor_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_patient_id ON consultation_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_doctor_id ON consultation_requests(doctor_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_form_id ON consultation_requests(form_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_severity ON consultation_requests(severity_level);
CREATE INDEX IF NOT EXISTS idx_consultation_replies_consultation_id ON consultation_replies(consultation_id);
CREATE INDEX IF NOT EXISTS idx_consultation_replies_user_id ON consultation_replies(user_id);

-- Insert sample users (password: "password123" hashed with bcrypt)
INSERT INTO users (username, password_hash, user_type) VALUES
    ('patient1', '$2b$10$o.f2nk3OZ9JIqc0XGzaYAOW14Rr5wcm.fFV/oBIIJL5dpdUYUSLfS', 'patient'),
    ('doctor1', '$2b$10$o.f2nk3OZ9JIqc0XGzaYAOW14Rr5wcm.fFV/oBIIJL5dpdUYUSLfS', 'doctor')
ON CONFLICT (username) DO NOTHING;

