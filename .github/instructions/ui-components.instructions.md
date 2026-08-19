---
description: Read this before creating or modifying UI components in this project.
---

# UI Components

All UI in this app is built with **shadcn/ui**. Do not hand-roll custom
components for things shadcn already provides (buttons, inputs, dialogs,
forms, dropdowns, cards, etc.).

## Rules

- Never write a custom component from scratch when an equivalent shadcn
  component exists. Always add/use the shadcn component instead.
- Add new components via the shadcn CLI so they land in `components/ui`
  and follow the project's configured style:

  ```bash
  npx shadcn@latest add <component>
  ```

- Import shadcn components using the `@/components/ui` alias, e.g.
  `import { Button } from "@/components/ui/button"`.
- Do not edit generated files in `components/ui` to change their public
  API/behavior beyond what shadcn's own theming (Tailwind classes, CSS
  variables) supports. Prefer composing shadcn primitives over modifying
  them.
- Configuration lives in `components.json` (style: `base-nova`, base
  color: `neutral`, icon library: `lucide`, RSC enabled). Do not change
  these without an explicit reason, and keep new components consistent
  with them.
- Use `lucide-react` for icons, matching the configured `iconLibrary`.
- Compose layouts/pages from shadcn primitives plus Tailwind utility
  classes; avoid introducing other component/styling libraries.
