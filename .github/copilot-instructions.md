# AI Coding Agent Instructions - App Inventory UI

## Project Overview
A React 19 + Vite application for managing application inventory with dashboards, admin controls, and multi-page routing. Built with Tailwind CSS v4 via `@tailwindcss/vite` plugin.

## Architecture & Key Files

### Routing & Entry Points
- **[src/App.jsx](../src/App.jsx)**: Main router using React Router v7 with 6 primary routes:
  - `/` → All Applications listing
  - `/dashboard` → Analytics dashboard
  - `/create` → New application form
  - `/admin` → Admin & permissions
  - `/app` → Individual application details
  - `/*` → 404 fallback

### Component Structure
- **[src/components/Sidebar.jsx](../src/components/Sidebar.jsx)**: Persistent navigation with `active` prop for highlighting. Uses Lucide icons (Layers, PieChart, List, Plus, Shield) and Tailwind glassmorphism (`bg-white/95 backdrop-blur-sm`).
- **Page Components**: Each route maps to [src/pages/](../src/pages/) or root-level pages (Dashboard, Login, AllApps, CreateApp, Application, Admin, NotFound).

### Styling & UI Patterns
- **Tailwind CSS v4** with CSS variables (configured in [components.json](../components.json)).
- **Icon Library**: Lucide React (v0.562.0) - all icons imported from `lucide-react`.
- **Alias Configuration**: `@` resolves to `src/` (see [vite.config.js](../vite.config.js)).
- **Component Library Setup**: ShadCN config present but UI components directory (`@/components/ui`) not yet populated—extend from Tailwind utilities.

### Data Flow
- **Mock Data Pattern**: Component-level mock data (e.g., `sampleSummary`, `apps_MockData` in [Dashboard.jsx](../src/pages/Dashboard.jsx), [AllApps.jsx](../src/AllApps.jsx)).
- **No Backend Integration Yet**: All data is static or component state. When adding API calls, use fetch or axios at page component level.
- **Navigation**: `useNavigate()` hook from React Router for programmatic routing.

## Build & Development Commands

```bash
npm run dev      # Start Vite dev server with HMR (http://localhost:5173)
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
npm run lint     # Run ESLint across all .js/.jsx files
```

## Project-Specific Patterns

### ESLint Rules
- Unused variables allowed if UPPERCASE (e.g., `STATUS_ENUM`).
- React Hooks warnings enforced (`react-hooks/rules-of-hooks`).
- React Refresh plugin for Vite Fast Refresh.

### Component Conventions
- **Sidebar Pattern**: Pass `active` prop to [Sidebar.jsx](../src/components/Sidebar.jsx) with values like `'all'`, `'dashboard'`, `'admin'` to highlight current page.
- **Conditional Styling**: Use template literals with ternaries or `clsx` (v2.1.1) for dynamic Tailwind classes.
- **Icons as Components**: Import icons directly (`import { ListIcon, PlusIcon } from 'lucide-react'`) and render as JSX (`<ListIcon className="w-5 h-5" />`).

### Tailwind Utilities
- Use Tailwind's color system with opacity modifiers: `bg-blue-600`, `bg-white/95`, `text-green-700`.
- Glassmorphism: `bg-white/95 backdrop-blur-sm border border-white/20 shadow-[...]`.
- Spacing units are consistent with Tailwind defaults (4, 6, 8px blocks).

## Integration Points

### External Dependencies
- **React Router DOM v7.12**: Manage navigation and route parameters via `useNavigate()` and `<Link>`.
- **Tailwind Merge v3.4**: Merges conflicting Tailwind classes (imported in config, not typically in component code).
- **Class Variance Authority v0.7.1**: For building component variants (not yet used—useful for future UI library).

### Future Integrations
- Add API service layer in `src/services/` or `src/api/` when connecting to backend.
- Use React Context or state management (Redux/Zustand) if multiple pages need shared state.
- Extend [components.json](../components.json) aliases for `hooks`, `utils`, `lib` directories when created.

## Developer Workflow Tips

1. **Fast Refresh**: Vite provides HMR—edits to JSX/CSS auto-reload. No page refresh needed.
2. **Path Resolution**: Always use `@/` for imports from `src/` (e.g., `import Sidebar from '@/components/Sidebar'`).
3. **Linting**: Run `npm run lint` before commits; fix common issues with component naming and unused variables.
4. **Tailwind Autocomplete**: Ensure VS Code has Tailwind IntelliSense enabled for class suggestions.
5. **Mock Data Maintenance**: Update component-level mock data in Dashboard and AllApps when schema changes are planned.
