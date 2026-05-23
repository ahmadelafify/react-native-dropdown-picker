import { JSX, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import TypescriptFunctionExample from './example-src-files/typescript-function-example';
import Picker from '../src/components/Picker';
import type { ItemType } from '../src/components/RenderListItem';

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

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text>Choose example:</Text>
        <Picker
          testID="hello"
          closeIconTestID="closeHello"
          modalTitle="test"
          label="This Is A Testing Label"
          listMode="MODAL"
          searchable
          setValue={setExample as any}
          value={example}
          items={EXAMPLE_ITEMS}
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
