import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import {
  AuthorizationConfig,
  AuthorizationConfigSchema,
} from '../schemas/authorization-config.schema';

interface ParsedRule {
  resource: string;
  methods: Set<string>;
}

@Injectable()
export class PolicyService implements OnApplicationBootstrap {
  private readonly logger = new Logger(PolicyService.name);
  private readonly matrix = new Map<string, ParsedRule[]>();

  constructor() {
    this.loadMatrix();
  }

  onApplicationBootstrap(): void {
    let totalRules = 0;
    for (const rules of this.matrix.values()) totalRules += rules.length;
    this.logger.log(`Authorization matrix loaded: ${this.matrix.size} roles, ${totalRules} rules`);
  }

  isAllowed(roles: string[], resource: string, method: string): boolean {
    const upperMethod = method.toUpperCase();
    for (const role of roles) {
      const rules = this.matrix.get(role) ?? [];
      for (const rule of rules) {
        const resourceMatch = rule.resource === '*' || rule.resource === resource;
        const methodMatch = rule.methods.has('*') || rule.methods.has(upperMethod);
        if (resourceMatch && methodMatch) return true;
      }
    }
    return false;
  }

  private loadMatrix(): void {
    const filePath = path.resolve(process.cwd(), 'config', 'authorization.yaml');

    if (!fs.existsSync(filePath)) {
      throw new Error(`Authorization config not found at ${filePath}`);
    }

    const raw = yaml.load(fs.readFileSync(filePath, 'utf8'));
    const result = AuthorizationConfigSchema.safeParse(raw);

    if (!result.success) {
      throw new Error(
        `Invalid authorization config: ${result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`,
      );
    }

    this.buildIndex(result.data);
  }

  private buildIndex(config: AuthorizationConfig): void {
    for (const [role, rules] of Object.entries(config.roles)) {
      this.matrix.set(
        role,
        rules.map((r) => ({ resource: r.resource, methods: new Set(r.methods) })),
      );
    }
  }
}
