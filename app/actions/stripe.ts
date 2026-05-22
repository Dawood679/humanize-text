"use server";

import { auth } from "@/auth/auth";
import prisma from "@/lib/prisma";
import { getStripe, STRIPE_PRO_PRICE_ID } from "@/lib/stripe";

export async function createCheckoutSession() {
  const session = await auth();
  const userId = session?.user?.id;
  const email = session?.user?.email;

  if (!userId || !email) {
    return { error: "You must be signed in to upgrade." };
  }

  if (!STRIPE_PRO_PRICE_ID) {
    return { error: "Stripe price is not configured. Set STRIPE_PRO_PRICE_ID in .env" };
  }

  const baseUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true, plan: true },
  });

  if (user?.plan === "PAID") {
    return { error: "You already have Pro." };
  }

  try {
    const checkoutSession = await getStripe().checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      ...(user?.stripeCustomerId
        ? { customer: user.stripeCustomerId }
        : { customer_email: email }),
      client_reference_id: userId,
      metadata: { userId },
      subscription_data: {
        metadata: { userId },
      },
      success_url: `${baseUrl}/dashboard?upgrade=success`,
      cancel_url: `${baseUrl}/dashboard?upgrade=cancelled`,
    });

    if (!checkoutSession.url) {
      return { error: "Could not start checkout." };
    }

    return { url: checkoutSession.url };
  } catch (error) {
    console.error("[stripe/checkout]", error);
    return { error: "Failed to start payment. Please try again." };
  }
}
