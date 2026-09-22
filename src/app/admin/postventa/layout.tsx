import { notFound } from "next/navigation";

import { requireTenantAdminWithPlan } from "@/lib/require-admin";

export default async function PostSaleLayout({ children }: { children: React.ReactNode }) {
  const { features } = await requireTenantAdminWithPlan();
  if (!features.allowPostSale) notFound();
  return children;
}
