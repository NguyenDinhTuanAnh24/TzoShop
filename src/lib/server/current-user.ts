import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  
  if (!user || !user.id) {
    throw new Error("UNAUTHORIZED");
  }
  
  return user;
}

export async function requireAdminUser() {
  const user = await requireCurrentUser();
  
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  
  return user;
}
