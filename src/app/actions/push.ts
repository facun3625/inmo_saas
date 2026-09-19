"use server";

import { ActionError, toUserError } from "@/lib/action-error";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getCurrentTenant } from "@/lib/tenant";

// Suscripción push del lado cliente (storefront) — a diferencia de
// subscribeToPush en admin/actions.ts, esto no exige rol ADMIN: cualquier
// usuario logueado de la tienda actual puede activar notificaciones.
export async function subscribeToCustomerPush(subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}) {
  try {
    return await runSubscribeToCustomerPush(subscription);
  } catch (err) {
    return toUserError(err, "No se pudieron activar las notificaciones");
  }
}

async function runSubscribeToCustomerPush(subscription: {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}) {
  const [session, tenant] = await Promise.all([auth(), getCurrentTenant()]);
  if (!session?.user || !tenant) throw new ActionError("No autorizado");

  await prisma.pushSubscription.upsert({
    where: { endpoint: subscription.endpoint },
    update: {
      userId: session.user.id,
      tenantId: tenant.id,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    create: {
      userId: session.user.id,
      tenantId: tenant.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  });
  return { ok: true as const };
}

// Scoped a userId además de endpoint: que un cliente no pueda borrar la
// suscripción de otro adivinando/reenviando un endpoint ajeno.
export async function unsubscribeFromCustomerPush(endpoint: string) {
  try {
    return await runUnsubscribeFromCustomerPush(endpoint);
  } catch (err) {
    return toUserError(err, "No se pudieron desactivar las notificaciones");
  }
}

async function runUnsubscribeFromCustomerPush(endpoint: string) {
  const session = await auth();
  if (!session?.user) throw new ActionError("No autorizado");

  await prisma.pushSubscription.deleteMany({
    where: { endpoint, userId: session.user.id },
  });
  return { ok: true as const };
}
