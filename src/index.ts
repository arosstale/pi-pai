/**
 * pi-pai - Personal AI Infrastructure for pi-mono Ecosystem
 * Ported from: https://github.com/danielmiessler/Personal_AI_Infrastructure
 */

export { OuterLoop, outerLoop, type CurrentState, type DesiredState, type Gap } from './core/outer-loop.js';
export { InnerLoop, runInnerLoop, type InnerLoopPhase, type InnerLoopContext } from './core/inner-loop.js';
export { PAIDiscordIntegration, paiDiscordIntegration, type PAIDiscordConfig } from './integration/discord-bot.js';
export { TACPAIIntegration, tacPaiIntegration } from './integration/tac-framework.js';
export { MCPRegistryIntegration, mcpRegistryIntegration } from './integration/mcp-registry.js';

// Main PAI class
export class PersonalAIInfrastructure {
  version = '1.0.0';

  /**
   * Initialize PAI system
   */
  async initialize(): Promise<void> {
    console.log('Initializing PAI system...');
    console.log(`Version: ${this.version}`);
    console.log('PAI system ready!');
  }

  /**
   * Get PAI status
   */
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
