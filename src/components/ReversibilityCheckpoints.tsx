import { useState } from 'react';
import { Undo2, RotateCcw, Eye, CheckCircle, ArrowRight, ArrowLeft, Send, CreditCard, Shield, Check, X, History, AlertTriangle } from 'lucide-react';

interface ReversibilityCheckpointsProps {
  onNext: () => void;
  onBack?: () => void;
}

interface ActionHistoryItem {
  id: number;
  action: string;
  timestamp: string;
  undone: boolean;
}

interface CheckpointState {
  id: string;
  approved: boolean;
}

export function ReversibilityCheckpoints({ onNext, onBack }: ReversibilityCheckpointsProps) {
  // Demo state for reversibility controls
  const [actionHistory, setActionHistory] = useState<ActionHistoryItem[]>([
    { id: 1, action: 'AI drafted email to legal team', timestamp: '2 min ago', undone: false },
    { id: 2, action: 'Added recipient: legal@company.com', timestamp: '1 min ago', undone: false },
    { id: 3, action: 'Attached patient report summary', timestamp: '30 sec ago', undone: false },
  ]);
  
  const [checkpoints, setCheckpoints] = useState<CheckpointState[]>([
    { id: 'send', approved: false },
    { id: 'payment', approved: false },
    { id: 'security', approved: false },
  ]);

  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [lastUndone, setLastUndone] = useState<string | null>(null);

  // Undo last action
  const handleUndo = () => {
    const lastAction = [...actionHistory].reverse().find(a => !a.undone);
    if (lastAction) {
      setActionHistory(actionHistory.map(a => 
        a.id === lastAction.id ? { ...a, undone: true } : a
      ));
      setLastUndone(lastAction.action);
      setTimeout(() => setLastUndone(null), 3000);
    }
  };

  // Redo (restore) an undone action
  const handleRedo = (id: number) => {
    setActionHistory(actionHistory.map(a => 
      a.id === id ? { ...a, undone: false } : a
    ));
  };

  // Rollback to a specific point
  const handleRollback = (id: number) => {
    setActionHistory(actionHistory.map(a => 
      a.id > id ? { ...a, undone: true } : { ...a, undone: false }
    ));
    setShowHistory(false);
  };

  // Toggle checkpoint approval
  const handleToggleCheckpoint = (id: string) => {
    setCheckpoints(checkpoints.map(c => 
      c.id === id ? { ...c, approved: !c.approved } : c
    ));
  };

  const activeActions = actionHistory.filter(a => !a.undone);
  const canUndo = activeActions.length > 0;
  const allCheckpointsApproved = checkpoints.every(c => c.approved);

  const checkpointData = [
    {
      id: 'send',
      icon: Send,
      title: 'Sending data',
      description: 'Review recipients and content before sending',
    },
    {
      id: 'payment',
      icon: CreditCard,
      title: 'Making payments',
      description: 'Confirm amount, recipient, and payment method',
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Changing security settings',
      description: 'Verify changes to access controls and permissions',
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

        {/* Undo notification */}
        {lastUndone && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-pulse">
            <Check className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-800 font-medium">Undone: {lastUndone}</span>
          </div>
        )}

        {/* Reversibility Controls - Now Interactive! */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Reversibility Controls
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Undo Button */}
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className={`bg-white rounded-xl shadow-sm border-2 p-6 text-left transition-all ${
                canUndo 
                  ? 'border-blue-200 hover:border-blue-400 hover:shadow-md cursor-pointer' 
                  : 'border-slate-200 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Undo2 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Undo
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {canUndo 
                  ? `Click to undo: "${activeActions[activeActions.length - 1]?.action.slice(0, 25)}..."` 
                  : 'No actions to undo'}
              </p>
            </button>

            {/* Rollback Button */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-6 text-left hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <RotateCcw className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Rollback
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {showHistory ? 'Click to hide history' : 'Click to view action history'}
              </p>
            </button>

            {/* Preview Button */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-6 text-left hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                Preview before commit
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {showPreview ? 'Hide preview' : 'Click to preview pending changes'}
              </p>
            </button>
          </div>
        </div>

        {/* Action History Panel (shown when Rollback is clicked) */}
        {showHistory && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-slate-600" />
              <h3 className="font-semibold text-slate-900">Action History</h3>
            </div>
            <div className="space-y-2">
              {actionHistory.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    item.undone ? 'bg-slate-100 opacity-50' : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      item.undone ? 'bg-slate-300 text-slate-600' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${item.undone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {item.action}
                      </div>
                      <div className="text-xs text-slate-500">{item.timestamp}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {item.undone ? (
                      <button
                        onClick={() => handleRedo(item.id)}
                        className="px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded"
                      >
                        Redo
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRollback(item.id)}
                        className="px-3 py-1 text-xs font-medium text-amber-600 hover:bg-amber-50 rounded"
                      >
                        Rollback here
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview Panel (shown when Preview is clicked) */}
        {showPreview && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border-2 border-violet-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5 text-violet-600" />
              <h3 className="font-semibold text-slate-900">Preview: Pending Email</h3>
            </div>
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="flex gap-2">
                <span className="text-sm font-medium text-slate-600 w-20">To:</span>
                <span className="text-sm text-slate-900">legal@company.com</span>
              </div>
              <div className="flex gap-2">
                <span className="text-sm font-medium text-slate-600 w-20">Subject:</span>
                <span className="text-sm text-slate-900">Patient Report Summary - Action Required</span>
              </div>
              <div className="flex gap-2">
                <span className="text-sm font-medium text-slate-600 w-20">Attachments:</span>
                <span className="text-sm text-slate-900">patient_report_summary.pdf</span>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <span className="text-sm font-medium text-slate-600">Body:</span>
                <p className="text-sm text-slate-700 mt-2">
                  Dear Legal Team,<br /><br />
                  Please find attached the patient report summary for your review. 
                  This document requires your interpretation regarding compliance implications...<br /><br />
                  Best regards,<br />
                  AI Assistant
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Close Preview
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-lg flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                Approve & Send
              </button>
            </div>
          </div>
        )}

        {/* Mandatory Checkpoints - Now Interactive! */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Mandatory Checkpoints
          </h2>
          <div className="space-y-4">
            {checkpointData.map((checkpoint) => {
              const Icon = checkpoint.icon;
              const state = checkpoints.find(c => c.id === checkpoint.id);
              const isApproved = state?.approved || false;
              
              return (
                <div
                  key={checkpoint.id}
                  className={`bg-white rounded-xl shadow-sm border-2 p-6 transition-all ${
                    isApproved ? 'border-emerald-300 bg-emerald-50/50' : 'border-amber-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isApproved ? 'bg-emerald-100' : 'bg-amber-100'
                    }`}>
                      <Icon className={`w-7 h-7 ${isApproved ? 'text-emerald-600' : 'text-amber-600'}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {checkpoint.title}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3">
                        {checkpoint.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className={`text-sm font-medium ${isApproved ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {isApproved ? 'Approved' : 'Requires approval'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleCheckpoint(checkpoint.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                        isApproved 
                          ? 'bg-emerald-100 border-emerald-300 text-emerald-700 hover:bg-emerald-200' 
                          : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                      }`}
                    >
                      {isApproved ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Approved</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">Click to Approve</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Checkpoint Progress</span>
            <span className="text-sm text-slate-500">
              {checkpoints.filter(c => c.approved).length} / {checkpoints.length} approved
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(checkpoints.filter(c => c.approved).length / checkpoints.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Key Message */}
        <div className={`border-2 rounded-xl p-6 mb-8 text-center transition-all ${
          allCheckpointsApproved 
            ? 'bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200' 
            : 'bg-gradient-to-r from-blue-50 to-violet-50 border-blue-200'
        }`}>
          <p className="text-lg font-semibold text-slate-900">
            {allCheckpointsApproved 
              ? '✅ All checkpoints approved!' 
              : 'Delegation never removes your control'}
          </p>
          <p className="text-sm text-slate-600 mt-2">
            {allCheckpointsApproved 
              ? 'You have reviewed and approved all mandatory checkpoints.' 
              : 'You maintain full authority to review, modify, or cancel any action at any stage'}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 border border-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          )}
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
