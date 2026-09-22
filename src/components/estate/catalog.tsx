import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, MapPin, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getStoreSettings } from "@/lib/settings";
import { StoreHero } from "@/components/catalog/store-hero";
import { StoreFooter } from "@/components/catalog/store-footer";
import { PropertyCard } from "@/components/estate/property-card";
import { PropertySearchForm } from "@/components/estate/property-search-form";
import { estatePropertyFilterOptions } from "@/lib/estate/data";
import { getCatalogFilterSettings, getCatalogFilterLabels } from "@/lib/estate/catalog-filter-settings";
import { contrastText } from "@/lib/contrast-color";

const FEATURED_TAKE = 8;

// La home es la vidriera: hero + buscador + una selección de propiedades.
// Buscar te manda a /propiedades, que es la página de resultados real (con
// grilla completa y paginación) — así siempre hay resultados visibles sin
// scrollear de más, en vez de mezclar hero y resultados en una sola página.
export async function EstateCatalog({ tenantId }: { tenantId: string }) {
  const session = await auth();
  const [enabledFilters, filterLabels, filterOptions, settings, properties, favoriteIds] =
    await Promise.all([
    getCatalogFilterSettings(tenantId),
    getCatalogFilterLabels(tenantId),
    estatePropertyFilterOptions(tenantId, { publishedOnly: true }),
    getStoreSettings(tenantId),
    prisma.estateProperty.findMany({
      where: { tenantId, published: true, listings: { some: { status: "AVAILABLE" } } },
      include: {
        media: { orderBy: { position: "asc" }, take: 1 },
        listings: { where: { status: "AVAILABLE" } },
      },
      orderBy: [{ featured: "desc" }, { featuredOrder: "asc" }, { createdAt: "desc" }],
      take: FEATURED_TAKE,
    }),
    session?.user
      ? prisma.estatePropertyFavorite.findMany({
          where: { tenantId, userId: session.user.id },
          select: { propertyId: true },
        })
      : Promise.resolve([]),
  ]);
  const favoritedSet = new Set(favoriteIds.map((f) => f.propertyId));
  const hasContactInfo = Boolean(settings.address || settings.phone);
  return (
    <div className="flex flex-1 flex-col">
      <StoreHero />
      <section className="grid overflow-hidden border-b lg:min-h-[300px] lg:grid-cols-[minmax(0,7fr)_minmax(280px,3fr)]">
        <div className="public-enter-side flex min-w-0 flex-col justify-center gap-5 bg-muted/50 px-4 py-8 sm:px-6 lg:px-10 lg:py-10 xl:px-12">
          <div>
            <h1 className="text-[clamp(1.8rem,4vw,2.5rem)] font-bold tracking-tight">
              Buscar propiedades
            </h1>
            <p className="mt-2 text-muted-foreground">
              Encontrá la propiedad que estás buscando
            </p>
          </div>
          <PropertySearchForm
            action="/propiedades"
            enabledKeys={enabledFilters}
            labels={filterLabels}
            values={{
              q: "",
              operation: "",
              propertyType: "",
              city: "",
              neighborhood: "",
              bedrooms: "",
              bathrooms: "",
              garages: "",
              orientation: "",
              petsPolicy: "",
              creditEligible: "",
            }}
            propertyTypes={filterOptions.propertyTypes}
            cities={filterOptions.cities}
            neighborhoods={filterOptions.neighborhoods}
          />
          {hasContactInfo && (
            <div className="grid min-w-0 gap-3 text-sm text-muted-foreground sm:flex sm:flex-wrap sm:items-center sm:gap-5">
              {settings.address && (
                <span className="flex min-w-0 items-start gap-2">
                  <MapPin className="size-4 shrink-0 text-primary" />
                  <span className="min-w-0 break-words">{settings.address}</span>
                </span>
              )}
              {settings.phone && (
                <span className="flex min-w-0 items-center gap-2">
                  <Phone className="size-4 shrink-0 text-primary" />
                  {settings.phone}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="public-enter-side-right public-enter-delay-1 relative hidden overflow-hidden bg-primary/10 lg:block">
          {settings.coverUrl ? (
            <Image
              src={settings.coverUrl}
              alt=""
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Building2 className="size-20 text-primary/30" />
            </div>
          )}
        </div>
      </section>
      <main className="mx-auto w-full max-w-[1440px] flex-1 bg-background">
        <div className="flex flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Nuestra selección
                </p>
                <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">
                  Propiedades destacadas
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {properties.length
                    ? `${properties.length} propiedades disponibles`
                    : "Explorá nuestra selección actualizada"}
                </p>
              </div>
              <Link href="/propiedades" className="w-fit text-sm font-medium text-primary underline underline-offset-4">
                Ver todas las propiedades
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {properties.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  favorited={favoritedSet.has(p.id)}
                  badgeColor={settings.badgeColor}
                />
              ))}
            </div>
            {!properties.length && (
              <div className="rounded-2xl border border-dashed px-6 py-16 text-center">
                <Building2 className="mx-auto size-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  Todavía no hay propiedades publicadas
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Volvé a visitarnos pronto o consultanos por lo que estás buscando.
                </p>
              </div>
            )}
          </div>
          {settings.hasDevelopments && (
            <Link
              href="/emprendimientos"
              className="public-enter public-enter-delay-2 group flex flex-col gap-6 overflow-hidden rounded-2xl px-6 py-7 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10 lg:py-9"
              style={{
                backgroundColor: settings.buttonColor,
                color: contrastText(settings.buttonColor),
              }}
            >
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[.2em] opacity-70">
                  Nuevas oportunidades
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Conocé nuestros emprendimientos
                </h2>
                <p className="mt-2 text-sm leading-relaxed opacity-80 sm:text-base">
                  Explorá proyectos, avances de obra, ubicaciones y opciones de financiación.
                </p>
              </div>
              <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-current/30 px-5 py-3 text-sm font-semibold transition-colors group-hover:bg-white/15">
                Ver emprendimientos
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          )}
        </div>
      </main>
      <StoreFooter />
    </div>
  );
}
