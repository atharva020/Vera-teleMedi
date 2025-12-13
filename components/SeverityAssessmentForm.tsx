'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { SEVERITY_QUESTIONS, calculateSeverity, type SeverityLevel } from '@/lib/severityQuestions';
import { showToast } from '@/lib/toast';

interface SeverityAssessmentFormProps {
  onSubmit: (responses: Record<string, number>, severity: SeverityLevel) => void;
  onCancel?: () => void;
  initialResponses?: Record<string, number>;
}

export default function SeverityAssessmentForm({ onSubmit, onCancel, initialResponses }: SeverityAssessmentFormProps) {
  const [responses, setResponses] = useState<Record<string, number>>(initialResponses || {});

  useEffect(() => {
    if (initialResponses) {
      setResponses(initialResponses);
    }
  }, [initialResponses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all questions are answered
    const unansweredQuestions = SEVERITY_QUESTIONS.filter(q => !responses[q.id]);
    
    if (unansweredQuestions.length > 0) {
      showToast('Required', `Please answer all questions. Missing: ${unansweredQuestions.length} question(s)`, 'warning');
      return;
    }

    const { level } = calculateSeverity(responses);
    onSubmit(responses, level);
  };

  const handleOptionSelect = (questionId: string, weight: number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: weight,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {SEVERITY_QUESTIONS.map((question, index) => (
          <Card key={question.id} className="border-2">
            <CardContent className="pt-6">
              <Label className="text-base font-semibold text-slate-900 mb-4 block">
                {index + 1}. {question.question}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              
              <div className="space-y-3 mt-4">
                {question.options.map((option) => (
                  <label
                    key={option.label}
                    className={`flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      responses[question.id] === option.weight
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.weight}
                      checked={responses[question.id] === option.weight}
                      onChange={() => handleOptionSelect(question.id, option.weight)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-sm text-slate-700 flex-1">
                      {option.label}
                    </span>
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                      option.weight === 1 ? 'bg-green-100 text-green-700' :
                      option.weight === 2 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {option.weight === 1 ? 'Low' : option.weight === 2 ? 'Moderate' : 'Severe'}
                    </span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between pt-6 border-t">
        <p className="text-sm text-slate-600">
          <span className="font-medium">Progress:</span> {Object.keys(responses).length} of {SEVERITY_QUESTIONS.length} questions answered
        </p>
        <div className="flex space-x-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={Object.keys(responses).length !== SEVERITY_QUESTIONS.length}
          >
            {initialResponses ? 'Update Assessment' : 'Submit Assessment'}
          </Button>
        </div>
      </div>
    </form>
  );
}

