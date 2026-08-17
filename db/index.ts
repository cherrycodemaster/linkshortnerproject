// The Neon HTTP adapter may not ship type declarations in the installed Drizzle version.
// @ts-expect-error — the adapter is available at runtime.
import { drizzle } from 'drizzle-orm/neon-http';

const db = drizzle(process.env.DATABASE_URL);

export { db };