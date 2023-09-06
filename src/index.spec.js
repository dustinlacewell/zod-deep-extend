"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const zod_1 = require("zod");
describe('extendZodSchema', () => {
    let schema;
    let newFields;
    beforeEach(() => {
        schema = zod_1.z.object({
            name: zod_1.z.string(),
            age: zod_1.z.number(),
        });
        newFields = {
            email: zod_1.z.string().email(),
            address: zod_1.z.object({
                street: zod_1.z.string(),
                city: zod_1.z.string(),
                zip: zod_1.z.string(),
            }),
        };
    });
    it('should extend the schema with new fields', () => {
        const extendedSchema = (0, index_1.deepExtend)(schema, newFields);
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
        const extendedSchema = (0, index_1.deepExtend)(schema, newFields);
        const result = extendedSchema.safeParse({
            name: 'John',
            age: 30,
        });
        expect(result.success).toBeFalsy();
    });
    it('should fail validation if extended fields are of wrong type', () => {
        const extendedSchema = (0, index_1.deepExtend)(schema, newFields);
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
            age: zod_1.z.string(), // age was a number in the original schema
        };
        const extendedSchema = (0, index_1.deepExtend)(schema, newFields);
        const result = extendedSchema.safeParse({
            name: 'John',
            age: 'thirty',
        });
        expect(result.success).toBeTruthy();
    });
    it('should fail validation if overridden fields are of wrong type', () => {
        newFields = {
            age: zod_1.z.string(), // age was a number in the original schema
        };
        const extendedSchema = (0, index_1.deepExtend)(schema, newFields);
        const result = extendedSchema.safeParse({
            name: 'John',
            age: 30, // should be a string now
        });
        expect(result.success).toBeFalsy();
    });
    it('should extend nested objects in the schema', () => {
        schema = zod_1.z.object({
            name: zod_1.z.string(),
            age: zod_1.z.number(),
            address: zod_1.z.object({
                street: zod_1.z.string(),
                city: zod_1.z.string(),
            }),
        });
        newFields = {
            address: zod_1.z.object({
                zip: zod_1.z.string(),
            }),
        };
        const extendedSchema = (0, index_1.deepExtend)(schema, newFields);
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
        expect(() => (0, index_1.deepExtend)(schema, invalidFields)).toThrowError();
    });
    it('should throw an error when trying to extend with an invalid nested field type', () => {
        const invalidFields = {
            address: zod_1.z.object({
                zip: 'not a ZodType',
            }),
        };
        expect(() => (0, index_1.deepExtend)(schema, invalidFields)).toThrowError();
    });
    it('should correctly handle optional fields', () => {
        const optionalFields = {
            email: zod_1.z.string().email().optional(),
        };
        const extendedSchema = (0, index_1.deepExtend)(schema, optionalFields);
        const result = extendedSchema.safeParse({
            name: 'John',
            age: 30,
        });
        expect(result.success).toBeTruthy();
    });
    it('should correctly handle nullable fields', () => {
        const nullableFields = {
            email: zod_1.z.string().email().nullable(),
        };
        const extendedSchema = (0, index_1.deepExtend)(schema, nullableFields);
        const result = extendedSchema.safeParse({
            name: 'John',
            age: 30,
            email: null,
        });
        expect(result.success).toBeTruthy();
    });
});
