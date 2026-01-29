import { useState } from 'react';
import { TaskInput } from '@/components/TaskInput';
import { FrameworkView } from '@/components/FrameworkView';
import { DelegationRules } from '@/components/DelegationRules';
import { ReversibilityCheckpoints } from '@/components/ReversibilityCheckpoints';
import { LearningOutcome } from '@/components/LearningOutcome';
import type { TaskNodeData } from '@/components/TaskNode';

type Screen = 'input' | 'framework' | 'delegation' | 'reversibility' | 'learning';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('input');
  const [tasks, setTasks] = useState<TaskNodeData[]>([]);

  const handleTasksDecomposed = (decomposedTasks: TaskNodeData[]) => {
    setTasks(decomposedTasks);
    setCurrentScreen('framework');
  };

  const handleFrameworkComplete = (editedTasks: TaskNodeData[]) => {
    setTasks(editedTasks);
    setCurrentScreen('delegation');
  };

  const handleDelegationComplete = () => {
    setCurrentScreen('reversibility');
  };

  const handleReversibilityComplete = () => {
    setCurrentScreen('learning');
  };

  const handleRestart = () => {
    setCurrentScreen('input');
    setTasks([]);
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'input' && (
        <TaskInput onNext={handleTasksDecomposed} />
      )}
      
      {currentScreen === 'framework' && (
        <FrameworkView
          initialTasks={tasks}
          onNext={handleFrameworkComplete}
        />
      )}
      
      {currentScreen === 'delegation' && (
        <DelegationRules
          tasks={tasks}
          onNext={handleDelegationComplete}
        />
      )}
      
      {currentScreen === 'reversibility' && (
        <ReversibilityCheckpoints onNext={handleReversibilityComplete} />
      )}
      
      {currentScreen === 'learning' && (
        <LearningOutcome tasks={tasks} onRestart={handleRestart} />
      )}
    </div>
  );
}