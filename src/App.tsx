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

  // Forward navigation
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

  // Back navigation
  const handleBackToInput = () => {
    setCurrentScreen('input');
  };

  const handleBackToFramework = () => {
    setCurrentScreen('framework');
  };

  const handleBackToDelegation = () => {
    setCurrentScreen('delegation');
  };

  const handleBackToReversibility = () => {
    setCurrentScreen('reversibility');
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
          onBack={handleBackToInput}
        />
      )}
      
      {currentScreen === 'delegation' && (
        <DelegationRules
          tasks={tasks}
          onNext={handleDelegationComplete}
          onBack={handleBackToFramework}
        />
      )}
      
      {currentScreen === 'reversibility' && (
        <ReversibilityCheckpoints 
          onNext={handleReversibilityComplete} 
          onBack={handleBackToDelegation}
        />
      )}
      
      {currentScreen === 'learning' && (
        <LearningOutcome 
          tasks={tasks} 
          onRestart={handleRestart} 
          onBack={handleBackToReversibility}
        />
      )}
    </div>
  );
}