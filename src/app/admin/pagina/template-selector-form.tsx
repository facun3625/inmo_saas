"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { updateTemplate } from "./actions";
import { STORE_TEMPLATES } from "./templates";

const TEMPLATE_INFO: Record<(typeof STORE_TEMPLATES)[number], { label: string; description: string }> = {
  clasico: { label: "Clásico", description: "Header sólido, catálogo en grilla. El diseño actual de tu sitio." },
  moderno: { label: "Moderno", description: "Hero grande con foto de portada y tipografía más marcada." },
  minimal: { label: "Minimal", description: "Look liviano, sin bordes, foco en las fotos de las propiedades." },
};

function TemplatePreview({ id }: { id: (typeof STORE_TEMPLATES)[number] }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border bg-muted/40 p-2">
      <div className={cn("h-3 rounded-sm", id === "minimal" ? "bg-foreground/20" : "bg-primary")} />
      {id === "moderno" && <div className="h-8 rounded-sm bg-primary/20" />}
      <div className="grid grid-cols-3 gap-1">
        <div className="h-6 rounded-sm bg-foreground/10" />
        <div className="h-6 rounded-sm bg-foreground/10" />
        <div className="h-6 rounded-sm bg-foreground/10" />
      </div>
    </div>
  );
}

export function TemplateSelectorForm({ template }: { template: string }) {
  const [selected, setSelected] = useState(template);
  const [pending, startTransition] = useTransition();

  function handleSelect(id: string) {
    if (id === selected) return;
    const previous = selected;
    setSelected(id);
    startTransition(async () => {
      const actionResult = await updateTemplate(id);
      if ("error" in actionResult) {
        toast.error(actionResult.error);
        setSelected(previous);
        return;
      }
      toast.success("Plantilla guardada");
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4">
      <p className="text-sm text-muted-foreground">
        Elegí la base visual de tu sitio. Por ahora todas las plantillas usan el mismo diseño —
        muy pronto vas a poder ver el look real de cada una.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {STORE_TEMPLATES.map((id) => {
          const info = TEMPLATE_INFO[id];
          const active = selected === id;
          return (
            <button
              key={id}
              type="button"
              disabled={pending}
              onClick={() => handleSelect(id)}
              className={cn(
                "flex flex-col gap-3 rounded-xl border p-3 text-left transition disabled:opacity-60",
                active ? "border-primary ring-1 ring-primary" : "hover:border-foreground/30",
              )}
            >
              <TemplatePreview id={id} />
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{info.label}</p>
                  <p className="text-xs text-muted-foreground">{info.description}</p>
                </div>
                {active && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CheckIcon className="size-3" />
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
