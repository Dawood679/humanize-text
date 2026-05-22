"use server";

import prisma from "@/lib/prisma";
import { mapTextsToChats } from "./chatMappers";

async function getUserRecentText(userId: string) {
  if (!userId) return [];

  const raw = await prisma.text.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  return mapTextsToChats(raw);
}

export default getUserRecentText;
