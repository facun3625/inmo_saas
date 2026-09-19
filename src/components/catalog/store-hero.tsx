"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2 } from "lucide-react";

import { AccountMenu } from "@/components/account-menu";
import { useStoreSettings } from "@/lib/store-settings-context";
import { contrastText } from "@/lib/contrast-color";
import { StoreNav } from "./store-nav";
import { MobileHamburgerMenu } from "./mobile-hamburger-menu";
import { FavoritesNavButton } from "./favorites-nav-button";
import { StoreTopBar } from "./store-top-bar";

export function StoreHero() {
  const { storeName, logoUrl, headerBgColor, menuBgColor, showNameInHeader, logoHeight } =
    useStoreSettings();

  return (
    <>
      <div className="hidden lg:block">
        <StoreTopBar />
      </div>
      <div
        className="hidden px-5 lg:block lg:px-8"
        style={{ backgroundColor: headerBgColor, color: contrastText(headerBgColor) }}
      >
        <div className="mx-auto flex min-h-24 w-full max-w-[1440px] items-center justify-center py-3.5">
          <Link
            href="/"
            className="flex min-w-0 items-center justify-center gap-4"
          >
            {logoUrl ? (
              <span
                className="flex w-auto shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-2"
                style={{ height: logoHeight, maxWidth: logoHeight * 3.5 }}
              >
                <Image
                  src={logoUrl}
                  alt={storeName}
                  width={Math.round(logoHeight * 3.5)}
                  height={logoHeight}
                  className="size-full object-contain"
                />
              </span>
            ) : (
              <span
                className="flex shrink-0 items-center justify-center rounded-2xl bg-white text-primary"
                style={{ height: logoHeight, width: logoHeight }}
              >
                <Building2 className="size-8" />
              </span>
            )}
            {showNameInHeader && (
              <span className="truncate text-2xl font-bold tracking-tight text-current">
                {storeName}
              </span>
            )}
          </Link>
        </div>
      </div>
      <div
        className="sticky top-0 z-50 hidden border-y border-current/10 px-5 shadow-sm backdrop-blur-xl lg:block lg:px-8"
        style={{ backgroundColor: menuBgColor, color: contrastText(menuBgColor) }}
      >
        <div className="mx-auto grid min-h-14 w-full max-w-[1440px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center">
          <div aria-hidden="true" />
          <StoreNav />
          <div className="flex items-center justify-end gap-5">
            <FavoritesNavButton />
            <AccountMenu overlay />
          </div>
        </div>
      </div>
      <div
        className="sticky top-0 z-50 flex min-h-16 w-full min-w-0 items-center overflow-hidden border-b border-current/10 px-4 shadow-sm backdrop-blur-xl lg:hidden"
        style={{ backgroundColor: headerBgColor, color: contrastText(headerBgColor) }}
      >
        <div className="mx-auto flex w-full min-w-0 max-w-[1440px] items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 flex-1 items-center gap-2.5">
            {logoUrl ? (
              <span className="flex h-10 max-w-[min(38vw,170px)] items-center overflow-hidden rounded-xl bg-white px-2 py-1.5">
                <Image
                  src={logoUrl}
                  alt={storeName}
                  width={190}
                  height={44}
                  className="h-full w-auto max-w-full object-contain"
                />
              </span>
            ) : (
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary">
                <Building2 className="size-6" />
              </span>
            )}
            {showNameInHeader && !logoUrl && (
              <span className="truncate text-base font-semibold">{storeName}</span>
            )}
          </Link>
          <div className="flex shrink-0 items-center gap-1">
            <FavoritesNavButton iconOnly />
            <AccountMenu overlay iconOnly />
            <MobileHamburgerMenu />
          </div>
        </div>
      </div>
    </>
  );
}
