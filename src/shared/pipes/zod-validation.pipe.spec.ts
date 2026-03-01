import { ZodValidationPipe } from './zod-validation.pipe';
import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

const TestSchema = z.object({
  name: z.string().min(2),
  age: z.number().positive(),
});

describe('ZodValidationPipe', () => {
  let pipe: ZodValidationPipe;

  describe('without schema', () => {
    beforeEach(() => {
      pipe = new ZodValidationPipe();
    });

    it('should pass through any value when no schema is provided', () => {
      const value = { random: 'data', unvalidated: 123 };
      expect(pipe.transform(value, { type: 'body' } as any)).toEqual(value);
    });

    it('should pass through null/undefined without throwing', () => {
      expect(pipe.transform(null, { type: 'body' } as any)).toBeNull();
      expect(pipe.transform(undefined, { type: 'body' } as any)).toBeUndefined();
    });
  });

  describe('with schema', () => {
    beforeEach(() => {
      pipe = new ZodValidationPipe(TestSchema);
    });

    it('should return parsed value when input is valid', () => {
      const input = { name: 'Alice', age: 30 };
      const result = pipe.transform(input, { type: 'body' } as any);
      expect(result).toEqual(input);
    });

    it('should throw BadRequestException when a required field is missing', () => {
      expect(() => {
        pipe.transform({ name: 'Alice' }, { type: 'body' } as any);
      }).toThrow(BadRequestException);
    });

    it('should throw BadRequestException when a field fails its constraint', () => {
      expect(() => {
        pipe.transform({ name: 'A', age: 30 }, { type: 'body' } as any);
      }).toThrow(BadRequestException);
    });

    it('should throw BadRequestException when a field has the wrong type', () => {
      expect(() => {
        pipe.transform({ name: 'Alice', age: -5 }, { type: 'body' } as any);
      }).toThrow(BadRequestException);
    });

    it('should include validation errors in the exception response', () => {
      try {
        pipe.transform({ name: 'A', age: -1 }, { type: 'body' } as any);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        const response = (err as BadRequestException).getResponse() as any;
        expect(response.message).toEqual('Validation failed');
        expect(Array.isArray(response.errors)).toBe(true);
        expect(response.errors.length).toBeGreaterThan(0);
      }
    });
  });
});
