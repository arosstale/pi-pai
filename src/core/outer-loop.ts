/**
 * PAI Outer Loop: Where You Are → Where You Want To Be
 */

export interface CurrentState {
  description: string;
  metrics: Record<string, any>;
  timestamp: Date;
}

export interface DesiredState {
  description: string;
  metrics: Record<string, any>;
  successCriteria: string[];
}

export interface Gap {
  currentState: CurrentState;
  desiredState: DesiredState;
  distance: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export class OuterLoop {
  /**
   * Identify the gap between current and desired state
   */
  identifyGap(current: CurrentState, desired: DesiredState): Gap {
    const gap = this.calculateDistance(current, desired);
    const priority = this.assessPriority(gap, desired);
    
    return {
      currentState: current,
      desiredState: desired,
      distance: gap,
      priority
    };
  }

  /**
   * Calculate distance between current and desired state
   */
  private calculateDistance(current: CurrentState, desired: DesiredState): number {
    let totalDistance = 0;
    
    const allKeys = new Set([
      ...Object.keys(current.metrics),
      ...Object.keys(desired.metrics)
    ]);
    
    for (const key of allKeys) {
      const currentVal = current.metrics[key] || 0;
      const desiredVal = desired.metrics[key] || 0;
      totalDistance += Math.abs(desiredVal - currentVal);
    }
    
    return totalDistance;
  }

  /**
   * Assess priority based on gap size and urgency
   */
  private assessPriority(gap: number, desired: DesiredState): Gap['priority'] {
    if (gap > 100) return 'critical';
    if (gap > 50) return 'high';
    if (gap > 20) return 'medium';
    return 'low';
  }

  /**
   * Generate strategies to close the gap
   */
  generateStrategies(gap: Gap): string[] {
    const strategies: string[] = [];
    
    strategies.push("Direct transition strategy");
    strategies.push("Incremental approach strategy");
    strategies.push("Parallel execution strategy");
    
    return strategies;
  }
}

export const outerLoop = new OuterLoop();
