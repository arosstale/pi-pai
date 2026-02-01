/**
 * PAI Framework - Personal AI Infrastructure
 * Mission-Oriented AI System with TELOS Framework
 *
 * Integrates:
 * - TELOS (Mission, Goals, Challenges, Strategies, Beliefs)
 * - Signal Capture (ISC-based decision validation)
 * - Learning Loop (Continuous improvement engine)
 * - Inner Loop (7-phase scientific method)
 * - Outer Loop (Gap analysis and strategy)
 */

export {
  // TELOS Framework
  TELOSFramework,
  TELOSManager,
  Mission,
  Goal,
  Challenge,
  Strategy,
  Belief,
  Learning,
  createTELOS
} from './telos.js';

export {
  // Signal Capture
  Signal,
  SignalCapture,
  SignalPattern,
  ISCCriterion,
  SignalStatus,
  createSignalCapture
} from './signal-capture.js';

export {
  // Learning Loop
  LearningLoop,
  LearningSession,
  LearningMetrics,
  Action,
  createLearningLoop
} from './learning-loop.js';

export {
  // Inner Loop (7-phase scientific method)
  InnerLoop,
  InnerLoopContext,
  InnerLoopPhase,
  runInnerLoop
} from '../core/inner-loop.js';

export {
  // Outer Loop (Gap analysis)
  OuterLoop,
  CurrentState,
  DesiredState,
  Gap,
  outerLoop
} from '../core/outer-loop.js';

import { TELOSManager, type Mission } from './telos.js';
import { SignalCapture } from './signal-capture.js';
import { LearningLoop } from './learning-loop.js';

/**
 * PAI System - Integrated Personal AI Infrastructure
 */
export class PAISystem {
  public telos: TELOSManager;
  public signals: SignalCapture;
  public learning: LearningLoop;

  constructor(mission: { id: string; statement: string }) {
    // Initialize TELOS framework
    this.telos = new TELOSManager(mission);

    // Initialize signal capture
    this.signals = new SignalCapture();

    // Initialize learning loop
    this.learning = new LearningLoop(this.telos, this.signals);
  }

  /**
   * Get integrated system status
   */
  getStatus() {
    const telosSummary = this.telos.getSummary();
    const signalStats = this.signals.getStatistics();
    const learningMetrics = this.learning.getMetrics();

    return {
      mission: telosSummary.mission,
      goals: {
        active: telosSummary.activeGoals,
        blocked: telosSummary.blockedGoals,
        completed: telosSummary.completedGoals
      },
      signals: {
        total: signalStats.totalSignals,
        verified: signalStats.verifiedSignals,
        failed: signalStats.failedSignals,
        successRate: signalStats.successRate,
        averageConfidence: signalStats.averageConfidence
      },
      learning: {
        sessions: learningMetrics.sessionCount,
        signalsAnalyzed: learningMetrics.totalSignalsAnalyzed,
        successRate: learningMetrics.averageSuccessRate,
        improvementVelocity: learningMetrics.improvementVelocity
      }
    };
  }

  /**
   * Get comprehensive health report
   */
  getHealthReport() {
    const status = this.getStatus();
    const pendingActions = this.learning.getPendingActions();
    const blockingChallenges = Object.values(this.telos.getTELOS().challenges);

    return {
      status,
      health: {
        signalHealth: status.signals.successRate >= 0.7 ? 'good' : 'needs-attention',
        learningHealth: status.learning.improvementVelocity > 0 ? 'improving' : 'stagnant',
        goalsHealth: status.goals.blocked > status.goals.active ? 'at-risk' : 'on-track'
      },
      recommendations: [
        ...pendingActions.map(a => a.description),
        ...(blockingChallenges.length > 0
          ? [`Address ${blockingChallenges.length} blocking challenges`]
          : []),
        ...(status.signals.averageConfidence < 0.7
          ? ['Increase confidence in signal verification']
          : [])
      ]
    };
  }
}

/**
 * Create PAI System
 */
export function createPAI(mission: { id: string; statement: string }): PAISystem {
  return new PAISystem(mission);
}

/**
 * Example usage
 */
export const exampleUsage = `
// Create PAI system
const pai = createPAI({
  id: 'trading-001',
  statement: 'Achieve $1M trading portfolio through systematic strategies'
});

// Add goals
pai.telos.addGoal({
  id: 'g0',
  title: 'Deploy Live Trading',
  description: 'Launch gold/silver stat-arb strategy',
  status: 'active',
  priority: 'p0'
});

// Add challenge
pai.telos.addChallenge({
  id: 'c0',
  title: 'Overfitting Risk',
  description: 'Strategy may overfit to historical data',
  affectedGoals: ['g0'],
  severity: 'high'
});

// Capture signal
pai.signals.captureSignal({
  source: 'backtest',
  decision: 'Deploy strategy v1',
  intent: 'Validate gold/silver spread trading',
  isc: [
    { criterion: 'Backtest Sharpe ratio exceeds 2.0', status: 'PENDING' },
    { criterion: 'Maximum drawdown stays below 15%', status: 'PENDING' },
    { criterion: 'Win rate exceeds 55%', status: 'PENDING' }
  ],
  confidence: 0.8,
  tags: ['backtest', 'deployment', 'stat-arb']
});

// Analyze and learn
const session = pai.learning.analyzeAndLearn(pai.signals.getSignals());

// Get system status
console.log(pai.getStatus());
console.log(pai.getHealthReport());
`;
