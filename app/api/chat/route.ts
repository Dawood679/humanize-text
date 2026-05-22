import { NextResponse } from "next/server";
import generateOutputText from "@/app/utlis/helptobuildtext";
import { auth } from "@/auth/auth";
import prisma from "@/lib/prisma";
import { countWords } from "@/app/utlis/countWords";
import {
  canHumanize,
  getMaxWords,
  type UserPlan,
} from "@/app/utlis/planLimits";

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { input?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const input = body.input?.trim();
  if (!input) {
    return NextResponse.json({ error: "Input is required" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, humanizeCount: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const plan = user.plan as UserPlan;
  const wordCount = countWords(input);
  const maxWords = getMaxWords(plan);

  if (wordCount > maxWords) {
    return NextResponse.json(
      {
        error: `Maximum ${maxWords.toLocaleString()} words allowed on your plan.`,
        code: "WORD_LIMIT",
        wordCount,
        maxWords,
        plan,
      },
      { status: 403 }
    );
  }

  if (!canHumanize(plan, user.humanizeCount)) {
    return NextResponse.json(
      {
        error: "Free try limit reached. Upgrade to continue.",
        code: "TRY_LIMIT",
        triesUsed: user.humanizeCount,
        plan,
      },
      { status: 403 }
    );
  }

  try {
    const generatedOutput = await generateOutputText(input);

    await prisma.$transaction([
      prisma.text.create({
        data: {
          userId,
          input,
          output: generatedOutput ?? "",
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { humanizeCount: { increment: 1 } },
      }),
    ]);

    const updated = await prisma.user.findUnique({
      where: { id: userId },
      select: { humanizeCount: true, plan: true },
    });

    return NextResponse.json({
      output: generatedOutput,
      usage: {
        triesUsed: updated?.humanizeCount ?? user.humanizeCount + 1,
        plan: updated?.plan ?? plan,
      },
    });
  } catch (error) {
    console.error("[api/chat]", error);
    return NextResponse.json(
      { error: "Failed to generate output" },
      { status: 500 }
    );
  }
}
