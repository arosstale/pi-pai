/**
 * PAI Inner Loop: The Scientific Method (7 Phases)
 * 
 * Iterative cycle for making progress toward desired state
 */

export type InnerLoopPhase = 
  | 'OBSERVE'
  | 'THINK'
  | 'PLAN'
  | 'DEFINE'
  | 'EXECUTE'
  | 'MEASURE'
  | 'LEARN';

export interface InnerLoopContext {
  goal: string;
  phase: InnerLoopPhase;
  observations: Record<string, any>[];
  hypotheses: string[];
  plan: string | null;
  executionResults: Record<string, any> | null;
  measurements: Record<string, any> | null;
  learnings: string[];
}

export class InnerLoop {
  private context: InnerLoopContext;
  private phaseHistory: InnerLoopPhase[] = [];

  constructor(goal: string) {
    this.context = {
      goal,
      phase: 'OBSERVE',
      observations: [],
      hypotheses: [],
      plan: null,
      executionResults: null,
      measurements: null,
      learnings: []
    };
  }

  /**
   * OBSERVE phase - Gather context and understand where you are
   */
  observe(observations: Record<string, any>[]): void {
    this.context.observations = observations;
    this.transitionTo('THINK');
  }

  /**
   * THINK phase - Generate ideas and hypotheses
   */
  think(hypotheses: string[]): void {
    this.context.hypotheses = hypotheses;
    this.transitionTo('PLAN');
  }

  /**
   * PLAN phase - Design experiment
   */
  plan(plan: string): void {
    this.context.plan = plan;
    this.transitionTo('DEFINE');
  }

  /**
   * DEFINE phase - Set success criteria
   */
  define(successCriteria: Record<string, any>): void {
    this.context.measurements = successCriteria;
    this.transitionTo('EXECUTE');
  }

  /**
   * EXECUTE phase - Run the plan
   */
  execute(results: Record<string, any>): void {
    this.context.executionResults = results;
    this.transitionTo('MEASURE');
  }

  /**
   * MEASURE phase - Collect results
   */
  measure(measurements: Record<string, any>): void {
    this.context.measurements = measurements;
    this.transitionTo('LEARN');
  }

  /**
   * LEARN phase - Refine for next iteration
   */
  learn(learnings: string[]): void {
    this.context.learnings = learnings;
    
    // If successful, we're done. If not, loop back to OBSERVE
    const successful = learnings.some(l => l.includes('success') || l.includes('achieved'));
    if (successful) {
      console.log('Goal achieved!');
    } else {
      this.transitionTo('OBSERVE');
    }
  }

  /**
   * Transition to next phase
   */
  private transitionTo(phase: InnerLoopPhase): void {
    this.phaseHistory.push(this.context.phase);
    this.context.phase = phase;
    console.log(`Transitioning: ${this.phaseHistory[this.phaseHistory.length - 1]} → ${phase}`);
  }

  /**
   * Get current context
   */
  getContext(): InnerLoopContext {
    return { ...this.context };
  }

  /**
   * Get phase history
   */
  getPhaseHistory(): InnerLoopPhase[] {
    return [...this.phaseHistory];
  }
}

export function runInnerLoop(goal: string): InnerLoop {
  return new InnerLoop(goal);
}
