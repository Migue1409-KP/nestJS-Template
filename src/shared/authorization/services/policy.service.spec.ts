import { Test, TestingModule } from '@nestjs/testing';
import { PolicyService } from './policy.service';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

jest.mock('fs');
jest.mock('js-yaml');

const mockMatrix = {
  roles: {
    ADMIN: [{ resource: '*', methods: ['*'] }],
    USER: [
      { resource: 'users/profile', methods: ['POST'] },
      { resource: 'users/profile/me', methods: ['GET'] },
      { resource: 'users/profile/:id', methods: ['GET', 'PATCH'] },
      { resource: 'parameters/languages', methods: ['GET'] },
    ],
  },
};

describe('PolicyService', () => {
  let service: PolicyService;

  beforeEach(async () => {
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue('mocked-yaml');
    (yaml.load as jest.Mock).mockReturnValue(mockMatrix);

    const module: TestingModule = await Test.createTestingModule({
      providers: [PolicyService],
    }).compile();

    service = module.get<PolicyService>(PolicyService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isAllowed', () => {
    it('denies when role is not in the matrix', () => {
      expect(service.isAllowed(['UNKNOWN'], 'users/profile', 'GET')).toBe(false);
    });

    it('denies when resource is not listed for the role', () => {
      expect(service.isAllowed(['USER'], 'admin/settings', 'GET')).toBe(false);
    });

    it('denies when method is not listed for the resource', () => {
      expect(service.isAllowed(['USER'], 'users/profile', 'DELETE')).toBe(false);
    });

    it('allows when role, resource and method match exactly', () => {
      expect(service.isAllowed(['USER'], 'users/profile', 'POST')).toBe(true);
    });

    it('allows ADMIN on any resource via wildcard', () => {
      expect(service.isAllowed(['ADMIN'], 'anything/at/all', 'DELETE')).toBe(true);
    });

    it('allows ADMIN on any method via wildcard', () => {
      expect(service.isAllowed(['ADMIN'], 'users/profile', 'PATCH')).toBe(true);
    });

    it('allows if ANY role in the list has access (union semantics)', () => {
      expect(service.isAllowed(['USER', 'ADMIN'], 'admin/settings', 'DELETE')).toBe(true);
    });

    it('denies when all roles in the list are denied', () => {
      expect(service.isAllowed(['USER'], 'users/profile', 'DELETE')).toBe(false);
    });

    it('is case-insensitive for methods', () => {
      expect(service.isAllowed(['USER'], 'users/profile', 'post')).toBe(true);
    });

    it('returns false for empty roles array', () => {
      expect(service.isAllowed([], 'users/profile', 'GET')).toBe(false);
    });
  });
});
