"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPinIcon, PhoneIcon, MailIcon } from "lucide-react";

import { useStoreSettings } from "@/lib/store-settings-context";
import { contrastText } from "@/lib/contrast-color";
import { toWhatsAppLink, toInstagramLink } from "@/lib/social-links";
import { WhatsAppIcon, InstagramIcon } from "./social-icons";
import { RichText } from "./rich-text";

export function StoreFooter() {
  const {
    storeName,
    logoUrl,
    address,
    phone,
    email,
    whatsapp,
    instagram,
    footerBgColor,
    footerLogoHeight,
    footerTagline,
    footerPitchTitle,
    footerPitchText,
  } = useStoreSettings();
  const hasSocial = Boolean(whatsapp || instagram);
  const hasContactInfo = Boolean(address || phone || email);
  const footerFg = contrastText(footerBgColor);
  const footerStyle = { backgroundColor: footerBgColor, color: footerFg };

  return (
    <>
      <section
        id="hablemos-hoy"
        className="scroll-mt-20 border-t border-border py-10 sm:py-12"
        style={footerStyle}
      >
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.2em] text-current/50">
              ¿Querés vender o alquilar?
            </p>
            <h2 className="mt-2 text-[clamp(1.75rem,5vw,2.5rem)] font-bold">
              Hablemos hoy.
            </h2>
          </div>
          <div className="grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
            {phone && (
              <a
                href={`tel:${phone}`}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary/90"
              >
                <PhoneIcon className="size-4" />
                {phone}
              </a>
            )}
            {whatsapp && (
              <a
                href={toWhatsAppLink(whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-semibold text-white transition duration-200 hover:brightness-105"
              >
                <WhatsAppIcon className="size-4" />
                WhatsApp
              </a>
            )}
            {!phone && !whatsapp && (
              <Link
                href="/contacto"
                className="rounded-xl px-6 py-3.5 font-semibold transition hover:opacity-90"
                style={{ backgroundColor: footerFg, color: footerBgColor }}
              >
                Contactanos
              </Link>
            )}
          </div>
        </div>
      </section>

      <footer className="py-10 sm:py-12" style={footerStyle}>
        <div className="mx-auto grid w-full max-w-[1440px] gap-9 border-t border-current/10 px-4 pt-10 text-sm sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
          <div>
            {logoUrl ? (
              <span
                className="flex w-auto items-center justify-center overflow-hidden rounded-xl bg-white p-1.5"
                style={{ height: footerLogoHeight, maxWidth: footerLogoHeight * 3.5 }}
              >
                <Image
                  src={logoUrl}
                  alt={storeName}
                  width={Math.round(footerLogoHeight * 3.5)}
                  height={footerLogoHeight}
                  className="size-full object-contain"
                />
              </span>
            ) : (
              <span className="text-lg font-semibold text-current">
                {storeName}
              </span>
            )}
            <RichText html={footerTagline} className="mt-4 max-w-xs text-current/60" />
            {hasSocial && (
              <div className="mt-4 flex items-center gap-2">
                {whatsapp && (
                  <a
                    href={toWhatsAppLink(whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-9 items-center justify-center rounded-full border border-current/15 text-current/70 transition-colors hover:border-current/30 hover:text-current"
                  >
                    <WhatsAppIcon className="size-4" />
                  </a>
                )}
                {instagram && (
                  <a
                    href={toInstagramLink(instagram)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-9 items-center justify-center rounded-full border border-current/15 text-current/70 transition-colors hover:border-current/30 hover:text-current"
                  >
                    <InstagramIcon className="size-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-current/50">
              {footerPitchTitle}
            </h3>
            <RichText html={footerPitchText} className="mt-4 text-current/70" />
          </div>

          {hasContactInfo && (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-current/50">
                Contacto
              </h3>
              <div className="mt-4 flex flex-col gap-4">
                {phone && (
                  <div className="flex items-center gap-3 text-current/80">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-current/10 text-current">
                      <PhoneIcon className="size-4" />
                    </span>
                    {phone}
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-3 text-current/80">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-current/10 text-current">
                      <MailIcon className="size-4" />
                    </span>
                    <span className="min-w-0 break-all">{email}</span>
                  </div>
                )}
                {address && (
                  <div className="flex items-center gap-3 text-current/80">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-current/10 text-current">
                      <MapPinIcon className="size-4" />
                    </span>
                    <span className="min-w-0 break-words">{address}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mx-auto mt-10 flex w-full max-w-[1440px] flex-wrap items-center justify-center gap-2 border-t border-current/10 px-4 pt-6 text-center text-sm text-current/60 lg:px-8">
          <span className="hidden lg:inline">
            Gestioná tu inmobiliaria y publicá tus propiedades con
          </span>
          <span className="lg:hidden">Tu inmobiliaria con</span>
          <a
            href="https://yaa.com.ar"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:opacity-80"
            aria-label="Conocé yaa.com.ar"
          >
            <Image
              src="/brand/logo.svg"
              alt="UrbIA"
              width={84}
              height={48}
              className="h-5 w-auto"
            />
          </a>
        </div>
      </footer>
    </>
  );
}
