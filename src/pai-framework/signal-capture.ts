/**
 * Signal Capture System - ISC (Ideal State Criteria) Based
 * Captures decision outcomes and validates against success criteria
 */

export type SignalStatus = 'PENDING' | 'VERIFIED' | 'FAILED' | 'INCONCLUSIVE';

export interface ISCCriterion {
  criterion: string; // 8-word testable condition
  status: SignalStatus;
  evidence?: string[];
}

export interface Signal {
  id: string;
  timestamp: Date;
  source: string; // Which system/agent generated this signal
  decision: string; // What decision was made
  intent: string; // Why it was made
  isc: ISCCriterion[]; // Ideal State Criteria for this decision
  result?: {
    success: boolean;
    outcome: string;
    metrics?: Record<string, any>;
  };
  confidence: number; // 0-1
  tags: string[];
}

export interface SignalPattern {
  name: string;
  description: string;
  signals: Signal[];
  successRate: number; // 0-1
  totalTrials: number;
  improvements: string[];
}

/**
 * Signal Capture Manager
 */
export class SignalCapture {
  private signals: Map<string, Signal> = new Map();
  private patterns: Map<string, SignalPattern> = new Map();

  /**
   * Capture a signal
   */
  captureSignal(signal: Omit<Signal, 'id' | 'timestamp'>): Signal {
    const fullSignal: Signal = {
      ...signal,
      id: `signal-${Date.now()}-${Math.random()}`,
      timestamp: new Date()
    };
    this.signals.set(fullSignal.id, fullSignal);
    return fullSignal;
  }

  /**
   * Verify signal against ISC
   */
  verifySignal(signalId: string, verification: Record<string, any>): Signal | null {
    const signal = this.signals.get(signalId);
    if (!signal) return null;

    // Update ISC statuses
    const updatedISC = signal.isc.map(criterion => {
      const isTrue = verification[criterion.criterion];
      return {
        ...criterion,
        status: isTrue ? 'VERIFIED' as SignalStatus : 'FAILED' as SignalStatus,
        evidence: isTrue ? [JSON.stringify(verification)] : []
      };
    });

    signal.isc = updatedISC;

    // Mark signal result
    const allVerified = updatedISC.every(c => c.status === 'VERIFIED');
    signal.result = {
      success: allVerified,
      outcome: allVerified ? 'Success' : 'Failed',
      metrics: verification
    };

    return signal;
  }

  /**
   * Identify pattern from signals
   */
  identifyPattern(
    name: string,
    description: string,
    signalIds: string[],
    successCriteria: (signals: Signal[]) => boolean
  ): SignalPattern | null {
    const patternSignals = signalIds
      .map(id => this.signals.get(id))
      .filter(Boolean) as Signal[];

    if (patternSignals.length === 0) return null;

    const successCount = patternSignals.filter(s => s.result?.success).length;
    const successRate = successCount / patternSignals.length;

    const pattern: SignalPattern = {
      name,
      description,
      signals: patternSignals,
      successRate,
      totalTrials: patternSignals.length,
      improvements: this.suggestImprovements(patternSignals)
    };

    this.patterns.set(name, pattern);
    return pattern;
  }

  /**
   * Suggest improvements based on signals
   */
  private suggestImprovements(signals: Signal[]): string[] {
    const improvements: string[] = [];

    // Analyze failures
    const failures = signals.filter(s => !s.result?.success);
    if (failures.length > 0) {
      improvements.push(
        `${failures.length} failures detected - review ISC criteria`
      );
    }

    // Analyze confidence drift
    const avgConfidence = signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length;
    if (avgConfidence < 0.7) {
      improvements.push('Low confidence signals - increase validation rigor');
    }

    // Analyze ISC coverage
    const allISCs = signals.flatMap(s => s.isc);
    const uniqueISCs = new Set(allISCs.map(c => c.criterion));
    if (uniqueISCs.size < allISCs.length) {
      improvements.push('Increase ISC criterion diversity');
    }

    return improvements;
  }

  /**
   * Get pattern analysis
   */
  getPattern(name: string): SignalPattern | null {
    return this.patterns.get(name) || null;
  }

  /**
   * Get signals for analysis
   */
  getSignals(filter?: {
    source?: string;
    tags?: string[];
    status?: SignalStatus;
  }): Signal[] {
    let signals = Array.from(this.signals.values());

    if (filter?.source) {
      signals = signals.filter(s => s.source === filter.source);
    }

    if (filter?.tags && filter.tags.length > 0) {
      signals = signals.filter(s =>
        filter.tags!.some(tag => s.tags.includes(tag))
      );
    }

    if (filter?.status) {
      signals = signals.filter(s =>
        s.isc.some(criterion => criterion.status === filter.status)
      );
    }

    return signals;
  }

  /**
   * Get signal statistics
   */
  getStatistics(): {
    totalSignals: number;
    verifiedSignals: number;
    failedSignals: number;
    averageConfidence: number;
    successRate: number;
    patternsIdentified: number;
  } {
    const signals = Array.from(this.signals.values());
    const verified = signals.filter(s => s.result?.success).length;
    const failed = signals.filter(s => s.result && !s.result.success).length;
    const avgConfidence = signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length || 0;

    return {
      totalSignals: signals.length,
      verifiedSignals: verified,
      failedSignals: failed,
      averageConfidence: avgConfidence,
      successRate: signals.length > 0 ? verified / signals.length : 0,
      patternsIdentified: this.patterns.size
    };
  }

  /**
   * Export signals for persistence
   */
  exportSignals(): Signal[] {
    return Array.from(this.signals.values());
  }

  /**
   * Import signals
   */
  importSignals(signals: Signal[]): void {
    signals.forEach(signal => {
      this.signals.set(signal.id, signal);
    });
  }
}

/**
 * Create signal capture system
 */
export function createSignalCapture(): SignalCapture {
  return new SignalCapture();
}
