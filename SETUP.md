# Setup Instructions

This document provides detailed instructions for setting up the multilingual e-commerce template.

## Database Migration

If you encounter database schema errors like `no such column: products.is_active`, run the migration script:

```bash
cd backend
python run_migration.py
```

This will:
1. Check your current database schema
2. Add any missing columns to the products table
3. Show you the updated schema

### Seeding Database with Sample Data

To populate the database with sample multilingual products:

```bash
cd backend
python seed_db.py
```

This will:
1. Create all required tables if they don't exist
2. Add sample categories with multilingual names
3. Add 50+ sample products with English, Arabic, and Persian titles/descriptions
4. Add sample admin users for testing

### Manual Migration

If you prefer to run migrations manually:

```bash
cd backend
python -m app.migrations.add_missing_columns
```

### Troubleshooting

If migration fails:
1. Make sure the database file exists (usually `app.db` in the backend folder)
2. Stop the server before running migration
3. Check file permissions on the database file
4. Ensure no other process is using the database file

## i18n (Internationalization) Configuration

### Overview

The application uses i18next with React integration for translations. Translation files are stored as nested JSON in `src/data/`.

### File Structure

```
src/
├── config/
│   └── i18n.ts              # i18next initialization and configuration
├── data/
│   ├── en.json              # English translations (nested JSON)
│   ├── fa.json              # Persian translations (nested JSON)
│   └── ar.json              # Arabic translations (nested JSON)
├── types/
│   └── i18n.d.ts            # TypeScript type definitions for translation keys
└── utils/
    └── i18n-validator.ts    # Development validation utilities
```

### Usage in Components

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('auth.login.title')}</h1>
      <p>{t('auth.validation.required')}</p>
    </div>
  );
};
```

### Adding New Translations

1. Add keys to `src/data/fa.json` (or other locale files) in the appropriate nested structure
2. TypeScript types will automatically update based on the JSON structure
3. Use the key in components with dot notation: `t('section.subsection.key')`

### Translation Key Convention

- Use nested structure for organization: `section.subsection.key`
- Keep keys lowercase with underscores for multi-word: `auth.login.forgot_password`
- Group related translations under common parents

### Debugging Missing Translations

In development mode, missing translations are logged to the console. You can also use the validation utilities:

```typescript
import { validateTranslationKeys } from '@/utils/i18n-validator';

const result = validateTranslationKeys(['auth.login.title', 'missing.key']);
console.log(result.missing); // ['missing.key']
```

### Changing Language

```typescript
import { changeLanguage } from '@/config/i18n';

// Switch to Persian
await changeLanguage('fa');
```