import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requireTenantAdmin } from "@/lib/require-admin";
import { getUserPointsBalance } from "@/lib/points";
import { formatPrice } from "@/lib/format";
import { FULFILLMENT_TYPE_LABELS, PAYMENT_METHOD_LABELS } from "@/lib/order-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrdersTable } from "../../pedidos/orders-table";
import { UserRoleToggle, UserDeleteButton } from "../user-row-actions";

const dateFormatter = new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" });

function formatDiscount(type: "PERCENT" | "FIXED", value: number) {
  return type === "PERCENT" ? `${value}%` : formatPrice(value);
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { session, tenant } = await requireTenantAdmin();

  const [user, orders, pointsBalance, couponRedemptions] = await Promise.all([
    prisma.user.findUnique({ where: { id, tenantId: tenant.id } }),
    prisma.order.findMany({
      where: { userId: id, tenantId: tenant.id },
      include: { paymentProof: true, deliveryDate: true },
      orderBy: { createdAt: "desc" },
    }),
    getUserPointsBalance(id),
    // Un cupón tipeado a mano en el checkout y uno canjeado por puntos dejan
    // la misma fila acá — es el único registro de "qué cupones usó" sin
    // importar cómo llegó a tenerlo. orderId null = lo canjeó por puntos
    // pero todavía no lo usó en ningún pedido.
    prisma.couponRedemption.findMany({
      where: { userId: id, coupon: { tenantId: tenant.id } },
      include: { coupon: true },
      orderBy: { redeemedAt: "desc" },
    }),
  ]);

  if (!user) notFound();

  const orderById = new Map(orders.map((o) => [o.id, o]));

  const isSelf = user.id === session?.user.id;
  const totalSpent = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          render={<Link href="/admin/usuarios" aria-label="Volver a usuarios" />}
        >
          <ArrowLeftIcon />
        </Button>
        <h1 className="text-xl font-semibold">{user.name || "Sin nombre"}</h1>
        {user.role === "ADMIN" && <Badge>Admin</Badge>}
        {isSelf && <Badge variant="secondary">Vos</Badge>}
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-lg border p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Email</span>
          <span className="text-sm font-medium">{user.email}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Teléfono</span>
          <span className="text-sm font-medium">{user.phone || "—"}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Dirección</span>
          <span className="text-sm font-medium">{user.address || "—"}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Se unió</span>
          <span className="text-sm font-medium">{dateFormatter.format(user.createdAt)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Pedidos</span>
          <span className="text-sm font-medium">{orders.length}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Total gastado</span>
          <span className="text-sm font-medium">{formatPrice(totalSpent)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">Puntos</span>
          <span className="text-sm font-medium">{pointsBalance}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 rounded-lg border p-4">
        <label className="flex items-center gap-2.5 text-sm">
          <UserRoleToggle id={user.id} role={user.role} disabled={isSelf} />
          <span className="font-medium">Es admin</span>
        </label>
        <UserDeleteButton id={user.id} label={user.name || user.email} disabled={isSelf} />
        {isSelf && (
          <span className="text-xs text-muted-foreground">
            No podés cambiar tu propio rol ni borrar tu cuenta desde acá.
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-medium">Cupones</h2>
        {couponRedemptions.length === 0 ? (
          <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
            Todavía no usó ningún cupón.
          </p>
        ) : (
          <div className="flex flex-col divide-y rounded-lg border">
            {couponRedemptions.map((r) => {
              const order = r.orderId ? orderById.get(r.orderId) : null;
              return (
                <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{r.coupon.code}</span>
                    <span className="text-muted-foreground">
                      {formatDiscount(r.coupon.discountType, Number(r.coupon.discountValue))}
                      {r.coupon.pointsCost > 0 ? ` · canjeado por ${r.coupon.pointsCost} puntos` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{dateFormatter.format(r.redeemedAt)}</span>
                    {order ? (
                      <Link href={`/admin/pedidos/${order.id}`} className="font-medium text-primary underline">
                        Usado en su pedido de {dateFormatter.format(order.createdAt)}
                      </Link>
                    ) : (
                      <Badge variant="secondary">Todavía no lo usó</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-medium">Historial de compras</h2>
        {orders.length === 0 ? (
          <p className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
            Todavía no hizo ningún pedido.
          </p>
        ) : (
          <OrdersTable
            orders={orders.map((o) => ({
              id: o.id,
              buyerLabel: user.name || user.email,
              isGuest: false,
              proofUrl: o.paymentProof?.url ?? null,
              deliveryLabel: dateFormatter.format(o.deliveryDate.date),
              fulfillmentLabel: FULFILLMENT_TYPE_LABELS[o.fulfillmentType],
              paymentLabel: PAYMENT_METHOD_LABELS[o.paymentMethod],
              status: o.status,
              needsReview: o.paymentMethod === "TRANSFER" && o.paymentProof?.status === "PENDING",
              isNew: !o.viewedAt,
              totalLabel: formatPrice(Number(o.total)),
            }))}
          />
        )}
      </div>
    </div>
  );
}
