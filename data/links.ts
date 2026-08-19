import { randomBytes } from "node:crypto";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { links } from "@/db/schema";

export async function getLinksByUserId(userId: string) {
  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.updatedAt));
}

export async function getLinkByShortCode(shortCode: string) {
  const [link] = await db
    .select()
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);

  return link;
}

async function isShortCodeTaken(shortCode: string) {
  const [existing] = await db
    .select({ id: links.id })
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);

  return Boolean(existing);
}

function generateShortCode() {
  return randomBytes(6).toString("base64url");
}

type CreateLinkData = {
  originalUrl: string;
  shortCode?: string;
};

export async function createLink(userId: string, data: CreateLinkData) {
  let shortCode = data.shortCode;

  if (shortCode) {
    if (await isShortCodeTaken(shortCode)) {
      throw new Error("SHORT_CODE_TAKEN");
    }
  } else {
    do {
      shortCode = generateShortCode();
    } while (await isShortCodeTaken(shortCode));
  }

  const [link] = await db
    .insert(links)
    .values({ userId, originalUrl: data.originalUrl, shortCode })
    .returning();

  return link;
}

type UpdateLinkData = {
  originalUrl: string;
  shortCode: string;
};

export async function updateLink(
  userId: string,
  linkId: number,
  data: UpdateLinkData,
) {
  const [existing] = await db
    .select({ id: links.id })
    .from(links)
    .where(eq(links.shortCode, data.shortCode))
    .limit(1);

  if (existing && existing.id !== linkId) {
    throw new Error("SHORT_CODE_TAKEN");
  }

  const [link] = await db
    .update(links)
    .set({
      originalUrl: data.originalUrl,
      shortCode: data.shortCode,
      updatedAt: new Date(),
    })
    .where(and(eq(links.id, linkId), eq(links.userId, userId)))
    .returning();

  if (!link) {
    throw new Error("NOT_FOUND");
  }

  return link;
}

export async function deleteLink(userId: string, linkId: number) {
  const [link] = await db
    .delete(links)
    .where(and(eq(links.id, linkId), eq(links.userId, userId)))
    .returning();

  if (!link) {
    throw new Error("NOT_FOUND");
  }

  return link;
}
