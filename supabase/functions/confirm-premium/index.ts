import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT and extract user identity
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const userId = claimsData.claims.sub;
    if (!userId) throw new Error("No user ID in token");

    const { session_id } = await req.json();
    if (!session_id) {
      throw new Error("session_id is required");
    }

    // Verify the Stripe session was paid
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      throw new Error("Payment not completed");
    }

    // Verify the session belongs to this user (metadata was set server-side)
    if (session.metadata?.user_id !== userId) {
      throw new Error("User mismatch");
    }

    // Update premium status using service role
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ premium: true })
      .eq("id", userId);

    if (updateError) throw new Error(`DB update failed: ${updateError.message}`);

    // Record the purchase
    await supabaseAdmin.from("purchases").insert({
      user_id: userId,
      store: "stripe",
      product_id: "zenvibe_premium",
      purchase_token: session_id,
      premium_unlocked: true,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("[confirm-premium] internal error:", error);
    // Return specific messages for known validation errors, generic for everything else
    const msg = error instanceof Error ? error.message : String(error);
    const safeMessages = ["Payment not completed", "User mismatch", "session_id is required", "No user ID in token", "Unauthorized"];
    const clientMessage = safeMessages.some(m => msg.includes(m)) ? msg : "Internal server error";
    const status = clientMessage === "Internal server error" ? 500 : 400;
    return new Response(JSON.stringify({ error: clientMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    });
  }
});
