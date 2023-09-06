import { z, ZodObject, ZodType } from 'zod';

export type ZodExtension = { [key: string]: ZodType<any> | ZodExtension };

export function deepExtend(schema: ZodObject<any>, newFields: ZodExtension): ZodObject<any> {
  let extension: any = {};

  for (const key in newFields) {
    const field = newFields[key];
    if (field instanceof ZodObject) {
      extension[key] = deepExtend(schema.shape[key] as ZodObject<any> || z.object({}), field.shape as ZodExtension);
    } else if (field instanceof ZodType) {
      extension[key] = field;
    } else {
      throw new Error(`Invalid field type for key "${key}". Fields must be instances of ZodType.`);
    }
  }

  return schema.extend(extension);
}