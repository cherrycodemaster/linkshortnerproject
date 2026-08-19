"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createLink, deleteLink, updateLink } from "@/data/links";

const createLinkSchema = z.object({
  originalUrl: z.url("Enter a valid URL"),
  shortCode: z
    .string()
    .trim()
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Only letters, numbers, - and _ are allowed",
    )
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be at most 30 characters")
    .optional(),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLinkAction(input: CreateLinkInput) {
  const { userId } = await auth.protect();
  if (!userId) {
    return { error: "Not authenticated" };
  }

  const result = createLinkSchema.safeParse(input);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const link = await createLink(userId, result.data);
    revalidatePath("/dashboard");
    return { success: true, data: link };
  } catch (error) {
    if (error instanceof Error && error.message === "SHORT_CODE_TAKEN") {
      return { error: "That short code is already taken." };
    }
    return { error: "Failed to create link" };
  }
}

const updateLinkSchema = z.object({
  id: z.number().int().positive(),
  originalUrl: z.url("Enter a valid URL"),
  shortCode: z
    .string()
    .trim()
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Only letters, numbers, - and _ are allowed",
    )
    .min(3, "Must be at least 3 characters")
    .max(30, "Must be at most 30 characters"),
});

type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

export async function updateLinkAction(input: UpdateLinkInput) {
  const { userId } = await auth.protect();
  if (!userId) {
    return { error: "Not authenticated" };
  }

  const result = updateLinkSchema.safeParse(input);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const { id, ...data } = result.data;
    const link = await updateLink(userId, id, data);
    revalidatePath("/dashboard");
    return { success: true, data: link };
  } catch (error) {
    if (error instanceof Error && error.message === "SHORT_CODE_TAKEN") {
      return { error: "That short code is already taken." };
    }
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return { error: "Link not found." };
    }
    return { error: "Failed to update link" };
  }
}

const deleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

export async function deleteLinkAction(input: DeleteLinkInput) {
  const { userId } = await auth.protect();
  if (!userId) {
    return { error: "Not authenticated" };
  }

  const result = deleteLinkSchema.safeParse(input);
  if (!result.success) {
    return { error: "Invalid input" };
  }

  try {
    await deleteLink(userId, result.data.id);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return { error: "Link not found." };
    }
    return { error: "Failed to delete link" };
  }
}
