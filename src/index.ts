/**
 * pi-pai - Personal AI Infrastructure
 * Standalone implementation - PAI + Ralph Wiggum + Damage Control
 * pi-mono Extension: @badlogic/pi-mono-pai
 * awesome-pi-agent Integration
 */

// TELOS Framework - Mission-Oriented Goals
export {
  TELOSFramework,
  TELOSManager,
  type Mission,
  type Goal,
  type Challenge,
  type Strategy,
  type Belief,
  type Learning,
  createTELOS
} from './pai-framework/telos.js';

// Signal Capture - ISC-based decision validation
export {
  SignalCapture,
  type Signal,
  type SignalPattern,
  type ISCCriterion,
  type SignalStatus,
  createSignalCapture
} from './pai-framework/signal-capture.js';

// Learning Loop - Continuous improvement
export {
  LearningLoop,
  type LearningSession,
  type LearningMetrics,
  type Action,
  createLearningLoop
} from './pai-framework/learning-loop.js';

// PAI Framework (integrated system)
export {
  PAISystem,
  createPAI,
  exampleUsage as PAIExampleUsage
} from './pai-framework/index.js';

// Core loops
export { OuterLoop, outerLoop, type CurrentState, type DesiredState, type Gap } from './core/outer-loop.js';
export { InnerLoop, runInnerLoop, type InnerLoopPhase, type InnerLoopContext } from './core/inner-loop.js';

// Ralph Wiggum (simple iteration)
export { RalphWiggum, createRalphLoop, type RalphLoopContext, type RalphLoopResult } from './ralph/ralph-wiggum.js';

// Security & Observability
export { DamageControlHook, createDamageControlHook, DamageControlConfig, ProtectionLevel } from './packs/system/damage-control/hooks/damage-control-hook.js';
export { PAIObservabilityServer, createPAIObservabilityServer, type PAIMetrics, type SystemHealth, type GoalProgress, type SystemMetrics, type Activity } from './packs/system/observability-server.js';

export class PersonalAIInfrastructure {
  version = '1.4.0';
  extensionName = 'pi-mono-pai';
  awesomePaiAgentIntegration = true;

  async initialize(): Promise<void> {
    console.log('Initializing PAI system...');
    console.log(`Version: ${this.version}`);
    console.log(`Extension: ${this.extensionName} for pi-mono`);
    console.log('Components:');
    console.log('  • PAI Loops (Outer + Inner 7-phase)');
    console.log('  • Ralph Wiggum (Simple Iteration)');
    console.log('  • Damage Control (Security Protection)');
    console.log('  • Observability Server (Metrics & Monitoring)');
    console.log('  • awesome-pi-agent Integration (Ecosystem Hub)');
    console.log('PAI system ready!');
  }

  getStatus(): any {
    return {
      version: this.version,
      extensionName: this.extensionName,
      targetPlatform: 'pi-mono',
      awesomePaiAgentIntegration: true,
      status: 'active',
      components: {
        outerLoop: 'ready',
        innerLoop: 'ready',
        ralphWiggum: 'ready',
        damageControl: 'ready',
        observability: 'ready',
        awesomePaiAgent: 'ready'
      }
    };
  }
}

export const pai = new PersonalAIInfrastructure();
