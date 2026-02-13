# Internal Feature Request Board

A minimal internal tool for creating, tracking, and commenting on feature requests. Built as a take-home project with a focus on clean architecture, correctness, and documentation.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 3 |
| Validation | Zod 3 |
| Testing | Vitest |
| Persistence | In-memory (repository pattern, swappable) |

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

Copy the example env file (already provided):

```bash
# .env.local is included in the repo for convenience (no secrets).
# The only variable is:
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> For production, set `NEXT_PUBLIC_BASE_URL` to your deployed origin.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will be redirected to `/feature-requests`.

### Build

```bash
npm run build
npm run start
```

### Lint & Type-check

```bash
npm run lint
npm run type-check
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

- `enums.ts` — `Status` and `Priority` defined as `as const` objects so Zod can consume them directly.
- `entities.ts` — `FeatureRequest` and `Comment` interfaces. Dates are ISO 8601 strings for zero-friction JSON serialisation.
- `repository.ts` — `FeatureRequestRepository` interface (the **port**). Use-cases depend only on this interface, never on a concrete implementation.

#### Application (`application/`)

Contains all business rules.

- `schemas.ts` — Zod schemas. **Single source of truth** for validation. All DTOs are derived via `z.infer<>`.
- `errors.ts` — Typed error classes (`NotFoundError`, `ValidationError`) with machine-readable `code` strings.
- `use-cases/` — One class per use-case, injected with the repository via constructor.

#### Infrastructure (`infrastructure/`)

- `in-memory-repository.ts` — Implements `FeatureRequestRepository` using two `Map` fields. Exported as a singleton with a `globalThis` guard to survive Next.js HMR restarts in development.

#### UI (`ui/`)

- Server Components: `FeatureRequestList`, `FeatureRequestCard`, `FeatureRequestDetail`, `StatusBadge`, `PriorityBadge`, `CommentList`
- Client Components (`'use client'`): `CreateFeatureRequestForm`, `UpdateStatusForm`, `AddCommentForm`

Client Components call the REST API via `fetch`, then call `router.refresh()` to re-render the Server Component tree without a full navigation.

---

## API Reference

All error responses follow this format:

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

Creates a new feature request. Status is always set to `OPEN`.

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

## Enums

| Enum | Values |
|---|---|
| `Status` | `OPEN`, `PLANNED`, `IN_PROGRESS`, `DONE` |
| `Priority` | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |

---

## Testing

### Run tests

```bash
npm run test
```

### What is tested

`src/modules/feature-requests/application/__tests__/create-feature-request.test.ts`

Unit tests for `CreateFeatureRequestUseCase` using an isolated in-memory stub repository (not the singleton):

- Creates a feature request with `OPEN` status and a valid UUID v4.
- Persists the entity in the repository.

### What is not tested (and why)

Integration tests for API routes and E2E tests for the UI are outside the scope of this take-home. The architecture makes them straightforward to add:

- **API routes** — use `next-test-api-route-handler` or `supertest` with a custom server.
- **UI** — use Playwright or Cypress against `npm run dev`.

---

## Swapping to Prisma

The in-memory repository can be replaced with a Prisma implementation without touching any application or domain code:

1. Install Prisma: `npm install prisma @prisma/client`
2. Define `FeatureRequest` and `Comment` models in `prisma/schema.prisma`.
3. Create `src/modules/feature-requests/infrastructure/prisma-repository.ts` implementing `FeatureRequestRepository`.
4. In each API route file, replace the import of `featureRequestRepository` from `in-memory-repository` with the new Prisma singleton.

No use-cases, schemas, or domain code needs to change.

---

## Project Structure (full)

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
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── README.md
```
