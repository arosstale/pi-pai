/**
 * pi-pai - Personal AI Infrastructure
 * Standalone implementation - PAI + Ralph Wiggum + Damage Control
 * pi-mono Extension: @badlogic/pi-mono-pai
 * awesome-pi-agent Integration
 */

export { OuterLoop, outerLoop, type CurrentState, type DesiredState, type Gap } from './core/outer-loop.js';
export { InnerLoop, runInnerLoop, type InnerLoopPhase, type InnerLoopContext } from './core/inner-loop.js';
export { RalphWiggum, createRalphLoop, type RalphState, type RalphLoopContext, type RalphLoopResult } from './ralph/ralph-wiggum.ts';
export { DamageControlHook, createDamageControlHook, type DamageControlConfig, type ProtectionLevel } from './pacs/system/damage-control/damage-control-hook.js';

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
        awesomePaiAgent: 'ready'
      }
    };
  }
}

export const pai = new PersonalAIInfrastructure();
