export const FREE_MAX_TRIES = 5;
export const FREE_MAX_WORDS = 1000;
export const PAID_MAX_WORDS = 10000;

export type UserPlan = "FREE" | "PAID";

export function getMaxWords(plan: UserPlan): number {
  return plan === "PAID" ? PAID_MAX_WORDS : FREE_MAX_WORDS;
}

export function getMaxTries(plan: UserPlan): number | null {
  return plan === "PAID" ? null : FREE_MAX_TRIES;
}

export function canHumanize(plan: UserPlan, triesUsed: number): boolean {
  const max = getMaxTries(plan);
  if (max === null) return true;
  return triesUsed < max;
}
