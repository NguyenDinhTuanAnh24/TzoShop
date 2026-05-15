import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(100),
  avatarUrl: z.string().trim().url().optional(),
});

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      ...(parsed.data.avatarUrl ? { avatarUrl: parsed.data.avatarUrl } : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
    },
  });

  return NextResponse.json({
    user: {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      image: updated.avatarUrl,
    },
  });
}

