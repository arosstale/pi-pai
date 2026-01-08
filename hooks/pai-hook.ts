/**
 * PAI Hook for pi-mono
 * Adds Personal AI Infrastructure context to agent
 */

import { AgentConfig } from "@mariozechner/pi-agent-core";

export function paiHook(config: AgentConfig): AgentConfig {
  // Add PAI context to system prompt
  config.systemPrompt += `

You have access to Personal AI Infrastructure (PAI):

1. PAI Framework (Daniel Miessler)
   - Two-Loop Architecture (Outer + Inner)
   - Outer Loop: Where You Are → Where You Want to Be
   - Inner Loop: Scientific Method (7 phases)
   - Phases: OBSERVE → THINK → PLAN → DEFINE → EXECUTE → MEASURE → LEARN

2. Ralph Wiggum (Simple Iteration)
   - Philosophy: "Ralph is deterministically bad in an undeterministic world"
   - Simple iteration loop: while :; do cat PROMPT.md | pi ; done
   - Self-referential learning from git history
   - Completion promise detection

3. Damage Control (Security)
   - 100+ dangerous command patterns protected
   - Three protection levels: Zero Access, Read Only, No Delete
   - Pattern-based command detection
   - Bash/Edit/Write tool protection

4. awesome-pi-agent Integration
   - 30+ Extensions catalogued
   - 15+ Skills documented
   - MCP Servers listed (927 servers)
   - Tools & Utilities categorized

Use these frameworks to provide structured, goal-oriented assistance to the user.
`;

  return config;
}
