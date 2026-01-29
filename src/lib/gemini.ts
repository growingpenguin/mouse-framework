import type { TaskNodeData, RiskType } from '@/components/TaskNode';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
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

    // Add IDs and positions for visualization
    const positions = [
      { x: 200, y: 120 },
      { x: 450, y: 120 },
      { x: 150, y: 280 },
      { x: 350, y: 280 },
      { x: 550, y: 280 },
      { x: 350, y: 420 },
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
    return getFallbackTasks();
  }
}

function getFallbackTasks(): TaskNodeData[] {
  return [
    { id: '1', label: 'Analyze request', stakes: 'low', x: 200, y: 120 },
    { id: '2', label: 'Gather information', stakes: 'low', x: 450, y: 120 },
    { id: '3', label: 'Process data', stakes: 'high', riskTypes: ['security'], x: 200, y: 280 },
    { id: '4', label: 'Make decision', stakes: 'high', riskTypes: ['irreversible'], x: 450, y: 280 },
  ];
}

