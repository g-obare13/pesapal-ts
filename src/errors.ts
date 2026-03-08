/**
 * Base class for all Pesapal-related errors.
 */
export class PesapalError extends Error {
  /** HTTP status code if the error is from an API response. */
  public statusCode?: number;
  /** The full response object from the API if available. */
  public response?: any;

  constructor(message: string, statusCode?: number, response?: any) {
    super(message);
    this.name = "PesapalError";
    this.statusCode = statusCode;
    this.response = response;

    // TypeScript compilation target workaround for extending built-in classes
    Object.setPrototypeOf(this, PesapalError.prototype);
  }
}

/**
 * Thrown when an operation requires authentication but the client
 * is not authenticated, or when requesting a token fails.
 */
export class PesapalAuthenticationError extends PesapalError {
  constructor(message: string, statusCode?: number, response?: any) {
    super(message, statusCode, response);
    this.name = "PesapalAuthenticationError";
    Object.setPrototypeOf(this, PesapalAuthenticationError.prototype);
  }
}

/**
 * Thrown when providing invalid inputs before sending a request to PesaPal.
 */
export class PesapalValidationError extends PesapalError {
  constructor(message: string) {
    super(message, 400);
    this.name = "PesapalValidationError";
    Object.setPrototypeOf(this, PesapalValidationError.prototype);
  }
}

/**
 * Thrown when the PesaPal API responds with an explicit error structure.
 */
export class PesapalAPIError extends PesapalError {
  constructor(message: string, statusCode?: number, response?: any) {
    super(message, statusCode, response);
    this.name = "PesapalAPIError";
    Object.setPrototypeOf(this, PesapalAPIError.prototype);
  }
}

/**
 * Thrown when a network request fails (e.g. timeout, DNS resolution failure).
 */
export class PesapalNetworkError extends PesapalError {
  constructor(message: string, originalError?: any) {
    super(message, undefined, originalError);
    this.name = "PesapalNetworkError";
    Object.setPrototypeOf(this, PesapalNetworkError.prototype);
  }
}
