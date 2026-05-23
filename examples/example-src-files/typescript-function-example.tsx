import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';

/**
 *
 * @param props
 * @param props.multiple
 */
export default function TypescriptFunctionExample(props: { multiple: boolean }): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const [singleValue, setSingleValue] = useState<string | null>(null);
  const [multiValue, setMultiValue] = useState<Array<string> | null>(null);
  const [items, setItems] = useState<Array<ItemType<string>>>([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Nectarines', value: 'nectarines' },
    { label: 'Kiwis', value: 'kiwis' },
    { label: 'Raspberries', value: 'raspberries' },
    { label: 'Pears', value: 'pears' },
    { label: 'Mango', value: 'mango' },
    { label: 'Pineapple', value: 'pineapple' },
    { label: 'Strawberries', value: 'strawberries' },
    { label: 'Blueberries', value: 'blueberries' },
    { label: 'Blackberries', value: 'blackberries' },
    { label: 'Watermelon', value: 'watermelon' },
    { label: 'Cantaloupe', value: 'cantaloupe' },
    { label: 'Honeydew', value: 'honeydew' },
    { label: 'Grapes', value: 'grapes' },
    { label: 'Cherries', value: 'cherries' },
    { label: 'Peaches', value: 'peaches' },
    { label: 'Plums', value: 'plums' },
    { label: 'Apricots', value: 'apricots' },
    { label: 'Pomegranate', value: 'pomegranate' },
    { label: 'Figs', value: 'figs' },
    { label: 'Dates', value: 'dates' },
    { label: 'Lychee', value: 'lychee' },
    { label: 'Passion Fruit', value: 'passion-fruit' },
    { label: 'Dragon Fruit', value: 'dragon-fruit' },
    { label: 'Papaya', value: 'papaya' },
    { label: 'Guava', value: 'guava' },
    { label: 'Coconut', value: 'coconut' },
    { label: 'Lemon', value: 'lemon' },
    { label: 'Lime', value: 'lime' },
    { label: 'Orange', value: 'orange' },
    { label: 'Grapefruit', value: 'grapefruit' },
  ]);
  const { multiple } = props;

  return (
    <View style={{ flex: 3 }}>
      <View style={{ flex: 1, zIndex: 3 }}>
        <Text>
          Choose a fruit (typescript function, {multiple ? 'multiple-item' : 'single-item'}):
        </Text>
      </View>

      <View style={{ flex: 1, zIndex: 2 }}>
        {multiple ? (
          <DropDownPicker
            open={open}
            value={multiValue}
            items={items}
            setOpen={setOpen}
            setValue={setMultiValue}
            setItems={setItems}
            placeholder="Choose a fruit"
            multiple
            multipleText="You have chosen {count} fruits."
          />
        ) : (
          <DropDownPicker
            open={open}
            value={singleValue}
            items={items}
            setOpen={setOpen}
            setValue={setSingleValue}
            setItems={setItems}
            placeholder="Choose a fruit"
            multiple={false}
          />
        )}
      </View>

      <View style={{ flex: 1, zIndex: 1 }}>
        <View style={{ flex: 1 }}>
          <Text>
            {multiple ? 'Fruits currently are: ' : 'Fruit currently is: '}
            {multiple ? JSON.stringify(multiValue) : JSON.stringify(singleValue)}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Button
            title={multiple ? 'Clear fruits' : 'Clear fruit'}
            onPress={(): void => {
              if (multiple) setMultiValue(null);
              else setSingleValue(null);
            }}
          />
        </View>
      </View>
    </View>
  );
}
