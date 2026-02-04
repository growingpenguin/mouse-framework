import type { TaskNodeData, RiskType } from '@/components/TaskNode';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// Using gemini-1.5-flash - FREE TIER: 15 RPM, 1M tokens/month, 1500 RPD
// See: https://ai.google.dev/pricing
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function decomposeTaskWithGemini(userRequest: string): Promise<TaskNodeData[]> {
  // Check if API key is configured
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
    console.warn('Gemini API key not configured. Using fallback tasks.');
    console.info('To enable AI: Get a free API key at https://aistudio.google.com/app/apikey');
    return getFallbackTasks(userRequest);
  }

  const prompt = `You are an AI task decomposition assistant. Analyze the following user request and break it down into individual tasks.

For each task, determine:
1. A short label (max 4 words)
2. Whether it's "low" or "high" stakes based on these criteria:
   - HIGH stakes if: involves sensitive data, irreversible actions, legal/medical decisions, security changes, financial transactions, or company-wide impact
   - LOW stakes if: reversible, informational, internal drafts, or has minimal consequences

3. For HIGH stakes tasks, identify risk types from: "irreversible", "legal", "security", "company-wide"

User request: "${userRequest}"

Respond ONLY with a valid JSON array in this exact format (no markdown, no explanation):
[
  {"label": "Task name", "stakes": "low"},
  {"label": "Task name", "stakes": "high", "riskTypes": ["legal", "security"]}
]

Generate 3-6 tasks that logically decompose this request.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();
    const text = data.candidates[0]?.content?.parts[0]?.text || '[]';
    
    // Clean up the response (remove markdown code blocks if present)
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const tasks = JSON.parse(cleanedText) as Array<{
      label: string;
      stakes: 'low' | 'high';
      riskTypes?: RiskType[];
    }>;

    // Add IDs and positions for visualization (matching improved layout)
    const positions = [
      { x: 150, y: 120 },
      { x: 450, y: 120 },
      { x: 150, y: 380 },
      { x: 450, y: 380 },
      { x: 300, y: 250 },
      { x: 300, y: 480 },
    ];

    return tasks.map((task, index) => ({
      id: String(index + 1),
      label: task.label,
      stakes: task.stakes,
      riskTypes: task.riskTypes,
      x: positions[index % positions.length].x,
      y: positions[index % positions.length].y,
    }));

  } catch (error) {
    console.error('Gemini API error:', error);
    // Return fallback tasks if API fails
    return getFallbackTasks(userRequest);
  }
}

function getFallbackTasks(userRequest?: string): TaskNodeData[] {
  // Smart fallback based on keywords in the request
  const request = (userRequest || '').toLowerCase();
  
  // Check for common patterns and return relevant fallback tasks
  if (request.includes('patient') || request.includes('medical') || request.includes('health')) {
    return [
      { id: '1', label: 'Summarize report', stakes: 'low', x: 150, y: 120 },
      { id: '2', label: 'Access patient data', stakes: 'high', riskTypes: ['security', 'legal'], x: 450, y: 120 },
      { id: '3', label: 'Medical interpretation', stakes: 'high', riskTypes: ['legal'], x: 150, y: 380 },
      { id: '4', label: 'Notify stakeholders', stakes: 'high', riskTypes: ['irreversible'], x: 450, y: 380 },
    ];
  }
  
  if (request.includes('payment') || request.includes('payroll') || request.includes('financial')) {
    return [
      { id: '1', label: 'Gather data', stakes: 'low', x: 150, y: 120 },
      { id: '2', label: 'Calculate amounts', stakes: 'low', x: 450, y: 120 },
      { id: '3', label: 'Verify accounts', stakes: 'high', riskTypes: ['security'], x: 150, y: 380 },
      { id: '4', label: 'Process payment', stakes: 'high', riskTypes: ['irreversible', 'legal'], x: 450, y: 380 },
    ];
  }
  
  if (request.includes('email') || request.includes('send') || request.includes('notify')) {
    return [
      { id: '1', label: 'Draft message', stakes: 'low', x: 150, y: 120 },
      { id: '2', label: 'Review content', stakes: 'low', x: 450, y: 120 },
      { id: '3', label: 'Verify recipients', stakes: 'high', riskTypes: ['security'], x: 150, y: 380 },
      { id: '4', label: 'Send email', stakes: 'high', riskTypes: ['irreversible'], x: 450, y: 380 },
    ];
  }
  
  // Default generic tasks
  return [
    { id: '1', label: 'Analyze request', stakes: 'low', x: 150, y: 120 },
    { id: '2', label: 'Gather information', stakes: 'low', x: 450, y: 120 },
    { id: '3', label: 'Process data', stakes: 'high', riskTypes: ['security'], x: 150, y: 380 },
    { id: '4', label: 'Execute action', stakes: 'high', riskTypes: ['irreversible'], x: 450, y: 380 },
  ];
}

