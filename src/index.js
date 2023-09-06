"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepExtend = void 0;
const zod_1 = require("zod");
function deepExtend(schema, newFields) {
    let extension = {};
    for (const key in newFields) {
        const field = newFields[key];
        if (field instanceof zod_1.ZodObject) {
            extension[key] = deepExtend(schema.shape[key] || zod_1.z.object({}), field.shape);
        }
        else if (field instanceof zod_1.ZodType) {
            extension[key] = field;
        }
        else {
            throw new Error(`Invalid field type for key "${key}". Fields must be instances of ZodType.`);
        }
    }
    return schema.extend(extension);
}
exports.deepExtend = deepExtend;
