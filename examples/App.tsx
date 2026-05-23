import React, { JSX, useCallback, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ItemType } from 'react-native-dropdown-picker';
import { moderateScale } from 'react-native-size-matters';
import TypescriptFunctionExample from './example-src-files/typescript-function-example';
import OldPicker from './src/components/Picker';
import NewPicker from '../src/components/Picker';

type ExampleKind = 'single' | 'multi';

const EXAMPLE_ITEMS: Array<ItemType<ExampleKind>> = [
  { label: 'Single-select', value: 'single' },
  { label: 'Multi-select', value: 'multi' },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 3,
    marginTop: 20,
    padding: 3,
  },
  leftSquare: {
    height: moderateScale(24),
    width: moderateScale(24),
    backgroundColor: 'red',
  },
});

export default function App(): JSX.Element {
  const [example, setExample] = useState<ExampleKind>('single');
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const [useNewPicker, setUseNewPicker] = useState<boolean>(false);

  const toggleNewPicker = useCallback(() => setUseNewPicker((v) => !v), []);

  const Picker = useNewPicker ? NewPicker : OldPicker;

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text>Choose example:</Text>
        <Button
          title={useNewPicker ? 'NEW (v6 src/) — tap for OLD' : 'OLD (examples/src/) — tap for NEW'}
          onPress={toggleNewPicker}
        />
        <Picker
          testID="hello"
          closeIconTestID="closeHello"
          modalTitle="test"
          label="This Is A Testing Label"
          listMode="MODAL"
          searchable
          setValue={setExample as any}
          value={example as any}
          items={EXAMPLE_ITEMS as any}
          open={pickerOpen}
          setOpen={setPickerOpen as any}
          hideListItemsIcons
          leftComponent={(<View style={styles.leftSquare} />) as any}
        />
      </View>

      <View style={{ flex: 3 }}>
        <Text>Example:</Text>
        <TypescriptFunctionExample multiple={example === 'multi'} />
      </View>
    </View>
  );
}
