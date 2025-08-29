import { IncomingMessage, ServerResponse } from "http";
import { HttpError } from "./errors";

//sending a JSON  response with proper headers.
export function sendJSON<T>(
  res: ServerResponse,
  status: number,
  payload: T
): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

export function sendError(res: ServerResponse, err: HttpError | Error): void {
  if (err instanceof HttpError) {
    const body = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.details !== undefined ? { details: err.details } : {}),
      },
    };
    sendJSON(res, err.status, body);
    return;
  }

  // Fallback 500
  const body = {
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    },
  } as const;
  sendJSON(res, 500, body);
}

export async function parseJSONBody<T = Record<string, unknown>>(
  req: IncomingMessage,
  maxBytes = 1_000_000
): Promise<T | undefined> {
  const chunks: Buffer[] = [];
  let total = 0;

  return await new Promise<T | undefined>((resolve, reject) => {
    req.on("data", (chunk: Buffer) => {
      total += chunk.length;
      if (total > maxBytes) {
        reject(
          new HttpError(413, "PAYLOAD_TOO_LARGE", "Request body too large")
        );
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString();
      if (raw.length === 0) {
        // empty body -> treat as undefined
        resolve(undefined);
        return;
      }
      try {
        const data = JSON.parse(raw) as T;
        resolve(data);
      } catch {
        reject(new HttpError(400, "BAD_REQUEST", "Invalid JSON"));
      }
    });

    req.on("error", (e) => reject(e));
  });
}
