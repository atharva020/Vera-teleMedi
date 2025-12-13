import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function Home() {
  try {
    const user = await getSession();

    if (user) {
      // Redirect based on user type
      if (user.user_type === 'patient') {
        redirect('/patient');
      } else {
        redirect('/dashboard');
      }
    } else {
      // Non-logged in users see the patient landing page
      redirect('/patient');
    }
  } catch (error) {
    // Fallback: redirect to patient page if there's any error
    redirect('/patient');
  }
}
