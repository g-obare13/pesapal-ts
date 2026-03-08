import {
  PesapalConfig,
  AuthResponse,
  RegisterIpnPayload,
  RegisterIpnResponse,
  IpnListResponse,
  SubmitOrderPayload,
  SubmitOrderResponse,
  TransactionStatusResponse,
  RefundRequestPayload,
  RefundRequestResponse,
  CancelOrderPayload,
  CancelOrderResponse,
} from "./types";
import {
  PesapalError,
  PesapalAuthenticationError,
  PesapalAPIError,
  PesapalNetworkError,
  PesapalValidationError,
} from "./errors";

/**
 * The main Pesapal client for interacting with Pesapal V3 API.
 */
export class PesapalClient {
  private config: PesapalConfig;
  private baseUrl: string;
  private token: string | null = null;

  /**
   * Initializes a new Pesapal client.
   * @param config - The configuration for the Pesapal client.
   * @throws Error if consumerKey or consumerSecret is missing.
   */
  constructor(config: PesapalConfig) {
    if (!config.consumerKey || !config.consumerSecret) {
      throw new Error(
        "Pesapal config must include consumerKey and consumerSecret",
      );
    }

    this.config = {
      environment: "sandbox", // Default to sandbox
      ...config,
    };

    // Set Base URL depending on the environment
    this.baseUrl =
      this.config.environment === "production"
        ? "https://pay.pesapal.com/v3"
        : "https://cybqa.pesapal.com/pesapalv3";
  }

  /**
   * General request wrapper using fetch.
   * @param endpoint - The API endpoint to call.
   * @param options - Fetch options.
   * @param requireAuth - Whether the request requires a bearer token. Defaults to true.
   * @returns The parsed JSON response.
   * @throws PesapalAuthenticationError if no token is found and auth is required.
   * @throws PesapalAPIError if the API returns an error response.
   * @throws PesapalNetworkError if the request fails due to network issues.
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = true,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (requireAuth) {
      if (!this.token) {
        throw new PesapalAuthenticationError(
          "Not authenticated. Call authenticate() first.",
        );
      }
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const text = await response.text();
      let data: any;

      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        data = text;
      }

      if (!response.ok || (data && data.error && data.error.code)) {
        throw new PesapalAPIError(
          data?.error?.message ||
            data?.message ||
            `Pesapal API request failed: ${response.statusText}`,
          response.status,
          data,
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof PesapalError) {
        throw error;
      }
      throw new PesapalNetworkError(
        `Network or fetch error: ${(error as Error).message}`,
        error,
      );
    }
  }

  /**
   * Step 1: Request a bearer token for authentication.
   * @param forceRefresh - If true, requests a new token even if one exists.
   * @returns Information about the authentication token.
   * @throws PesapalAuthenticationError if the token request fails.
   */
  public async authenticate(
    forceRefresh: boolean = false,
  ): Promise<AuthResponse> {
    if (this.token && !forceRefresh) {
      // You could implement token expiry checks here
      return {
        token: this.token,
        status: "200",
        message: "Token alive",
        error: null,
        expiryDate: "",
      };
    }

    const payload = {
      consumer_key: this.config.consumerKey,
      consumer_secret: this.config.consumerSecret,
    };

    try {
      const response = await this.request<AuthResponse>(
        "/api/Auth/RequestToken",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        false, // Do not require auth for token request
      );

      if (response && response.token) {
        this.token = response.token;
      } else {
        throw new PesapalAuthenticationError(
          "Failed to get token from PesaPal response",
          500,
          response,
        );
      }

      return response;
    } catch (error) {
      if (error instanceof PesapalError) {
        throw new PesapalAuthenticationError(
          error.message,
          error.statusCode,
          error.response,
        );
      }
      throw error;
    }
  }

  /**
   * Step 2: Register the Instant Payment Notification (IPN) URL.
   * @param payload - The IPN registration details (URL and type).
   * @returns Details about the registered IPN.
   * @throws PesapalValidationError if required fields are missing.
   */
  public async registerIPN(
    payload: RegisterIpnPayload,
  ): Promise<RegisterIpnResponse> {
    if (!payload.url || !payload.ipn_notification_type) {
      throw new PesapalValidationError(
        "Register IPN requires: url, ipn_notification_type",
      );
    }

    return this.request<RegisterIpnResponse>("/api/URLSetup/RegisterIPN", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Step 3: Get the list of registered IPN URLs.
   * @returns A list of all registered IPN configurations.
   */
  public async getIPNList(): Promise<IpnListResponse[]> {
    return this.request<IpnListResponse[]>("/api/URLSetup/GetIpnList", {
      method: "GET",
    });
  }

  /**
   * Step 4: Submit a request for a new order.
   * @param payload - The order and billing details.
   * @returns Order tracking information and redirect URL.
   * @throws PesapalValidationError if required fields are missing or invalid.
   */
  public async submitOrder(
    payload: SubmitOrderPayload,
  ): Promise<SubmitOrderResponse> {
    if (
      !payload.id ||
      !payload.currency ||
      !payload.amount ||
      !payload.description ||
      !payload.callback_url ||
      !payload.notification_id ||
      !payload.billing_address
    ) {
      throw new PesapalValidationError(
        "Submit order is missing required fields",
      );
    }

    if (payload.amount <= 0) {
      throw new PesapalValidationError(
        "Order amount must be greater than zero",
      );
    }

    if (payload.subscription_details && !payload.account_number) {
      throw new PesapalValidationError(
        "An account_number is mandatory when providing subscription_details",
      );
    }

    return this.request<SubmitOrderResponse>(
      "/api/Transactions/SubmitOrderRequest",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  }

  /**
   * Step 5: Get the status of a transaction.
   * @param orderTrackingId - The unique tracking ID provided during order submission.
   * @returns Detailed information about the transaction status.
   * @throws PesapalValidationError if orderTrackingId is missing.
   */
  public async getTransactionStatus(
    orderTrackingId: string,
  ): Promise<TransactionStatusResponse> {
    if (!orderTrackingId) {
      throw new PesapalValidationError("orderTrackingId is required");
    }

    return this.request<TransactionStatusResponse>(
      `/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        method: "GET",
      },
    );
  }

  /**
   * Step 6: Submit a refund request.
   * @param payload - Refund request details.
   * @returns Status of the refund request.
   * @throws PesapalValidationError if required fields are missing.
   */
  public async requestRefund(
    payload: RefundRequestPayload,
  ): Promise<RefundRequestResponse> {
    if (
      !payload.confirmation_code ||
      !payload.amount ||
      !payload.username ||
      !payload.remarks
    ) {
      throw new PesapalValidationError(
        "Refund request requires: confirmation_code, amount, username, remarks",
      );
    }

    return this.request<RefundRequestResponse>(
      "/api/Transactions/RefundRequest",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  }

  /**
   * Step 7: Cancel a pending order.
   * @param payload - Cancel order payload containing tracking ID.
   * @returns Status of the cancellation request.
   * @throws PesapalValidationError if order_tracking_id is missing.
   */
  public async cancelOrder(
    payload: CancelOrderPayload,
  ): Promise<CancelOrderResponse> {
    if (!payload.order_tracking_id) {
      throw new PesapalValidationError(
        "Cancel order requires: order_tracking_id",
      );
    }

    return this.request<CancelOrderResponse>("/api/Transactions/CancelOrder", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  /**
   * Helper to manually set a token if it was retrieved elsewhere
   * (e.g. from shared cache).
   * @param token - The bearer token to use for subsequent requests.
   */
  public setToken(token: string): void {
    this.token = token;
  }

  /**
   * Gets the current active token.
   * @returns The active bearer token, or null if not authenticated.
   */
  public getToken(): string | null {
    return this.token;
  }
}
