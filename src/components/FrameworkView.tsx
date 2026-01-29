import { useState } from 'react';
import { Edit3, Trash2, GitMerge, GitBranch, ArrowRight } from 'lucide-react';
import { TaskNode, TaskNodeData } from '@/components/TaskNode';

interface FrameworkViewProps {
  initialTasks: TaskNodeData[];
  onNext: (tasks: TaskNodeData[]) => void;
}

export function FrameworkView({ initialTasks, onNext }: FrameworkViewProps) {
  const [tasks, setTasks] = useState<TaskNodeData[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const handleTaskClick = (taskId: string) => {
    setSelectedTask(taskId === selectedTask ? null : taskId);
  };

  const handleRemoveTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    setSelectedTask(null);
  };

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
          <div className="relative h-[500px] bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Connection lines */}
              <line x1="240" y1="160" x2="340" y2="280" stroke="#cbd5e1" strokeWidth="3" />
              <line x1="440" y1="160" x2="340" y2="280" stroke="#cbd5e1" strokeWidth="3" />
              <line x1="340" y1="320" x2="440" y2="320" stroke="#cbd5e1" strokeWidth="3" />
            </svg>

            {/* Task Nodes */}
            {tasks.map((task) => (
              <div
                key={task.id}
                className="absolute"
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

            {/* Helper text if no tasks selected */}
            {!selectedTask && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-slate-400 text-sm">
                  Click a task node to edit or remove it
                </p>
              </div>
            )}
          </div>

          {/* Edit Panel */}
          {selectedTask && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">
                  Editing: {tasks.find(t => t.id === selectedTask)?.label}
                </h3>
                <button
                  onClick={() => handleRemoveTask(selectedTask)}
                  className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <Edit3 className="w-4 h-4" />
                  Edit Description
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <GitMerge className="w-4 h-4" />
                  Merge with Another
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <GitBranch className="w-4 h-4" />
                  Split Task
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Framework Controls</h3>
          <div className="grid grid-cols-3 gap-3">
            <button className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors">
              Add New Task
            </button>
            <button className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors">
              Reorder Tasks
            </button>
            <button className="px-4 py-3 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors">
              Change Stakes Level
            </button>
          </div>
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            Continue to Delegation
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
