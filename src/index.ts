/**
 * pi-pai - Personal AI Infrastructure
 * Standalone PAI implementation
 */

export { OuterLoop, outerLoop } from './core/outer-loop.js';
export { InnerLoop, runInnerLoop, InnerLoopPhase, InnerLoopContext } from './core/inner-loop.js';

export class PersonalAIInfrastructure {
  version = '1.0.0';

  async initialize(): Promise<void> {
    console.log('Initializing PAI system...');
    console.log(`Version: ${this.version}`);
    console.log('PAI system ready!');
  }

  getStatus(): any {
    return {
      version: this.version,
      status: 'active',
      outerLoop: 'ready',
      innerLoop: 'ready'
    };
  }
}

export const pai = new PersonalAIInfrastructure();
