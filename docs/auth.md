# Authentication

All authentication in this app is handled by **Clerk**
(`@clerk/nextjs` / `@clerk/ui`). Do not introduce any other auth method
(no NextAuth, custom JWT/session handling, third-party OAuth wired by hand,
etc.).

## Middleware / route protection

- `proxy.ts` (this project's Next.js 16 middleware file) wraps the app in
  `clerkMiddleware()`. Do not remove or bypass this.
- `createRouteMatcher()` is deprecated by Clerk (Middleware-path-based
  gating can be bypassed by framework-level Middleware bypasses and
  path-normalization mismatches) — do not add it to `proxy.ts`.
- Protect authenticated resources (pages, layouts, route handlers, server
  actions) individually by calling `await auth.protect()` at the top of
  each one, e.g.:

  ```tsx
  import { auth } from "@clerk/nextjs/server";

  export default async function DashboardPage() {
    await auth.protect();

    return <h1>Dashboard</h1>;
  }
  ```

- An unauthenticated user hitting a protected page is redirected to sign
  in automatically by `auth.protect()`; never render protected content
  without this check.


## Home page redirect

- `app/page.tsx` must check the current session server-side (`auth()`
  from `@clerk/nextjs/server`) and redirect signed-in users to
  `/dashboard` via `redirect()` from `next/navigation`. Signed-out users
  see the normal marketing/home content.
- This also covers the post-sign-in flow: `ClerkProvider` refreshes the
  page after a modal sign-in completes, so a user who signs in from `/`
  lands on the refreshed home page and is immediately redirected to
  `/dashboard` by this same check. Don't add a separate
  `forceRedirectUrl` / `fallbackRedirectUrl` to `<SignInButton>` /
  `<SignUpButton>` for this — it would duplicate the redirect logic
  instead of relying on the single check in `app/page.tsx`.

## Sign in / sign up must always be modal

- Never link users to standalone `/sign-in` or `/sign-up` pages for the
  primary sign-in/sign-up flow.
- Trigger auth exclusively through Clerk's modal components:

  ```tsx
  <SignInButton mode="modal" />
  <SignUpButton mode="modal" />
  ```

- The catch-all `app/sign-in/[[...sign-in]]/page.tsx` and
  `app/sign-up/[[...sign-up]]/page.tsx` routes exist only because Clerk
  requires them (e.g. for redirects/callbacks); do not build UI that
  navigates to them directly or renders full-page `<SignIn />` /
  `<SignUp />` as the primary entry point.
- Use Clerk's `<Show when="signed-in">` / `<Show when="signed-out">` (or
  `<SignedIn>` / `<SignedOut>`) to conditionally render `UserButton` vs.
  the modal sign-in/sign-up triggers.
