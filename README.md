# Lendsqr Frontend Engineering Assessment

React + Vite admin dashboard built to the Lendsqr Figma prototype specification.

## Setup

```bash
npm install
npm run dev       # development server at http://localhost:5173
npm run build     # production build
npm run preview   # preview production build locally
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
 ┃ ┣ mockData.ts
 ┃ ┗ users.ts
 ┣ assets
 ┃ ┣ logo.svg
 ┃ ┗ pablo-sign-in.svg
 ┣ components
 ┃ ┣ layout
 ┃ ┃ ┣ DashboardLayout.module.scss
 ┃ ┃ ┣ DashboardLayout.tsx
 ┃ ┃ ┣ Header.module.scss
 ┃ ┃ ┣ Header.tsx
 ┃ ┃ ┣ Sidebar.module.scss
 ┃ ┃ ┗ Sidebar.tsx
 ┃ ┗ ui
 ┃ ┃ ┣ EmptyState.module.scss
 ┃ ┃ ┣ EmptyState.tsx
 ┃ ┃ ┣ ErrorState.module.scss
 ┃ ┃ ┣ ErrorState.tsx
 ┃ ┃ ┣ Popover.module.scss
 ┃ ┃ ┣ Popover.tsx
 ┃ ┃ ┣ Skeleton.module.scss
 ┃ ┃ ┣ Skeleton.tsx
 ┃ ┃ ┣ StatusBadge.module.scss
 ┃ ┃ ┗ StatusBadge.tsx
 ┣ features
 ┃ ┣ auth
 ┃ ┃ ┣ LoginPage.module.scss
 ┃ ┃ ┗ LoginPage.tsx
 ┃ ┗ users
 ┃ ┃ ┣ components
 ┃ ┃ ┃ ┣ FilterForm.module.scss
 ┃ ┃ ┃ ┣ FilterForm.tsx
 ┃ ┃ ┃ ┣ Pagination.module.scss
 ┃ ┃ ┃ ┣ Pagination.tsx
 ┃ ┃ ┃ ┣ StatCard.module.scss
 ┃ ┃ ┃ ┗ StatCard.tsx
 ┃ ┃ ┣ UserDetailPage.module.scss
 ┃ ┃ ┣ UserDetailPage.tsx
 ┃ ┃ ┣ UsersPage.module.scss
 ┃ ┃ ┗ UsersPage.tsx
 ┣ lib
 ┃ ┗ storage.ts
 ┣ router
 ┃ ┗ index.tsx
 ┣ store
 ┃ ┗ authStore.ts
 ┣ styles
 ┃ ┣ main.scss
 ┃ ┣ _reset.scss
 ┃ ┗ _variables.scss
 ┣ types
 ┃ ┗ index.ts
 ┣ App.tsx
 ┣ main.tsx
 ┗ vite-env.d.ts
```

---

## Key Decisions

### Virtualization — not used

500 records paginated at configurable page size (default 100, selectable 10/25/50/100) means the DOM holds at most 100 rows. TanStack Table manualPagination + TanStack Query placeholderData handles page transitions without flicker.

Virtualization adds hard costs: dynamic row heights require measurement passes, scroll restoration becomes manual, keyboard navigation degrades. Breakeven is ~5,000+ rows in a single uninterrupted scroll — not reached here. If the dataset grew beyond server-side pagination capacity (50k+ records in one shot), TanStack Virtual would slot in alongside the existing column/filter definitions with minimal restructuring.

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

## Lighthouse audit

Initial scan of `/users` scored **Accessibility 0.92**, **SEO 0.60**. All issues fixed:

| Audit              | Issue                                                            | Fix                                                 |
| ------------------ | ---------------------------------------------------------------- | --------------------------------------------------- |
| `color-contrast`   | Sidebar group labels `rgba(84,95,125,0.7)` on white – ratio 3.23 | Changed to `$text` (#545F7D) – ratio 6.14           |
| `color-contrast`   | Active badge `#39cd62` on `#f3fcf6` – ratio 1.99                 | `$status-active-text` → `#0B7027` – ratio 5.13      |
| `color-contrast`   | Pending badge `#e9b200` on `#fef5ec` – ratio 1.79                | `$status-pending-text` → `#996300` – ratio 4.57     |
| `color-contrast`   | Blacklisted badge `#e4033b` on `#fde8ec` – ratio 4.09            | `$status-blacklisted-text` → `#C40033` – ratio 5.24 |
| `link-name`        | Logo `<a>` has no accessible name                                | Added `aria-label="Home"`                           |
| `td-has-header`    | Table `<td>` not associated with `<th>`                          | Added `scope="col"` to every `<th>`                 |
| `meta-description` | Missing `<meta name="description">`                              | Added to `index.html`                               |
| `robots-txt`       | `robots.txt` missing / invalid                                   | Created `public/robots.txt` (`Allow: /`)            |

After fixes: **Accessibility 1.00**, **SEO 1.00**, **Best Practices 1.00**.

---

## Responsive breakpoints

| Breakpoint | Behaviour                                        |
| ---------- | ------------------------------------------------ |
| >1024px    | Fixed sidebar (283px), full header               |
| 640-1024px | Sidebar collapses behind hamburger with overlay  |
| <640px     | Single-column layout, search and username hidden |
