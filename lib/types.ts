export type UserType = 'patient' | 'doctor';

export interface User {
  id: string;
  username: string;
  user_type: UserType;
  created_at: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface ConsultationRequest {
  id: string;
  patient_id: string;
  doctor_id?: string;
  title: string;
  description: string;
  form_responses?: Record<string, any>;
  severity_level?: 'green' | 'yellow' | 'red';
  prescription?: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface ConsultationReply {
  id: string;
  consultation_id: string;
  user_id: string;
  message: string;
  created_at: string;
}

export interface PatientProfile {
  id: string;
  user_id: string;
  full_name?: string;
  age?: number;
  weight?: number;
  height?: number;
  blood_group?: string;
  allergies?: string;
  current_medications?: string;
  created_at: string;
  updated_at: string;
}


