import { useState } from 'react';
import { Edit3, Trash2, ArrowRight, Plus, ArrowUpDown, Shield, X, Check } from 'lucide-react';
import { TaskNode, TaskNodeData, StakeLevel } from '@/components/TaskNode';

interface FrameworkViewProps {
  initialTasks: TaskNodeData[];
  onNext: (tasks: TaskNodeData[]) => void;
}

export function FrameworkView({ initialTasks, onNext }: FrameworkViewProps) {
  const [tasks, setTasks] = useState<TaskNodeData[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [newTaskStakes, setNewTaskStakes] = useState<StakeLevel>('low');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedLabel, setEditedLabel] = useState('');

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId === selectedTask ? null : taskId);
    setIsEditingDescription(false);
    setIsChangingStakes(false);
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    setSelectedTask(null);
  };

  // Add new task
  const handleAddTask = () => {
    if (!newTaskLabel.trim()) return;
    
    const newTask: TaskNodeData = {
      id: String(Date.now()),
      label: newTaskLabel.trim(),
      stakes: newTaskStakes,
      riskTypes: newTaskStakes === 'high' ? ['irreversible'] : undefined,
      x: 300 + Math.random() * 200,
      y: 200 + Math.random() * 150,
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskLabel('');
    setNewTaskStakes('low');
    setIsAddingTask(false);
  };

  // Edit task description
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

  // Change stakes level
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

  // Reorder tasks (move selected up/down)
  const handleMoveTask = (direction: 'up' | 'down') => {
    if (!selectedTask) return;
    
    const index = tasks.findIndex(t => t.id === selectedTask);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= tasks.length) return;
    
    const newTasks = [...tasks];
    [newTasks[index], newTasks[newIndex]] = [newTasks[newIndex], newTasks[index]];
    
    // Update positions
    const positions = [
      { x: 200, y: 120 },
      { x: 450, y: 120 },
      { x: 200, y: 280 },
      { x: 450, y: 280 },
      { x: 325, y: 400 },
      { x: 200, y: 400 },
    ];
    
    newTasks.forEach((task, i) => {
      task.x = positions[i % positions.length].x;
      task.y = positions[i % positions.length].y;
    });
    
    setTasks(newTasks);
  };

  const selectedTaskData = tasks.find(t => t.id === selectedTask);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        <h1 className="text-4xl font-semibold text-slate-900 mb-4 text-center">
          Your process framework
        </h1>
        <p className="text-slate-600 text-center mb-12">
          The AI proposes a framework. You control it.
        </p>

        {/* Main Framework Canvas */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="relative h-[500px] bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 overflow-hidden">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Dynamic connection lines */}
              {tasks.map((task, index) => {
                if (index === tasks.length - 1) return null;
                const nextTask = tasks[index + 1];
                return (
                  <line
                    key={`line-${index}`}
                    x1={task.x}
                    y1={(task.y || 0) + 40}
                    x2={nextTask.x}
                    y2={(nextTask.y || 0) - 40}
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    strokeDasharray="4"
                  />
                );
              })}
            </svg>

            {/* Task Nodes */}
            {tasks.map((task) => (
              <div
                key={task.id}
                className="absolute transition-all duration-300"
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

            {/* Helper text if no tasks */}
            {tasks.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-slate-400 text-sm">
                  No tasks yet. Add a new task to get started.
                </p>
              </div>
            )}

            {/* Helper text if no tasks selected */}
            {tasks.length > 0 && !selectedTask && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-slate-400 text-sm bg-white/80 px-4 py-2 rounded-lg">
                  Click a task node to edit or remove it
                </p>
              </div>
            )}
          </div>

          {/* Edit Panel */}
          {selectedTask && selectedTaskData && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">
                  Editing: {selectedTaskData.label}
                </h3>
                <button
                  onClick={() => handleRemoveTask(selectedTask)}
                  className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>

              {/* Edit Description Form */}
              {isEditingDescription ? (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={editedLabel}
                    onChange={(e) => setEditedLabel(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Task description"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveDescription}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingDescription(false)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 flex items-center gap-1"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={handleStartEditDescription}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Description
                  </button>
                  <button 
                    onClick={() => handleToggleStakes(selectedTask)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Shield className="w-4 h-4" />
                    Toggle Stakes ({selectedTaskData.stakes})
                  </button>
                  <button 
                    onClick={() => handleMoveTask('up')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    Move Up
                  </button>
                  <button 
                    onClick={() => handleMoveTask('down')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    Move Down
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Framework Controls</h3>
          
          {/* Add Task Form */}
          {isAddingTask ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newTaskLabel}
                  onChange={(e) => setNewTaskLabel(e.target.value)}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task description..."
                  autoFocus
                />
                <select
                  value={newTaskStakes}
                  onChange={(e) => setNewTaskStakes(e.target.value as StakeLevel)}
                  className="px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low Stakes</option>
                  <option value="high">High Stakes</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddTask}
                  disabled={!newTaskLabel.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Add Task
                </button>
                <button
                  onClick={() => {
                    setIsAddingTask(false);
                    setNewTaskLabel('');
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <button 
                onClick={() => setIsAddingTask(true)}
                className="px-4 py-3 bg-emerald-100 hover:bg-emerald-200 rounded-lg text-sm font-medium text-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Task
              </button>
              <button 
                onClick={() => {
                  if (selectedTask) {
                    handleMoveTask('up');
                  } else {
                    alert('Select a task first to reorder');
                  }
                }}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                Reorder Tasks
              </button>
              <button 
                onClick={() => {
                  if (selectedTask) {
                    handleToggleStakes(selectedTask);
                  } else {
                    alert('Select a task first to change stakes');
                  }
                }}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Change Stakes Level
              </button>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm font-medium text-blue-900">
            This is not a fixed chain of rules, but a flexible, user-editable structure
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => onNext(tasks)}
            disabled={tasks.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            Continue to Delegation
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
