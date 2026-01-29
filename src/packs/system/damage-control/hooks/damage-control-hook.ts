/**
 * Damage Control Hook for pi-mono
 * Blocks dangerous commands and protects sensitive files
 */

import { readFile } from 'fs/promises';
export interface Tool {
  name: string;
  description: string;
}

export interface ToolResult {
  success: boolean;
  message: string;
  content?: any;
  isError?: boolean;
}

export type ProtectionLevel = 'strict' | 'balanced' | 'permissive';

export interface DamageControlConfig {
  enabled: boolean;
  level: ProtectionLevel;
  askOnDangerous: boolean;
  logViolations: boolean;
}

export class DamageControlHook {
  private config: DamageControlConfig = {
    enabled: true,
    level: 'balanced',
    askOnDangerous: true,
    logViolations: true
  };

  private patterns: any;

  constructor(config?: Partial<DamageControlConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.loadPatterns();
  }

  /**
   * Load protection patterns
   */
  private async loadPatterns(): Promise<void> {
    try {
      const patternsContent = await readFile(
        '/tmp/pi-pai/src/packs/system/damage-control/patterns.yaml',
        'utf8'
      );
      this.patterns = this.parseYaml(patternsContent);
    } catch (error) {
      // If patterns file doesn't exist, use empty patterns
      this.patterns = {};
    }
  }

  /**
   * Simple YAML parser
   */
  private parseYaml(content: string): any {
    const lines = content.split('\n');
    const result: any = {};
    let currentCategory: string = '';
    let currentItems: any[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      
      // Skip comments and empty lines
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }
      
      // Categories
      if (trimmed.endsWith(':')) {
        currentCategory = trimmed.replace(':', '');
        currentItems = [];
        result[currentCategory] = currentItems;
      } else if (trimmed.startsWith('- ')) {
        const item = trimmed.substring(2);
        const parts = item.split(':');
        if (parts.length >= 2) {
          currentItems.push({
            pattern: parts[0].trim(),
            reason: parts[1].trim(),
            severity: this.extractSeverity(parts[1]),
            action: parts[2]?.trim() || 'block'
          });
        }
      }
    }

    return result;
  }

  /**
   * Extract severity from reason
   */
  private extractSeverity(reason: string): 'critical' | 'high' | 'medium' | 'low' {
    const lower = reason.toLowerCase();
    if (lower.includes('delete') || lower.includes('destroy') || lower.includes('drop') || lower.includes('truncate') || lower.includes('flush')) {
      return 'critical';
    } else if (lower.includes('reset') || lower.includes('clean') || lower.includes('remove') || lower.includes('prune')) {
      return 'high';
    } else if (lower.includes('force') || lower.includes('override')) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Check if command matches dangerous pattern
   */
  isDangerousCommand(command: string): boolean {
    if (!this.config.enabled) {
      return false;
    }

    for (const category of Object.keys(this.patterns)) {
      const items = this.patterns[category];
      if (Array.isArray(items)) {
        for (const item of items) {
          if (typeof item === 'object' && item.pattern) {
            const regex = new RegExp(item.pattern, 'i');
            if (regex.test(command)) {
              if (this.config.logViolations) {
                console.log(`[DAMAGE-CONTROL] Blocked ${this.config.level} command: ${command}`);
                console.log(`[DAMAGE-CONTROL] Reason: ${item.reason}`);
                console.log(`[DAMAGE-CONTROL] Severity: ${item.severity}`);
              }
              return true;
            }
          }
        }
      }
    }

    return false;
  }

  /**
   * Check if path is sensitive
   */
  isSensitivePath(path: string): boolean {
    if (!this.config.enabled) {
      return false;
    }

    const sensitiveCommands = this.patterns.sensitiveCommands || [];
    if (Array.isArray(sensitiveCommands)) {
      for (const cmd of sensitiveCommands) {
        if (typeof cmd === 'object' && cmd.pattern) {
          if (path.includes(cmd.pattern) || path.startsWith(cmd.pattern)) {
            if (this.config.logViolations) {
              console.log(`[DAMAGE-CONTROL] Blocked access to sensitive path: ${path}`);
              }
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Pre-tool-use hook
   */
  async preToolUse(tool: Tool, args: any): Promise<ToolResult | null> {
    if (!this.config.enabled) {
      return null;
    }

    // Check bash tool commands
    if (tool.name === 'bash') {
      const command = args.command || '';
      
      if (this.isDangerousCommand(command)) {
        if (this.config.askOnDangerous) {
          return {
            success: false,
            message: `[DAMAGE-CONTROL] ⚠️  Dangerous command detected: ${command}`,
            content: [{
              type: 'text',
              text: `[DAMAGE-CONTROL] ⚠️  Dangerous command detected: ${command}`
            }],
            isError: true
          };
        } else {
          return {
            success: false,
            message: `[DAMAGE-CONTROL] ❌ Dangerous command blocked: ${command}`,
            content: [{
              type: 'text',
              text: `[DAMAGE-CONTROL] ❌ Dangerous command blocked: ${command}`
            }],
            isError: true
          };
        }
      }
    }

    // Check write tool for sensitive paths
    if (tool.name === 'write') {
      const filePath = args.file_path || '';
      
      if (this.isSensitivePath(filePath)) {
        if (this.config.askOnDangerous) {
          return {
            success: false,
            message: `[DAMAGE-CONTROL] ⚠️  Sensitive path detected: ${filePath}`,
            content: [{
              type: 'text',
              text: `[DAMAGE-CONTROL] ⚠️  Sensitive path detected: ${filePath}`
            }],
            isError: true
          };
        } else {
          return {
            success: false,
            message: `[DAMAGE-CONTROL] ❌ Write to sensitive path blocked: ${filePath}`,
            content: [{
              type: 'text',
              text: `[DAMAGE-CONTROL] ❌ Write to sensitive path blocked: ${filePath}`
            }],
            isError: true
          };
        }
      }
    }

    return null;
  }
}

export function createDamageControlHook(config?: Partial<DamageControlConfig>): DamageControlHook {
  return new DamageControlHook(config);
}
