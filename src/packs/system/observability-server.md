# PAI Observability Server Pack

## Overview
Monitoring and analytics system for PAI.

## Components

### Metrics Collection
```typescript
// PAI Metrics System
interface PAIMetrics {
  goalId: string;
  phase: string;
  duration: number;
  success: boolean;
  timestamp: Date;
}

class PAIObservabilityServer {
  async recordMetrics(metrics: PAIMetrics): Promise<void> {
    // Store metrics
  }

  async getGoalMetrics(goalId: string): Promise<PAIMetrics[]> {
    // Retrieve metrics
  }

  async getSystemHealth(): Promise<SystemHealth> {
    // Check system health
  }
}
```

### Dashboard API
```typescript
// Observability Dashboard
interface PAIDashboard {
  getGoalProgress(goalId: string): Promise<GoalProgress>;
  getSystemMetrics(): Promise<SystemMetrics>;
  getRecentActivity(): Promise<Activity[]>;
}
```

### Configuration
```json
{
  "observability": {
    "enabled": true,
    "serverPort": 9091,
    "storage": "/opt/pai-data/observability",
    "retentionDays": 90
  }
}
```

## Installation Steps

```bash
# 1. Create observability storage
mkdir -p /opt/pai-data/observability

# 2. Initialize observability server
npx pai-init-observability

# 3. Start observability service
systemctl enable pai-observability.service
systemctl start pai-observability.service

# 4. Access dashboard
curl http://localhost:9091/dashboard
```

## Integration with pi-mono
- Discord Bot Dashboard: Port 9090
- PAI Dashboard: Port 9091
- Unified monitoring across systems
