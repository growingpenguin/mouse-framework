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
  if (totalNodes <= 1) {
    return { x: width / 2, y: height / 2 };
  }
  
  if (totalNodes === 2) {
    // Side by side
    return {
      x: index === 0 ? width * 0.3 : width * 0.7,
      y: height / 2,
    };
  }
  
  if (totalNodes === 3) {
    // Triangle: 2 on top, 1 on bottom
    if (index < 2) {
      return {
        x: index === 0 ? width * 0.3 : width * 0.7,
        y: height * 0.3,
      };
    }
    return { x: width / 2, y: height * 0.7 };
  }
  
  if (totalNodes === 4) {
    // 2x2 grid
    const row = Math.floor(index / 2);
    const col = index % 2;
    return {
      x: col === 0 ? width * 0.3 : width * 0.7,
      y: row === 0 ? height * 0.25 : height * 0.7,
    };
  }
  
  if (totalNodes === 5) {
    // 2 on top, 2 in middle, 1 on bottom
    if (index < 2) {
      return {
        x: index === 0 ? width * 0.3 : width * 0.7,
        y: height * 0.2,
      };
    }
    if (index < 4) {
      return {
        x: (index - 2) === 0 ? width * 0.3 : width * 0.7,
        y: height * 0.5,
      };
    }
    return { x: width / 2, y: height * 0.8 };
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
  
  if (nodeCount === 2) {
    connections.push([0, 1]);
  } else if (nodeCount === 3) {
    // Triangle flow: 0→2, 1→2
    connections.push([0, 2], [1, 2]);
  } else if (nodeCount === 4) {
    // 2x2 grid flow: top→bottom, bottom-left→bottom-right
    connections.push([0, 2], [1, 3], [2, 3]);
  } else if (nodeCount === 5) {
    // Extended flow
    connections.push([0, 2], [1, 3], [2, 4], [3, 4]);
  } else {
    // For 6+ nodes: connect each row to next row
    const cols = Math.ceil(Math.sqrt(nodeCount));
    for (let i = 0; i < nodeCount - cols; i++) {
      // Connect to node below
      if (i + cols < nodeCount) {
        connections.push([i, i + cols]);
      }
      // Connect to diagonal
      if (i % cols < cols - 1 && i + cols + 1 < nodeCount) {
        connections.push([i, i + cols + 1]);
      }
    }
    // Connect last row horizontally
    const lastRowStart = Math.floor((nodeCount - 1) / cols) * cols;
    for (let i = lastRowStart; i < nodeCount - 1; i++) {
      connections.push([i, i + 1]);
    }
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
