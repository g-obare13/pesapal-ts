import { json } from "@sveltejs/kit";
import { pesapal } from "$lib/server/pesapal";

export async function GET({ url }) {
  const orderTrackingId = url.searchParams.get("OrderTrackingId");
  const orderNotificationType = url.searchParams.get("OrderNotificationType");
  const orderMerchantReference = url.searchParams.get("OrderMerchantReference");

  console.log("Webhook received:", {
    orderTrackingId,
    orderNotificationType,
    orderMerchantReference,
  });

  if (orderTrackingId && orderNotificationType === "IPNCHANGE") {
    try {
      await pesapal.authenticate();
      const status = await pesapal.getTransactionStatus(orderTrackingId);
      console.log("Transaction status:", status);
    } catch (error) {
      console.error("Error updating transaction status:", error);
    }
  }

  return json({ received: true });
}
