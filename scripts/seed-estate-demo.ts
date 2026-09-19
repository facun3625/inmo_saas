import "dotenv/config";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;
if (
  !["localhost", "127.0.0.1", "[::1]"].includes(
    new URL(connectionString).hostname,
  )
)
  throw new Error("La demo solo se crea en una base local.");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
async function main() {
  const subdomain = "demo-inmo";
  if (await db.tenant.findUnique({ where: { subdomain } })) {
    console.log("La demo inmobiliaria ya existe; no se modificaron sus datos.");
    return;
  }
  const password = randomBytes(15).toString("base64url");
  const hash = await bcrypt.hash(password, 12);
  await db.$transaction(
    async (tx) => {
      const plan = await tx.plan.findFirst({
        where: { active: true },
        orderBy: { order: "desc" },
      });
      const tenant = await tx.tenant.create({
        data: {
          subdomain,
          category: "DEMO",
          billingStatus: "ACTIVE",
          planId: plan?.id,
        },
      });
      await tx.user.create({
        data: {
          tenantId: tenant.id,
          email: "admin@demo-inmo.example",
          name: "Equipo Demo",
          role: "ADMIN",
          passwordHash: hash,
        },
      });
      await tx.settings.createMany({
        data: [
          {
            tenantId: tenant.id,
            key: "store_name",
            value: "Horizonte · Inmobiliaria demo",
          },
          { tenantId: tenant.id, key: "store_city", value: "Córdoba" },
          { tenantId: tenant.id, key: "store_province", value: "Córdoba" },
          {
            tenantId: tenant.id,
            key: "seo_title",
            value: "Horizonte · Propiedades en Córdoba",
          },
        ],
      });
      const owner = await tx.estateContact.create({
        data: {
          tenantId: tenant.id,
          name: "María López (demo)",
          email: "maria@example.test",
          roles: ["OWNER"],
        },
      });
      const prospect = await tx.estateContact.create({
        data: {
          tenantId: tenant.id,
          name: "Tomás Ríos (demo)",
          email: "tomas@example.test",
          roles: ["PROSPECT", "TENANT"],
          notes: "Busca dos dormitorios y espacio para trabajar.",
        },
      });
      const development = await tx.estateDevelopment.create({
        data: {
          tenantId: tenant.id,
          name: "Patios del Parque",
          address: "Dirección ficticia 200",
          city: "Córdoba",
          stage: "CONSTRUCTION",
          description:
            "Proyecto de demostración con espacios verdes y unidades amplias.",
        },
      });
      const specs = [
        {
          code: "HZ-001",
          title: "Casa con jardín en zona norte",
          propertyType: "Casa",
          city: "Córdoba",
          neighborhood: "Cerro de las Rosas",
          bedrooms: 3,
          bathrooms: 2,
          garages: 2,
          coveredArea: "160",
          totalArea: "350",
          sale: "185000",
          rent: null,
        },
        {
          code: "HZ-002",
          title: "Departamento luminoso con balcón",
          propertyType: "Departamento",
          city: "Córdoba",
          neighborhood: "Nueva Córdoba",
          bedrooms: 2,
          bathrooms: 1,
          garages: 1,
          coveredArea: "75",
          totalArea: "88",
          sale: "98000",
          rent: "780000",
        },
        {
          code: "HZ-003",
          title: "Tu próximo hogar junto al parque",
          propertyType: "Departamento",
          city: "Córdoba",
          neighborhood: "General Paz",
          bedrooms: 1,
          bathrooms: 1,
          garages: 0,
          coveredArea: "48",
          totalArea: "56",
          sale: "69000",
          rent: null,
        },
      ];
      const ids: string[] = [];
      for (const [i, spec] of specs.entries()) {
        const { sale, rent, ...data } = spec;
        const p = await tx.estateProperty.create({
          data: {
            ...data,
            tenantId: tenant.id,
            address: `Dirección privada ficticia ${100 + i}`,
            ownerId: owner.id,
            developmentId: i === 2 ? development.id : null,
            published: true,
            featured: i === 0,
            description:
              "Propiedad ficticia de demostración. Ambientes cómodos, buena iluminación y excelente distribución. Los datos y precios son ilustrativos.",
            listings: {
              create: [
                { operation: "SALE", price: sale, currency: "USD" },
                ...(rent
                  ? [{ operation: "RENT", price: rent, currency: "ARS" }]
                  : []),
              ],
            },
          },
        });
        ids.push(p.id);
      }
      await tx.estateInquiry.create({
        data: {
          tenantId: tenant.id,
          propertyId: ids[1],
          contactId: prospect.id,
          message: "Me interesa coordinar una visita al departamento.",
          source: "WEB",
        },
      });
      const startsAt = new Date();
      startsAt.setDate(startsAt.getDate() + 1);
      startsAt.setHours(18, 0, 0, 0);
      await tx.estateVisit.create({
        data: {
          tenantId: tenant.id,
          propertyId: ids[1],
          contactId: prospect.id,
          agentName: "Equipo Horizonte",
          startsAt,
          endsAt: new Date(startsAt.getTime() + 3600000),
          status: "CONFIRMED",
        },
      });
      const contract = await tx.estateContract.create({
        data: {
          tenantId: tenant.id,
          propertyId: ids[0],
          contactId: prospect.id,
          reference: "DEMO-2026-001",
          startsAt: new Date("2026-01-01T15:00:00Z"),
          endsAt: new Date("2027-12-31T15:00:00Z"),
          amount: "650000",
          currency: "ARS",
          status: "ACTIVE",
          adjustmentNotes:
            "Condiciones ilustrativas; revisar según el contrato.",
        },
      });
      await tx.estateCharge.create({
        data: {
          tenantId: tenant.id,
          contractId: contract.id,
          concept: "Alquiler",
          period: "2026-09",
          dueAt: new Date("2026-09-10T15:00:00Z"),
          amount: "650000",
          currency: "ARS",
        },
      });
      const building = await tx.estateBuilding.create({
        data: {
          tenantId: tenant.id,
          name: "Edificio Horizonte (demo)",
          address: "Dirección ficticia 300",
        },
      });
      await tx.estateUnit.createMany({
        data: [
          {
            tenantId: tenant.id,
            buildingId: building.id,
            label: "1 A",
            responsibleName: owner.name,
            coefficient: "50",
          },
          {
            tenantId: tenant.id,
            buildingId: building.id,
            label: "1 B",
            responsibleName: prospect.name,
            coefficient: "50",
          },
        ],
      });
      await tx.estateMaintenance.create({
        data: {
          tenantId: tenant.id,
          propertyId: ids[0],
          title: "Revisión de una pérdida de agua",
          description:
            "Reclamo ficticio para mostrar el seguimiento de mantenimiento.",
          priority: "HIGH",
        },
      });
      await tx.estateValuation.create({
        data: {
          tenantId: tenant.id,
          contactId: owner.id,
          address: "Dirección ficticia 450",
          propertyType: "Casa",
          notes: "Solicita valoración para venta.",
        },
      });
    },
    { timeout: 15000 },
  );
  console.log(
    "Demo: http://demo-inmo.localhost:3010\nPanel: http://demo-inmo.localhost:3010/admin\nEmail: admin@demo-inmo.example\nContraseña local generada: " +
      password,
  );
}
main().finally(() => db.$disconnect());
