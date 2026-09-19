"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentTenant } from "@/lib/tenant";
import { canTenantReceiveOrders } from "@/lib/billing-status";
import { isRateLimited, recordFailure, clientIp } from "@/lib/rate-limit";
import { ActionError, toUserError } from "@/lib/action-error";

const operationLabels: Record<string, string> = { SALE: "Venta", RENT: "Alquiler" };

export async function subscribeToAlerts(form: FormData) {
  const tenant = await getCurrentTenant();
  try {
    if (!tenant || !canTenantReceiveOrders(tenant))
      throw new ActionError("El sitio no está disponible");
    const data = z
      .object({
        name: z.string().trim().min(2).max(150),
        email: z.email().max(254),
        operation: z.enum(["SALE", "RENT", ""]).optional(),
        propertyType: z.string().trim().max(80).optional().or(z.literal("")),
        zone: z.string().trim().max(150).optional().or(z.literal("")),
        maxBudget: z.string().trim().max(20).optional().or(z.literal("")),
        website: z.literal(""),
      })
      .parse(Object.fromEntries(form));
    const key = `estate-alert:${tenant.id}:${clientIp(await headers())}`;
    if (await isRateLimited(key, { limit: 5, windowMinutes: 60 }))
      throw new ActionError("Ya recibimos varias solicitudes. Intentá más tarde.");
    await recordFailure(key);
    const criteria = [
      data.operation ? operationLabels[data.operation] : null,
      data.propertyType || null,
      data.zone ? `zona ${data.zone}` : null,
      data.maxBudget ? `hasta ${data.maxBudget}` : null,
    ]
      .filter(Boolean)
      .join(", ");
    const contact = await prisma.estateContact.create({
      data: {
        tenantId: tenant.id,
        name: data.name,
        email: data.email,
        roles: ["PROSPECT"],
      },
    });
    await prisma.estateInquiry.create({
      data: {
        tenantId: tenant.id,
        contactId: contact.id,
        message: criteria
          ? `Quiere recibir alertas de propiedades: ${criteria}.`
          : "Quiere recibir alertas de propiedades nuevas.",
        source: "ALERTA",
      },
    });
    revalidatePath("/admin", "layout");
    return { ok: true };
  } catch (error) {
    return toUserError(error, "No pudimos registrar tu solicitud");
  }
}
