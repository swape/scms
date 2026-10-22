# AGENTS.md — Development Guide

This file defines repository-specific coding standards and workflow rules.

Use [README.md](./README.md) as the source of truth for:

- [Project structure](./README.md#project-structure) and [architecture](./README.md#architecture-notes).
- [Setup and commands](./README.md#getting-started).
- [Adding blocks](./README.md#adding-a-new-block), including editors, previews, shared controls, and registry definitions.
- [Stack conventions](./README.md#current-stack-details).

## Core Rules

- Avoid `any`.
- Define shared object shapes in `src/types/types.ts`.
- Keep localStorage helper logic in `src/localstorage.ts`.
- Guard browser-only APIs in SSR contexts.

## Svelte Guidance

- Keep existing store patterns consistent where already implemented.
- Keep components focused and move reusable logic into `.ts` helpers.
- Use one component per file and keep naming consistent with current folders.

## CSS And Tailwind

- Keep class names kebab-case.
- Do not use BEM naming.
- Do not use `!important` unless there is no safe alternative.

## Astro Guidance

- Keep page files focused on composition and routing.
- Use client directives only when interactivity is needed.

## Commit Checklist

- Run `npm run check` after significant code changes.
- Run `npm run format` before committing.
- Avoid committing test-only placeholders or hardcoded tokens.
- Update `README.md` when behavior, setup, or usage changes.

## Change Log Rule

- Record each agent update in `agent-changes.md`.
- Use date and affected file name(s).
- Write entries in past tense and keep them concise.
