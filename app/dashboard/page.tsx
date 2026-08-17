import { auth } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  // route protection is handled by clerkMiddleware in proxy.ts
  await auth.protect();

  return <h1>Dashboard</h1>;
}
