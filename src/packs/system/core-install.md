# PAI Core Install Pack

## Overview
Core infrastructure pack for PAI system.

## Components

### Core Services
```typescript
// PAI Core Service
import { outerLoop, runInnerLoop } from '@mariozechner/pi-pai';

// Initialize PAI
const paiCore = {
  outerLoop,
  innerLoop: runInnerLoop,
  version: '1.0.0'
};
```

### Database Schema
```sql
-- PAI Goals Database
CREATE TABLE pai_goals (
  id INTEGER PRIMARY KEY,
  goal TEXT NOT NULL,
  current_state JSON,
  desired_state JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PAI Observations
CREATE TABLE pai_observations (
  id INTEGER PRIMARY KEY,
  goal_id INTEGER,
  phase TEXT,
  observation JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (goal_id) REFERENCES pai_goals(id)
);

-- PAI Learnings
CREATE TABLE pai_learnings (
  id INTEGER PRIMARY KEY,
  goal_id INTEGER,
  learning TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (goal_id) REFERENCES pai_goals(id)
);
```

### Configuration
```json
{
  "pai": {
    "enabled": true,
    "workspace": "/opt/pai-data",
    "database": "/opt/pai-data/pai.db",
    "maxIterations": 10,
    "learningRate": 0.1
  }
}
```

## Installation Steps

```bash
# 1. Create workspace directory
mkdir -p /opt/pai-data

# 2. Install package
cd /home/majinbu/organized/active-projects/pi-mono
npm install @mariozechner/pi-pai

# 3. Initialize database
npx pai-init-db

# 4. Start PAI core service
systemctl enable pai-core.service
systemctl start pai-core.service

# 5. Verify installation
pai status
```

## Verification

```bash
# Check PAI service status
systemctl status pai-core.service

# Test PAI core
pai test

# View PAI logs
journalctl -u pai-core.service -f
```

## Integration with pi-mono
- Discord Bot: `/pai status`, `/pai plan` commands
- TAC Framework: PAI loops available to all agents
- Act-Learn-Reuse: PAI learnings stored in expertise
