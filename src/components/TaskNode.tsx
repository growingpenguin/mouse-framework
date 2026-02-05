import { AlertTriangle, Lock, Building2, ShieldAlert } from 'lucide-react';

export type StakeLevel = 'low' | 'high';
export type RiskType = 'irreversible' | 'legal' | 'security' | 'company-wide';

export interface TaskNodeData {
  id: string;
  label: string;
  stakes: StakeLevel;
  riskTypes?: RiskType[];
  x?: number;
  y?: number;
}

interface TaskNodeProps {
  node: TaskNodeData;
  onClick?: () => void;
  isSelected?: boolean;
  showRiskIcons?: boolean;
}

const riskIcons: Record<RiskType, typeof AlertTriangle> = {
  'irreversible': Lock,
  'legal': ShieldAlert,
  'security': ShieldAlert,
  'company-wide': Building2,
};

const riskLabels: Record<RiskType, string> = {
  'irreversible': 'Irreversible',
  'legal': 'Legal',
  'security': 'Security',
  'company-wide': 'Company-wide',
};

export function TaskNode({ node, onClick, isSelected, showRiskIcons }: TaskNodeProps) {
  const isHighStakes = node.stakes === 'high';

  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer transition-all duration-300 ease-out flex flex-col items-center
        ${isSelected ? 'scale-110 z-10' : 'hover:scale-105'}
      `}
    >
      {/* Main Node Circle - fixed width container ensures circle is centered */}
      <div className="relative w-24 h-24 flex-shrink-0">
        {/* Glow Effect */}
        <div
          className={`
            absolute inset-0 rounded-full blur-xl transition-opacity duration-300
            ${isHighStakes ? 'bg-red-400' : 'bg-emerald-400'}
            ${isSelected ? 'opacity-50' : 'opacity-0'}
          `}
        />
        
        {/* Outer Ring */}
        <div
          className={`
            relative w-24 h-24 rounded-full flex items-center justify-center
            transition-all duration-300 shadow-lg
            ${
              isHighStakes
                ? 'bg-gradient-to-br from-red-100 to-red-50 border-[3px] border-red-400'
                : 'bg-gradient-to-br from-emerald-100 to-emerald-50 border-[3px] border-emerald-400'
            }
            ${isSelected 
              ? 'ring-4 ring-indigo-400/50 ring-offset-2 ring-offset-white border-opacity-100' 
              : 'hover:shadow-xl'
            }
          `}
        >
          {/* Inner Circle */}
          <div
            className={`
              w-6 h-6 rounded-full shadow-inner transition-transform duration-300
              ${isHighStakes 
                ? 'bg-gradient-to-br from-red-500 to-red-600' 
                : 'bg-gradient-to-br from-emerald-500 to-emerald-600'
              }
              ${isSelected ? 'scale-125' : ''}
            `}
          />
          
          {/* Pulse Animation for Selected */}
          {isSelected && (
            <div
              className={`
                absolute inset-0 rounded-full animate-ping opacity-25
                ${isHighStakes ? 'bg-red-400' : 'bg-emerald-400'}
              `}
              style={{ animationDuration: '2s' }}
            />
          )}
        </div>
      </div>

      {/* Label */}
      <div className="mt-4 text-center max-w-[160px]">
        <div className={`
          text-sm font-semibold leading-tight mb-1 transition-colors
          ${isSelected ? 'text-slate-900' : 'text-slate-700'}
        `}>
          {node.label}
        </div>
        <div
          className={`
            inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
            ${isHighStakes 
              ? 'bg-red-100 text-red-700' 
              : 'bg-emerald-100 text-emerald-700'
            }
          `}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${isHighStakes ? 'bg-red-500' : 'bg-emerald-500'}`} />
          {isHighStakes ? 'High-stakes' : 'Low-stakes'}
        </div>
      </div>

      {/* Risk Icons */}
      {showRiskIcons && node.riskTypes && node.riskTypes.length > 0 && (
        <div className="flex gap-1.5 justify-center mt-3">
          {node.riskTypes.slice(0, 3).map((riskType) => {
            const Icon = riskIcons[riskType];
            return (
              <div
                key={riskType}
                className="group relative w-6 h-6 rounded-lg bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors cursor-help shadow-sm"
                title={riskLabels[riskType]}
              >
                <Icon className="w-3.5 h-3.5 text-red-600" />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {riskLabels[riskType]}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
