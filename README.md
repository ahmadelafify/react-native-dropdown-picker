# react-native-dropdown-picker

> **Archived.** This repo holds a v6.0.0 TypeScript rewrite of a dropdown picker
> originally derived from the now-stale `react-native-dropdown-picker` ecosystem.
> No longer published, maintained, or accepting contributions.

## What it is

A single/multi-select dropdown for React Native:

- TypeScript-first, strict mode, no escape hatches
- Generic over `T extends ValueType` with a discriminated-union prop type
  for single vs multi-select
- List modes: FlatList (default), ScrollView, Modal
- Optional search with normalized matching (handles regional accents)
  and `addCustomItem` via `fastest-levenshtein` distance sort
- Optional category/parent items, sticky headers, item separators
- RTL aware
- Consumer-controlled placeholders/copy (no built-in i18n layer)

## Usage

```tsx
import { useState } from 'react';
import { View, Text } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker-plus';

const ITEMS: Array<ItemType<string>> = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Pear', value: 'pear' },
];

export default function App() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  return (
    <View style={{ flex: 1 }}>
      <DropDownPicker
        open={open}
        value={value}
        items={ITEMS}
        setOpen={setOpen}
        setValue={setValue}
        placeholder="Choose a fruit"
      />
      <Text>Chosen fruit: {value ?? 'none'}</Text>
    </View>
  );
}
```

`<DropDownPicker>` re-exports its prop types — see `index.ts` for the full surface.

## What v6 changed from v5

This is a hard fork. Breaking on purpose:

- **Removed**: `mode='BADGE'` + the entire badge renderer
- **Removed**: `theme` prop + `DARK` theme + `setTheme` / `addTheme` /
  `Picker.THEMES` (use your own theming layer)
- **Removed**: `language` / `translation` props + `Picker.LANGUAGE` /
  `setLanguage` / `addTranslation` / `modifyTranslation` (pass `placeholder`,
  `searchPlaceholder`, `multipleText` directly)
- **Removed**: `MODE` constant + `setMode` (was a one-value enum after BADGE went)
- **Removed**: `SCHEMA` static and the hand-written `index.d.ts` (types now flow
  from source)
- **Converted**: every source file from JavaScript to TypeScript under full
  strict mode (`strict`, `noUncheckedIndexedAccess`,
  `noPropertyAccessFromIndexSignature`, `noUnusedLocals`, `noImplicitReturns`)
- **Replaced**: hand-rolled arrow icon memo with a typed `<PickerArrow />`
  component

## License

MIT. See [LICENSE](./LICENSE).
