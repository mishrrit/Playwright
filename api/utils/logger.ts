export const sanitize = (obj: any) => {
  try {
    const clone = JSON.parse(JSON.stringify(obj));
    const mask = (v: string) => (v ? "***" : v);
    if (clone?.headers?.authorization)
      clone.headers.authorization = mask(clone.headers.authorization);
    if (clone?.password) clone.password = mask(clone.password);
    if (clone?.token) clone.token = mask(clone.token);
    return clone;
  } catch {
    return obj;
  }
};

export class Logger {
  static info(msg: string, meta?: any) {
    console.info("[api][info]", msg, meta ? sanitize(meta) : "");
  }
  static debug(msg: string, meta?: any) {
    if (process.env.DEBUG)
      console.debug("[api][debug]", msg, meta ? sanitize(meta) : "");
  }
  static error(msg: string, meta?: any) {
    console.error("[api][error]", msg, meta ? sanitize(meta) : "");
  }
}
