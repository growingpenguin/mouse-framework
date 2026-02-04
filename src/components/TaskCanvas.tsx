import { useRef, useEffect, useState } from 'react';
import { TaskNode, TaskNodeData } from '@/components/TaskNode';
import { useForceLayout } from '@/lib/useForceLayout';

interface TaskCanvasProps {
  tasks: TaskNodeData[];
  selectedTaskId?: string | null;
  onTaskClick?: (taskId: string) => void;
  height?: number;
}

export function TaskCanvas({ 
  tasks, 
  selectedTaskId, 
  onTaskClick,
  height = 520 
}: TaskCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height });

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [height]);

  // Use force-directed layout
  const positionedNodes = useForceLayout(tasks, {
    width: dimensions.width,
    height: dimensions.height,
    nodeRadius: 55,
    padding: 25,
  });

  // Generate curved connection paths
  const generateConnections = () => {
    const connections: JSX.Element[] = [];
    
    if (positionedNodes.length < 2) return connections;
    
    // Define connection pairs based on task count
    const connectionPairs: [number, number][] = [];
    
    if (positionedNodes.length === 2) {
      connectionPairs.push([0, 1]);
    } else if (positionedNodes.length === 3) {
      connectionPairs.push([0, 2], [1, 2]);
    } else if (positionedNodes.length >= 4) {
      connectionPairs.push([0, 2], [1, 3], [2, 3]);
    }
    
    connectionPairs.forEach(([fromIdx, toIdx], i) => {
      if (fromIdx >= positionedNodes.length || toIdx >= positionedNodes.length) return;
      
      const from = positionedNodes[fromIdx];
      const to = positionedNodes[toIdx];
      
      if (!from.x || !from.y || !to.x || !to.y) return;
      
      const startX = from.x;
      const startY = from.y + 60;
      const endX = to.x;
      const endY = to.y - 60;
      
      // Create curved bezier path
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
          className="opacity-60 transition-opacity duration-300"
        />
      );
      
      // Animated dot traveling along the path
      connections.push(
        <circle key={`dot-${i}`} r="4" fill="#6366f1" className="opacity-80">
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
    <div 
      ref={containerRef}
      className="relative bg-gradient-to-br from-slate-100/50 via-white to-blue-50/30 rounded-xl overflow-hidden"
      style={{ height: `${height}px` }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }} 
        />
      </div>
      
      {/* Connection Lines SVG */}
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
      {positionedNodes.map((task) => (
        <div
          key={task.id}
          className="absolute transition-all duration-500 ease-out"
          style={{
            left: `${task.x}px`,
            top: `${task.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <TaskNode
            node={task}
            onClick={onTaskClick ? () => onTaskClick(task.id) : undefined}
            isSelected={selectedTaskId === task.id}
            showRiskIcons
          />
        </div>
      ))}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">No tasks yet</p>
            <p className="text-slate-400 text-sm">Select a demo or enter your request</p>
          </div>
        </div>
      )}
    </div>
  );
}
