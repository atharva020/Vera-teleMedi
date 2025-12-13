import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Sidebar from '@/components/Sidebar';
import DashboardHeader from '@/components/DashboardHeader';
import PatientDashboard from '@/components/PatientDashboard';
import DoctorDashboard from '@/components/DoctorDashboard';

export default async function RootDashboard() {
  const user = await getSession();

  if (!user) {
    redirect('/login');
  }

  // Redirect patients to home page
  if (user.user_type === 'patient') {
    redirect('/patient');
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col ml-64">
        <DashboardHeader user={user} />
        <main className="flex-1 overflow-y-auto">
          <DoctorDashboard user={user} />
        </main>
      </div>
    </div>
  );
}

