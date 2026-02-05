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

  // Generate curved connection paths between circle edges
  const generateConnections = () => {
    const elements: JSX.Element[] = [];
    const nodeRadius = 45; // Radius of the circle node
    
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
      
      // End point: edge of the "to" circle
      const endX = to.x - nx * nodeRadius;
      const endY = to.y - ny * nodeRadius;
      
      // Create curved bezier path
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;
      
      // Add perpendicular curve offset for nicer curves
      const curveMagnitude = Math.min(50, distance * 0.2);
      const curveX = midX - ny * curveMagnitude * (i % 2 === 0 ? 1 : -1) * 0.3;
      const curveY = midY + nx * curveMagnitude * (i % 2 === 0 ? 1 : -1) * 0.3;
      
      const path = `M ${startX} ${startY} Q ${curveX} ${curveY}, ${endX} ${endY}`;
      
      // Connection line
      elements.push(
        <path
          key={`connection-${i}`}
          d={path}
          fill="none"
          stroke="url(#connectionGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          className="opacity-70 transition-opacity duration-300"
          markerEnd="url(#arrowhead)"
        />
      );
      
      // Animated dot traveling along the path
      elements.push(
        <circle key={`dot-${i}`} r="5" fill="#6366f1" className="opacity-90">
          <animateMotion
            dur={`${2 + (i % 3) * 0.5}s`}
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
          {/* Arrow marker */}
          <marker
            id="arrowhead"
            markerWidth="12"
            markerHeight="10"
            refX="10"
            refY="5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 12 5, 0 10, 2 5" fill="#6366f1" />
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
