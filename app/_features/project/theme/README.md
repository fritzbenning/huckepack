# Theme Feature

This feature manages Tailwind v4 themes for projects, with versioning support and optimistic updates.

## Structure

```
theme/
├── actions/          # Actions with optimistic updates
│   ├── createTheme.ts
│   ├── updateTheme.ts
│   └── deleteTheme.ts
├── database/         # Database operations
│   ├── get.ts
│   ├── upsert.ts
│   └── delete.ts
├── hooks/           # React hooks for data fetching
│   ├── useTheme.ts
│   ├── useThemes.ts
│   └── useThemesWithVersion.ts
├── services/        # Business logic
│   └── versionHelpers.ts
└── types.ts         # TypeScript types

theme-version/
├── database/        # Version-specific operations
│   ├── create.ts
│   ├── get.ts
│   └── update.ts
├── presets/         # Default theme templates
│   └── defaultTailwindTheme.ts
└── services/
    └── createInitialVersion.ts
```

## Usage

### Creating a Theme

```typescript
import { useAsyncAction } from "@shared/action";

const { action: createTheme, loading } = useAsyncAction("theme.create", {
  onSuccess: (theme) => console.info("Theme created:", theme),
  onError: (error) => console.error("Error:", error),
});

createTheme({
  name: "my-theme",
  projectId: "project-id",
  repositoryPath: "src/theme.css",
});
```

### Updating a Theme (with Optimistic Updates)

```typescript
import { useAsyncAction } from "@shared/action";

const { action: updateTheme, loading } = useAsyncAction("theme.update", {
  onSuccess: () => console.info("Theme updated"),
  onError: (error) => console.error("Error:", error),
});

updateTheme({
  themeId: "theme-id",
  projectId: "project-id",
  content: `@import "tailwindcss";
@theme {
  --color-primary: #3b82f6;
  /* ... */
}`,
});
```

### Fetching Themes

```typescript
import { useThemes, useThemesWithVersion } from "@project/theme";

// Get basic theme data
const { themes, loading, error } = useThemes(projectId);

// Get themes with current version content
const { themes, loading, error } = useThemesWithVersion(projectId);
```

### Fetching a Single Theme

```typescript
import { useTheme, useThemeWithVersion } from "@project/theme";

// Get basic theme data
const { theme, loading, error } = useTheme(themeId);

// Get theme with current version content
const { theme, loading, error } = useThemeWithVersion(themeId);
```

## Database Schema

### themes table
- `id` (uuid) - Primary key
- `project_id` (uuid) - Foreign key to projects
- `name` (text) - Theme name
- `repository_path` (text) - Path in repository
- `current_version` (integer) - Current version number
- `current_version_id` (uuid) - Foreign key to theme_versions
- `created_at` (timestamp)

### theme_versions table
- `id` (uuid) - Primary key
- `theme_id` (uuid) - Foreign key to themes
- `version` (integer) - Version number
- `content` (text) - Tailwind v4 theme CSS string
- `created_at` (timestamp)

## Features

- ✅ Versioning system with full history
- ✅ Optimistic updates for instant UI feedback
- ✅ Default Tailwind v4 theme on project creation
- ✅ SWR for caching and revalidation
- ✅ TypeScript support
- ✅ Follows file/file_versions pattern

## Default Theme

When a project is created, a default Tailwind v4 theme is automatically created with:
- Primary color (blue)
- Secondary color (violet)
- All Tailwind default spacing values
- All Tailwind default font sizes
- All Tailwind default border radius values
- Font weights, line heights, and letter spacing

The default theme can be customized by editing `/app/_features/project/theme-version/presets/defaultTailwindTheme.ts`.

