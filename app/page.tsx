import { auth } from "@/auth/auth";
import { redirect } from "next/navigation";
import LandingPage from "./Components/landing/LandingPage";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}
