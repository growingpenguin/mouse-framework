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

export function TaskNode({ node, onClick, isSelected, showRiskIcons }: TaskNodeProps) {
  const isHighStakes = node.stakes === 'high';

  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer transition-all duration-200
        ${isSelected ? 'scale-105' : 'hover:scale-105'}
      `}
    >
      {/* Main Node Circle */}
      <div
        className={`
          w-20 h-20 rounded-full border-4 flex items-center justify-center
          ${
            isHighStakes
              ? 'bg-red-50 border-red-500'
              : 'bg-emerald-50 border-emerald-500'
          }
          ${isSelected ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}
        `}
      >
        <div
          className={`
            w-3 h-3 rounded-full
            ${isHighStakes ? 'bg-red-500' : 'bg-emerald-500'}
          `}
        />
      </div>

      {/* Label */}
      <div className="mt-3 text-center max-w-[140px]">
        <div className="text-sm font-medium text-slate-800 leading-tight">
          {node.label}
        </div>
        <div
          className={`
            text-xs mt-1 font-medium
            ${isHighStakes ? 'text-red-600' : 'text-emerald-600'}
          `}
        >
          {isHighStakes ? 'High-stakes' : 'Low-stakes'}
        </div>
      </div>

      {/* Risk Icons */}
      {showRiskIcons && node.riskTypes && node.riskTypes.length > 0 && (
        <div className="flex gap-1 justify-center mt-2">
          {node.riskTypes.map((riskType) => {
            const Icon = riskIcons[riskType];
            return (
              <div
                key={riskType}
                className="w-5 h-5 rounded bg-red-100 flex items-center justify-center"
              >
                <Icon className="w-3 h-3 text-red-600" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
