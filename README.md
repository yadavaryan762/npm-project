# TaskFlow — Smart Task Management Application

> A personal productivity app built with React, Vite, and [safe-storage-lite](https://www.npmjs.com/package/safe-storage-lite) — a custom NPM package for safe, feature-rich localStorage management.

🔗 **Live Demo**: [https://yadavaryan762.github.io/npm-project/](https://yadavaryan762.github.io/npm-project/)

📁 **Repository**: [https://github.com/yadavaryan762/npm-project](https://github.com/yadavaryan762/npm-project)

---

## Features

- **Dashboard** — Welcome overview with stat cards, completion rate progress bar, and recent tasks
- **Task Management** — Create, edit, delete, complete, and reopen tasks
- **Task Fields** — Title, description, category, priority (high/medium/low), due date
- **Search & Filtering** — Search by title, filter by status/category/priority, sort by date or priority
- **Upcoming View** — Tasks grouped by date with overdue section
- **Categories** — Personal, Work, Study, Other
- **Theme Switching** — Light and dark mode, persisted via SafeStorage
- **Persistent Storage** — All data stored in localStorage via `safe-storage-lite`
- **Empty States** — Friendly states for no tasks / no results
- **Responsive** — Full mobile and tablet support with collapsible sidebar

---

## Technologies Used

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| `safe-storage-lite` | Custom NPM package for localStorage |
| Lucide React | Icon library |
| CSS (vanilla) | Custom design system |

**No backend. No Redux. No unnecessary dependencies.**

---

## Installation

```bash
git clone <your-repo>
cd taskflow
npm install
```

---

## Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Production Build

```bash
npm run build
npm run preview
```

---

## How SafeStorage is Integrated

All persistent data operations flow through [`src/utils/storage.js`](./src/utils/storage.js), which exclusively uses the `safe-storage-lite` package.

**Never** are `localStorage.setItem`, `localStorage.getItem`, or `localStorage.clear` called directly anywhere in the application.

### Storage operations used:

| Operation | SafeStorage Method | TTL? |
|---|---|---|
| Save tasks | `setItem(key, tasks)` | No — permanent |
| Load tasks | `getItem(key)` | — |
| Save theme | `setItem(key, theme)` | No — permanent |
| Load theme | `getItem(key)` | — |
| Save preferences | `setItem(key, prefs)` | No — permanent |
| Clear task data | `removeItem(key)` | — |
| Check storage | `isStorageAvailable()` | — |
| Check key exists | `hasItem(key)` | — |

```js
// Example from src/utils/storage.js:
import { setItem, getItem, removeItem, hasItem, isStorageAvailable } from 'safe-storage-lite';

export function saveTasks(tasks) {
  return setItem('taskflow_tasks', tasks); // permanent, no TTL
}

export function getTasks() {
  const tasks = getItem('taskflow_tasks');
  return Array.isArray(tasks) ? tasks : [];
}
```

**Why no TTL on tasks?** Tasks are user-created permanent records. TTL is intentionally not used for them — the user controls deletion. TTL would be appropriate for caching temporary data like session hints, which is not needed here.

---

## Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx       — Navigation sidebar
│   ├── Header.jsx        — Top bar with theme toggle
│   ├── StatCard.jsx      — Dashboard stat card
│   ├── TaskCard.jsx      — Individual task row
│   ├── TaskForm.jsx      — Create / edit modal form
│   └── EmptyState.jsx    — Empty content placeholder
├── pages/
│   ├── Dashboard.jsx     — Overview with stats and recent tasks
│   ├── Tasks.jsx         — Full task list with search and filters
│   ├── Upcoming.jsx      — Upcoming / overdue tasks by date
│   └── Settings.jsx      — Theme, storage info, danger zone
├── utils/
│   ├── storage.js        — All SafeStorage calls (never raw localStorage)
│   ├── taskHelpers.js    — Task logic, filters, stats
│   └── uuid.js           — Minimal UUID v4 generator
├── App.jsx               — Root state, routing, task CRUD
├── main.jsx              — React entry point
└── index.css             — Full design system
```

---

## Future Improvements

- Subtasks / checklists
- Tags and custom categories
- Drag-and-drop task reordering
- Task notes / attachments
- Recurring tasks
- Export to CSV / JSON
- Keyboard shortcuts
- PWA support (offline mode)
- Notifications for due dates

---

## NPM Package

This application uses [`safe-storage-lite`](https://www.npmjs.com/package/safe-storage-lite) — a custom NPM package authored by Aryan Yadav.

**Package features:**
- Automatic JSON serialization / deserialization
- TTL (time-to-live) expiration with lazy eviction
- Safe fallback when localStorage is unavailable (Node.js, SSR, sandboxed iframes)
- Namespace-isolated `clear()` that never wipes unrelated origin data
- Quota-exceeded errors return `false` instead of throwing
- Zero runtime dependencies

---

## License

MIT
