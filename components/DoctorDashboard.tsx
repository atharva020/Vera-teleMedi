'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import ConsultationDetail from '@/components/ConsultationDetail';
import { getSeverityDisplay } from '@/lib/severityQuestions';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SidebarToggleButton } from '@/components/Sidebar';

interface DoctorDashboardProps {
  user: User;
}

export default function DoctorDashboard({ user }: DoctorDashboardProps) {
  const router = useRouter();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/consultations');
      const data = await response.json();
      setConsultations(data.consultations || []);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-4 md:mb-6">
        <div className="flex items-start gap-3">
          <SidebarToggleButton />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm md:text-base text-slate-600 mt-1">Welcome, Dr. {user.username}!</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 mb-4 md:mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {consultations.filter(c => c.status === 'pending').length}
            </div>
            <p className="text-xs text-slate-500">Awaiting your response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {consultations.filter(c => c.status === 'accepted').length}
            </div>
            <p className="text-xs text-slate-500">Currently treating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">Total Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 mb-1">{consultations.length}</div>
            <p className="text-xs text-slate-500">Patient assessments received</p>
          </CardContent>
        </Card>
      </div>

      {/* Consultation Queue */}
      <Card>
        <CardHeader className="px-4 md:px-6 pt-4 md:pt-6 pb-3 md:pb-4">
          <CardTitle className="text-lg md:text-xl">Consultation Queue</CardTitle>
          <CardDescription className="text-sm">Patient consultation requests</CardDescription>
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
          {loading ? (
            <p className="text-sm text-slate-500 text-center py-8">Loading consultations...</p>
          ) : consultations.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              No consultation requests yet
            </p>
          ) : (
            <div className="space-y-3">
              {consultations.map((consultation) => {
                const severityInfo = consultation.severity_level 
                  ? getSeverityDisplay(consultation.severity_level)
                  : null;
                
                return (
                  <div
                    key={consultation.id}
                    className={`p-3 md:p-4 border-2 rounded-lg hover:shadow-md transition-all cursor-pointer ${
                      consultation.severity_level === 'red' ? 'border-red-300 bg-red-50/30' :
                      consultation.severity_level === 'yellow' ? 'border-yellow-300 bg-yellow-50/30' :
                      consultation.severity_level === 'green' ? 'border-green-300 bg-green-50/30' :
                      'border-slate-200'
                    }`}
                    onClick={() => setSelectedConsultation(consultation)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            {severityInfo && (
                              <div className={`h-3 w-3 rounded-full flex-shrink-0 ${severityInfo.color}`}></div>
                            )}
                            <h4 className="font-semibold text-sm md:text-base text-slate-900 truncate">{consultation.title}</h4>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 capitalize ${
                            consultation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            consultation.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                            consultation.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {consultation.status}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-slate-600 line-clamp-2 mb-2">{consultation.description}</p>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="text-slate-500 whitespace-nowrap">{new Date(consultation.created_at).toLocaleDateString()}</span>
                          {consultation.patient && (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium whitespace-nowrap">
                              Patient: {consultation.patient.username}
                            </span>
                          )}
                          {severityInfo && (
                            <span className={`px-2 py-0.5 rounded font-medium whitespace-nowrap ${severityInfo.bgColor} ${severityInfo.textColor}`}>
                              {severityInfo.label}
                            </span>
                          )}
                          {consultation.form_responses && (
                            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 whitespace-nowrap">
                              Assessment Complete
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consultation Detail Modal */}
      {selectedConsultation && (
        <Dialog open={!!selectedConsultation} onOpenChange={(open) => !open && setSelectedConsultation(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 mx-4 md:mx-auto">
            <div className="p-4 md:p-6">
              <ConsultationDetail
                consultation={selectedConsultation}
                onUpdate={() => {
                  fetchConsultations();
                  setSelectedConsultation(null);
                }}
                userType="doctor"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}

