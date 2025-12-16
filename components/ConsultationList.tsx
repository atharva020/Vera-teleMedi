'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, ConsultationRequest } from '@/lib/types';
import ConsultationDetail from '@/components/ConsultationDetail';
import SeverityAssessmentForm from '@/components/SeverityAssessmentForm';
import { getSeverityDisplay } from '@/lib/severityQuestions';
import type { SeverityLevel } from '@/lib/severityQuestions';
import { showToast } from '@/lib/toast';

interface ConsultationListProps {
  user: User;
}

export default function ConsultationList({ user }: ConsultationListProps) {
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingConsultation, setEditingConsultation] = useState<ConsultationRequest | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<ConsultationRequest | null>(null);
  const [expandedConsultations, setExpandedConsultations] = useState<Set<string>>(new Set());

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

  const handleFormSubmit = async (responses: Record<string, any>, severity: SeverityLevel) => {
    try {
      // If editing existing assessment, update it; otherwise create new
      if (editingConsultation) {
        const response = await fetch(`/api/consultations/${editingConsultation.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            form_responses: responses,
            severity_level: severity,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setFormOpen(false);
          setEditingConsultation(null);
          fetchConsultations();
          showToast('Success', 'Assessment updated successfully!', 'success');
        }
      } else {
        const response = await fetch('/api/consultations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: 'Severity Assessment',
            description: 'Patient severity assessment consultation',
            form_responses: responses,
            severity_level: severity,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setFormOpen(false);
          fetchConsultations();
          showToast('Success', 'Assessment submitted successfully! A doctor will review your case.', 'success');
        }
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      showToast('Error', 'Failed to save assessment. Please try again.', 'error');
    }
  };

  const handleCreateNew = () => {
    setEditingConsultation(null);
    setFormOpen(true);
  };

  const handleEditAssessment = (consultation: ConsultationRequest) => {
    setEditingConsultation(consultation);
    setFormOpen(true);
  };

  const toggleExpanded = (consultationId: string) => {
    const newExpanded = new Set(expandedConsultations);
    if (newExpanded.has(consultationId)) {
      newExpanded.delete(consultationId);
    } else {
      newExpanded.add(consultationId);
    }
    setExpandedConsultations(newExpanded);
  };

  // Filter assessments (those with severity_level and form_responses)
  const assessments = consultations.filter(
    c => c.severity_level && c.form_responses
  );

  // Show form if formOpen is true
  if (formOpen) {
    return (
      <div className="container mx-auto px-4 py-8">
        <SeverityAssessmentForm 
          onSubmit={handleFormSubmit}
          initialResponses={editingConsultation?.form_responses as Record<string, number> | undefined}
          onCancel={() => {
            setFormOpen(false);
            setEditingConsultation(null);
          }}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Health Assessments</h1>
          <p className="text-sm md:text-base text-slate-600">
            {assessments.length > 0 
              ? `You have ${assessments.length} assessment${assessments.length > 1 ? 's' : ''}. Create a new one anytime.`
              : 'Create your first health assessment below'}
          </p>
        </div>
        <Button 
          onClick={handleCreateNew}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg flex-shrink-0 w-full sm:w-auto"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Create New Assessment</span>
          <span className="sm:hidden">New Assessment</span>
        </Button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600">Loading your assessments...</p>
          </div>
        </div>
      ) : assessments.length === 0 ? (
        <Card className="border-2 border-dashed border-slate-300 bg-slate-50/50">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No Assessments Yet</h3>
              <p className="text-slate-600 mb-6">
                Create your first health assessment to get started with medical consultations.
              </p>
              <Button 
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                Create Your First Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assessments.map((consultation) => {
            const isExpanded = expandedConsultations.has(consultation.id);
            const severityInfo = getSeverityDisplay(consultation.severity_level as SeverityLevel);
            const statusColors = {
              pending: 'border-yellow-200 bg-yellow-50/30',
              accepted: 'border-blue-200 bg-blue-50/30',
              completed: 'border-green-200 bg-green-50/30',
              cancelled: 'border-red-200 bg-red-50/30',
            };

            return (
              <Card 
                key={consultation.id} 
                className={`border-2 transition-all ${statusColors[consultation.status as keyof typeof statusColors] || 'border-slate-200'}`}
              >
                <CardHeader className="pb-3 p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className={`h-3 w-3 mt-1 rounded-full ${severityInfo.color} flex-shrink-0`}></div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base md:text-lg font-semibold text-slate-900 mb-2">
                          {consultation.title}
                        </CardTitle>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs md:text-sm text-slate-600">
                          <span>Submitted: {new Date(consultation.created_at).toLocaleDateString()}</span>
                          <span className="capitalize">Status: {consultation.status}</span>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${severityInfo.bgColor} ${severityInfo.textColor} inline-block w-fit`}>
                            {severityInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAssessment(consultation)}
                        className="bg-white gap-1.5"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="hidden sm:inline">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpanded(consultation.id)}
                        className="bg-white gap-1.5"
                      >
                        {isExpanded ? (
                          <>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                            <span>Show</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="pt-0">
                    <ConsultationDetail
                      consultation={consultation}
                      onUpdate={fetchConsultations}
                      userType="patient"
                    />
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Patient Consultation Detail Dialog */}
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

