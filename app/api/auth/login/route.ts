import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { setSession } from '@/lib/auth';
import { AuthResponse, User } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .limit(1);

    if (error || !users || users.length === 0) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const sessionUser: User = {
      id: user.id,
      username: user.username,
      user_type: user.user_type,
      created_at: user.created_at,
    };

    await setSession(sessionUser);

    return NextResponse.json<AuthResponse>({
      success: true,
      user: sessionUser,
      message: 'Login successful',
    });
  } catch (error) {
    return NextResponse.json<AuthResponse>(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

