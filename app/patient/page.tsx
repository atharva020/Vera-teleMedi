import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HeroSection } from '@/components/ui/hero-section';

export default async function PatientHomePage() {
  const user = await getSession();

  // Only patients can access this page
  if (user && user.user_type !== 'patient') {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header user={user} />
      
      <main className="flex-1">
        <HeroSection
          title={
            <>
              Your Health, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7E66] to-[#ff5f42]">Our Priority</span>
            </>
          }
          subtitle="Complete your weekly check-in. VERA converts your responses into structured clinical triage for your oncology team."
          callToAction={{
            text: "Report your weekly symptoms",
            href: user ? "/consultations" : "/login",
          }}
          backgroundImage="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&auto=format&fit=crop&q=80"
        />

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                How VERA supports your treatment?
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                VERA provides continuous symptom monitoring designed specifically for patients undergoing cancer therapy.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#FF7E66] to-[#ff5f42] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Structured symptoms monitoring</h3>
                <p className="text-slate-600 leading-relaxed">Validated oncology questionnaires, designed for weekly symptom tracking.</p>
              </div>

              {/* Feature 2 */}
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#0A3747] to-[#051d26] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Secure & Private</h3>
                <p className="text-slate-600 leading-relaxed">Encrypted storage and secure data handling aligned with healthcare standards.</p>
              </div>

              {/* Feature 3 */}
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#2BC2A4] to-[#229b83] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3"> AI-Supported Clinical Triage </h3>
                <p className="text-slate-600 leading-relaxed">Patient responses are analyzed using clinical thresholds. Oncology team is notified of the severity predicted. </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Get started with your journey in just four simple steps
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Step 1 */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0A3747] to-[#051d26] text-white flex items-center justify-center font-bold text-xl shadow-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Create Your Account</h3>
                    <p className="text-slate-600 leading-relaxed">Sign up and set up your profile in just a few minutes</p>
                  </div>
                </div>
                {/* Step 2: Check-in with VERA */}
                <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  {/* The Red/Rose Box - Signals Health Action/Symptoms */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF7E66] to-[#ff5f42] text-white flex items-center justify-center font-bold text-xl shadow-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">Weekly symptom check-in</h3>
                    <p className="text-slate-600 leading-relaxed">Complete a short, structured questionnaire.</p>
                  </div>
                </div>
                

               {/* Step 3: Team Sync */}
              <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                {/* The Yellow/Amber Box - Signals Connection & Information Transfer */}
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD166] to-[#ffc133] text-white flex items-center justify-center font-bold text-xl shadow-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">AI triage assessment</h3>
                  <p className="text-slate-600 leading-relaxed">VERA analyzes your responses using clinically validated thresholds and assigns a triage level (green, yellow, or red).</p>
                </div>
              </div>

               {/* Step 4: Doctor Feedback */}
              <div className="flex items-start space-x-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                {/* The Green/Emerald Box - Signals Resolution, Safety, and Care Received */}
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2BC2A4] to-[#229b83] text-white flex items-center justify-center font-bold text-xl shadow-lg">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">Clinical review & escalation</h3>
                  <p className="text-slate-600 leading-relaxed">Your oncology team is notified of your triage status. High-priority alerts are flagged for urgent clinical review and follow-up when needed.</p>
                </div>
              </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

