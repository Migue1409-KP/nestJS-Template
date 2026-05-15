import { z } from 'zod';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', '*'] as const;

const RuleSchema = z.object({
  resource: z.string().min(1),
  methods: z.array(z.enum(HTTP_METHODS)).min(1),
});

export const AuthorizationConfigSchema = z.object({
  roles: z.record(z.string(), z.array(RuleSchema)),
});

export type AuthorizationConfig = z.infer<typeof AuthorizationConfigSchema>;
