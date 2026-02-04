import { useState } from 'react';
import { ArrowRight, Info, Loader2, Sparkles, Zap, Stethoscope, DollarSign, Server, ChevronRight } from 'lucide-react';
import { TaskNode, TaskNodeData } from '@/components/TaskNode';
import { decomposeTaskWithGemini } from '@/lib/gemini';

interface TaskInputProps {
  onNext: (tasks: TaskNodeData[]) => void;
}

// Demo scenarios with different task types
interface DemoScenario {
  id: string;
  title: string;
  description: string;
  icon: typeof Stethoscope;
  color: string;
  gradient: string;
  prompt: string;
  tasks: TaskNodeData[];
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'healthcare',
    title: 'Healthcare',
    description: 'Patient report & legal notification',
    icon: Stethoscope,
    color: 'text-rose-600',
    gradient: 'from-rose-500 to-pink-500',
    prompt: `I need to organize the following tasks for a patient case:
1. Read and summarize the patient's medical report
2. Access the patient's protected health information (PHI) from the database
3. Provide medical interpretation of the lab results
4. Send notification email to the legal team about potential malpractice concerns`,
    tasks: [
      { id: '1', label: 'Summarize report', stakes: 'low', x: 150, y: 120 },
      { id: '2', label: 'Access patient data', stakes: 'high', riskTypes: ['security', 'legal'], x: 450, y: 120 },
      { id: '3', label: 'Medical interpretation', stakes: 'high', riskTypes: ['legal'], x: 150, y: 380 },
      { id: '4', label: 'Notify stakeholders', stakes: 'high', riskTypes: ['irreversible', 'company-wide'], x: 450, y: 380 },
    ],
  },
  {
    id: 'finance',
    title: 'Finance',
    description: 'Payroll processing & bonus approval',
    icon: DollarSign,
    color: 'text-emerald-600',
    gradient: 'from-emerald-500 to-teal-500',
    prompt: `I need to organize these quarterly payroll tasks:
1. Calculate total payroll based on employee hours and salaries
2. Review performance data to determine bonus eligibility
3. Get CFO approval for bonus payments over $10,000
4. Execute wire transfers to employee bank accounts`,
    tasks: [
      { id: '1', label: 'Calculate payroll', stakes: 'low', x: 150, y: 120 },
      { id: '2', label: 'Review bonus criteria', stakes: 'low', x: 450, y: 120 },
      { id: '3', label: 'Approve payments', stakes: 'high', riskTypes: ['irreversible', 'company-wide'], x: 150, y: 380 },
      { id: '4', label: 'Execute bank transfer', stakes: 'high', riskTypes: ['irreversible', 'security'], x: 450, y: 380 },
    ],
  },
  {
    id: 'devops',
    title: 'IT / DevOps',
    description: 'Production deployment & security',
    icon: Server,
    color: 'text-violet-600',
    gradient: 'from-violet-500 to-purple-500',
    prompt: `I need to organize these deployment tasks:
1. Run the automated test suite on the staging environment  
2. Build Docker images and push to container registry
3. Deploy v2.5.0 to production Kubernetes cluster
4. Update firewall rules to allow new API endpoints`,
    tasks: [
      { id: '1', label: 'Run test suite', stakes: 'low', x: 150, y: 120 },
      { id: '2', label: 'Build artifacts', stakes: 'low', x: 450, y: 120 },
      { id: '3', label: 'Deploy to production', stakes: 'high', riskTypes: ['irreversible', 'company-wide'], x: 150, y: 380 },
      { id: '4', label: 'Update firewall rules', stakes: 'high', riskTypes: ['security', 'irreversible'], x: 450, y: 380 },
    ],
  },
];

export function TaskInput({ onNext }: TaskInputProps) {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewTasks, setPreviewTasks] = useState<TaskNodeData[]>([]);
  const [hasDecomposed, setHasDecomposed] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const handleDecompose = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    try {
      const tasks = await decomposeTaskWithGemini(inputText);
      setPreviewTasks(tasks);
      setHasDecomposed(true);
      setSelectedScenario(null);
    } catch (error) {
      console.error('Failed to decompose task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemo = (scenario: DemoScenario) => {
    setInputText(scenario.prompt);
    setPreviewTasks(scenario.tasks);
    setHasDecomposed(true);
    setSelectedScenario(scenario.id);
  };

  const handleContinue = () => {
    onNext(previewTasks);
  };

  // Generate curved connection paths
  const generateConnections = () => {
    const connections: JSX.Element[] = [];
    
    if (previewTasks.length < 2) return connections;
    
    // Define connection pairs based on task count
    // For 4 tasks in 2x2 grid: connect top row to bottom row
    const connectionPairs: [number, number][] = [];
    
    if (previewTasks.length === 2) {
      connectionPairs.push([0, 1]);
    } else if (previewTasks.length === 3) {
      connectionPairs.push([0, 2], [1, 2]);
    } else if (previewTasks.length >= 4) {
      // Top-left → Bottom-left, Top-right → Bottom-right, Bottom-left → Bottom-right
      connectionPairs.push([0, 2], [1, 3], [2, 3]);
    }
    
    connectionPairs.forEach(([fromIdx, toIdx], i) => {
      if (fromIdx >= previewTasks.length || toIdx >= previewTasks.length) return;
      
      const from = previewTasks[fromIdx];
      const to = previewTasks[toIdx];
      
      if (!from.x || !from.y || !to.x || !to.y) return;
      
      const startX = from.x;
      const startY = from.y + 70; // Increased offset for larger nodes
      const endX = to.x;
      const endY = to.y - 70;
      
      const midY = (startY + endY) / 2;
      const path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
      
      connections.push(
        <path
          key={`connection-${i}`}
          d={path}
          fill="none"
          stroke="url(#connectionGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="opacity-70"
        />
      );
      
      // Animated dot traveling along the path
      connections.push(
        <circle key={`dot-${i}`} r="4" fill="#6366f1">
          <animateMotion
            dur={`${2.5 + i * 0.3}s`}
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

        {/* Demo Scenario Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span className="text-sm font-semibold text-slate-700">Try a Demo Scenario (No API Key Required)</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {DEMO_SCENARIOS.map((scenario) => {
              const Icon = scenario.icon;
              const isSelected = selectedScenario === scenario.id;
              return (
                <button
                  key={scenario.id}
                  onClick={() => handleSelectDemo(scenario)}
                  className={`
                    relative p-5 rounded-2xl text-left transition-all duration-300 group
                    ${isSelected 
                      ? `bg-gradient-to-br ${scenario.gradient} text-white shadow-xl scale-[1.02]` 
                      : 'bg-white/70 hover:bg-white border border-slate-200/50 hover:border-slate-300 hover:shadow-lg'
                    }
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors
                    ${isSelected 
                      ? 'bg-white/20' 
                      : `bg-gradient-to-br ${scenario.gradient} bg-opacity-10`
                    }
                  `}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-white' : scenario.color}`} />
                  </div>
                  <h3 className={`font-bold text-lg mb-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {scenario.title}
                  </h3>
                  <p className={`text-sm ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                    {scenario.description}
                  </p>
                  <div className={`
                    absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300
                    ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'}
                  `}>
                    <ChevronRight className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-sm font-semibold text-slate-700">Or Enter Your Own Request</span>
          </div>
          <textarea
            className="w-full h-28 px-5 py-4 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 text-base bg-white/80"
            placeholder="Example: Review customer complaints and escalate critical issues to management"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (selectedScenario) setSelectedScenario(null);
            }}
          />
          
          <div className="mt-4 flex flex-wrap justify-end gap-3">
            {/* AI decompose button */}
            <button
              onClick={handleDecompose}
              disabled={isLoading || !inputText.trim()}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Decompose with Gemini
                </>
              )}
            </button>
            
            {/* Continue button */}
            {hasDecomposed && (
              <button
                onClick={handleContinue}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Task Framework Preview */}
        {hasDecomposed && previewTasks.length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Task Framework
                </h2>
                <p className="text-sm text-slate-500">AI-decomposed workflow • {previewTasks.length} tasks identified</p>
              </div>
            </div>

            {/* Canvas */}
            <div className="relative h-[520px] bg-gradient-to-br from-slate-100/50 via-white to-blue-50/30 rounded-xl overflow-hidden">
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
                <span className="text-sm text-slate-600">Low-stakes (safe to delegate)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-sm" />
                <span className="text-sm text-slate-600">High-stakes (human required)</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasDecomposed && (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Select a Demo or Enter Your Request</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Choose one of the demo scenarios above or type your own request to see how AI decomposes complex tasks.
            </p>
          </div>
        )}

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
