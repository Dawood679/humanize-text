"use client";
import { useSession } from "next-auth/react"


export default function ShowUser() {
    const { data: session } = useSession( )
  return <div>{session?.user?.name}</div>;
}

