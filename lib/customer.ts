import type { Prisma } from "@prisma/client";

type Tx = Prisma.TransactionClient;

export type CustomerInput = {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  company?: string | null;
  address?: string | null;
};

/**
 * Finds a Customer by phone number, creating one if it doesn't exist yet.
 * Updates missing contact fields on the existing record when new info is provided.
 * Returns null when no phone number is available (nothing to link).
 */
export async function findOrCreateCustomer(
  tx: Tx,
  input: CustomerInput,
  source: string
): Promise<string | null> {
  const phone = String(input.phone || "").trim();
  if (!phone) return null;

  const name = String(input.name || "").trim() || "Khách hàng";
  const email = String(input.email || "").trim() || null;
  const company = String(input.company || "").trim() || null;
  const address = String(input.address || "").trim() || null;

  const existing = await tx.customer.findUnique({ where: { phone } });

  if (existing) {
    const updated = await tx.customer.update({
      where: { id: existing.id },
      data: {
        name: name || existing.name,
        email: email ?? existing.email,
        company: company ?? existing.company,
        address: address ?? existing.address
      }
    });
    return updated.id;
  }

  const created = await tx.customer.create({
    data: { name, phone, email, company, address, source }
  });

  return created.id;
}
