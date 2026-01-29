/**
 * SelfCheckGPT Integration
 * 
 * Based on the paper: "SELFCHECKGPT: Zero-Resource Black-Box Hallucination Detection
 * for Generative Large Language Models" by Manakul et al. (2023)
 * 
 * Key insight: If an LLM has knowledge of a concept, sampled responses are likely
 * to be similar and contain consistent facts. For hallucinated facts, responses
 * diverge and contradict one another.
 * 
 * In high-stakes settings, larger models sound confident but can hallucinate.
 * SelfCheckGPT helps calibrate human trust by detecting when AI is uncertain.
 */

import type { TaskNodeData, RiskType } from '@/components/TaskNode';

export interface SelfCheckResult {
  task: TaskNodeData;
  confidenceScore: number; // 0-1, higher = more consistent/reliable
  agreementLevel: 'high' | 'medium' | 'low';
  samples: string[]; // Simulated sample responses
  warning?: string;
  recommendation: string;
}

export interface SelfCheckSummary {
  overallConfidence: number;
  highConfidenceTasks: number;
  lowConfidenceTasks: number;
  recommendation: string;
  trustCalibration: string;
}

/**
 * Simulates SelfCheckGPT consistency checking
 * In production, this would:
 * 1. Generate N stochastic samples from the LLM
 * 2. Compare consistency using BERTScore, NLI, or prompting
 * 3. Calculate agreement scores
 * 
 * For demo purposes, we simulate this based on task characteristics
 */
export function performSelfCheck(tasks: TaskNodeData[]): SelfCheckResult[] {
  return tasks.map(task => {
    // Simulate confidence based on task characteristics
    // In reality, this would come from comparing multiple LLM samples
    const { confidenceScore, samples } = simulateConsistencyCheck(task);
    
    const agreementLevel = getAgreementLevel(confidenceScore);
    const warning = generateWarning(task, confidenceScore, agreementLevel);
    const recommendation = generateRecommendation(task, confidenceScore);

    return {
      task,
      confidenceScore,
      agreementLevel,
      samples,
      warning,
      recommendation,
    };
  });
}

/**
 * Simulates the core SelfCheckGPT mechanism:
 * - Generate multiple samples
 * - Check consistency between them
 * - High consistency = factual, Low consistency = potential hallucination
 */
function simulateConsistencyCheck(task: TaskNodeData): { 
  confidenceScore: number; 
  samples: string[];
} {
  // Simulate sample generation (in reality: N stochastic LLM responses)
  const samples = generateSimulatedSamples(task);
  
  // Calculate simulated consistency score
  // High-stakes tasks with certain risk types tend to have more variance
  let baseConfidence = 0.85;
  
  // Risk factors that increase uncertainty (model might hallucinate)
  if (task.stakes === 'high') {
    baseConfidence -= 0.15;
  }
  
  if (task.riskTypes?.includes('legal')) {
    baseConfidence -= 0.1; // Legal interpretations often inconsistent
  }
  
  if (task.riskTypes?.includes('security')) {
    baseConfidence -= 0.08;
  }
  
  if (task.riskTypes?.includes('irreversible')) {
    baseConfidence -= 0.05;
  }
  
  // Add some randomness to simulate real variance
  const variance = (Math.random() - 0.5) * 0.15;
  const confidenceScore = Math.max(0.2, Math.min(0.98, baseConfidence + variance));
  
  return { confidenceScore, samples };
}

/**
 * Generate simulated sample responses
 * In real SelfCheckGPT: multiple stochastic LLM outputs
 */
function generateSimulatedSamples(task: TaskNodeData): string[] {
  const label = task.label.toLowerCase();
  
  // Simulate different sample responses showing consistency/inconsistency
  if (label.includes('summarize') || label.includes('analyze')) {
    return [
      `Sample 1: Extract key points from document`,
      `Sample 2: Summarize main findings`,
      `Sample 3: Create brief overview`, // Consistent samples
    ];
  }
  
  if (label.includes('legal') || label.includes('interpretation')) {
    return [
      `Sample 1: Requires legal review per Section 5.2`,
      `Sample 2: May need compliance check under Article 7`,
      `Sample 3: Legal implications unclear, consult counsel`, // Inconsistent!
    ];
  }
  
  if (label.includes('patient') || label.includes('medical')) {
    return [
      `Sample 1: Access patient records via secure portal`,
      `Sample 2: Retrieve medical data with authorization`,
      `Sample 3: Patient information requires HIPAA compliance`, // Variance in approach
    ];
  }
  
  if (label.includes('email') || label.includes('send')) {
    return [
      `Sample 1: Send notification to stakeholders`,
      `Sample 2: Email legal team with summary`,
      `Sample 3: Forward report to external parties`, // Different recipients!
    ];
  }
  
  return [
    `Sample 1: Process task as specified`,
    `Sample 2: Execute according to guidelines`,
    `Sample 3: Complete task following protocol`,
  ];
}

function getAgreementLevel(confidence: number): 'high' | 'medium' | 'low' {
  if (confidence >= 0.75) return 'high';
  if (confidence >= 0.5) return 'medium';
  return 'low';
}

function generateWarning(
  task: TaskNodeData, 
  confidence: number, 
  agreement: 'high' | 'medium' | 'low'
): string | undefined {
  if (agreement === 'low') {
    return `⚠️ High disagreement detected! AI responses are inconsistent for "${task.label}". Do NOT delegate without human review.`;
  }
  
  if (agreement === 'medium' && task.stakes === 'high') {
    return `⚡ Moderate uncertainty on high-stakes task. AI may sound confident but responses vary. Verify before proceeding.`;
  }
  
  if (task.stakes === 'high' && task.riskTypes?.includes('legal')) {
    return `⚖️ Legal task with AI uncertainty. Larger models may over-generalize. Human judgment required.`;
  }
  
  return undefined;
}

function generateRecommendation(task: TaskNodeData, confidence: number): string {
  if (confidence < 0.5) {
    return 'DO NOT DELEGATE: High uncertainty detected. Human decision required.';
  }
  
  if (confidence < 0.7 && task.stakes === 'high') {
    return 'HUMAN REVIEW REQUIRED: AI responses inconsistent for this high-stakes task.';
  }
  
  if (task.stakes === 'high') {
    return 'HUMAN OVERSIGHT: Even with high confidence, high-stakes tasks need human approval.';
  }
  
  if (confidence >= 0.8 && task.stakes === 'low') {
    return 'SAFE TO DELEGATE: High consistency, low stakes. AI can handle this.';
  }
  
  return 'PROCEED WITH CAUTION: Monitor AI output for this task.';
}

/**
 * Generate overall summary of SelfCheck results
 */
export function generateSelfCheckSummary(results: SelfCheckResult[]): SelfCheckSummary {
  const avgConfidence = results.reduce((sum, r) => sum + r.confidenceScore, 0) / results.length;
  const highConfidence = results.filter(r => r.agreementLevel === 'high').length;
  const lowConfidence = results.filter(r => r.agreementLevel === 'low').length;
  
  let recommendation: string;
  let trustCalibration: string;
  
  if (lowConfidence > results.length / 2) {
    recommendation = 'CRITICAL: Most tasks show high AI uncertainty. Avoid delegation.';
    trustCalibration = 'The AI sounds confident but responses diverge significantly. Do not over-trust based on fluent answers.';
  } else if (avgConfidence < 0.6) {
    recommendation = 'CAUTION: Overall low consistency. Human oversight essential for all tasks.';
    trustCalibration = 'Larger models can sound authoritative while hallucinating. Verify all outputs.';
  } else if (highConfidence === results.length) {
    recommendation = 'LOW RISK: All tasks show high consistency. Safe for appropriate delegation.';
    trustCalibration = 'AI responses are consistent across samples. Trust can be calibrated higher for low-stakes items.';
  } else {
    recommendation = 'MIXED: Some tasks reliable, others uncertain. Review individually.';
    trustCalibration = 'Success depends on calibrated trust, not smarter-sounding answers. Check each task.';
  }
  
  return {
    overallConfidence: avgConfidence,
    highConfidenceTasks: highConfidence,
    lowConfidenceTasks: lowConfidence,
    recommendation,
    trustCalibration,
  };
}

/**
 * Key insight from the paper applied to high-stakes delegation:
 * 
 * "In high-stakes settings, larger models often sound more confident,
 * causing people to over-generalize from a few good answers and trust
 * them too much, which leads to over-deployment and more unnoticed mistakes."
 * 
 * Solution: Use SelfCheckGPT to enforce cautious behavior when disagreement
 * is high. In high-stakes AI, success depends on calibrated human trust,
 * not smarter-sounding answers.
 */
export const SELFCHECK_PRINCIPLE = {
  problem: 'Larger models sound confident, leading to over-trust and unnoticed mistakes',
  solution: 'SelfCheckGPT detects inconsistency to calibrate human trust',
  insight: 'In high-stakes AI, success depends on calibrated trust, not smarter-sounding answers',
  method: 'Compare multiple stochastic samples - divergence indicates potential hallucination',
};

