import type { APIRoute } from "astro";

// This route is server-rendered (Vercel Serverless Function)
export const prerender = false;

interface GHLContactPayload {
  locationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  tags: string[];
  customFields?: Array<{ key: string; field_value: string }>;
}

export const POST: APIRoute = async ({ request }) => {
  const GHL_API_KEY = import.meta.env.GHL_API_KEY;
  const GHL_LOCATION_ID = import.meta.env.GHL_LOCATION_ID;

  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    console.error("Missing GHL_API_KEY or GHL_LOCATION_ID env vars");
    return new Response(
      JSON.stringify({ success: false, error: "Server misconfiguration" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  // Parse incoming form data
  let name = "";
  let email = "";
  let phone = "";
  let message = "";

  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const body = await request.json();
    name = body.name ?? "";
    email = body.email ?? "";
    phone = body.phone ?? "";
    message = body.message ?? "";
  } else {
    const formData = await request.formData();
    name = (formData.get("name") as string) ?? "";
    email = (formData.get("email") as string) ?? "";
    phone = (formData.get("phone") as string) ?? "";
    message = (formData.get("message") as string) ?? "";
  }

  // Basic validation
  if (!name || !email) {
    return new Response(
      JSON.stringify({ success: false, error: "Name and email are required" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const nameParts = name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ");

  const payload: GHLContactPayload = {
    locationId: GHL_LOCATION_ID,
    firstName,
    lastName,
    email: email.trim(),
    phone: phone.trim(),
    tags: ["website-contact-form"],
  };

  try {
    const ghlRes = await fetch(
      "https://services.leadconnectorhq.com/contacts/upsert",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GHL_API_KEY}`,
          "Content-Type": "application/json",
          Version: "2021-07-28",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!ghlRes.ok) {
      const errText = await ghlRes.text();
      let detail = "Failed to submit. Please try again.";
      try {
        const errJson = JSON.parse(errText);
        detail = errJson.message || errJson.error || errText;
      } catch (e) {
        detail = errText;
      }

      console.error(`GHL API error ${ghlRes.status}:`, errText);
      return new Response(
        JSON.stringify({
          success: false,
          error: detail,
        }),
        {
          status: ghlRes.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const result = await ghlRes.json();
    const contactId = result?.contact?.id;
    console.log("GHL contact created:", contactId);

    // 1. If there's a message, add it to the Conversations tab
    if (contactId && message.trim()) {
      try {
        const convRes = await fetch(
          "https://services.leadconnectorhq.com/conversations/messages",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${GHL_API_KEY}`,
              "Content-Type": "application/json",
              Version: "2021-07-28",
            },
            body: JSON.stringify({
              type: "Email",
              contactId: contactId,
              direction: "inbound",
              status: "delivered", // Ensures it appears as a completed message
              subject: "Website Contact Form Submission", // Required for Email type
              html: `<p>${message.trim().replace(/\n/g, "<br>")}</p>`, // GHL Email type prefers HTML
              message: message.trim(), // Fallback plain text
            }),
          },
        );

        if (!convRes.ok) {
          const convErr = await convRes.text();
          console.error(
            `GHL Conversation API error ${convRes.status}:`,
            convErr,
          );
        } else {
          console.log("GHL conversation message added successfully.");
        }
      } catch (err) {
        console.error("Failed to call GHL Conversation API:", err);
      }
    }

    // 2. Also add it as a Note for redundant audit tracking
    if (contactId && message.trim()) {
      try {
        await fetch(
          `https://services.leadconnectorhq.com/contacts/${contactId}/notes`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${GHL_API_KEY}`,
              "Content-Type": "application/json",
              Version: "2021-07-28",
            },
            body: JSON.stringify({
              body: `Message from web form:\n\n${message.trim()}`,
            }),
          },
        );
        console.log("GHL note added to contact:", contactId);
      } catch (noteErr) {
        console.error("Failed to add GHL note:", noteErr);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Contact form error:", err);
    return new Response(
      JSON.stringify({
        success: false,
        error: "An unexpected error occurred.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
