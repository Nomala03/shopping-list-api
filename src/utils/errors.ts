export type ErrorCode =
  | "BAD_REQUEST"
  | "NOT_FOUND"
  | "METHOD_NOT_ALLOWED"
  | "UNSUPPORTED_MEDIA_TYPE"
  | "PAYLOAD_TOO_LARGE"
  | "INTERNAL_SERVER_ERROR";

export interface ValidationErrorDetail {
  field: string;
  message: string;
}

export class HttpError extends Error {
  status: number;
  code: ErrorCode;
  details?: ValidationErrorDetail[];

  constructor(
    status: number,
    code: ErrorCode,
    message: string,
    details?: ValidationErrorDetail[]
  ) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}
