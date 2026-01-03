# i18n Translation Architecture Decision

## Date: 2026-01-03

## Status: APPROVED

## Context

The application was experiencing missing translation keys at runtime. Components using `t('auth.validation.required')` were not receiving the expected translations despite the keys existing in `fa.json`.

## Root Cause Analysis

The `flattenTranslations()` function in `src/config/i18n.ts` was incorrectly processing deeply nested objects, causing keys beyond depth 2 to be lost during the flattening process.

## Decision

**Remove `flattenTranslations` entirely and use i18next's native nested key support.**

### Rationale:
1. i18next natively supports nested keys with dot notation (`keySeparator: '.'`)
2. The flatten function added unnecessary complexity and introduced bugs
3. Nested JSON structure is more maintainable and readable
4. Better TypeScript integration possible with nested structure

## Implementation Plan

### Phase 1: Config Cleanup (Required)
- [ ] Remove `flattenTranslations` function from `i18n.ts`
- [ ] Update `i18n.init()` to pass nested JSON directly
- [ ] Add proper i18next options (`keySeparator`, `returnObjects`)

### Phase 2: Type Safety (Recommended)
- [ ] Create `src/types/i18n.d.ts` with translation key types
- [ ] Add compile-time validation for translation keys

### Phase 3: Developer Experience (Optional)
- [ ] Add missing key detection in development mode
- [ ] Create translation key extraction script

## Code Changes Required

### Before (Problematic):
```typescript
import faTranslations from '../locales/fa.json';

const flattenTranslations = (obj, prefix = '') => {
  // Buggy implementation losing deep keys
};

i18n.init({
  resources: {
    fa: { translation: flattenTranslations(faTranslations) }
  }
});
```

### After (Correct):
```typescript
import faTranslations from '../locales/fa.json';

i18n.init({
  resources: {
    fa: { translation: faTranslations }  // Direct pass-through
  },
  keySeparator: '.',
  returnObjects: true
});
```

## Consequences

### Positive:
- All nested translation keys will work correctly
- Simpler codebase with less custom logic
- Better maintainability
- Native i18next feature usage

### Negative:
- None identified

## References
- [i18next documentation on nested keys](https://www.i18next.com/translation-function/essentials#accessing-keys)
- [i18next keySeparator option](https://www.i18next.com/overview/configuration-options#languages-namespaces-resources)