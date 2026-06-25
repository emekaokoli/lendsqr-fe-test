# Lendsqr Frontend Engineering Assessment

Typescript, React, Vite admin dashboard built to the Lendsqr Figma prototype specification.

## Setup

```bash
pnpm install
pnpm run dev       # development server at http://localhost:5173
pnpm run build     # production build
pnpm run preview   # preview production build locally
pnpm run test      # run tests
```

**Login credentials** — any non-empty email + password. The mock auth accepts all input.

---

## Tech Stack

| Concern      | Choice                                                   |
| ------------ | -------------------------------------------------------- |
| Bundler      | Vite                                                     |
| UI framework | React 18                                                 |
| Routing      | TanStack Router v1                                       |
| Server state | TanStack Query v5                                        |
| Table        | TanStack Table v8                                        |
| Forms        | React Hook Form                                          |
| Client state | Zustand (auth, persisted via zustand/middleware/persist) |
| Styles       | SCSS Modules                                             |
| Icons        | Lucide React                                             |
| Font         | Work Sans (Google Fonts)                                 |

---

## Architecture

```
src
 ┣ api
 ┃ ┣ mockData.test.ts
 ┃ ┣ mockData.ts
 ┃ ┣ users.test.ts
 ┃ ┗ users.ts
 ┣ assets
 ┃ ┣ logo.svg
 ┃ ┗ pablo-sign-in.svg
 ┣ components
 ┃ ┣ layout
 ┃ ┃ ┣ DashboardLayout.module.scss
 ┃ ┃ ┣ DashboardLayout.test.tsx
 ┃ ┃ ┣ DashboardLayout.tsx
 ┃ ┃ ┣ Header.module.scss
 ┃ ┃ ┣ Header.test.tsx
 ┃ ┃ ┣ Header.tsx
 ┃ ┃ ┣ Sidebar.module.scss
 ┃ ┃ ┣ Sidebar.test.tsx
 ┃ ┃ ┗ Sidebar.tsx
 ┃ ┗ ui
 ┃ ┃ ┣ EmptyState.module.scss
 ┃ ┃ ┣ EmptyState.test.tsx
 ┃ ┃ ┣ EmptyState.tsx
 ┃ ┃ ┣ ErrorState.module.scss
 ┃ ┃ ┣ ErrorState.test.tsx
 ┃ ┃ ┣ ErrorState.tsx
 ┃ ┃ ┣ Popover.module.scss
 ┃ ┃ ┣ Popover.test.tsx
 ┃ ┃ ┣ Popover.tsx
 ┃ ┃ ┣ Skeleton.module.scss
 ┃ ┃ ┣ Skeleton.test.tsx
 ┃ ┃ ┣ Skeleton.tsx
 ┃ ┃ ┣ StatusBadge.module.scss
 ┃ ┃ ┣ StatusBadge.test.tsx
 ┃ ┃ ┗ StatusBadge.tsx
 ┣ features
 ┃ ┣ auth
 ┃ ┃ ┣ LoginPage.module.scss
 ┃ ┃ ┣ LoginPage.test.tsx
 ┃ ┃ ┗ LoginPage.tsx
 ┃ ┗ users
 ┃ ┃ ┣ components
 ┃ ┃ ┃ ┣ FilterForm.module.scss
 ┃ ┃ ┃ ┣ FilterForm.test.tsx
 ┃ ┃ ┃ ┣ FilterForm.tsx
 ┃ ┃ ┃ ┣ Pagination.module.scss
 ┃ ┃ ┃ ┣ Pagination.test.tsx
 ┃ ┃ ┃ ┣ Pagination.tsx
 ┃ ┃ ┃ ┣ StatCard.module.scss
 ┃ ┃ ┃ ┣ StatCard.test.tsx
 ┃ ┃ ┃ ┗ StatCard.tsx
 ┃ ┃ ┣ UserDetailPage.module.scss
 ┃ ┃ ┣ UserDetailPage.test.tsx
 ┃ ┃ ┣ UserDetailPage.tsx
 ┃ ┃ ┣ UsersPage.module.scss
 ┃ ┃ ┣ UsersPage.test.tsx
 ┃ ┃ ┗ UsersPage.tsx
 ┣ lib
 ┃ ┣ storage.test.ts
 ┃ ┗ storage.ts
 ┣ router
 ┃ ┣ index.test.tsx
 ┃ ┗ index.tsx
 ┣ store
 ┃ ┣ authStore.test.ts
 ┃ ┗ authStore.ts
 ┣ styles
 ┃ ┣ main.scss
 ┃ ┣ _reset.scss
 ┃ ┗ _variables.scss
 ┣ test
 ┃ ┗ setup.ts
 ┣ types
 ┃ ┗ index.ts
 ┣ App.test.tsx
 ┣ App.tsx
 ┣ main.test.tsx
 ┣ main.tsx
 ┗ vite-env.d.ts
```

---

## Key Decisions

### Virtualization — not used

500 records paginated at configurable page size (default 100, selectable 10/25/50/100) means the DOM holds at most 100 rows. TanStack Table manualPagination + TanStack Query placeholderData handles page transitions without flicker.

Virtualization adds hard costs: dynamic row heights require measurement passes, scroll restoration becomes manual, keyboard navigation degrades. Breakeven is ~5,000+ rows in a single uninterrupted scroll — not reached here. If the dataset grew beyond server-side pagination capacity (50k+ records in one shot), TanStack Virtual https://tanstack.com/virtual/latest would slot in alongside the existing column/filter definitions with minimal restructuring.

### Popover — portal-based

Filter and action menus use ReactDOM.createPortal into document.body. Table cells create stacking contexts that clip position:absolute children — without a portal the dropdown renders invisible behind adjacent cells. The portal reads trigger getBoundingClientRect on open and re-reads on scroll/resize events.

### User detail — localStorage via TanStack Query initialData

TanStack Query's initialData option returns localStorage data synchronously — no loading flash on revisit. The queryFn still fires a background refetch after staleTime (5 min). Writes happen after every successful fetch, keeping the cache current.

### Auth guard

TanStack Router beforeLoad on the layout route uses useAuthStore.getState() (Zustand imperative accessor, safe outside React) and throws redirect({ to: '/login' }) if unauthenticated. No guarded route is reachable without a session.

---

## States handled

| State               | Implementation                                                |
| ------------------- | ------------------------------------------------------------- |
| Table loading       | Skeleton rows (shimmer) during isLoading or isPlaceholderData |
| Stats loading       | Skeleton cards                                                |
| User detail loading | Skeleton fields in summary and info sections                  |
| Empty (filtered)    | EmptyState component when query returns 0 records             |
| Table error         | ErrorState with retry button calling usersQuery.refetch()     |
| User detail error   | ErrorState with retry                                         |
| Unauthenticated     | Redirect to /login via beforeLoad                             |

---

## Responsive breakpoints

| Breakpoint | Behaviour                                        |
| ---------- | ------------------------------------------------ |
| >1024px    | Fixed sidebar (283px), full header               |
| 640-1024px | Sidebar collapses behind hamburger with overlay  |
| <640px     | Single-column layout, search and username hidden |
