import Ajv from "ajv";
const ajv = new Ajv({ allErrors: true, strict: false });

export function validateSchema<T>(schema: object, data: unknown) {
  const validate = (ajv as any).compile(schema as any);
  const valid = validate(data as any);
  return { valid: Boolean(valid), errors: validate.errors ?? undefined };
}
