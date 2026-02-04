import { useState } from 'react';
import { Edit3, Trash2, ArrowRight, Plus, ArrowUp, ArrowDown, Shield, X, Check, Sparkles } from 'lucide-react';
import { TaskNode, TaskNodeData, StakeLevel } from '@/components/TaskNode';

interface FrameworkViewProps {
  initialTasks: TaskNodeData[];
  onNext: (tasks: TaskNodeData[]) => void;
}

export function FrameworkView({ initialTasks, onNext }: FrameworkViewProps) {
  const [tasks, setTasks] = useState<TaskNodeData[]>(() => {
    // Position tasks in a nice grid layout
    const positions = [
      { x: 150, y: 120 },
      { x: 450, y: 120 },
      { x: 150, y: 380 },
      { x: 450, y: 380 },
      { x: 300, y: 500 },
    ];
    return initialTasks.map((task, i) => ({
      ...task,
      x: positions[i % positions.length].x,
      y: positions[i % positions.length].y,
    }));
  });
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [newTaskStakes, setNewTaskStakes] = useState<StakeLevel>('low');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedLabel, setEditedLabel] = useState('');

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId === selectedTask ? null : taskId);
    setIsEditingDescription(false);
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    setSelectedTask(null);
  };

  const handleAddTask = () => {
    if (!newTaskLabel.trim()) return;
    
    const positions = [
      { x: 150, y: 120 },
      { x: 450, y: 120 },
      { x: 150, y: 380 },
      { x: 450, y: 380 },
      { x: 300, y: 500 },
    ];
    
    const newTask: TaskNodeData = {
      id: String(Date.now()),
      label: newTaskLabel.trim(),
      stakes: newTaskStakes,
      riskTypes: newTaskStakes === 'high' ? ['irreversible'] : undefined,
      x: positions[tasks.length % positions.length].x,
      y: positions[tasks.length % positions.length].y,
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskLabel('');
    setNewTaskStakes('low');
    setIsAddingTask(false);
  };

  const handleStartEditDescription = () => {
    const task = tasks.find(t => t.id === selectedTask);
    if (task) {
      setEditedLabel(task.label);
      setIsEditingDescription(true);
    }
  };

  const handleSaveDescription = () => {
    if (!editedLabel.trim() || !selectedTask) return;
    
    setTasks(tasks.map(t => 
      t.id === selectedTask ? { ...t, label: editedLabel.trim() } : t
    ));
    setIsEditingDescription(false);
  };

  const handleToggleStakes = (taskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const newStakes: StakeLevel = t.stakes === 'low' ? 'high' : 'low';
        return {
          ...t,
          stakes: newStakes,
          riskTypes: newStakes === 'high' ? ['irreversible'] : undefined,
        };
      }
      return t;
    }));
  };

  const handleMoveTask = (direction: 'up' | 'down') => {
    if (!selectedTask) return;
    
    const index = tasks.findIndex(t => t.id === selectedTask);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= tasks.length) return;
    
    const newTasks = [...tasks];
    [newTasks[index], newTasks[newIndex]] = [newTasks[newIndex], newTasks[index]];
    
    const positions = [
      { x: 150, y: 120 },
      { x: 450, y: 120 },
      { x: 150, y: 380 },
      { x: 450, y: 380 },
      { x: 300, y: 500 },
    ];
    
    newTasks.forEach((task, i) => {
      task.x = positions[i % positions.length].x;
      task.y = positions[i % positions.length].y;
    });
    
    setTasks(newTasks);
  };

  const selectedTaskData = tasks.find(t => t.id === selectedTask);

  // Generate curved connection paths
  const generateConnections = () => {
    const connections: JSX.Element[] = [];
    
    if (tasks.length < 2) return connections;
    
    // Connect tasks in a logical flow
    const connectionPairs: [number, number][] = [];
    
    if (tasks.length === 2) {
      connectionPairs.push([0, 1]);
    } else if (tasks.length === 3) {
      connectionPairs.push([0, 2], [1, 2]);
    } else if (tasks.length >= 4) {
      connectionPairs.push([0, 2], [1, 3], [2, 3]);
      if (tasks.length >= 5) {
        connectionPairs.push([3, 4]);
      }
    }
    
    connectionPairs.forEach(([fromIdx, toIdx], i) => {
      if (fromIdx >= tasks.length || toIdx >= tasks.length) return;
      
      const from = tasks[fromIdx];
      const to = tasks[toIdx];
      
      if (!from.x || !from.y || !to.x || !to.y) return;
      
      const startX = from.x;
      const startY = from.y + 70;
      const endX = to.x;
      const endY = to.y - 70;
      
      // Create curved path
      const midY = (startY + endY) / 2;
      const controlX1 = startX;
      const controlY1 = midY;
      const controlX2 = endX;
      const controlY2 = midY;
      
      const path = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
      
      connections.push(
        <path
          key={`connection-${i}`}
          d={path}
          fill="none"
          stroke="url(#connectionGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-60"
        />
      );
      
      // Add animated dot
      connections.push(
        <circle key={`dot-${i}`} r="4" fill="#6366f1">
          <animateMotion
            dur={`${3 + i * 0.5}s`}
            repeatCount="indefinite"
            path={path}
          />
        </circle>
      );
    });
    
    return connections;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-slate-200/50 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-medium text-slate-600">AI-Generated Framework</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Your process framework
          </h1>
          <p className="text-lg text-slate-600">
            The AI proposes a framework. <span className="text-indigo-600 font-medium">You control it.</span>
          </p>
        </div>

        {/* Main Framework Canvas */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-6">
          <div className="relative h-[550px] bg-gradient-to-br from-slate-100/50 via-white to-blue-50/30 rounded-xl overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)`,
                backgroundSize: '40px 40px',
              }} />
            </div>
            
            {/* Connection Lines */}
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
            {tasks.map((task) => (
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
                  onClick={() => handleTaskClick(task.id)}
                  isSelected={selectedTask === task.id}
                  showRiskIcons
                />
              </div>
            ))}

            {/* Empty State */}
            {tasks.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                    <Plus className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">No tasks yet</p>
                  <p className="text-slate-400 text-sm">Add a task to get started</p>
                </div>
              </div>
            )}
          </div>

          {/* Edit Panel */}
          {selectedTask && selectedTaskData && (
            <div className="mt-6 p-5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${selectedTaskData.stakes === 'high' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                  <h3 className="font-semibold text-slate-900">
                    {selectedTaskData.label}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    selectedTaskData.stakes === 'high' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {selectedTaskData.stakes === 'high' ? 'High-stakes' : 'Low-stakes'}
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveTask(selectedTask)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>

              {isEditingDescription ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editedLabel}
                    onChange={(e) => setEditedLabel(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    placeholder="Task description"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveDescription()}
                  />
                  <button
                    onClick={handleSaveDescription}
                    className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingDescription(false)}
                    className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={handleStartEditDescription}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
                  >
                    <Edit3 className="w-4 h-4 text-slate-500" />
                    Edit Name
                  </button>
                  <button 
                    onClick={() => handleToggleStakes(selectedTask)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      selectedTaskData.stakes === 'high'
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    Make {selectedTaskData.stakes === 'high' ? 'Low' : 'High'}-stakes
                  </button>
                  <button 
                    onClick={() => handleMoveTask('up')}
                    disabled={tasks.findIndex(t => t.id === selectedTask) === 0}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowUp className="w-4 h-4 text-slate-500" />
                    Move Up
                  </button>
                  <button 
                    onClick={() => handleMoveTask('down')}
                    disabled={tasks.findIndex(t => t.id === selectedTask) === tasks.length - 1}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowDown className="w-4 h-4 text-slate-500" />
                    Move Down
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Task Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-6">
          {isAddingTask ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-slate-900">Add New Task</h3>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newTaskLabel}
                  onChange={(e) => setNewTaskLabel(e.target.value)}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter task description..."
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <select
                  value={newTaskStakes}
                  onChange={(e) => setNewTaskStakes(e.target.value as StakeLevel)}
                  className="px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white min-w-[140px]"
                >
                  <option value="low">🟢 Low Stakes</option>
                  <option value="high">🔴 High Stakes</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddTask}
                  disabled={!newTaskLabel.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Add Task
                </button>
                <button
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskLabel('');
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsAddingTask(true)}
              className="w-full px-6 py-4 bg-gradient-to-r from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 border-2 border-dashed border-indigo-200 rounded-xl text-sm font-medium text-indigo-600 transition-all flex items-center justify-center gap-2 group"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Add New Task
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-sm" />
            <span className="text-sm text-slate-600">Low-stakes (safe to delegate)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm" />
            <span className="text-sm text-slate-600">High-stakes (human required)</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => onNext(tasks)}
            disabled={tasks.length === 0}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-400 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center gap-3 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30"
          >
            Continue to Delegation
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
