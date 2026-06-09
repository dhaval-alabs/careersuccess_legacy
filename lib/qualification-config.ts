export interface LpQualificationConfig {
  subject: string;
  questions: string[];
  options: (string[])[];
}

const COMMON_QUESTIONS = [
  "Quick one — are you working, studying, or just starting out?",
  "What's drawing you toward {course} right now?",
  "When are you hoping to get started?",
  "Last one — when works best for a learning advisor to call you?"
];

const COMMON_OPTIONS = [
  ['Working professional', 'Fresher / recent graduate', 'Student', 'Between jobs right now'],
  ['Start my career in data / AI', 'Switch into a data / AI role', 'Upskill or get promoted', 'Just exploring for now'],
  ['This month', 'In the next month or two', 'Still figuring it out'],
  ['As soon as possible', 'Later today (before 6 PM)', 'Tomorrow morning (10 AM–1 PM)', 'Tomorrow afternoon (1–6 PM)', 'Let me pick a specific time']
];

export const QUALIFICATION_CONFIG: Record<string, LpQualificationConfig> = {
  'data-science-specialization': { 
    subject: 'Data Science', 
    questions: COMMON_QUESTIONS, 
    options: COMMON_OPTIONS 
  },
  'data-science-ai': { 
    subject: 'Data Science & AI', 
    questions: COMMON_QUESTIONS, 
    options: COMMON_OPTIONS 
  },
  'data-analytics-ai': { 
    subject: 'Data Analytics & AI', 
    questions: COMMON_QUESTIONS, 
    options: COMMON_OPTIONS 
  },
};
