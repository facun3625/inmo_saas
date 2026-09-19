"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, LogOut, Menu, X, User } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { YaaLoginDialog } from "@/components/marketing/yaa-login-dialog";
import { scrollToAnchor, handleAnchorNavClick } from "@/lib/anchor-scroll";
import { useMarketingSocial } from "@/components/marketing/marketing-social-context";
import { InstagramIcon } from "@/components/catalog/social-icons";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function YaaPublicNav() {
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const close = () => setOpen(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const { instagramUrl } = useMarketingSocial();

  // Al llegar a "/" con un hash en la URL (nav cruzado desde otra página, o
  // recargar/retroceder), corrige el scroll — scrollToAnchor ya reintenta
  // mientras el layout inicial (imágenes, fuentes) se termina de asentar.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) scrollToAnchor(hash);
  }, []);

  function handleAnchorClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    close();
    handleAnchorNavClick(event, pathname, id);
  }

  // En el dominio raíz la sesión representa la cuenta central de UrbIA. Un
  // dueño puede tener además otra sesión host-only en su subdominio, pero
  // solo se crea al elegir explícitamente "Ir al panel de mi tienda".
  const accountHref = session?.user?.role === "SUPER_ADMIN" ? "/platform" : "/mi-cuenta";
  const accountLabel = session?.user?.role === "SUPER_ADMIN" ? "Ir a la plataforma" : (session?.user?.name ?? "Mi cuenta");

  return (
    <header className="sticky top-0 z-40 border-b border-[#dce8ef] bg-white/95 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" onClick={close} className="flex shrink-0 items-center" aria-label="UrbIA, inicio">
          <Image src="/brand/logo.svg" alt="UrbIA" width={1479} height={554} priority className="bg-white rounded-lg p-1.5 h-9 w-auto object-contain md:h-12" />
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold text-[#133453] lg:flex">
          <Link href="/#funcionalidades" onClick={(e) => handleAnchorClick(e, "funcionalidades")} className="border-b-2 border-transparent py-2 transition-colors hover:border-[#208ab1] hover:text-[#208ab1]">Tu página web</Link>
          <Link href="/#clientes" onClick={(e) => handleAnchorClick(e, "clientes")} className="border-b-2 border-transparent py-2 transition-colors hover:border-[#208ab1] hover:text-[#208ab1]">Tu panel</Link>
          <Link href="/#precios" onClick={(e) => handleAnchorClick(e, "precios")} className="border-b-2 border-transparent py-2 transition-colors hover:border-[#208ab1] hover:text-[#208ab1]">Precios</Link>
          <Link href="/#socios" onClick={(e) => handleAnchorClick(e, "socios")} className="border-b-2 border-transparent py-2 transition-colors hover:border-[#208ab1] hover:text-[#208ab1]">Revendedores</Link>
          <Link href="/preguntas-frecuentes" className="border-b-2 border-transparent py-2 transition-colors hover:border-[#208ab1] hover:text-[#208ab1]">FAQs</Link>
          <Link href="/#contacto" onClick={(e) => handleAnchorClick(e, "contacto")} className="border-b-2 border-transparent py-2 transition-colors hover:border-[#208ab1] hover:text-[#208ab1]">Contacto</Link>
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de UrbIA"
              className="flex size-9 items-center justify-center rounded-full text-[#133453] transition-colors hover:text-[#58c7e1]"
            >
              <InstagramIcon className="size-5" />
            </a>
          )}
          <Link href="/demo" className="yaa-btn border-[#d5e3ed]! bg-white! text-[#133453]! py-2! px-4! text-sm">Ver ejemplo</Link>
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button type="button" className="yaa-btn yaa-btn-primary py-2! px-5! text-sm" />
                }
              >
                <User className="size-4" />
                <span className="max-w-44 truncate">{accountLabel}</span>
                <ChevronDown className="size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-56 p-1.5">
                <DropdownMenuItem render={<Link href={accountHref} />} className="gap-2 py-2 text-sm">
                  <User className="size-4" />
                  {session.user.role === "SUPER_ADMIN" ? "Ir a la plataforma" : "Ir a mi panel"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  // <a> nativo a propósito, no <Link>: esta ruta hace
                  // varios redirects reales para borrar cookies de sesión
                  // en cada dominio, y necesita una navegación de página
                  // completa — con <Link>, Next la trata como transición
                  // interna y el estado de sesión en memoria (useSession)
                  // no se entera del cierre hasta que recargás a mano.
                  // eslint-disable-next-line @next/next/no-html-link-for-pages
                  render={<a href="/api/auth/logout-all" />}
                  className="gap-2 py-2 text-sm text-muted-foreground"
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              {/* El acceso central se resuelve en un modal; /registro queda
                  reservado exclusivamente para crear una tienda nueva. */}
              <button type="button" onClick={() => setLoginOpen(true)} className="yaa-btn border-[#d5e3ed]! bg-white! text-[#133453]! py-2! px-4! text-sm">Iniciar sesión</button>
              <Link href="/registro" className="yaa-btn yaa-btn-primary py-2! px-5! text-sm">Crear mi web</Link>
            </>
          )}
        </div>

        <button onClick={() => setOpen((value) => !value)} aria-label={open ? "Cerrar menú" : "Abrir menú"} className="-mr-2 shrink-0 p-2 text-[#133453] lg:hidden">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[#dce8ef] bg-white/98 backdrop-blur-lg lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            <Link href="/#funcionalidades" onClick={(e) => handleAnchorClick(e, "funcionalidades")} className="rounded-lg px-3 py-3 font-semibold text-[#133453] transition-colors hover:bg-[#edf5f9] hover:text-[#208ab1]">Tu página web</Link>
            <Link href="/#clientes" onClick={(e) => handleAnchorClick(e, "clientes")} className="rounded-lg px-3 py-3 font-semibold text-[#133453] transition-colors hover:bg-[#edf5f9] hover:text-[#208ab1]">Tu panel</Link>
            <Link href="/#precios" onClick={(e) => handleAnchorClick(e, "precios")} className="rounded-lg px-3 py-3 font-semibold text-[#133453] transition-colors hover:bg-[#edf5f9] hover:text-[#208ab1]">Precios</Link>
            <Link href="/#socios" onClick={(e) => handleAnchorClick(e, "socios")} className="rounded-lg px-3 py-3 font-semibold text-[#133453] transition-colors hover:bg-[#edf5f9] hover:text-[#208ab1]">Revendedores</Link>
            <Link href="/preguntas-frecuentes" onClick={close} className="rounded-lg px-3 py-3 font-semibold text-[#133453] transition-colors hover:bg-[#edf5f9] hover:text-[#208ab1]">Preguntas frecuentes</Link>
            <Link href="/#contacto" onClick={(e) => handleAnchorClick(e, "contacto")} className="rounded-lg px-3 py-3 font-semibold text-[#133453] transition-colors hover:bg-[#edf5f9] hover:text-[#208ab1]">Contacto</Link>
            <Link href="/demo" onClick={close} className="rounded-lg px-3 py-3 font-semibold text-[#58c7e1] transition-colors hover:bg-[#edf5f9] hover:text-[#208ab1]">Ver ejemplo</Link>
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={close}
                className="flex items-center gap-2 rounded-lg px-3 py-3 font-semibold text-[#133453] transition-colors hover:bg-[#edf5f9] hover:text-[#58c7e1]"
              >
                <InstagramIcon className="size-4" />
                Instagram
              </a>
            )}
            <div className="my-2 h-px bg-white/10" />
            {session?.user ? (
              <div className="grid gap-2">
                <Link href={accountHref} onClick={close} className="yaa-btn yaa-btn-primary w-full justify-center">
                  <User className="size-4" />
                  {accountLabel}
                </Link>
                      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a
                  href="/api/auth/logout-all"
                  className="yaa-btn border-[#d5e3ed]! bg-white! text-[#133453]! w-full justify-center"
                >
                  <LogOut className="size-4" />
                  Cerrar sesión
                </a>
              </div>
            ) : (
              <div className="grid gap-2">
                <button type="button" onClick={() => { close(); setLoginOpen(true); }} className="yaa-btn border-[#d5e3ed]! bg-white! text-[#133453]! w-full justify-center">Iniciar sesión</button>
                <Link href="/registro" onClick={close} className="yaa-btn yaa-btn-primary w-full justify-center">Crear mi web</Link>
              </div>
            )}
          </nav>
        </div>
      )}

      <div className="h-px w-full bg-[#edf5f9]" />
      <YaaLoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </header>
  );
}
