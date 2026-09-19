"use client";
import { useState, useTransition } from "react";
import {
  Bell,
  User,
  Mail,
  Tag,
  Building2,
  MapPin,
  Wallet,
  ChevronDown,
} from "lucide-react";
import { subscribeToAlerts } from "./actions";

const fieldWrap =
  "mt-1.5 flex min-h-12 items-center gap-2 rounded-xl border border-input bg-background px-3.5 py-2.5 transition-[border-color,box-shadow] duration-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20";
const fieldInput =
  "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground";

export function AlertForm() {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  if (sent)
    return (
      <p
        role="status"
        className="flex items-center gap-3 rounded-2xl bg-primary/10 p-6 text-sm text-primary"
      >
        <Bell className="size-5 shrink-0" />
        Listo, te vamos a avisar apenas tengamos propiedades que coincidan con
        lo que buscás.
      </p>
    );

  return (
    <form
      className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8"
      action={(form) =>
        start(async () => {
          setError("");
          try {
            const result = await subscribeToAlerts(form);
            if ("error" in result) setError(result.error);
            else setSent(true);
          } catch {
            setError("No se pudo conectar. Intentá nuevamente.");
          }
        })
      }
    >
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        defaultValue=""
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block text-sm font-medium">
          Nombre
          <div className={fieldWrap}>
            <User className="size-4 shrink-0 text-muted-foreground" />
            <input
              name="name"
              type="text"
              required
              maxLength={150}
              className={fieldInput}
            />
          </div>
        </label>
        <label className="block text-sm font-medium">
          Email
          <div className={fieldWrap}>
            <Mail className="size-4 shrink-0 text-muted-foreground" />
            <input
              name="email"
              type="email"
              required
              maxLength={254}
              className={fieldInput}
            />
          </div>
        </label>
        <label className="block text-sm font-medium">
          Operación
          <div className={`${fieldWrap} relative`}>
            <Tag className="size-4 shrink-0 text-muted-foreground" />
            <select
              name="operation"
              defaultValue=""
              className={`${fieldInput} appearance-none pr-5`}
            >
              <option value="">Venta y alquiler</option>
              <option value="SALE">Venta</option>
              <option value="RENT">Alquiler</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3.5 size-3.5 text-muted-foreground" />
          </div>
        </label>
        <label className="block text-sm font-medium">
          Tipo de propiedad
          <div className={fieldWrap}>
            <Building2 className="size-4 shrink-0 text-muted-foreground" />
            <input
              name="propertyType"
              type="text"
              placeholder="Departamento, casa..."
              maxLength={80}
              className={fieldInput}
            />
          </div>
        </label>
        <label className="block text-sm font-medium">
          Zona de interés
          <div className={fieldWrap}>
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
            <input
              name="zone"
              type="text"
              maxLength={150}
              className={fieldInput}
            />
          </div>
        </label>
        <label className="block text-sm font-medium">
          Presupuesto máximo
          <div className={fieldWrap}>
            <Wallet className="size-4 shrink-0 text-muted-foreground" />
            <input
              name="maxBudget"
              type="text"
              placeholder="USD 100.000"
              maxLength={20}
              className={fieldInput}
            />
          </div>
        </label>
      </div>
      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}
      <button
        disabled={pending}
        className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:opacity-50 sm:w-auto"
      >
        <Bell className="size-4" />
        {pending ? "Enviando…" : "Quiero recibir alertas"}
      </button>
    </form>
  );
}
