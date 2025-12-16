import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import PatientDashboard from '@/components/PatientDashboard';

export default async function PatientDashboardPage() {
  const user = await getSession();

  if (!user) {
    redirect('/login');
  }

  if (user.user_type !== 'patient') {
    redirect('/dashboard');
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col md:ml-64">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-y-auto">
          <PatientDashboard user={user} />
        </main>
      </div>
    </div>
  );
}

