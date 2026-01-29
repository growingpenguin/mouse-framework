import { Check, X, Lock, Building2, ShieldAlert, ArrowRight } from 'lucide-react';
import { TaskNodeData } from '@/components/TaskNode';

interface DelegationRulesProps {
  tasks: TaskNodeData[];
  onNext: () => void;
}

const riskReasons = {
  irreversible: 'Irreversible action',
  legal: 'Legal/medical impact',
  security: 'Security impact',
  'company-wide': 'Company-wide risk',
};

const riskIcons = {
  irreversible: Lock,
  legal: ShieldAlert,
  security: ShieldAlert,
  'company-wide': Building2,
};

export function DelegationRules({ tasks, onNext }: DelegationRulesProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-semibold text-slate-900 mb-4 text-center">
          Who should handle each part?
        </h1>
        <p className="text-slate-600 text-center mb-12">
          Delegation rules based on task stakes and reversibility
        </p>

        {/* Task List */}
        <div className="space-y-4 mb-6">
          {tasks.map((task) => {
            const isHighStakes = task.stakes === 'high';
            const canDelegate = !isHighStakes;

            return (
              <div
                key={task.id}
                className={`
                  bg-white rounded-xl shadow-sm border-2 p-6
                  ${isHighStakes ? 'border-red-200' : 'border-emerald-200'}
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Task Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`
                          w-3 h-3 rounded-full
                          ${isHighStakes ? 'bg-red-500' : 'bg-emerald-500'}
                        `}
                      />
                      <h3 className="text-lg font-semibold text-slate-900">
                        {task.label}
                      </h3>
                      <span
                        className={`
                          px-2 py-1 rounded text-xs font-medium
                          ${
                            isHighStakes
                              ? 'bg-red-100 text-red-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }
                        `}
                      >
                        {isHighStakes ? 'High-stakes' : 'Low-stakes'}
                      </span>
                    </div>

                    {/* Risk Reasons */}
                    {task.riskTypes && task.riskTypes.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {task.riskTypes.map((riskType) => {
                          const Icon = riskIcons[riskType];
                          return (
                            <div
                              key={riskType}
                              className="flex items-center gap-2 text-sm text-slate-600"
                            >
                              <Icon className="w-4 h-4 text-red-600" />
                              <span>{riskReasons[riskType]}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Delegation Decision */}
                    <div
                      className={`
                        flex items-center gap-2 px-4 py-3 rounded-lg font-medium
                        ${
                          canDelegate
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                        }
                      `}
                    >
                      {canDelegate ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Delegate to AI</span>
                        </>
                      ) : (
                        <>
                          <X className="w-5 h-5" />
                          <span>Human decision required</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Toggle Switch (disabled for high stakes) */}
                  <div className="flex flex-col items-end gap-2">
                    <div
                      className={`
                        w-14 h-8 rounded-full relative transition-colors
                        ${
                          canDelegate
                            ? 'bg-emerald-500 cursor-pointer'
                            : 'bg-slate-300 cursor-not-allowed'
                        }
                      `}
                    >
                      <div
                        className={`
                          absolute top-1 w-6 h-6 bg-white rounded-full transition-transform
                          ${canDelegate ? 'translate-x-7' : 'translate-x-1'}
                        `}
                      />
                    </div>
                    <span className="text-xs text-slate-500">
                      {canDelegate ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rule Box */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-200 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Delegation Rule</h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                AI can <strong>assist</strong> high-stakes tasks by providing information, 
                analysis, and recommendations, but should not <strong>decide</strong> them. 
                Final decisions on irreversible, sensitive, or critical actions must remain 
                with humans.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">
                {tasks.filter(t => t.stakes === 'low').length}
              </div>
              <div className="text-sm text-slate-600 mt-1">Tasks delegated to AI</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {tasks.filter(t => t.stakes === 'high').length}
              </div>
              <div className="text-sm text-slate-600 mt-1">Tasks requiring human control</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={onNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            Continue to Reversibility
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
