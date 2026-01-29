import { Lightbulb, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { TaskNodeData } from '@/components/TaskNode';

interface LearningOutcomeProps {
  tasks: TaskNodeData[];
  onRestart: () => void;
}

export function LearningOutcome({ tasks, onRestart }: LearningOutcomeProps) {
  const delegatedTasks = tasks.filter(t => t.stakes === 'low');
  const humanTasks = tasks.filter(t => t.stakes === 'high');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-semibold text-slate-900 mb-4 text-center">
          What you learned
        </h1>
        <p className="text-slate-600 text-center mb-12">
          Understanding when to delegate and when to decide
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {/* Delegated Tasks */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-emerald-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                Safely Delegated
              </h2>
            </div>
            <div className="space-y-3">
              {delegatedTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-start gap-2 text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  <span className="text-slate-700">{task.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-emerald-100">
              <p className="text-xs text-emerald-700 font-medium">
                ✓ Low-stakes, reversible, informational tasks
              </p>
            </div>
          </div>

          {/* Human-Controlled Tasks */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-red-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">
                Required Human Control
              </h2>
            </div>
            <div className="space-y-3">
              {humanTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-start gap-2 text-sm"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                  <span className="text-slate-700">{task.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-red-100">
              <p className="text-xs text-red-700 font-medium">
                ⚠ High-stakes, irreversible, sensitive tasks
              </p>
            </div>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="bg-gradient-to-br from-violet-50 to-blue-50 rounded-xl border-2 border-violet-200 p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-violet-200 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-7 h-7 text-violet-700" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Key Takeaways
              </h2>
              <p className="text-sm text-slate-600">
                Principles for effective human-AI collaboration
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-violet-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-emerald-700 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Low-stakes, reversible tasks are safe to delegate
                  </h3>
                  <p className="text-sm text-slate-600">
                    Tasks that can be undone, involve no sensitive data, and have 
                    minimal consequences can be fully automated.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-violet-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-700 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    High-stakes, irreversible tasks require human judgment
                  </h3>
                  <p className="text-sm text-slate-600">
                    Decisions with legal, financial, security, or ethical implications 
                    must include human oversight and final approval.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-violet-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-700 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    AI assists, but you maintain control
                  </h3>
                  <p className="text-sm text-slate-600">
                    The AI helps you build and execute your process, but you always 
                    retain the ability to review, modify, and override decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reinforcement Message */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold text-slate-900">Core Principle</h3>
          </div>
          <p className="text-slate-700 leading-relaxed">
            The AI helps you <strong>improve your process</strong>, not replace your decisions. 
            Think of it as a framework builder that enhances your workflow while keeping 
            you in control of critical choices.
          </p>
        </div>

        {/* Performance Summary */}
        <div className="bg-slate-100 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-slate-900 mb-4 text-center">
            Collaboration Summary
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-1">
                {tasks.length}
              </div>
              <div className="text-sm text-slate-600">Total tasks</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-1">
                {Math.round((delegatedTasks.length / tasks.length) * 100)}%
              </div>
              <div className="text-sm text-slate-600">Automated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {Math.round((humanTasks.length / tasks.length) * 100)}%
              </div>
              <div className="text-sm text-slate-600">Human-guided</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={onRestart}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            Try Another Workflow
          </button>
        </div>
      </div>
    </div>
  );
}
