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

  // Use force-directed layout - now returns nodes AND connections
  const { nodes: positionedNodes, connections } = useForceLayout(tasks, {
    width: dimensions.width,
    height: dimensions.height,
    nodeRadius: 55,
    padding: 30,
  });

  // Generate clean straight connection lines between circle edges
  const generateConnections = () => {
    const elements: JSX.Element[] = [];
    const nodeRadius = 50; // Radius of the circle node
    
    if (positionedNodes.length < 2 || connections.length === 0) return elements;
    
    connections.forEach(([fromIdx, toIdx], i) => {
      if (fromIdx >= positionedNodes.length || toIdx >= positionedNodes.length) return;
      
      const from = positionedNodes[fromIdx];
      const to = positionedNodes[toIdx];
      
      if (!from?.x || !from?.y || !to?.x || !to?.y) return;
      
      // Calculate direction from one node to another
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance === 0) return;
      
      // Normalize direction
      const nx = dx / distance;
      const ny = dy / distance;
      
      // Start point: edge of the "from" circle
      const startX = from.x + nx * nodeRadius;
      const startY = from.y + ny * nodeRadius;
      
      // End point: edge of the "to" circle (leave room for arrow)
      const endX = to.x - nx * (nodeRadius + 8);
      const endY = to.y - ny * (nodeRadius + 8);
      
      // Simple straight line
      const path = `M ${startX} ${startY} L ${endX} ${endY}`;
      
      // Connection line
      elements.push(
        <line
          key={`connection-${i}`}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#94a3b8"
          strokeWidth="2"
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
          className="transition-opacity duration-300"
        />
      );
      
      // Animated dot traveling along the path
      elements.push(
        <circle key={`dot-${i}`} r="4" fill="#6366f1" className="opacity-80">
          <animateMotion
            dur={`${2.5 + (i % 3) * 0.3}s`}
            repeatCount="indefinite"
            path={path}
          />
        </circle>
      );
    });
    
    return elements;
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
          {/* Clean arrow marker */}
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M 0 0 L 8 4 L 0 8 L 2 4 Z" fill="#64748b" />
          </marker>
        </defs>
        {generateConnections()}
      </svg>

      {/* Task Nodes */}
      {positionedNodes.map((task) => (
        <div
          key={task.id}
          className="absolute transition-all duration-300 ease-out"
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

      {/* Node count indicator */}
      {tasks.length > 0 && (
        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-xs font-medium text-slate-600 shadow-sm">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} • {connections.length} connection{connections.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
