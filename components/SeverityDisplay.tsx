'use client';

import { SEVERITY_QUESTIONS, getSeverityDisplay, calculateSeverity, type SeverityLevel } from '@/lib/severityQuestions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SeverityDisplayProps {
  responses: Record<string, number>;
  severityLevel: SeverityLevel;
  showDetails?: boolean;
}

export default function SeverityDisplay({ responses, severityLevel, showDetails = true }: SeverityDisplayProps) {
  const severityInfo = getSeverityDisplay(severityLevel);
  const severityResult = calculateSeverity(responses);

  return (
    <div className="space-y-6 py-2">
      {/* Overall Severity Card */}
      <Card className={`border-2 shadow-sm ${
        severityLevel === 'green' ? 'border-green-500' :
        severityLevel === 'yellow' ? 'border-yellow-500' :
        'border-red-500'
      }`}>
        <CardHeader className={`${severityInfo.bgColor} px-6 py-5`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`h-5 w-5 rounded-full ${severityInfo.color} flex-shrink-0`}></div>
              <div>
                <CardTitle className={`${severityInfo.textColor} text-xl mb-1`}>{severityInfo.label}</CardTitle>
                <CardDescription className="mt-1 text-sm">{severityInfo.description}</CardDescription>
              </div>
            </div>
            <div className="text-right ml-4">
              <div className={`text-3xl font-bold ${severityInfo.textColor} mb-1`}>
                {severityResult.percentage}%
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Score: {severityResult.score}/{severityResult.maxScore}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Detailed Responses */}
      {showDetails && (
        <Card className="shadow-sm">
          <CardHeader className="px-6 py-5 border-b border-slate-200">
            <CardTitle className="text-xl font-semibold mb-2">Assessment Details</CardTitle>
            <CardDescription className="text-sm">Patient responses to severity questions</CardDescription>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <div className="space-y-6">
              {SEVERITY_QUESTIONS.map((question, index) => {
                const selectedWeight = responses[question.id];
                const selectedOption = question.options.find(opt => opt.weight === selectedWeight);
                
                return (
                  <div 
                    key={question.id} 
                    className={`pb-6 ${
                      index < SEVERITY_QUESTIONS.length - 1 ? 'border-b border-slate-200' : ''
                    }`}
                  >
                    <div className="mb-3">
                      <p className="text-base font-semibold text-slate-900 leading-relaxed">
                        {index + 1}. {question.question}
                      </p>
                    </div>
                    {selectedOption ? (
                      <div className="flex items-start justify-between gap-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <p className="text-sm text-slate-700 flex-1 leading-relaxed">
                          {selectedOption.label}
                        </p>
                        <span className={`flex-shrink-0 px-3 py-1.5 rounded-md text-xs font-semibold ${
                          selectedOption.weight === 1 ? 'bg-green-100 text-green-800 border border-green-200' :
                          selectedOption.weight === 2 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                          'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {selectedOption.weight === 1 ? 'Low' : selectedOption.weight === 2 ? 'Moderate' : 'Severe'}
                        </span>
                      </div>
                    ) : (
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <p className="text-sm text-slate-500 italic">No response provided</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

