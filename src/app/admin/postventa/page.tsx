import { ClipboardCheckIcon, HardHatIcon, KeyRoundIcon, WrenchIcon } from "lucide-react";

const nextAreas = [
  { icon: KeyRoundIcon, label: "Entregas y actas" },
  { icon: WrenchIcon, label: "Reclamos y garantías" },
  { icon: HardHatIcon, label: "Inspecciones y trabajos" },
  { icon: ClipboardCheckIcon, label: "Conformidad y cierre" },
];

export default function PostSaleHomePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">Postventa</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Gestión de postventa</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Este entorno será el punto de trabajo para desarrolladoras y constructoras después de la
          entrega: garantías, reclamos, inspecciones, reparaciones y cierre de casos.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {nextAreas.map(({ icon: Icon, label }) => (
          <div key={label} className="rounded-2xl border bg-card p-5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <p className="mt-4 font-medium">{label}</p>
            <p className="mt-1 text-xs text-muted-foreground">Próximamente</p>
          </div>
        ))}
      </section>
    </div>
  );
}
