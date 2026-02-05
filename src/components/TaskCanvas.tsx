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

  /**
   * BOUNDARY-TO-BOUNDARY EDGE ROUTING
   * 
   * Algorithm: Ray–Circle Intersection
   * 
   * 1. Draw imaginary line from center A → center B
   * 2. Find where line hits boundary of circle A (start point)
   * 3. Find where line hits boundary of circle B (end point)  
   * 4. Draw arrow from start → end
   * 
   * This is the industry-standard solution for node-link diagrams.
   */
  const generateConnections = () => {
    const elements: JSX.Element[] = [];
    
    // Circle radius: w-24 = 96px, so radius = 48px
    const RADIUS = 48;
    
    if (positionedNodes.length < 2 || connections.length === 0) return elements;
    
    connections.forEach(([fromIdx, toIdx], i) => {
      if (fromIdx >= positionedNodes.length || toIdx >= positionedNodes.length) return;
      
      const nodeA = positionedNodes[fromIdx];
      const nodeB = positionedNodes[toIdx];
      
      // Get center coordinates (x, y represent circle centers)
      const x1 = nodeA.x ?? 0;
      const y1 = nodeA.y ?? 0;
      const x2 = nodeB.x ?? 0;
      const y2 = nodeB.y ?? 0;
      
      // Step 1: Compute direction vector from A to B
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      
      // Skip if nodes overlap
      if (len < RADIUS * 2) return;
      
      // Step 2: Normalize to unit vector
      const ux = dx / len;
      const uy = dy / len;
      
      // Step 3: Start point = boundary of circle A (in direction of B)
      const startX = x1 + ux * RADIUS;
      const startY = y1 + uy * RADIUS;
      
      // Step 4: End point = boundary of circle B (facing A)
      const endX = x2 - ux * RADIUS;
      const endY = y2 - uy * RADIUS;
      
      // Draw the connection line
      elements.push(
        <line
          key={`line-${i}`}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#94a3b8"
          strokeWidth="2"
          strokeLinecap="round"
        />
      );
      
      // Draw arrowhead at end point (touching circle B)
      const arrowLen = 12;
      const arrowWidth = Math.PI / 7; // ~25 degrees
      const angle = Math.atan2(dy, dx);
      
      const arrow1X = endX - arrowLen * Math.cos(angle - arrowWidth);
      const arrow1Y = endY - arrowLen * Math.sin(angle - arrowWidth);
      const arrow2X = endX - arrowLen * Math.cos(angle + arrowWidth);
      const arrow2Y = endY - arrowLen * Math.sin(angle + arrowWidth);
      
      elements.push(
        <polygon
          key={`arrow-${i}`}
          points={`${endX},${endY} ${arrow1X},${arrow1Y} ${arrow2X},${arrow2Y}`}
          fill="#64748b"
        />
      );
      
      // Animated dot along path
      const path = `M ${startX} ${startY} L ${endX} ${endY}`;
      elements.push(
        <circle key={`dot-${i}`} r="4" fill="#6366f1" opacity="0.8">
          <animateMotion dur="2s" repeatCount="indefinite" path={path} />
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

      {/* Task Nodes - positioned so CIRCLE CENTER is exactly at x,y */}
      {positionedNodes.map((task) => (
        <div
          key={task.id}
          className="absolute transition-all duration-300 ease-out"
          style={{
            // Position the top-left corner of the node container
            // Circle is 96px (w-24), so center is at 48px from left/top
            left: `${(task.x ?? 0) - 48}px`,
            top: `${(task.y ?? 0) - 48}px`,
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
