import { Undo2, RotateCcw, Eye, CheckCircle, ArrowRight, Send, CreditCard, Shield } from 'lucide-react';

interface ReversibilityCheckpointsProps {
  onNext: () => void;
}

export function ReversibilityCheckpoints({ onNext }: ReversibilityCheckpointsProps) {
  const reversibilityFeatures = [
    {
      icon: Undo2,
      title: 'Undo',
      description: 'Reverse any action immediately after execution',
      color: 'blue',
    },
    {
      icon: RotateCcw,
      title: 'Rollback',
      description: 'Return to any previous state in the workflow',
      color: 'blue',
    },
    {
      icon: Eye,
      title: 'Preview before commit',
      description: 'Review all changes before they take effect',
      color: 'blue',
    },
  ];

  const checkpoints = [
    {
      icon: Send,
      title: 'Sending data',
      description: 'Review recipients and content before sending',
      action: 'Mandatory approval',
    },
    {
      icon: CreditCard,
      title: 'Making payments',
      description: 'Confirm amount, recipient, and payment method',
      action: 'Mandatory approval',
    },
    {
      icon: Shield,
      title: 'Changing security settings',
      description: 'Verify changes to access controls and permissions',
      action: 'Mandatory approval',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        <h1 className="text-4xl font-semibold text-slate-900 mb-4 text-center">
          Control & safety
        </h1>
        <p className="text-slate-600 text-center mb-12">
          Every action is reversible and protected by checkpoints
        </p>

        {/* Reversibility Features */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Reversibility Controls
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {reversibilityFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mandatory Checkpoints */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Mandatory Checkpoints
          </h2>
          <div className="space-y-4">
            {checkpoints.map((checkpoint) => {
              const Icon = checkpoint.icon;
              return (
                <div
                  key={checkpoint.title}
                  className="bg-white rounded-xl shadow-sm border-2 border-amber-200 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {checkpoint.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3">
                        {checkpoint.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-sm font-medium text-amber-700">
                          {checkpoint.action}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-lg border border-amber-200">
                      <CheckCircle className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">
                        Human approval required
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workflow Example */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h3 className="font-semibold text-slate-900 mb-4">Example Workflow</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4 pb-3 border-b border-slate-200">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-semibold text-emerald-700 text-sm">
                1
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-900">AI drafts email</div>
                <div className="text-sm text-slate-500">Automated execution</div>
              </div>
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            
            <div className="flex items-center gap-4 pb-3 border-b border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-700 text-sm">
                2
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-900">Preview & edit draft</div>
                <div className="text-sm text-slate-500">User review checkpoint</div>
              </div>
              <CheckCircle className="w-5 h-5 text-amber-600" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center font-semibold text-amber-700 text-sm">
                3
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-900">Send email</div>
                <div className="text-sm text-slate-500">Requires explicit approval</div>
              </div>
              <Undo2 className="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Key Message */}
        <div className="bg-gradient-to-r from-blue-50 to-violet-50 border-2 border-blue-200 rounded-xl p-6 mb-8 text-center">
          <p className="text-lg font-semibold text-slate-900">
            Delegation never removes your control
          </p>
          <p className="text-sm text-slate-600 mt-2">
            You maintain full authority to review, modify, or cancel any action at any stage
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={onNext}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            Continue to Learning Summary
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
