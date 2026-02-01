/**
 * Learning Loop - Continuous Improvement Engine
 * Integrates signals and learnings into systematic improvement
 */

import { Signal, SignalCapture } from './signal-capture.js';
import { TELOSManager } from './telos.js';

export interface LearningSession {
  id: string;
  timestamp: Date;
  signals: Signal[];
  insights: string[];
  actions: Action[];
  successRate: number;
}

export interface Action {
  id: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  targetGoal?: string;
  estimatedImpact: number; // 0-1
  status: 'planned' | 'in-progress' | 'completed' | 'abandoned';
}

export interface LearningMetrics {
  sessionCount: number;
  totalSignalsAnalyzed: number;
  averageSuccessRate: number;
  actionsGenerated: number;
  actionsCompleted: number;
  improvementVelocity: number; // Success rate improvement per session
}

/**
 * Learning Loop Manager
 */
export class LearningLoop {
  private sessions: Map<string, LearningSession> = new Map();
  private actions: Map<string, Action> = new Map();
  private successHistory: number[] = [];

  constructor(
    private telos: TELOSManager,
    private signals: SignalCapture
  ) {}

  /**
   * Analyze signals and generate learnings
   */
  analyzeAndLearn(sessionSignals: Signal[]): LearningSession {
    const session: LearningSession = {
      id: `session-${Date.now()}`,
      timestamp: new Date(),
      signals: sessionSignals,
      insights: [],
      actions: [],
      successRate: 0
    };

    // Calculate success rate
    const successCount = sessionSignals.filter(s => s.result?.success).length;
    session.successRate = sessionSignals.length > 0 ? successCount / sessionSignals.length : 0;
    this.successHistory.push(session.successRate);

    // Generate insights
    session.insights = this.generateInsights(sessionSignals);

    // Generate actions
    session.actions = this.generateActions(sessionSignals, session.insights);

    // Record learnings in TELOS
    session.insights.forEach(insight => {
      this.telos.recordLearning({
        category: 'learning-loop',
        insight,
        confidence: session.successRate
      });
    });

    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Generate insights from signals
   */
  private generateInsights(signals: Signal[]): string[] {
    const insights: string[] = [];

    // Pattern detection
    const patterns = this.detectPatterns(signals);
    patterns.forEach(pattern => {
      insights.push(`Pattern identified: ${pattern}`);
    });

    // Failure analysis
    const failures = signals.filter(s => !s.result?.success);
    if (failures.length > 0) {
      const failureRate = failures.length / signals.length;
      insights.push(`Failure rate: ${(failureRate * 100).toFixed(1)}%`);

      // Common failure modes
      const failureReasons = failures.map(f => f.result?.outcome || 'unknown');
      const uniqueReasons = new Set(failureReasons);
      uniqueReasons.forEach(reason => {
        insights.push(`Common failure: ${reason}`);
      });
    }

    // Confidence analysis
    const avgConfidence = signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length;
    insights.push(`Average confidence: ${(avgConfidence * 100).toFixed(1)}%`);

    // ISC effectiveness
    const allISCs = signals.flatMap(s => s.isc);
    const verifiedISCs = allISCs.filter(c => c.status === 'VERIFIED').length;
    const iscEffectiveness = verifiedISCs / allISCs.length;
    insights.push(`ISC effectiveness: ${(iscEffectiveness * 100).toFixed(1)}%`);

    return insights;
  }

  /**
   * Detect patterns in signals
   */
  private detectPatterns(signals: Signal[]): string[] {
    const patterns: string[] = [];
    const tagFrequency: Record<string, number> = {};

    signals.forEach(signal => {
      signal.tags.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    });

    // Find frequent tags
    Object.entries(tagFrequency)
      .filter(([_, count]) => count > signals.length * 0.5)
      .forEach(([tag, _]) => {
        patterns.push(tag);
      });

    return patterns;
  }

  /**
   * Generate actions from insights
   */
  private generateActions(signals: Signal[], insights: string[]): Action[] {
    const actions: Action[] = [];
    const seenActions = new Set<string>();

    signals.forEach(signal => {
      // For failed signals, generate improvement actions
      if (signal.result && !signal.result.success) {
        const actionDesc = `Improve handling of ${signal.source} ${signal.decision}`;
        if (!seenActions.has(actionDesc)) {
          const action: Action = {
            id: `action-${Date.now()}-${Math.random()}`,
            description: actionDesc,
            priority: 'high',
            estimatedImpact: 0.3,
            status: 'planned'
          };
          actions.push(action);
          this.actions.set(action.id, action);
          seenActions.add(actionDesc);
        }
      }
    });

    // From insights, suggest strategic actions
    if (insights.some(i => i.includes('Failure rate'))) {
      const action: Action = {
        id: `action-${Date.now()}-${Math.random()}`,
        description: 'Review and refine ISC criteria',
        priority: 'high',
        estimatedImpact: 0.5,
        status: 'planned'
      };
      if (!seenActions.has(action.description)) {
        actions.push(action);
        this.actions.set(action.id, action);
        seenActions.add(action.description);
      }
    }

    return actions;
  }

  /**
   * Execute action and track result
   */
  executeAction(actionId: string, result: { success: boolean; outcome: string }): Action | null {
    const action = this.actions.get(actionId);
    if (!action) return null;

    action.status = result.success ? 'completed' : 'abandoned';
    return action;
  }

  /**
   * Get learning metrics
   */
  getMetrics(): LearningMetrics {
    const allSignals = Array.from(this.sessions.values()).flatMap(s => s.signals);
    const avgSuccessRate =
      this.successHistory.length > 0
        ? this.successHistory.reduce((a, b) => a + b, 0) / this.successHistory.length
        : 0;

    const completedActions = Array.from(this.actions.values()).filter(
      a => a.status === 'completed'
    ).length;

    // Calculate improvement velocity
    let improvementVelocity = 0;
    if (this.successHistory.length > 1) {
      const recent = this.successHistory.slice(-5);
      const older = this.successHistory.slice(0, Math.min(5, this.successHistory.length - 5));
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const olderAvg = older.reduce((a, b) => a + b, 0) / older.length || 0;
      improvementVelocity = recentAvg - olderAvg;
    }

    return {
      sessionCount: this.sessions.size,
      totalSignalsAnalyzed: allSignals.length,
      averageSuccessRate: avgSuccessRate,
      actionsGenerated: this.actions.size,
      actionsCompleted: completedActions,
      improvementVelocity
    };
  }

  /**
   * Get session history
   */
  getSessions(): LearningSession[] {
    return Array.from(this.sessions.values()).sort(
      (a: { timestamp: Date }, b: { timestamp: Date }) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  /**
   * Get pending actions
   */
  getPendingActions(): Action[] {
    return Array.from(this.actions.values()).filter(a => a.status === 'planned');
  }
}

/**
 * Create learning loop
 */
export function createLearningLoop(
  telos: TELOSManager,
  signals: SignalCapture
): LearningLoop {
  return new LearningLoop(telos, signals);
}
