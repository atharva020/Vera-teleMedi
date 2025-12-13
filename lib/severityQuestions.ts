// Fixed Severity Assessment Questions for All Patients

export interface SeverityOption {
  label: string;
  weight: number; // 1 = mild/green, 2 = moderate/yellow, 3 = severe/red
}

export interface SeverityQuestion {
  id: string;
  question: string;
  options: SeverityOption[];
}

export const SEVERITY_QUESTIONS: SeverityQuestion[] = [
  {
    id: 'pain',
    question: 'In the last 7 days, what was the SEVERITY of your PAIN?',
    options: [
      { label: 'Mild pain, no functional impact', weight: 1 },
      { label: 'Moderate pain, new or worsening, affects activities', weight: 2 },
      { label: 'Severe pain; unable to function; uncontrolled', weight: 3 },
    ],
  },
  {
    id: 'nausea_vomiting',
    question: 'In the last 7 days, what was the SEVERITY of your NAUSEA / VOMITING?',
    options: [
      { label: 'Mild nausea, eating normally', weight: 1 },
      { label: 'Able to eat/drink but with difficulty', weight: 2 },
      { label: 'Unable to keep food/liquids; signs of dehydration', weight: 3 },
    ],
  },
  {
    id: 'fever_temperature',
    question: 'In the last 7 days, what was the SEVERITY of your FEVER / TEMPERATURE?',
    options: [
      { label: '<37.8°C, feels well', weight: 1 },
      { label: '37.8–38.3°C, feels unwell', weight: 2 },
      { label: '≥38.3°C (possible neutropenic fever)*', weight: 3 },
    ],
  },
  {
    id: 'fatigue',
    question: 'In the last 7 days, what was the SEVERITY of your FATIGUE?',
    options: [
      { label: 'Mild, usual for patient', weight: 1 },
      { label: 'Worsening fatigue; new functional impact', weight: 2 },
      { label: 'Extreme fatigue; difficulty walking or standing', weight: 3 },
    ],
  },
  {
    id: 'wound_incision',
    question: 'In the last 7 days, what was the SEVERITY of your WOUND / INCISION?',
    options: [
      { label: 'Slight redness, no discharge', weight: 1 },
      { label: 'Increasing redness, small discharge', weight: 2 },
      { label: 'Pus, foul smell, fever, rapidly spreading redness', weight: 3 },
    ],
  },
  {
    id: 'breathing_cough',
    question: 'In the last 7 days, what was the SEVERITY of your BREATHING / COUGH?',
    options: [
      { label: 'Occasional cough, no limitation', weight: 1 },
      { label: 'Persistent cough, mild shortness of breath', weight: 2 },
      { label: 'Difficulty breathing, chest pain', weight: 3 },
    ],
  },
  {
    id: 'bleeding',
    question: 'In the last 7 days, what was the SEVERITY of your BLEEDING?',
    options: [
      { label: 'Small spotting, self-resolves', weight: 1 },
      { label: 'Recurrent spotting, new bruising', weight: 2 },
      { label: 'Heavy bleeding, blood in stool/vomit/urine', weight: 3 },
    ],
  },
  {
    id: 'gi_symptoms',
    question: 'In the last 7 days, what was the SEVERITY of your GI SYMPTOMS?',
    options: [
      { label: 'Mild diarrhea (<3 stools/day)', weight: 1 },
      { label: 'Moderate diarrhea, mild abdominal pain', weight: 2 },
      { label: 'Severe diarrhea (>6/day), severe abdominal pain', weight: 3 },
    ],
  },
  {
    id: 'weight_appetite',
    question: 'In the last 7 days, what was the SEVERITY of your WEIGHT / APPETITE?',
    options: [
      { label: 'Mild appetite loss', weight: 1 },
      { label: 'Eating <50% of usual intake', weight: 2 },
      { label: 'Not eating at all for 24h or >5% weight loss/week', weight: 3 },
    ],
  },
];

export type SeverityLevel = 'green' | 'yellow' | 'red';

export interface SeverityResult {
  level: SeverityLevel;
  score: number;
  maxScore: number;
  percentage: number;
}

/**
 * Calculate overall severity based on patient responses
 * @param responses - Record of question IDs to selected option weights
 * @returns Severity result with level and score
 */
export function calculateSeverity(responses: Record<string, number>): SeverityResult {
  const weights = Object.values(responses).filter(w => typeof w === 'number');
  
  if (weights.length === 0) {
    return { level: 'green', score: 0, maxScore: SEVERITY_QUESTIONS.length * 3, percentage: 0 };
  }

  const totalScore = weights.reduce((sum, weight) => sum + weight, 0);
  const maxScore = SEVERITY_QUESTIONS.length * 3;
  const percentage = (totalScore / maxScore) * 100;

  let level: SeverityLevel;
  if (percentage <= 40) {
    level = 'green';
  } else if (percentage <= 70) {
    level = 'yellow';
  } else {
    level = 'red';
  }

  return {
    level,
    score: totalScore,
    maxScore,
    percentage: Math.round(percentage),
  };
}

/**
 * Get severity level display information
 */
export function getSeverityDisplay(level: SeverityLevel): {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
} {
  switch (level) {
    case 'green':
      return {
        label: 'Low Priority',
        color: 'bg-green-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        description: 'Routine consultation - No immediate concerns',
      };
    case 'yellow':
      return {
        label: 'Medium Priority',
        color: 'bg-yellow-500',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        description: 'Moderate concern - Should be reviewed soon',
      };
    case 'red':
      return {
        label: 'High Priority',
        color: 'bg-red-500',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        description: 'Urgent - Requires immediate attention',
      };
  }
}

