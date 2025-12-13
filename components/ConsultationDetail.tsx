'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ConsultationRequest, ConsultationReply } from '@/lib/types';
import SeverityDisplay from '@/components/SeverityDisplay';
import { showToast } from '@/lib/toast';

interface ConsultationDetailProps {
  consultation: ConsultationRequest;
  onUpdate: () => void;
  userType: 'patient' | 'doctor';
}

export default function ConsultationDetail({ consultation, onUpdate, userType }: ConsultationDetailProps) {
  const [replies, setReplies] = useState<ConsultationReply[]>([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [prescription, setPrescription] = useState(consultation.prescription || '');
  const [showPrescriptionDialog, setShowPrescriptionDialog] = useState(false);
  const [status, setStatus] = useState<'pending' | 'accepted' | 'completed' | 'cancelled'>(consultation.status);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReplies();
  }, [consultation.id]);

  const fetchReplies = async () => {
    try {
      const response = await fetch(`/api/consultations/${consultation.id}/replies`);
      const data = await response.json();
      setReplies(data.replies || []);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/consultations/replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consultation_id: consultation.id,
          message: replyMessage,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setReplyMessage('');
        fetchReplies();
        showToast('Success', 'Message sent successfully', 'success');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      showToast('Error', 'Failed to send reply', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/consultations/${consultation.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          doctor_id: userType === 'doctor' ? consultation.doctor_id || undefined : undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setStatus(newStatus as 'pending' | 'accepted' | 'completed' | 'cancelled');
        onUpdate();
        showToast('Success', `Status updated to ${newStatus}`, 'success');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showToast('Error', 'Failed to update status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrescription = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/consultations/${consultation.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prescription: prescription,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowPrescriptionDialog(false);
        onUpdate();
        showToast('Success', 'Prescription saved successfully!', 'success');
      }
    } catch (error) {
      console.error('Error saving prescription:', error);
      showToast('Error', 'Failed to save prescription', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Consultation Header */}
      <Card className="shadow-sm">
        <CardHeader className="px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-xl mb-2">{consultation.title}</CardTitle>
              <CardDescription className="text-base mt-1">{consultation.description}</CardDescription>
              {userType === 'doctor' && (consultation as any).patient && (
                <div className="mt-3 flex items-center space-x-2">
                  <span className="text-sm text-slate-600">Patient:</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {(consultation as any).patient.username}
                  </span>
                </div>
              )}
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex-shrink-0 ${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Created: {new Date(consultation.created_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Severity Assessment Display */}
      {consultation.severity_level && consultation.form_responses && (
        <div className="mt-2">
          <SeverityDisplay
            responses={consultation.form_responses as Record<string, number>}
            severityLevel={consultation.severity_level}
            showDetails={userType === 'doctor'}
          />
        </div>
      )}


      {/* Doctor Actions */}
      {userType === 'doctor' && (
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Manage this consultation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Label>Status:</Label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={loading}
                className="flex h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900"
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowPrescriptionDialog(true)}
                variant="outline"
                className="flex-1"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {consultation.prescription ? 'Edit Prescription' : 'Add Prescription'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prescription Display (for both doctor and patient) */}
      {consultation.prescription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Prescription
            </CardTitle>
            <CardDescription>
              {userType === 'doctor' ? 'Your prescription for this consultation' : 'Prescription from your doctor'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-900 whitespace-pre-wrap">{consultation.prescription}</p>
            </div>
            {userType === 'patient' && (
              <p className="text-xs text-slate-500 mt-3 flex items-center">
                <svg className="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Please follow the prescription carefully. Contact your doctor if you have any questions.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Prescription Dialog */}
      <Dialog open={showPrescriptionDialog} onOpenChange={setShowPrescriptionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Prescription</DialogTitle>
            <DialogDescription>
              Write the prescription for this consultation
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="prescription">Prescription</Label>
            <textarea
              id="prescription"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Enter prescription details, medications, dosage, instructions..."
              className="flex min-h-[200px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-900 mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrescriptionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePrescription} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              Save Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Messages/Replies */}
      <Card>
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
          <CardDescription>
            Chat with the {userType === 'doctor' ? 'patient' : 'doctor'} about this consultation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Messages Display */}
          <div className="border rounded-lg p-4 bg-slate-50 min-h-[300px] max-h-[400px] overflow-y-auto">
            {replies.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <svg className="h-12 w-12 mx-auto text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm text-slate-500">No messages yet</p>
                  <p className="text-xs text-slate-400 mt-1">Start a conversation below</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`flex ${reply.user_id === consultation.patient_id ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[75%] ${
                      reply.user_id === consultation.patient_id
                        ? 'bg-white border border-blue-200'
                        : 'bg-blue-600 text-white'
                    } rounded-lg p-3 shadow-sm`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold ${
                          reply.user_id === consultation.patient_id
                            ? 'text-blue-700'
                            : 'text-blue-100'
                        }`}>
                          {reply.user_id === consultation.patient_id ? '👤 Patient' : '👨‍⚕️ Doctor'}
                        </span>
                        <span className={`text-xs ${
                          reply.user_id === consultation.patient_id
                            ? 'text-slate-500'
                            : 'text-blue-100'
                        }`}>
                          {new Date(reply.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        reply.user_id === consultation.patient_id
                          ? 'text-slate-900'
                          : 'text-white'
                      }`}>{reply.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="border-t pt-4">
            <Label htmlFor="message" className="text-sm font-medium mb-2 block">
              Send a message
            </Label>
            <div className="flex space-x-2">
              <textarea
                id="message"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder={`Type your message to the ${userType === 'doctor' ? 'patient' : 'doctor'}...`}
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleReply();
                  }
                }}
              />
              <Button 
                onClick={handleReply} 
                disabled={loading || !replyMessage.trim()} 
                className="bg-blue-600 hover:bg-blue-700 self-end"
                size="lg"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

