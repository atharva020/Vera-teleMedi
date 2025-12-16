'use client';

import { useState, useEffect } from 'react';
import { User, ConsultationRequest } from '@/lib/types';
import { getSeverityDisplay } from '@/lib/severityQuestions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ConsultationDetail from '@/components/ConsultationDetail';
import { SidebarToggleButton } from '@/components/Sidebar';

interface PatientDashboardProps {
  user: User;
}

export default function PatientDashboard({ user }: PatientDashboardProps) {
  const router = useRouter();
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await fetch(`/api/consultations?patient_id=${user.id}`);
      const data = await response.json();
      setConsultations(data.consultations || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeConsultations = consultations.filter(c => c.status === 'pending' || c.status === 'accepted').length;
  const completedConsultations = consultations.filter(c => c.status === 'completed').length;
  const totalConsultations = consultations.length;

  return (
    <div className="p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-6 gap-3">
        <div className="flex items-center gap-3">
          <SidebarToggleButton />
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs md:text-sm text-slate-600 border border-slate-200 rounded-lg px-2 md:px-3 py-1.5">
            <svg className="h-4 w-4 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="whitespace-nowrap">16 Nov - 13 Dec</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 mb-4 md:mb-6">
        {/* Active Consultations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Active Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">{activeConsultations}</div>
            <p className="text-xs text-slate-500">Currently in progress</p>
          </CardContent>
        </Card>

        {/* Total Consultations */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">+{totalConsultations}</div>
            <p className="text-xs text-green-600">+{totalConsultations > 0 ? '100' : '0'}% from last month</p>
          </CardContent>
        </Card>

        {/* Completed */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">{completedConsultations}</div>
            <p className="text-xs text-blue-600">+{completedConsultations > 0 ? '20.1' : '0'}% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Consultations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Consultations</CardTitle>
            <CardDescription>Your latest consultation requests</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-500">Loading...</div>
            ) : consultations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 mb-4">No consultations yet</p>
                <Link href="/consultations">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Create Consultation
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {consultations.slice(0, 3).map((consultation) => {
                  const severityInfo = consultation.severity_level 
                    ? getSeverityDisplay(consultation.severity_level)
                    : null;
                  
                  return (
                    <div 
                      key={consultation.id} 
                      className={`flex items-start justify-between p-3 rounded-lg border-2 hover:bg-slate-50 transition-colors cursor-pointer ${
                        consultation.severity_level === 'red' ? 'border-red-300' :
                        consultation.severity_level === 'yellow' ? 'border-yellow-300' :
                        consultation.severity_level === 'green' ? 'border-green-300' :
                        'border-slate-200'
                      }`}
                      onClick={() => setSelectedConsultation(consultation)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {severityInfo && (
                            <div className={`h-2 w-2 rounded-full ${severityInfo.color}`}></div>
                          )}
                          <h4 className="font-medium text-slate-900">{consultation.title}</h4>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2">{consultation.description}</p>
                        <div className="flex items-center space-x-3 mt-2">
                          <p className="text-xs text-slate-500">
                            {new Date(consultation.created_at).toLocaleDateString()}
                          </p>
                          {severityInfo && (
                            <span className={`text-xs font-medium ${severityInfo.textColor}`}>
                              {severityInfo.label}
                            </span>
                          )}
                          {consultation.prescription && (
                            <span className="flex items-center text-xs text-green-600 font-medium">
                              <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Prescription
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`ml-4 px-2 py-1 rounded-full text-xs font-medium ${
                        consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        consultation.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {consultation.status}
                      </span>
                    </div>
                  );
                })}
                <Link href="/consultations">
                  <Button variant="outline" className="w-full mt-4">
                    View All Consultations
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/consultations">
              <Button className="w-full justify-start" size="lg">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Consultation
              </Button>
            </Link>
            <Link href="/messages">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                View Messages
              </Button>
            </Link>
            <Link href="/appointments">
              <Button variant="outline" className="w-full justify-start" size="lg">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Schedule Appointment
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Consultation Detail Dialog */}
      {selectedConsultation && (
        <Dialog open={!!selectedConsultation} onOpenChange={(open) => !open && setSelectedConsultation(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <ConsultationDetail
              consultation={selectedConsultation}
              onUpdate={() => {
                fetchConsultations();
                setSelectedConsultation(null);
              }}
              userType="patient"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

