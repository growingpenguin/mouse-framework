import { useState } from 'react';
import { ArrowRight, Info, Loader2, Sparkles, Play, Zap } from 'lucide-react';
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
    x: 180,
    y: 140,
  },
  {
    id: '2',
    label: 'Access patient data',
    stakes: 'high',
    riskTypes: ['security', 'legal'],
    x: 420,
    y: 140,
  },
  {
    id: '3',
    label: 'Medical interpretation',
    stakes: 'high',
    riskTypes: ['legal'],
    x: 180,
    y: 340,
  },
  {
    id: '4',
    label: 'Notify stakeholders',
    stakes: 'high',
    riskTypes: ['irreversible', 'company-wide'],
    x: 420,
    y: 340,
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

  // Generate curved connection paths
  const generateConnections = () => {
    const connections: JSX.Element[] = [];
    
    if (previewTasks.length < 2) return connections;
    
    const connectionPairs: [number, number][] = [];
    
    if (previewTasks.length === 2) {
      connectionPairs.push([0, 1]);
    } else if (previewTasks.length === 3) {
      connectionPairs.push([0, 2], [1, 2]);
    } else if (previewTasks.length >= 4) {
      connectionPairs.push([0, 2], [1, 3], [2, 3]);
    }
    
    connectionPairs.forEach(([fromIdx, toIdx], i) => {
      if (fromIdx >= previewTasks.length || toIdx >= previewTasks.length) return;
      
      const from = previewTasks[fromIdx];
      const to = previewTasks[toIdx];
      
      if (!from.x || !from.y || !to.x || !to.y) return;
      
      const startX = from.x;
      const startY = from.y + 50;
      const endX = to.x;
      const endY = to.y - 50;
      
      const midY = (startY + endY) / 2;
      const path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
      
      connections.push(
        <path
          key={`connection-${i}`}
          d={path}
          fill="none"
          stroke="url(#connectionGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-60"
        />
      );
      
      connections.push(
        <circle key={`dot-${i}`} r="4" fill="#6366f1">
          <animateMotion
            dur={`${3 + i * 0.5}s`}
            repeatCount="indefinite"
            path={path}
          />
        </circle>
      );
    });
    
    return connections;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-200/50 mb-4">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-slate-600">AI-Powered Task Analysis</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            What do you want to do?
          </h1>
          <p className="text-lg text-slate-600">
            Enter a high-level request and <span className="text-indigo-600 font-medium">AI will decompose it</span> into tasks
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-8">
          <textarea
            className="w-full h-32 px-5 py-4 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 text-lg bg-white/80"
            placeholder="Example: Handle this patient report and notify the legal team"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {/* Demo button - no API key needed! */}
            {!hasDecomposed && (
              <button
                onClick={handleTryDemo}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30"
              >
                <Play className="w-5 h-5" />
                Try Demo (No API Key)
              </button>
            )}
            
            {/* AI decompose button */}
            <button
              onClick={handleDecompose}
              disabled={isLoading || !inputText.trim()}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-400 text-white px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Decompose with Gemini
                </>
              )}
            </button>
            
            {/* Continue button - shows after decomposition */}
            {hasDecomposed && (
              <button
                onClick={handleContinue}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Decomposed Framework */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Task Framework
              </h2>
              <p className="text-sm text-slate-500">AI-decomposed workflow visualization</p>
            </div>
          </div>

          {/* Canvas for nodes and connections */}
          <div className="relative h-[480px] bg-gradient-to-br from-slate-100/50 via-white to-blue-50/30 rounded-xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }} />
            </div>
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              {generateConnections()}
            </svg>

            {/* Task Nodes */}
            {previewTasks.map((task) => (
              <div
                key={task.id}
                className="absolute transition-all duration-500 ease-out"
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
          <div className="flex items-center justify-center gap-8 pt-6 mt-6 border-t border-slate-200/50">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm" />
              <span className="text-sm text-slate-600">Low-stakes (reversible, informational)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-sm" />
              <span className="text-sm text-slate-600">High-stakes (irreversible, sensitive)</span>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-5 flex items-start gap-4 shadow-lg">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-amber-900">
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
