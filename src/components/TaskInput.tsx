import { useState } from 'react';
import { ArrowRight, Info, Loader2, Sparkles, Play } from 'lucide-react';
import { TaskNode, TaskNodeData } from '@/components/TaskNode';
import { decomposeTaskWithGemini } from '@/lib/gemini';

interface TaskInputProps {
  onNext: (tasks: TaskNodeData[]) => void;
}

// Demo tasks for the default example - no API key needed!
const DEMO_TASKS: TaskNodeData[] = [
  {
    id: '1',
    label: 'Summarize report',
    stakes: 'low',
    x: 200,
    y: 120,
  },
  {
    id: '2',
    label: 'Access patient data',
    stakes: 'high',
    riskTypes: ['security', 'legal'],
    x: 450,
    y: 120,
  },
  {
    id: '3',
    label: 'Legal interpretation',
    stakes: 'high',
    riskTypes: ['legal', 'company-wide'],
    x: 200,
    y: 280,
  },
  {
    id: '4',
    label: 'Send external email',
    stakes: 'high',
    riskTypes: ['irreversible', 'company-wide'],
    x: 450,
    y: 280,
  },
];

export function TaskInput({ onNext }: TaskInputProps) {
  const [inputText, setInputText] = useState('Handle this patient report and notify the legal team');
  const [isLoading, setIsLoading] = useState(false);
  const [previewTasks, setPreviewTasks] = useState<TaskNodeData[]>(DEMO_TASKS);
  const [hasDecomposed, setHasDecomposed] = useState(false);

  const handleDecompose = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    try {
      const tasks = await decomposeTaskWithGemini(inputText);
      setPreviewTasks(tasks);
      setHasDecomposed(true);
    } catch (error) {
      console.error('Failed to decompose task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick demo - skip API call and use pre-made tasks
  const handleTryDemo = () => {
    setInputText('Handle this patient report and notify the legal team');
    setPreviewTasks(DEMO_TASKS);
    setHasDecomposed(true);
  };

  const handleContinue = () => {
    onNext(previewTasks);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-semibold text-slate-900 mb-4 text-center">
          What do you want to do?
        </h1>
        <p className="text-slate-600 text-center mb-12">
          Enter a high-level request and the AI will decompose it into tasks
        </p>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <textarea
            className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
            placeholder="Example: Handle this patient report and notify the legal team"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            {/* Demo button - no API key needed! */}
            {!hasDecomposed && (
              <button
                onClick={handleTryDemo}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Try Demo (No API Key)
              </button>
            )}
            
            {/* AI decompose button */}
            <button
              onClick={handleDecompose}
              disabled={isLoading || !inputText.trim()}
              className="bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Decompose with Gemini
                </>
              )}
            </button>
            
            {/* Continue button - shows after decomposition */}
            {hasDecomposed && (
              <button
                onClick={handleContinue}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Decomposed Framework */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">
            Task Framework
          </h2>

          {/* SVG Canvas for connections */}
          <div className="relative h-[450px] mb-4">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Dynamic connection lines between tasks */}
              {previewTasks.map((task, index) => {
                if (index === previewTasks.length - 1) return null;
                const nextTask = previewTasks[index + 1];
                return (
                  <line
                    key={`line-${index}`}
                    x1={task.x}
                    y1={(task.y || 0) + 40}
                    x2={nextTask.x}
                    y2={(nextTask.y || 0) - 40}
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeDasharray="4"
                  />
                );
              })}
            </svg>

            {/* Task Nodes */}
            {previewTasks.map((task) => (
              <div
                key={task.id}
                className="absolute"
                style={{
                  left: `${task.x}px`,
                  top: `${task.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <TaskNode node={task} showRiskIcons />
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-8 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500" />
              <span className="text-sm text-slate-600">Low-stakes (reversible, informational)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <span className="text-sm text-slate-600">High-stakes (irreversible, sensitive)</span>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">
              High-stakes tasks should not be delegated to AI
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Tasks involving sensitive data, irreversible actions, or legal/medical decisions require human oversight.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
