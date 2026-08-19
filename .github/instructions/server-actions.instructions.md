---
description: Read this before creating or modifying server actions or data mutations in this project.
---

# Server Actions

All data mutations in this app MUST be done via server actions. Server
actions are called from client components — never mutate data from a
server component or route handler directly.

## File location and naming

- Server action files MUST be named `actions.ts`.
- Colocate each `actions.ts` file in the same directory as the client
  component that calls it.

## Input types

- ALL data passed into a server action must have explicit TypeScript
  types. NEVER type an argument as `FormData`.

## Validation

- ALL data received by a server action MUST be validated with a Zod
  schema before use. Reject/throw on invalid input before doing anything
  else.

## Auth check

- Every server action MUST first verify there is a logged-in user (e.g.
  via `auth.protect()` / `auth()` from `@clerk/nextjs/server`) before any
  database operation. See [auth.instructions..md](./auth.instructions..md)
  for the auth conventions used in this project.

## Database access

- Server actions must NEVER call Drizzle queries directly.
- ALL database operations must go through helper functions in the `/data`
  directory that wrap the Drizzle queries, matching the pattern used for
  data fetching (see [data-fetching.instructions.md](./data-fetching.instructions.md)).

## Error handling

- Server actions must NEVER throw. Catch all errors (validation, auth,
  database) and return a plain result object with either a `success` or
  an `error` property instead, e.g. `{ success: true, data }` or
  `{ error: "message" }`, so the calling client component can handle it
  without a try/catch.

## Example

```ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createLink } from "@/data/links";

const createLinkSchema = z.object({
  url: z.string().url(),
  slug: z.string().min(1),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLinkAction(input: CreateLinkInput) {
  const { userId } = await auth.protect();
  if (!userId) {
    return { error: "Not authenticated" };
  }

  const result = createLinkSchema.safeParse(input);
  if (!result.success) {
    return { error: "Invalid input" };
  }

  try {
    const link = await createLink(userId, result.data);
    return { success: true, data: link };
  } catch {
    return { error: "Failed to create link" };
  }
}
```
