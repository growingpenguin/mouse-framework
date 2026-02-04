import { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Brain, 
  TrendingUp, 
  TrendingDown,
  Info,
  ChevronDown,
  ChevronUp,
  Shield,
  Zap
} from 'lucide-react';
import type { SelfCheckResult, SelfCheckSummary } from '@/lib/selfcheck';
import { SELFCHECK_PRINCIPLE } from '@/lib/selfcheck';

interface SelfCheckPanelProps {
  results: SelfCheckResult[];
  summary: SelfCheckSummary;
}

export function SelfCheckPanel({ results, summary }: SelfCheckPanelProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [showPrinciple, setShowPrinciple] = useState(false);

  const getConfidenceColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'text-emerald-600 bg-emerald-100';
      case 'medium': return 'text-amber-600 bg-amber-100';
      case 'low': return 'text-red-600 bg-red-100';
    }
  };

  const getConfidenceIcon = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return <CheckCircle className="w-5 h-5" />;
      case 'medium': return <AlertTriangle className="w-5 h-5" />;
      case 'low': return <XCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* SelfCheckGPT Header */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border-2 border-violet-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-violet-200 flex items-center justify-center flex-shrink-0">
            <Brain className="w-7 h-7 text-violet-700" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              SelfCheckGPT Analysis
            </h2>
            <p className="text-sm text-slate-600 mb-3">
              Detecting AI uncertainty by comparing multiple response samples. 
              High disagreement = potential hallucination.
            </p>
            <button
              onClick={() => setShowPrinciple(!showPrinciple)}
              className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1"
            >
              {showPrinciple ? 'Hide' : 'Show'} research insight
              {showPrinciple ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Research Principle */}
        {showPrinciple && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-violet-200">
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-slate-900">Problem: </span>
                  <span className="text-slate-600">{SELFCHECK_PRINCIPLE.problem}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-slate-900">Solution: </span>
                  <span className="text-slate-600">{SELFCHECK_PRINCIPLE.solution}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Zap className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-medium text-slate-900">Key Insight: </span>
                  <span className="text-slate-600">{SELFCHECK_PRINCIPLE.insight}</span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500 italic">
              Based on: Manakul et al. (2023) "SELFCHECKGPT: Zero-Resource Black-Box Hallucination Detection"
            </p>
          </div>
        )}
      </div>

      {/* Overall Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Consistency Summary
        </h3>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-900">
              {Math.round(summary.overallConfidence * 100)}%
            </div>
            <div className="text-sm text-slate-600">Overall Confidence</div>
          </div>
          <div className="text-center p-4 bg-emerald-50 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">
              {summary.highConfidenceTasks}
            </div>
            <div className="text-sm text-slate-600">High Agreement</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {summary.lowConfidenceTasks}
            </div>
            <div className="text-sm text-slate-600">Low Agreement</div>
          </div>
        </div>

        <div className={`p-4 rounded-lg ${
          summary.overallConfidence < 0.6 
            ? 'bg-red-50 border border-red-200' 
            : summary.overallConfidence < 0.75 
              ? 'bg-amber-50 border border-amber-200'
              : 'bg-emerald-50 border border-emerald-200'
        }`}>
          <p className="font-medium text-slate-900 mb-1">{summary.recommendation}</p>
          <p className="text-sm text-slate-600">{summary.trustCalibration}</p>
        </div>
      </div>

      {/* Per-Task Results */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          Per-Task Consistency Analysis
        </h3>
        
        <div className="space-y-3">
          {results.map((result) => (
            <div
              key={result.task.id}
              className={`border rounded-lg overflow-hidden ${
                result.agreementLevel === 'low' 
                  ? 'border-red-300' 
                  : result.agreementLevel === 'medium'
                    ? 'border-amber-300'
                    : 'border-slate-200'
              }`}
            >
              {/* Task Header */}
              <button
                onClick={() => setExpandedTask(
                  expandedTask === result.task.id ? null : result.task.id
                )}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getConfidenceColor(result.agreementLevel)}`}>
                    {getConfidenceIcon(result.agreementLevel)}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-slate-900">{result.task.label}</div>
                    <div className="text-sm text-slate-500">
                      {result.task.stakes === 'high' ? '🔴 High-stakes' : '🟢 Low-stakes'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">
                      {Math.round(result.confidenceScore * 100)}%
                    </div>
                    <div className={`text-xs font-medium ${
                      result.agreementLevel === 'high' 
                        ? 'text-emerald-600' 
                        : result.agreementLevel === 'medium'
                          ? 'text-amber-600'
                          : 'text-red-600'
                    }`}>
                      {result.agreementLevel.toUpperCase()} agreement
                    </div>
                  </div>
                  {expandedTask === result.task.id 
                    ? <ChevronUp className="w-5 h-5 text-slate-400" />
                    : <ChevronDown className="w-5 h-5 text-slate-400" />
                  }
                </div>
              </button>

              {/* Expanded Details */}
              {expandedTask === result.task.id && (
                <div className="px-4 pb-4 border-t border-slate-200 bg-slate-50">
                  {/* Warning */}
                  {result.warning && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-sm text-amber-800">{result.warning}</p>
                    </div>
                  )}

                  {/* Simulated Samples */}
                  <div className="mt-3">
                    <p className="text-xs font-medium text-slate-500 mb-2">
                      Sample responses (simulated):
                    </p>
                    <div className="space-y-1">
                      {result.samples.map((sample, idx) => (
                        <div 
                          key={idx}
                          className="text-xs text-slate-600 p-2 bg-white rounded border border-slate-200"
                        >
                          {sample}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className={`mt-3 p-3 rounded-lg ${
                    result.recommendation.includes('DO NOT') 
                      ? 'bg-red-100 text-red-800'
                      : result.recommendation.includes('HUMAN')
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <p className="text-sm font-medium">{result.recommendation}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key Takeaway */}
      <div className="bg-slate-900 text-white rounded-xl p-6">
        <div className="flex items-start gap-3">
          <TrendingDown className="w-6 h-6 text-amber-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold mb-2">Why This Matters</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              Larger AI models often sound more confident, causing users to over-trust them 
              based on a few good answers. This leads to over-deployment and unnoticed mistakes. 
              <strong className="text-white"> SelfCheckGPT enforces caution when AI responses disagree </strong>
              — because in high-stakes AI, success depends on calibrated human trust, 
              not smarter-sounding answers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


