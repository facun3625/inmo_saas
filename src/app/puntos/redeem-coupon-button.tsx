"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { redeemCoupon } from "./actions";

export function RedeemCouponButton({ couponId, disabled }: { couponId: string; disabled: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleClick() {
    startTransition(async () => {
      try {
        const result = await redeemCoupon(couponId);
        if ("error" in result) {
          toast.error(result.error);
          return;
        }
        toast.success("Cupón canjeado — ya lo podés usar en tu próximo pedido");
        router.refresh();
      } catch {
        toast.error("Se cortó la conexión. Probá de nuevo.");
      }
    });
  }

  return (
    <Button size="sm" disabled={disabled || pending} onClick={handleClick}>
      {pending ? "Canjeando…" : "Canjear"}
    </Button>
  );
}
