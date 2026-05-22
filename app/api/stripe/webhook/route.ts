import { NextResponse } from "next/server";
import type Stripe from "stripe";
import prisma from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

async function upgradeUser(
  userId: string,
  customerId: string,
  subscriptionId: string
) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: "PAID",
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
    },
  });
}

async function downgradeUser(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: "FREE",
      stripeSubscriptionId: null,
    },
  });
}

async function resolveUserId(
  metadata: Stripe.Metadata | null | undefined,
  clientReferenceId?: string | null
): Promise<string | null> {
  if (metadata?.userId) return metadata.userId;
  if (clientReferenceId) return clientReferenceId;
  return null;
}

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        if (checkoutSession.mode !== "subscription") break;

        const userId = await resolveUserId(
          checkoutSession.metadata,
          checkoutSession.client_reference_id
        );
        const customerId =
          typeof checkoutSession.customer === "string"
            ? checkoutSession.customer
            : checkoutSession.customer?.id;
        const subscriptionId =
          typeof checkoutSession.subscription === "string"
            ? checkoutSession.subscription
            : checkoutSession.subscription?.id;

        if (userId && customerId && subscriptionId) {
          await upgradeUser(userId, customerId, subscriptionId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = await resolveUserId(subscription.metadata);
        if (!userId) break;

        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        if (
          subscription.status === "active" ||
          subscription.status === "trialing"
        ) {
          await upgradeUser(userId, customerId, subscription.id);
        } else if (
          subscription.status === "canceled" ||
          subscription.status === "unpaid" ||
          subscription.status === "past_due"
        ) {
          if (subscription.status === "canceled") {
            await downgradeUser(userId);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = await resolveUserId(subscription.metadata);
        if (userId) await downgradeUser(userId);
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("[stripe/webhook] handler error", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
