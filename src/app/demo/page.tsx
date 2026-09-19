import type { Metadata } from "next";
import Link from "next/link";
import { DemoProperties } from "@/components/demo/demo-site";
export const metadata: Metadata = { title: "UrbIA · Inmobiliaria de ejemplo", description: "Recorré una página inmobiliaria de ejemplo creada con UrbIA.", robots: { index: false, follow: false } };
export default function DemoPage() {
  return <>
    <section className="bg-[#edf6fa] px-6 py-14 sm:py-20"><div className="mx-auto max-w-7xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#1e658c]">Venta · Alquiler · Servicios inmobiliarios</p><h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">Encontrá el lugar para tu próxima etapa.</h1><p className="mt-5 max-w-xl text-base leading-7 text-slate-500">Explorá nuestras propiedades y contanos qué estás buscando. Te acompañamos en cada paso.</p></div></section>
    <section className="mx-auto max-w-7xl px-6 py-10"><DemoProperties/></section>
    <section className="mx-auto max-w-7xl px-6 py-14"><div className="rounded-2xl bg-[#f1f6f9] p-8 sm:p-12"><p className="text-xs font-semibold uppercase tracking-widest text-[#1e658c]">Una búsqueda a tu medida</p><h2 className="mt-3 text-3xl font-semibold">Tu próxima propiedad puede estar por llegar.</h2><p className="mt-4 max-w-xl leading-7 text-slate-500">Definí qué tipo de inmueble te interesa, la zona y la operación para conocer cómo funcionaría una alerta personalizada.</p><Link href="/demo/alertas" className="mt-6 inline-block rounded-lg bg-[#1e658c] px-6 py-3 text-sm font-semibold text-white">Configurar mi alerta</Link></div></section>
  </>;
}
