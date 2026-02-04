import { useEffect, useState, useRef } from 'react';
import {
  forceSimulation,
  forceCollide,
  forceCenter,
  forceManyBody,
  forceX,
  forceY,
  SimulationNodeDatum,
} from 'd3-force';
import type { TaskNodeData } from '@/components/TaskNode';

interface ForceNode extends SimulationNodeDatum {
  id: string;
  label: string;
  stakes: 'low' | 'high';
  riskTypes?: string[];
}

interface UseForceLayoutOptions {
  width: number;
  height: number;
  nodeRadius?: number;
  padding?: number;
}

export function useForceLayout(
  tasks: TaskNodeData[],
  options: UseForceLayoutOptions
) {
  const { width, height, nodeRadius = 60, padding = 20 } = options;
  const [nodes, setNodes] = useState<TaskNodeData[]>([]);
  const simulationRef = useRef<ReturnType<typeof forceSimulation> | null>(null);

  useEffect(() => {
    if (tasks.length === 0) {
      setNodes([]);
      return;
    }

    // Initialize nodes with positions if not set
    const initialNodes: ForceNode[] = tasks.map((task, index) => {
      // Start with a grid layout for initial positions
      const cols = Math.ceil(Math.sqrt(tasks.length));
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      return {
        ...task,
        x: task.x ?? (col + 0.5) * (width / cols),
        y: task.y ?? (row + 0.5) * (height / Math.ceil(tasks.length / cols)),
      };
    });

    // Stop existing simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    // Create force simulation
    const simulation = forceSimulation<ForceNode>(initialNodes)
      // Repulsion between nodes
      .force('charge', forceManyBody().strength(-400))
      // Collision detection with node radius
      .force('collide', forceCollide<ForceNode>()
        .radius(nodeRadius + padding)
        .strength(0.8)
        .iterations(3)
      )
      // Keep nodes centered
      .force('center', forceCenter(width / 2, height / 2).strength(0.05))
      // Attract to horizontal center bands
      .force('x', forceX<ForceNode>()
        .x((d, i) => {
          // Position in left or right column based on index
          const isLeftColumn = i % 2 === 0;
          return isLeftColumn ? width * 0.25 : width * 0.75;
        })
        .strength(0.3)
      )
      // Attract to vertical center bands
      .force('y', forceY<ForceNode>()
        .y((d, i) => {
          // Position in top or bottom row
          const isTopRow = i < 2;
          if (tasks.length <= 2) return height / 2;
          return isTopRow ? height * 0.25 : height * 0.7;
        })
        .strength(0.3)
      )
      .alphaDecay(0.02)
      .velocityDecay(0.3);

    simulationRef.current = simulation;

    // Update state on each tick
    simulation.on('tick', () => {
      setNodes(
        initialNodes.map((node) => ({
          id: node.id,
          label: node.label,
          stakes: node.stakes,
          riskTypes: node.riskTypes as TaskNodeData['riskTypes'],
          // Clamp positions to stay within bounds
          x: Math.max(nodeRadius, Math.min(width - nodeRadius, node.x ?? width / 2)),
          y: Math.max(nodeRadius + 30, Math.min(height - nodeRadius - 50, node.y ?? height / 2)),
        }))
      );
    });

    // Run simulation for a set number of ticks then stop
    simulation.alpha(1).restart();

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [tasks, width, height, nodeRadius, padding]);

  return nodes;
}
