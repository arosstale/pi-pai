/**
 * PAI Observability Server Pack
 * Monitoring and analytics system for PAI
 */

export interface PAIMetrics {
  goalId: string;
  phase: string;
  duration: number;
  success: boolean;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  memoryUsage: number;
  activeGoals: number;
  lastActivity: Date;
}

export interface GoalProgress {
  goalId: string;
  currentPhase: string;
  progress: number;
  estimatedCompletion: Date;
  metrics: PAIMetrics[];
}

export interface SystemMetrics {
  totalGoals: number;
  completedGoals: number;
  averageDuration: number;
  successRate: number;
  activeComponents: string[];
}

export interface Activity {
  id: string;
  type: 'goal_started' | 'phase_completed' | 'goal_completed' | 'error';
  timestamp: Date;
  details: Record<string, any>;
}

export class PAIObservabilityServer {
  private metrics: PAIMetrics[] = [];
  private activities: Activity[] = [];
  private startTime: Date = new Date();

  async recordMetrics(metrics: PAIMetrics): Promise<void> {
    this.metrics.push(metrics);

    // Record activity
    this.activities.push({
      id: `${metrics.goalId}-${Date.now()}`,
      type: metrics.success ? 'phase_completed' : 'error',
      timestamp: metrics.timestamp,
      details: {
        goalId: metrics.goalId,
        phase: metrics.phase,
        duration: metrics.duration,
        success: metrics.success,
        ...metrics.metadata
      }
    });

    // Keep only recent activities (last 1000)
    if (this.activities.length > 1000) {
      this.activities = this.activities.slice(-1000);
    }
  }

  async getGoalMetrics(goalId: string): Promise<PAIMetrics[]> {
    return this.metrics.filter(m => m.goalId === goalId);
  }

  async getSystemHealth(): Promise<SystemHealth> {
    const now = new Date();
    const uptime = now.getTime() - this.startTime.getTime();

    // Calculate memory usage (simplified)
    const memUsage = process.memoryUsage().heapUsed / 1024 / 1024; // MB

    // Count active goals
    const activeGoals = new Set(this.metrics.filter(m => {
      const age = now.getTime() - m.timestamp.getTime();
      return age < 24 * 60 * 60 * 1000; // Last 24 hours
    }).map(m => m.goalId)).size;

    // Determine status
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (activeGoals === 0 && this.metrics.length > 0) {
      status = 'degraded'; // No recent activity
    }

    const lastActivity = this.activities.length > 0
      ? this.activities[this.activities.length - 1].timestamp
      : this.startTime;

    return {
      status,
      uptime,
      memoryUsage: memUsage,
      activeGoals,
      lastActivity
    };
  }

  async getGoalProgress(goalId: string): Promise<GoalProgress> {
    const goalMetrics = await this.getGoalMetrics(goalId);
    if (goalMetrics.length === 0) {
      return {
        goalId,
        currentPhase: 'not_started',
        progress: 0,
        estimatedCompletion: new Date(),
        metrics: []
      };
    }

    const latest = goalMetrics[goalMetrics.length - 1];
    const phases = ['observe', 'think', 'plan', 'define', 'execute', 'measure', 'learn'];
    const currentIndex = phases.indexOf(latest.phase);
    const progress = currentIndex >= 0 ? (currentIndex + 1) / phases.length : 0;

    // Estimate completion (simplified)
    const avgDuration = goalMetrics.reduce((sum, m) => sum + m.duration, 0) / goalMetrics.length;
    const remainingPhases = phases.length - (currentIndex + 1);
    const estimatedCompletion = new Date(Date.now() + (remainingPhases * avgDuration));

    return {
      goalId,
      currentPhase: latest.phase,
      progress,
      estimatedCompletion,
      metrics: goalMetrics
    };
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    const totalGoals = new Set(this.metrics.map(m => m.goalId)).size;
    const completedGoals = new Set(
      this.metrics.filter(m => m.phase === 'learn' && m.success).map(m => m.goalId)
    ).size;

    const durations = this.metrics.map(m => m.duration).filter(d => d > 0);
    const averageDuration = durations.length > 0
      ? durations.reduce((sum, d) => sum + d, 0) / durations.length
      : 0;

    const successfulMetrics = this.metrics.filter(m => m.success).length;
    const successRate = this.metrics.length > 0 ? successfulMetrics / this.metrics.length : 0;

    return {
      totalGoals,
      completedGoals,
      averageDuration,
      successRate,
      activeComponents: ['outerLoop', 'innerLoop', 'ralphWiggum', 'damageControl', 'observability']
    };
  }

  async getRecentActivity(limit: number = 50): Promise<Activity[]> {
    return this.activities.slice(-limit);
  }

  // Method to record the test metric from user input
  async recordTestMetric(testValue: string): Promise<void> {
    await this.recordMetrics({
      goalId: 'test-goal',
      phase: 'test',
      duration: 1000,
      success: true,
      timestamp: new Date(),
      metadata: { test: testValue }
    });
  }
}

export function createPAIObservabilityServer(): PAIObservabilityServer {
  return new PAIObservabilityServer();
}