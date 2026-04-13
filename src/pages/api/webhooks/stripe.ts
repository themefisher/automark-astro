import type { APIRoute } from "astro";
import Stripe from "stripe";

export const prerender = false;

interface GHLContactPayload {
  locationId: string;
  email: string;
  tags: string[];
  customFields?: Array<{ key: string; field_value: string }>;
}

export const POST: APIRoute = async ({ request }) => {
  const STRIPE_SECRET_KEY = import.meta.env.STRIPE_SECRET_KEY;
  const STRIPE_WEBHOOK_SECRET = import.meta.env.STRIPE_WEBHOOK_SECRET;
  const GHL_API_KEY = import.meta.env.GHL_API_KEY;
  const GHL_LOCATION_ID = import.meta.env.GHL_LOCATION_ID;

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return new Response("Webhook Error: Missing Stripe Env variables", { status: 500 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2026-03-25.dahlia",
  });

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Webhook Error: Missing stripe-signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email || session.customer_email;
    const pricePaid = session.amount_total ? (session.amount_total / 100).toString() : "0";

    if (customerEmail && GHL_API_KEY && GHL_LOCATION_ID) {
      // Upsert the contact to mark as a PAID customer
      const payload: GHLContactPayload = {
        locationId: GHL_LOCATION_ID,
        email: customerEmail,
        tags: ["paid-customer"],
        customFields: [
          // IMPORTANT: Replace "price" with your exact "Unique Key" found in GHL -> Settings -> Custom Fields
          { key: "price", field_value: `$${pricePaid}` } 
        ],
      };

      try {
        await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GHL_API_KEY}`,
            "Content-Type": "application/json",
            Version: "2021-07-28",
          },
          body: JSON.stringify(payload),
        });
        console.log(`GHL updated for paid customer: ${customerEmail}`);
      } catch (err) {
        console.error("GHL Webhook Update Error:", err);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
};
