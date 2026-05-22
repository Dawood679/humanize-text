import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import DashboardShell from "@/app/Components/dashboard/DashboardShell";
import prisma from "@/lib/prisma";
import { mapTextsToChats } from "@/app/utlis/chatMappers";
import { getUserUsage } from "@/app/utlis/getUserUsage";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  let userId = session.user.id;

  if (!userId && session.user.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });
    userId = user?.id ?? "";
  }

  if (!userId) {
    redirect("/");
  }

  const [texts, usage] = await Promise.all([
    prisma.text.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    }),
    getUserUsage(userId),
  ]);

  const initialChats = mapTextsToChats(texts);

  return (
    <DashboardShell
      userName={session.user.name}
      userId={userId}
      initialChats={initialChats}
      initialUsage={usage}
    />
  );
}
