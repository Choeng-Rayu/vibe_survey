// Placeholder API for fetching survey data
export interface Option {
  id: string;
  label: string;
  value: any;
}

export type QuestionType = 'multiple_choice' | 'single_choice' | 'text';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: Option[];
  // Simple branching rule for demo purposes
  skipIfAnswer?: any;
}

export interface Survey {
  id: string;
  title: string;
  questions: Question[];
}

/**
 * Mock fetchSurvey implementation.
 * Returns a static survey with a few example questions.
 */
export async function fetchSurvey(surveyId: string): Promise<Survey> {
  // In a real implementation this would call an API endpoint.
  // Here we return a simple static survey.
  return {
    id: surveyId,
    title: 'Demo Survey',
    questions: [
      {
        id: 'q1',
        type: 'single_choice',
        text: 'What is your favorite color?',
        options: [
          { id: 'opt1', label: 'Red', value: 'red' },
          { id: 'opt2', label: 'Green', value: 'green' },
          { id: 'opt3', label: 'Blue', value: 'blue' },
        ],
      },
      {
        id: 'q2',
        type: 'multiple_choice',
        text: 'Select the fruits you like',
        options: [
          { id: 'opt1', label: 'Apple', value: 'apple' },
          { id: 'opt2', label: 'Banana', value: 'banana' },
          { id: 'opt3', label: 'Cherry', value: 'cherry' },
        ],
      },
      {
        id: 'q3',
        type: 'text',
        text: 'Any additional comments?',
        // Demonstrate branching: skip this question if previous answer includes 'skip'
        skipIfAnswer: 'skip',
      },
    ],
  };
}
