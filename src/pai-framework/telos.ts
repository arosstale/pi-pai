/**
 * TELOS Framework - Mission-Oriented Goal System
 * Based on Daniel Miessler's PAI v2.4
 *
 * TELOS = Mission + Goals + Challenges + Strategies + Beliefs
 */

export interface TELOSFramework {
  mission: Mission;
  goals: Record<string, Goal>;
  challenges: Record<string, Challenge>;
  strategies: Record<string, Strategy>;
  beliefs: Record<string, Belief>;
  learnings: Learning[];
}

export interface Mission {
  id: string;
  statement: string;
  timeframe?: string;
  successCriteria?: string[];
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  missionId: string;
  timeline?: string;
  status: 'active' | 'blocked' | 'completed' | 'paused';
  blockedBy?: string[]; // Challenge IDs
  supports?: string[]; // Goal IDs
  priority: 'p0' | 'p1' | 'p2' | 'p3';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  affectedGoals: string[]; // Goal IDs
  severity: 'low' | 'medium' | 'high' | 'critical';
  blockedAt?: Date;
  mitigation?: string;
}

export interface Strategy {
  id: string;
  title: string;
  description: string;
  addresses: string[]; // Challenge IDs
  tactics: string[];
  successIndicators: string[];
}

export interface Belief {
  id: string;
  statement: string;
  category: string;
  evidence?: string[];
  confidence: number; // 0-1
}

export interface Learning {
  id: string;
  category: string;
  insight: string;
  timestamp: Date;
  affectedGoal?: string;
  confidence: number; // 0-1
}

/**
 * TELOS Framework Manager
 */
export class TELOSManager {
  private telos: TELOSFramework;

  constructor(mission: Mission) {
    this.telos = {
      mission,
      goals: {},
      challenges: {},
      strategies: {},
      beliefs: {},
      learnings: []
    };
  }

  /**
   * Add a goal aligned with mission
   */
  addGoal(goal: Omit<Goal, 'missionId'>): Goal {
    const fullGoal: Goal = {
      ...goal,
      missionId: this.telos.mission.id
    };
    this.telos.goals[goal.id] = fullGoal;
    return fullGoal;
  }

  /**
   * Add a challenge blocking goals
   */
  addChallenge(challenge: Challenge): Challenge {
    this.telos.challenges[challenge.id] = challenge;
    // Mark affected goals as blocked
    for (const goalId of challenge.affectedGoals) {
      if (this.telos.goals[goalId]) {
        this.telos.goals[goalId].status = 'blocked';
        this.telos.goals[goalId].blockedBy = [
          ...(this.telos.goals[goalId].blockedBy || []),
          challenge.id
        ];
      }
    }
    return challenge;
  }

  /**
   * Add strategy to mitigate challenge
   */
  addStrategy(strategy: Strategy): Strategy {
    this.telos.strategies[strategy.id] = strategy;
    return strategy;
  }

  /**
   * Record learning
   */
  recordLearning(learning: Omit<Learning, 'id' | 'timestamp'>): Learning {
    const fullLearning: Learning = {
      ...learning,
      id: `learning-${Date.now()}`,
      timestamp: new Date()
    };
    this.telos.learnings.push(fullLearning);
    return fullLearning;
  }

  /**
   * Get goal status
   */
  getGoalStatus(goalId: string): Goal | null {
    return this.telos.goals[goalId] || null;
  }

  /**
   * Check goal is blocked
   */
  isGoalBlocked(goalId: string): boolean {
    const goal = this.telos.goals[goalId];
    return goal ? goal.status === 'blocked' : false;
  }

  /**
   * Get blocking challenges
   */
  getBlockingChallenges(goalId: string): Challenge[] {
    const goal = this.telos.goals[goalId];
    if (!goal || !goal.blockedBy) return [];
    return goal.blockedBy.map(id => this.telos.challenges[id]).filter(Boolean);
  }

  /**
   * Get full TELOS state
   */
  getTELOS(): TELOSFramework {
    return { ...this.telos };
  }

  /**
   * Get summary
   */
  getSummary(): {
    mission: string;
    activeGoals: number;
    blockedGoals: number;
    completedGoals: number;
    totalChallenges: number;
    totalLearnings: number;
  } {
    const goals = Object.values(this.telos.goals);
    return {
      mission: this.telos.mission.statement,
      activeGoals: goals.filter(g => g.status === 'active').length,
      blockedGoals: goals.filter(g => g.status === 'blocked').length,
      completedGoals: goals.filter(g => g.status === 'completed').length,
      totalChallenges: Object.keys(this.telos.challenges).length,
      totalLearnings: this.telos.learnings.length
    };
  }
}

/**
 * Create TELOS manager
 */
export function createTELOS(mission: Mission): TELOSManager {
  return new TELOSManager(mission);
}
