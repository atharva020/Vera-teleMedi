'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User, ConsultationRequest } from '@/lib/types';
import ConsultationDetail from '@/components/ConsultationDetail';
import SeverityAssessmentForm from '@/components/SeverityAssessmentForm';
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

  // Find existing assessment (most recent one with severity_level)
  const existingAssessment = consultations.find(
    c => c.severity_level && c.form_responses
  );

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

  const handleEditAssessment = () => {
    if (existingAssessment) {
      setEditingConsultation(existingAssessment);
      setFormOpen(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Health Assessment</h1>
        <p className="text-slate-600">
          {existingAssessment 
            ? 'View or edit your submitted assessment below'
            : 'Please complete the assessment below so our medical team can prioritize your care'}
        </p>
      </div>

      {/* Show loading, existing assessment, or form */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600">Loading your assessment...</p>
          </div>
        </div>
      ) : existingAssessment && !formOpen ? (
        <div className="space-y-4">
          <Card className="border-2 border-green-200 bg-green-50/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-1">Assessment Submitted</h3>
                  <p className="text-sm text-slate-600">
                    Submitted on {new Date(existingAssessment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  onClick={handleEditAssessment}
                  variant="outline"
                  className="bg-white"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Assessment
                </Button>
              </div>
              <ConsultationDetail
                consultation={existingAssessment}
                onUpdate={fetchConsultations}
                userType="patient"
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <SeverityAssessmentForm 
          onSubmit={handleFormSubmit}
          initialResponses={editingConsultation?.form_responses as Record<string, number> | undefined}
          onCancel={() => {
            setFormOpen(false);
            setEditingConsultation(null);
          }}
        />
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

