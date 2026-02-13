# Internal Feature Request Board

A minimal internal tool for creating, tracking, and commenting on feature requests.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Getting Started](#getting-started)
3. [Architecture](#architecture)
4. [API Reference](#api-reference)
5. [Testing](#testing)
6. [Assumptions](#assumptions)
7. [Intentional Decisions](#intentional-decisions)
8. [Items Not Implemented](#items-not-implemented)
9. [Swapping to Prisma](#swapping-to-prisma)
10. [Project Structure](#project-structure)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 3 |
| Validation | Zod 3 |
| Testing | Vitest |
| Persistence | In-memory (repository pattern, swappable to Prisma) |

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9 or later

### Installation

```bash
npm install
```

### Environment

`.env.local` is included in the repository (no secrets — only a base URL):

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

For production (e.g. Vercel), set `NEXT_PUBLIC_BASE_URL` to your deployed origin.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/feature-requests`.

### Build

```bash
npm run build
npm run start
```

### Lint & Type-check

```bash
npm run lint        # ESLint
npm run type-check  # tsc --noEmit
npm run test        # Vitest unit tests
```

---

## Architecture

The project follows a **DDD-lite** structure. All business logic lives under `src/modules/`, completely decoupled from Next.js.

```
src/
├── lib/
│   └── api-response.ts          # Shared JSON error response helper
├── modules/
│   └── feature-requests/
│       ├── domain/              # Entities, enums, repository interface (port)
│       ├── application/         # Use-cases, DTOs, Zod schemas, error classes
│       ├── infrastructure/      # In-memory repository (adapter)
│       └── ui/                  # React components
└── app/
    ├── api/feature-requests/    # Next.js Route Handlers
    └── feature-requests/        # Next.js pages
```

### Layers

#### Domain (`domain/`)

Pure TypeScript — no framework dependencies.

- `enums.ts` — `Status` and `Priority` as `as const` objects; union types derived from them.
- `entities.ts` — `FeatureRequest` and `Comment` interfaces. Dates stored as ISO 8601 strings.
- `repository.ts` — `FeatureRequestRepository` interface (the **port**). Use-cases depend only on this interface, never on a concrete implementation.

#### Application (`application/`)

Contains all business rules.

- `schemas.ts` — Zod schemas. **Single source of truth** for all validation. DTOs are `z.infer<>` derivations — no duplication.
- `errors.ts` — Typed error classes (`NotFoundError`, `ValidationError`) with machine-readable `code` strings.
- `use-cases/` — One class per use-case, injected with the repository via constructor (no DI container).

#### Infrastructure (`infrastructure/`)

- `in-memory-repository.ts` — Implements `FeatureRequestRepository` with two private `Map` fields. Exported as a singleton with a `globalThis` guard to survive Next.js HMR restarts in development.

#### UI (`ui/`)

- **Server Components**: `FeatureRequestList`, `FeatureRequestCard`, `FeatureRequestDetail`, `StatusBadge`, `PriorityBadge`, `CommentList`
- **Client Components** (`'use client'`): `CreateFeatureRequestForm`, `UpdateStatusForm`, `AddCommentForm`

Client Components call the REST API via `fetch`, then call `router.refresh()` to re-render the Server Component tree without a full navigation.

---

## API Reference

All error responses share this format:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Feature request with id \"...\" not found",
    "details": {}
  }
}
```

### Endpoints

#### `GET /api/feature-requests`

Returns all feature requests sorted by newest first.

**Response `200`**
```json
[
  {
    "id": "uuid",
    "title": "string",
    "description": "string",
    "status": "OPEN | PLANNED | IN_PROGRESS | DONE",
    "priority": "LOW | MEDIUM | HIGH | CRITICAL",
    "createdAt": "ISO 8601",
    "updatedAt": "ISO 8601"
  }
]
```

---

#### `POST /api/feature-requests`

Creates a new feature request. Status is always initialised to `OPEN`.

**Request body**
```json
{
  "title": "string (3–120 chars)",
  "description": "string (10–2000 chars)",
  "priority": "LOW | MEDIUM | HIGH | CRITICAL"
}
```

**Response `201`** — created `FeatureRequest` object.
**Response `422`** — validation error with field-level details.

---

#### `GET /api/feature-requests/:id`

Returns a single feature request with its comments.

**Response `200`**
```json
{
  "featureRequest": { "...": "FeatureRequest" },
  "comments": [
    {
      "id": "uuid",
      "featureRequestId": "uuid",
      "body": "string",
      "createdAt": "ISO 8601"
    }
  ]
}
```

**Response `404`** — not found.
**Response `422`** — invalid UUID format.

---

#### `PATCH /api/feature-requests/:id`

Updates status and/or priority. At least one field must be provided.

**Request body**
```json
{
  "status": "OPEN | PLANNED | IN_PROGRESS | DONE",
  "priority": "LOW | MEDIUM | HIGH | CRITICAL"
}
```

**Response `200`** — updated `FeatureRequest` object.

---

#### `POST /api/feature-requests/:id/comments`

Adds a comment to a feature request.

**Request body**
```json
{
  "body": "string (1–1000 chars)"
}
```

**Response `201`** — created `Comment` object.

---

## Testing

### Run

```bash
npm run test
```

### What is tested

`src/modules/feature-requests/application/__tests__/create-feature-request.test.ts`

Unit tests for `CreateFeatureRequestUseCase` using an isolated stub repository (not the singleton):

- Creates a feature request with `OPEN` status and a valid UUID v4.
- Persists the entity in the repository.

### What is not tested

Integration and E2E tests are outside the scope of this project. The architecture makes them straightforward to add:

- **API routes** — `next-test-api-route-handler` or `supertest`.
- **UI** — Playwright or Cypress against `npm run dev`.

---

## Assumptions

- **Single user, no authentication** — the brief did not mention auth. The board is treated as a shared internal tool where anyone can create, update, and comment on requests.
- **No pagination** — the dataset is assumed to be small enough for a full list on one page.
- **No search or filtering** — not mentioned in the requirements; out of scope.
- **Status always starts as `OPEN`** — a newly created request has not been reviewed yet, so `OPEN` is the only sensible default.
- **Comments are append-only** — editing or deleting comments is not part of the spec.
- **In-memory storage is acceptable for the take-home** — the brief explicitly offered it as an option. The repository pattern ensures the switch to a real database is a one-file change.

---

## Intentional Decisions

### `as const` objects instead of TypeScript `enum`

TypeScript enums have a number of well-known pitfalls (reverse mapping, module augmentation issues, incompatibility with `isolatedModules`). Using `as const` objects with a derived union type gives the same runtime guarantees, works cleanly with `z.enum(Object.values(...))`, and produces simpler compiled output.

### Zod schemas as single source of truth

All validation lives in `application/schemas.ts`. DTOs are `z.infer<>` derivations — no manual type duplication. This means a change to a validation rule automatically narrows the type used by use-cases and API handlers.

### Dates as ISO 8601 strings

Entities store dates as strings rather than `Date` objects. This eliminates serialisation friction when values cross the API boundary via `JSON.stringify` — no conversion step is needed anywhere in the codebase.

### Constructor injection without a DI container

Each API route constructs the use-case directly, passing the repository singleton as a constructor argument. For a project of this scale, a DI container would add complexity without benefit. The pattern is easy to understand and test.

### `globalThis` singleton pattern

The in-memory repository is attached to `globalThis` in development to survive Next.js Hot Module Replacement restarts. In production the guard is skipped. This is the same approach recommended by Prisma for Next.js.

### Server Components + `router.refresh()`

Pages are Server Components that fetch data directly. Client Components handle mutations via `fetch` + `router.refresh()`. This keeps data-fetching logic out of client bundles and avoids global state management.

---

## Items Not Implemented

### Persistent storage

Data is held in memory and does not survive a server restart or a Vercel cold start. For a production deployment, a database is required. The repository interface (`FeatureRequestRepository`) makes this a drop-in swap — see [Swapping to Prisma](#swapping-to-prisma).

### Authentication and authorisation

No login, sessions, or role-based access control. Out of scope for the brief.

### Search and filtering

No full-text search or filter by status/priority. Can be added as a query-param on `GET /api/feature-requests` without touching the domain layer.

### Pagination

The list endpoint returns all records. Acceptable for a small internal team; a `cursor` or `page`/`limit` param can be added at the use-case level.

### Editing and deleting

Feature requests and comments cannot be edited or deleted. Not mentioned in the brief.

### Integration and E2E tests

Only one use-case is unit-tested. API route integration tests and browser E2E tests were not implemented within the scope of this take-home.

### Real-time updates

The board does not push updates to other open browser tabs. A polling interval or WebSocket connection could be added on top of the existing API without architectural changes.

---

## Swapping to Prisma

No application or domain code needs to change. Steps:

1. `npm install prisma @prisma/client`
2. Define models in `prisma/schema.prisma`:

```prisma
model FeatureRequest {
  id          String    @id @default(uuid())
  title       String
  description String
  status      String
  priority    String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  comments    Comment[]
}

model Comment {
  id               String         @id @default(uuid())
  featureRequestId String
  body             String
  createdAt        DateTime       @default(now())
  featureRequest   FeatureRequest @relation(fields: [featureRequestId], references: [id])
}
```

3. Create `src/modules/feature-requests/infrastructure/prisma-repository.ts` implementing `FeatureRequestRepository`.
4. Replace the import of `featureRequestRepository` in each API route file to point to the new Prisma singleton.

---

## Project Structure

```
.
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── pull_request_template.md
├── src/
│   ├── lib/
│   │   └── api-response.ts
│   ├── modules/feature-requests/
│   │   ├── domain/
│   │   │   ├── enums.ts
│   │   │   ├── entities.ts
│   │   │   └── repository.ts
│   │   ├── application/
│   │   │   ├── errors.ts
│   │   │   ├── schemas.ts
│   │   │   ├── dtos.ts
│   │   │   ├── use-cases/
│   │   │   │   ├── create-feature-request.ts
│   │   │   │   ├── list-feature-requests.ts
│   │   │   │   ├── get-feature-request.ts
│   │   │   │   ├── update-feature-request.ts
│   │   │   │   └── add-comment.ts
│   │   │   └── __tests__/
│   │   │       └── create-feature-request.test.ts
│   │   ├── infrastructure/
│   │   │   └── in-memory-repository.ts
│   │   └── ui/
│   │       ├── StatusBadge.tsx
│   │       ├── PriorityBadge.tsx
│   │       ├── FeatureRequestCard.tsx
│   │       ├── FeatureRequestList.tsx
│   │       ├── FeatureRequestDetail.tsx
│   │       ├── CreateFeatureRequestForm.tsx
│   │       ├── UpdateStatusForm.tsx
│   │       ├── CommentList.tsx
│   │       └── AddCommentForm.tsx
│   └── app/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── globals.css
│       ├── api/feature-requests/
│       │   ├── route.ts
│       │   └── [id]/
│       │       ├── route.ts
│       │       └── comments/route.ts
│       └── feature-requests/
│           ├── page.tsx
│           ├── new/page.tsx
│           └── [id]/page.tsx
├── .env.local
├── .eslintrc.json
├── .eslintignore
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── README.md
```
