-- AlterTable
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "stripe_customer_id" TEXT,
ADD COLUMN IF NOT EXISTS "stripe_subscription_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_stripe_customer_id_key" ON "users"("stripe_customer_id");
CREATE UNIQUE INDEX IF NOT EXISTS "users_stripe_subscription_id_key" ON "users"("stripe_subscription_id");
