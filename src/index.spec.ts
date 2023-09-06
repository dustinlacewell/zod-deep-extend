import { deepExtend, ZodExtension } from './index';
import { z, ZodObject, ZodTypeAny } from 'zod';

describe('extendZodSchema', () => {
  let schema: ZodObject<any>;
  let newFields: { [key: string]: ZodTypeAny };

  beforeEach(() => {
    schema = z.object({
      name: z.string(),
      age: z.number(),
    });
    newFields = {
      email: z.string().email(),
      address: z.object({
        street: z.string(),
        city: z.string(),
        zip: z.string(),
      }),
    };
  });

  it('should extend the schema with new fields', () => {
    const extendedSchema = deepExtend(schema, newFields);
    const result = extendedSchema.safeParse({
      name: 'John',
      age: 30,
      email: 'john@example.com',
      address: {
        street: '123 Main St',
        city: 'New York',
        zip: '10001',
      },
    });

    expect(result.success).toBeTruthy();
  });

  it('should fail validation if extended fields are missing', () => {
    const extendedSchema = deepExtend(schema, newFields);
    const result = extendedSchema.safeParse({
      name: 'John',
      age: 30,
    });

    expect(result.success).toBeFalsy();
  });

  it('should fail validation if extended fields are of wrong type', () => {
    const extendedSchema = deepExtend(schema, newFields);
    const result = extendedSchema.safeParse({
      name: 'John',
      age: 30,
      email: 'not an email',
      address: {
        street: '123 Main St',
        city: 'New York',
        zip: 10001, // should be a string
      },
    });

    expect(result.success).toBeFalsy();
  });
  it('should override existing fields in the schema', () => {
    newFields = {
      age: z.string(), // age was a number in the original schema
    };
    const extendedSchema = deepExtend(schema, newFields);
    const result = extendedSchema.safeParse({
      name: 'John',
      age: 'thirty',
    });

    expect(result.success).toBeTruthy();
  });

  it('should fail validation if overridden fields are of wrong type', () => {
    newFields = {
      age: z.string(), // age was a number in the original schema
    };
    const extendedSchema = deepExtend(schema, newFields);
    const result = extendedSchema.safeParse({
      name: 'John',
      age: 30, // should be a string now
    });

    expect(result.success).toBeFalsy();
  });

  it('should extend nested objects in the schema', () => {
    schema = z.object({
      name: z.string(),
      age: z.number(),
      address: z.object({
        street: z.string(),
        city: z.string(),
      }),
    });
    newFields = {
      address: z.object({
        zip: z.string(),
      }),
    };
    const extendedSchema = deepExtend(schema, newFields);
    const result = extendedSchema.safeParse({
      name: 'John',
      age: 30,
      address: {
        street: '123 Main St',
        city: 'New York',
        zip: '10001',
      },
    });

    expect(result.success).toBeTruthy();
  });  

  it('should throw an error when trying to extend with an invalid field type', () => {
    const invalidFields = {
      email: 'not a ZodType',
    };
  
    expect(() => deepExtend(schema, invalidFields as any as ZodExtension)).toThrowError();
  });

  it('should throw an error when trying to extend with an invalid nested field type', () => {
    const invalidFields = {
      address: z.object({
        zip: 'not a ZodType' as any as ZodTypeAny,
      }),
    };
  
    expect(() => deepExtend(schema, invalidFields)).toThrowError();
  });

  it('should correctly handle optional fields', () => {
    const optionalFields = {
      email: z.string().email().optional(),
    };
    const extendedSchema = deepExtend(schema, optionalFields);
    const result = extendedSchema.safeParse({
      name: 'John',
      age: 30,
    });
  
    expect(result.success).toBeTruthy();
  });  

  it('should correctly handle nullable fields', () => {
    const nullableFields = {
      email: z.string().email().nullable(),
    };
    const extendedSchema = deepExtend(schema, nullableFields);
    const result = extendedSchema.safeParse({
      name: 'John',
      age: 30,
      email: null,
    });
  
    expect(result.success).toBeTruthy();
  });  

});