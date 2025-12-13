import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Header from '@/components/Header';
import ConsultationList from '@/components/ConsultationList';

export default async function ConsultationsPage() {
  const user = await getSession();

  if (!user) {
    redirect('/login');
  }

  if (user.user_type !== 'patient') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} />
      <ConsultationList user={user} />
    </div>
  );
}

