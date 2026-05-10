import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      passwordHash: true,
      oauthAccounts: {
        where: { provider: "google" },
        select: { email: true, linkedAt: true },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const googleAccount = user.oauthAccounts[0] ?? null;

  return NextResponse.json({
    emailPassword: !!user.passwordHash,
    googleLinked: !!googleAccount,
    googleEmail: googleAccount?.email ?? null,
  });
}
