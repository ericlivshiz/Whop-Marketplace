# Whop Frosted UI — Next.js

A Next.js app with [Whop's Frosted UI](https://docs.whop.com/developer/guides/frosted_ui) design system built in.

## What's included

- **@whop/react** — Frosted UI components, theme provider, and Tailwind plugin
- **FrostedProviders** — Frosted UI `Theme` wrapper with dark mode support
- **WhopThemeScript** — Prevents theme flash on load
- **Tailwind CSS v4** — Configured with `frostedThemePlugin()` for design tokens
- **withWhopAppConfig** — Next.js config wrapper for Frosted UI optimizations

## Getting started

From the repo root:

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Using Frosted UI

Import components from `@whop/react/components`:

```tsx
import { Button, Card, Heading, Text } from "@whop/react/components";

export default function Example() {
  return (
    <Card>
      <Heading size="4">Hello</Heading>
      <Text>Built with Frosted UI</Text>
      <Button color="blue">Click me</Button>
    </Card>
  );
}
```

Use Frosted UI Tailwind tokens (not standard Tailwind scales):

```tsx
<div className="bg-blue-2 text-blue-11 border border-blue-6 p-4">
  Blue themed box
</div>
```

## Building a Whop embedded app?

This project uses the Frosted UI theme directly so it works without Whop credentials. When you're ready to embed inside Whop, swap `FrostedProviders` for `WhopApp` in `src/app/layout.tsx`:

```tsx
import { WhopApp } from "@whop/react/components";

// In layout body:
<WhopApp accentColor="blue" appearance="inherit">
  {children}
</WhopApp>
```

You'll also need:

1. A Whop app in the [developer dashboard](https://whop.com/dashboard/developer/)
2. `NEXT_PUBLIC_WHOP_APP_ID` in `.env.local`
3. `@whop-apps/dev-proxy` for local iframe development

See the [Whop developer docs](https://docs.whop.com/developer/guides/frosted_ui) for the full setup.

## Resources

- [Frosted UI docs](https://docs.whop.com/developer/guides/frosted_ui)
- [Frosted UI Storybook](https://storybook.whop.dev)
- [Whop Next.js template](https://github.com/whopio/whop-nextjs-app-template)
