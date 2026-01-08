/**
 * Ralph Wiggum - Simple Iteration Technique
 * Origin: Geoffrey Huntley
 */

export interface RalphLoopContext {
  prompt: string;
  maxIterations: number;
  currentIteration: number;
  completionPromise?: string;
}

export interface RalphLoopResult {
  success: boolean;
  iterations: number;
  duration: number;
  completed: boolean;
}

export class RalphWiggum {
  context: RalphLoopContext;

  constructor(prompt: string, maxIterations: number = 50) {
    this.context = {
      prompt,
      maxIterations,
      currentIteration: 0
    };
  }

  async run(): Promise<RalphLoopResult> {
    const startTime = Date.now();
    let completed = false;

    while (this.context.currentIteration < this.context.maxIterations && !completed) {
      this.context.currentIteration++;

      // Check for completion promise
      if (this.context.completionPromise) {
        completed = true;
      }
    }

    return {
      success: true,
      iterations: this.context.currentIteration,
      duration: Date.now() - startTime,
      completed
    };
  }

  cancel(): void {
    this.context.completionPromise = 'CANCELLED';
  }
}

export function createRalphLoop(prompt: string, maxIterations?: number): RalphWiggum {
  return new RalphWiggum(prompt, maxIterations);
}
