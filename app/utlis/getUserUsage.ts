"use server";

import prisma from "@/lib/prisma";
import {
  FREE_MAX_TRIES,
  FREE_MAX_WORDS,
  PAID_MAX_WORDS,
  getMaxTries,
  getMaxWords,
  canHumanize,
  type UserPlan,
} from "./planLimits";

export type UserUsage = {
  plan: UserPlan;
  triesUsed: number;
  maxTries: number | null;
  maxWords: number;
  canTry: boolean;
  triesRemaining: number | null;
};

export async function getUserUsage(userId: string): Promise<UserUsage> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, humanizeCount: true },
  });

  const plan = (user?.plan ?? "FREE") as UserPlan;
  const triesUsed = user?.humanizeCount ?? 0;
  const maxTries = getMaxTries(plan);
  const maxWords = getMaxWords(plan);

  return {
    plan,
    triesUsed,
    maxTries,
    maxWords,
    canTry: canHumanize(plan, triesUsed),
    triesRemaining:
      maxTries === null ? null : Math.max(0, maxTries - triesUsed),
  };
}
