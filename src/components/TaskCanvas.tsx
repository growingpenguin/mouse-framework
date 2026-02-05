import { useRef, useEffect, useState } from 'react';
import { TaskNode, TaskNodeData } from '@/components/TaskNode';
import { useForceLayout } from '@/lib/useForceLayout';

interface TaskCanvasProps {
  tasks: TaskNodeData[];
  selectedTaskId?: string | null;
  onTaskClick?: (taskId: string) => void;
  height?: number;
}

// Circle visual: w-24 = 96px, so radius = 48px
const RADIUS = 48;

interface ConnectionPoint {
  // Starting boundary dot
  startX: number;
  startY: number;
  // Target boundary dot (arrow tip goes here)
  endX: number;
  endY: number;
}

export function TaskCanvas({ 
  tasks, 
  selectedTaskId, 
  onTaskClick,
  height = 520 
}: TaskCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height });
  
  // Rendering phases
  const [showCircles, setShowCircles] = useState(false);
  const [showArrows, setShowArrows] = useState(false);
  const [connectionPoints, setConnectionPoints] = useState<ConnectionPoint[]>([]);

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDimensions({ width: containerRef.current.clientWidth, height });
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [height]);

  // Get layout positions
  const { nodes: layoutNodes, connections } = useForceLayout(tasks, {
    width: dimensions.width,
    height: dimensions.height,
    nodeRadius: 60,
    padding: 40,
  });

  // STEP 1: Reset everything when tasks change
  // FIX: Depend on tasks array (via JSON key), not just length
  const tasksKey = tasks.map(t => t.id).join(',');
  useEffect(() => {
    setShowCircles(false);
    setShowArrows(false);
    setConnectionPoints([]);
  }, [tasksKey, dimensions.width, dimensions.height]);

  // STEP 2: Wait, then show circles
  useEffect(() => {
    if (tasks.length === 0) return;
    
    const timer = setTimeout(() => {
      setShowCircles(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [tasksKey, dimensions.width, dimensions.height, tasks.length]);

  // STEP 3: Wait for circles to settle, then calculate boundary dots
  useEffect(() => {
    if (!showCircles || layoutNodes.length < 2) return;

    const timer = setTimeout(() => {
      // NOW circles are settled - calculate the boundary dots
      
      const points: ConnectionPoint[] = [];
      
      connections.forEach(([sourceIdx, targetIdx]) => {
        const sourceCircle = layoutNodes[sourceIdx];
        const targetCircle = layoutNodes[targetIdx];
        
        if (!sourceCircle || !targetCircle) return;
        
        // Get circle centers (these are now settled)
        const sourceX = sourceCircle.x ?? 0;
        const sourceY = sourceCircle.y ?? 0;
        const targetX = targetCircle.x ?? 0;
        const targetY = targetCircle.y ?? 0;
        
        // Calculate direction from source to target
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < RADIUS * 2) return; // Circles overlap
        
        // Normalize direction
        const dirX = dx / distance;
        const dirY = dy / distance;
        
        // FIND BOUNDARY DOTS (minimum distance between circles):
        
        // Dot on SOURCE circle boundary (closest to target)
        const startX = sourceX + dirX * RADIUS;
        const startY = sourceY + dirY * RADIUS;
        
        // Dot on TARGET circle boundary (closest to source) - ARROW TIP HERE
        const endX = targetX - dirX * RADIUS;
        const endY = targetY - dirY * RADIUS;
        
        points.push({ startX, startY, endX, endY });
      });
      
      // Save calculated points
      setConnectionPoints(points);
      
      // STEP 4: Now show the arrows
      setShowArrows(true);
      
    }, 500); // Wait 500ms for circles to settle
    
    return () => clearTimeout(timer);
  }, [showCircles, layoutNodes, connections]);

  return (
    <div 
      ref={containerRef}
      className="relative bg-gradient-to-br from-slate-100/50 via-white to-blue-50/30 rounded-xl overflow-hidden"
      style={{ height }}
    >
      {/* Background grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* CIRCLES: Only show after phase 1 */}
      {showCircles && layoutNodes.map((node) => {
        const x = node.x ?? 0;
        const y = node.y ?? 0;

        return (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: x - RADIUS,
              top: y - RADIUS,
              zIndex: 10,
            }}
          >
            <TaskNode
              node={node}
              onClick={onTaskClick ? () => onTaskClick(node.id) : undefined}
              isSelected={selectedTaskId === node.id}
              showRiskIcons
            />
          </div>
        );
      })}

      {/* ARROWS: Only show after circles settled AND boundary dots calculated */}
      {/* z-index 15 = ABOVE circles so we can see the debug dots clearly */}
      {showArrows && connectionPoints.length > 0 && (
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 15 }}>
          <defs>
            <marker
              id="arrowTip"
              markerWidth="10"
              markerHeight="7"
              refX="10"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
            </marker>
          </defs>

          {connectionPoints.map((conn, i) => (
            <g key={i}>
              {/* Connection line with arrow */}
              <line
                x1={conn.startX}
                y1={conn.startY}
                x2={conn.endX}
                y2={conn.endY}
                stroke="#64748b"
                strokeWidth="2"
                markerEnd="url(#arrowTip)"
              />

              {/* Animated flow dot */}
              <circle r="4" fill="#6366f1" opacity="0.8">
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  path={`M ${conn.startX} ${conn.startY} L ${conn.endX} ${conn.endY}`}
                />
              </circle>
            </g>
          ))}
        </svg>
      )}

      {/* Empty state */}
      {tasks.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium">No tasks yet</p>
          </div>
        </div>
      )}

      {/* Task count indicator */}
      {tasks.length > 0 && showArrows && (
        <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/90 rounded-full text-xs font-medium text-slate-600 shadow z-20">
          {tasks.length} tasks • {connectionPoints.length} connections
        </div>
      )}
    </div>
  );
}
