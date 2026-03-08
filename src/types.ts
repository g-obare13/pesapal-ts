/**
 * Configuration for the Pesapal client.
 */
export interface PesapalConfig {
  /** The application consumer key provided by Pesapal. */
  consumerKey: string;
  /** The application consumer secret provided by Pesapal. */
  consumerSecret: string;
  /** The environment to use: 'sandbox' or 'production'. Defaults to 'sandbox'. */
  environment?: "sandbox" | "production";
}

/**
 * Response from a successful authentication request.
 */
export interface AuthResponse {
  /** The bearer token used for subsequent requests. */
  token: string;
  /** The date and time when the token expires. */
  expiryDate: string;
  /** Error message if any, otherwise null. */
  error: string | null;
  /** Status code of the response. */
  status: string;
  /** Human-readable message from the server. */
  message: string;
}

/**
 * Type of notification method for IPN.
 */
export type IpnNotificationType = "GET" | "POST";

/**
 * Payload for registering an IPN URL.
 */
export interface RegisterIpnPayload {
  /** The target URL to send IPN notifications to. */
  url: string;
  /** HTTP method to use for notifications. */
  ipn_notification_type: IpnNotificationType;
}

/**
 * Response from registering an IPN URL.
 */
export interface RegisterIpnResponse {
  /** The registered URL. */
  url: string;
  /** Date when the IPN was created. */
  created_date: string;
  /** Unique identifier for the IPN. */
  ipn_id: string;
  /** Error message if any, otherwise null. */
  error: string | null;
  /** Status of the registration. */
  status: string;
}

/**
 * Item in the list of registered IPNs.
 */
export interface IpnListResponse {
  /** The registered URL. */
  url: string;
  /** Date when the IPN was created. */
  created_date: string;
  /** Unique identifier for the IPN. */
  ipn_id: string;
  /** Error message if any, otherwise null. */
  error: string | null;
  /** Status of the IPN. */
  status: string;
}

/**
 * Address details for billing or shipping.
 */
export interface Address {
  /** Primary email address. */
  email_address: string;
  /** Optional phone number. */
  phone_number?: string;
  /** Two-letter ISO country code. */
  country_code?: string;
  /** First name. */
  first_name?: string;
  /** Middle name. */
  middle_name?: string;
  /** Last name. */
  last_name?: string;
  /** Primary address line. */
  line_1?: string;
  /** Secondary address line. */
  line_2?: string;
  /** City. */
  city?: string;
  /** State or province. */
  state?: string;
  /** Postal code. */
  postal_code?: string;
  /** Zip code. */
  zip_code?: string;
}

/**
 * Details for recurring subscriptions.
 */
export interface SubscriptionDetails {
  /** Start date for the subscription (ISO format). */
  start_date: string;
  /** End date for the subscription (ISO format). */
  end_date: string;
  /** Frequency of billing. */
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY" | string;
}

/**
 * Payload to submit a new order.
 */
export interface SubmitOrderPayload {
  /** Unique merchant reference ID for the order. */
  id: string;
  /** Three-letter ISO currency code (e.g., KES, USD). */
  currency: string;
  /** Total amount for the order. */
  amount: number;
  /** Description of the order items or service. */
  description: string;
  /** URL to redirect the user after the payment process. */
  callback_url: string;
  /** Registered IPN ID to use for notifications. */
  notification_id: string;
  /** Optional URL to redirect the user if they cancel. */
  cancellation_url?: string;
  /** Customer billing address details. */
  billing_address: Address;
  /** Optional account number. Mandatory for subscriptions. */
  account_number?: string;
  /** Optional details for subscription orders. */
  subscription_details?: SubscriptionDetails;
}

/**
 * Response from submitting an order.
 */
export interface SubmitOrderResponse {
  /** Unique tracking ID from Pesapal for this transaction. */
  order_tracking_id: string;
  /** The merchant reference ID provided in the request. */
  merchant_reference: string;
  /** The URL where the user should be redirected to complete payment. */
  redirect_url: string;
  /** Error message if any, otherwise null. */
  error: string | null;
  /** Status of the order submission. */
  status: string;
}

/**
 * Information related to subscription transactions.
 */
export interface SubscriptionTransactionInfo {
  /** Reference account for the subscription. */
  account_reference: string;
  /** Amount for this transaction. */
  amount: number;
  /** Customer's first name. */
  first_name: string;
  /** Customer's last name. */
  last_name: string;
  /** Correlation tracking ID. */
  correlation_id: number;
}

/**
 * Response containing full status of a transaction.
 */
export interface TransactionStatusResponse {
  /** Method used for payment (e.g., M-Pesa, Card). */
  payment_method: string;
  /** Transaction amount. */
  amount: number;
  /** Date the transaction was created. */
  created_date: string;
  /** Provider's confirmation code (e.g., M-Pesa reference). */
  confirmation_code: string;
  /** Pesapal tracking ID. */
  order_tracking_id: string;
  /** Description of the current payment status. */
  payment_status_description: string;
  /** Order description. */
  description: string;
  /** Server message. */
  message: string;
  /** Account used for payment. */
  payment_account: string;
  /** Registered callback URL. */
  call_back_url: string;
  /** Internal status code. */
  status_code: number;
  /** Original merchant reference. */
  merchant_reference: string;
  /** Standardized payment status code. */
  payment_status_code: string;
  /** Transaction currency. */
  currency: string;
  /** Error object if any, otherwise null. */
  error: any | null;
  /** Overall response status. */
  status: string;
  /** Subscription specific details if applicable. */
  subscription_transaction_info?: SubscriptionTransactionInfo;
}

/**
 * Payload for requesting a refund.
 */
export interface RefundRequestPayload {
  /** Original provider confirmation code. */
  confirmation_code: string;
  /** Amount to refund. */
  amount: string;
  /** Username of the person authorizing the refund. */
  username: string;
  /** Reason for the refund. */
  remarks: string;
}

/**
 * Response from a refund request.
 */
export interface RefundRequestResponse {
  /** Status of the refund request. */
  status: string;
  /** Server message. */
  message: string;
}

/**
 * Payload for canceling an order.
 */
export interface CancelOrderPayload {
  /** Pesapal tracking ID to cancel. */
  order_tracking_id: string;
}

/**
 * Response from an order cancellation.
 */
export interface CancelOrderResponse {
  /** Status of the cancellation. */
  status: string;
  /** Server message. */
  message: string;
}
