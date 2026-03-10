import { json } from "@sveltejs/kit";
import { pesapal } from "$lib/server/pesapal";
import { NEXT_PUBLIC_BASE_URL } from "$env/static/private";

export async function POST({ request }) {
  try {
    const body = await request.json();
    const baseUrl = NEXT_PUBLIC_BASE_URL || "http://localhost:3001";

    await pesapal.authenticate();

    // 1. Register IPN
    const ipn = await pesapal.registerIPN({
      url: `${baseUrl}/api/webhook`,
      ipn_notification_type: "GET",
    });

    // 2. Submit Order
    const orderResponse = await pesapal.submitOrder({
      id: `ORDER-ID-${Date.now()}`,
      currency: "KES",
      amount: Number(body.amount),
      description: body.description,
      callback_url: `${baseUrl}/payment-success`,
      notification_id: ipn.ipn_id,
      billing_address: {
        email_address: body.email,
        phone_number: body.phone,
        country_code: body.country || "KE",
        first_name: body.firstName,
        last_name: body.lastName,
        line_1: body.address,
        city: body.city,
        state: body.state,
        zip_code: body.zip,
      },
    });

    return json(orderResponse);
  } catch (error: any) {
    console.error("Payment failed", error);
    return json(
      { error: error?.message || "Failed to initiate payment" },
      { status: 500 },
    );
  }
}
