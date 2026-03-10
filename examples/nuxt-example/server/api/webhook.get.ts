import { usePesapal } from "../utils/pesapal";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const orderTrackingId = query.OrderTrackingId as string;
  const orderNotificationType = query.OrderNotificationType as string;
  const orderMerchantReference = query.OrderMerchantReference as string;

  console.log("Webhook received:", {
    orderTrackingId,
    orderNotificationType,
    orderMerchantReference,
  });

  if (orderTrackingId && orderNotificationType === "IPNCHANGE") {
    try {
      const pesapal = usePesapal();
      await pesapal.authenticate();
      const status = await pesapal.getTransactionStatus(orderTrackingId);

      console.log("Transaction status:", status);

      // Update your database here
    } catch (error) {
      console.error("Error updating transaction status:", error);
    }
  }

  return { received: true };
});
