import { useEffect, useState, useRef } from 'react';
import {
  forceSimulation,
  forceCollide,
  forceCenter,
  forceManyBody,
  forceX,
  forceY,
  forceLink,
  SimulationNodeDatum,
  SimulationLinkDatum,
} from 'd3-force';
import type { TaskNodeData } from '@/components/TaskNode';

interface ForceNode extends SimulationNodeDatum {
  id: string;
  label: string;
  stakes: 'low' | 'high';
  riskTypes?: string[];
  index?: number;
}

interface ForceLink extends SimulationLinkDatum<ForceNode> {
  source: ForceNode | string;
  target: ForceNode | string;
}

interface UseForceLayoutOptions {
  width: number;
  height: number;
  nodeRadius?: number;
  padding?: number;
}

// Calculate optimal grid layout based on node count
function calculateGridPosition(index: number, totalNodes: number, width: number, height: number) {
  // Layout nodes in a sequential workflow pattern (left-to-right, top-to-bottom flow)
  
  if (totalNodes <= 1) {
    return { x: width / 2, y: height / 2 };
  }
  
  if (totalNodes === 2) {
    // Horizontal flow: 1 → 2
    return {
      x: index === 0 ? width * 0.3 : width * 0.7,
      y: height / 2,
    };
  }
  
  if (totalNodes === 3) {
    // Stepped flow: 1 → 2 → 3
    const positions = [
      { x: width * 0.2, y: height * 0.25 },
      { x: width * 0.5, y: height * 0.5 },
      { x: width * 0.8, y: height * 0.75 },
    ];
    return positions[index];
  }
  
  if (totalNodes === 4) {
    // Snake flow: 1 → 2
    //             ↓
    //         4 ← 3
    const positions = [
      { x: width * 0.25, y: height * 0.25 },  // 1: top-left
      { x: width * 0.75, y: height * 0.25 },  // 2: top-right
      { x: width * 0.75, y: height * 0.7 },   // 3: bottom-right
      { x: width * 0.25, y: height * 0.7 },   // 4: bottom-left
    ];
    return positions[index];
  }
  
  if (totalNodes === 5) {
    // Extended snake flow
    const positions = [
      { x: width * 0.2, y: height * 0.2 },
      { x: width * 0.5, y: height * 0.2 },
      { x: width * 0.8, y: height * 0.45 },
      { x: width * 0.5, y: height * 0.7 },
      { x: width * 0.2, y: height * 0.7 },
    ];
    return positions[index];
  }
  
  // For 6+ nodes: dynamic grid
  const cols = Math.ceil(Math.sqrt(totalNodes));
  const rows = Math.ceil(totalNodes / cols);
  const row = Math.floor(index / cols);
  const col = index % cols;
  
  // Calculate spacing
  const xSpacing = width / (cols + 1);
  const ySpacing = height / (rows + 1);
  
  return {
    x: (col + 1) * xSpacing,
    y: (row + 1) * ySpacing,
  };
}

// Generate logical connections between nodes
function generateConnections(nodeCount: number): [number, number][] {
  const connections: [number, number][] = [];
  
  if (nodeCount < 2) return connections;
  
  // Create a sequential workflow: each task connects to the next
  // This represents a logical process flow regardless of stakes
  // Example: Task 1 → Task 2 → Task 3 → Task 4
  
  for (let i = 0; i < nodeCount - 1; i++) {
    connections.push([i, i + 1]);
  }
  
  return connections;
}

export function useForceLayout(
  tasks: TaskNodeData[],
  options: UseForceLayoutOptions
) {
  const { width, height, nodeRadius = 55, padding = 30 } = options;
  const [nodes, setNodes] = useState<TaskNodeData[]>([]);
  const [connections, setConnections] = useState<[number, number][]>([]);
  const simulationRef = useRef<ReturnType<typeof forceSimulation> | null>(null);

  useEffect(() => {
    if (tasks.length === 0) {
      setNodes([]);
      setConnections([]);
      return;
    }

    // Calculate initial positions based on grid layout
    const initialNodes: ForceNode[] = tasks.map((task, index) => {
      const gridPos = calculateGridPosition(index, tasks.length, width, height);
      return {
        ...task,
        x: gridPos.x,
        y: gridPos.y,
        index,
      };
    });

    // Generate connection pairs
    const connectionPairs = generateConnections(tasks.length);
    setConnections(connectionPairs);

    // Create links for force simulation
    const links: ForceLink[] = connectionPairs.map(([source, target]) => ({
      source: initialNodes[source],
      target: initialNodes[target],
    }));

    // Stop existing simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    // Create force simulation with improved forces
    const simulation = forceSimulation<ForceNode>(initialNodes)
      // Repulsion between nodes - stronger for more nodes
      .force('charge', forceManyBody()
        .strength(-300 - tasks.length * 20)
      )
      // Collision detection with node radius
      .force('collide', forceCollide<ForceNode>()
        .radius(nodeRadius + padding)
        .strength(1)
        .iterations(4)
      )
      // Link force - keeps connected nodes closer
      .force('link', forceLink<ForceNode, ForceLink>(links)
        .distance(150)
        .strength(0.3)
      )
      // Keep nodes centered
      .force('center', forceCenter(width / 2, height / 2).strength(0.03))
      // Attract to ideal X positions
      .force('x', forceX<ForceNode>()
        .x((d) => {
          const pos = calculateGridPosition(d.index ?? 0, tasks.length, width, height);
          return pos.x;
        })
        .strength(0.2)
      )
      // Attract to ideal Y positions
      .force('y', forceY<ForceNode>()
        .y((d) => {
          const pos = calculateGridPosition(d.index ?? 0, tasks.length, width, height);
          return pos.y;
        })
        .strength(0.2)
      )
      .alphaDecay(0.02)
      .velocityDecay(0.4);

    simulationRef.current = simulation;

    // Update state on each tick
    simulation.on('tick', () => {
      setNodes(
        initialNodes.map((node) => ({
          id: node.id,
          label: node.label,
          stakes: node.stakes,
          riskTypes: node.riskTypes as TaskNodeData['riskTypes'],
          // Clamp positions to stay within bounds with margin for labels
          x: Math.max(nodeRadius + 20, Math.min(width - nodeRadius - 20, node.x ?? width / 2)),
          y: Math.max(nodeRadius + 40, Math.min(height - nodeRadius - 60, node.y ?? height / 2)),
        }))
      );
    });

    // Start simulation
    simulation.alpha(1).restart();

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [tasks, width, height, nodeRadius, padding]);

  return { nodes, connections };
}
