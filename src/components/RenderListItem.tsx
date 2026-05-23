import { JSX, memo, useCallback, useMemo } from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  Text,
  TextProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import type { ThemeStyles } from '../themes/light';

export type ValueType = string | number | boolean;

export interface ItemType<T extends ValueType> {
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  icon?: () => JSX.Element;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  parent?: T | null;
  selectable?: boolean;
  testID?: string;
  value?: T;
  [key: string]: unknown;
}

interface RenderListItemProps<T extends ValueType> {
  allowFontScaling?: boolean;
  categorySelectable: boolean;
  containerStyle: StyleProp<ViewStyle>;
  custom: boolean;
  customItemContainerStyle: StyleProp<ViewStyle>;
  customItemLabelStyle: StyleProp<TextStyle>;
  disabled: boolean;
  disabledItemContainerStyle: StyleProp<ViewStyle>;
  disabledItemLabelStyle: StyleProp<TextStyle>;
  IconComponent: JSX.Element | null;
  isSelected: boolean;
  item: ItemType<T>;
  label: string;
  labelProps?: TextProps;
  labelStyle: StyleProp<TextStyle>;
  listChildContainerStyle: StyleProp<ViewStyle>;
  listChildLabelStyle: StyleProp<TextStyle>;
  listItemContainerStyle: StyleProp<ViewStyle>;
  listItemLabelStyle: StyleProp<TextStyle>;
  listParentContainerStyle: StyleProp<ViewStyle>;
  listParentLabelStyle: StyleProp<TextStyle>;
  onPress: (item: ItemType<T>, custom: boolean) => void;
  parent: T | null;
  props?: TouchableOpacityProps;
  rtl: boolean;
  selectable: boolean | undefined;
  selectedItemContainerStyle: StyleProp<ViewStyle>;
  selectedItemLabelStyle: StyleProp<TextStyle>;
  setPosition: (value: T, y: number) => void;
  THEME: ThemeStyles;
  TickIconComponent: () => JSX.Element;
  value: T;
}

function RenderListItem<T extends ValueType>({
  allowFontScaling = false,
  categorySelectable,
  containerStyle,
  custom,
  customItemContainerStyle,
  customItemLabelStyle,
  disabled,
  disabledItemContainerStyle,
  disabledItemLabelStyle,
  IconComponent,
  isSelected,
  item,
  label,
  labelProps,
  labelStyle,
  listChildContainerStyle,
  listChildLabelStyle,
  listItemContainerStyle,
  listItemLabelStyle,
  listParentContainerStyle,
  listParentLabelStyle,
  onPress,
  parent,
  props,
  selectable,
  selectedItemContainerStyle,
  selectedItemLabelStyle,
  setPosition,
  THEME,
  TickIconComponent,
  value,
}: RenderListItemProps<T>): JSX.Element {
  const _TickIconComponent = useMemo(
    () => (isSelected ? <TickIconComponent /> : null),
    [isSelected, TickIconComponent],
  );

  const _listParentChildContainerStyle = useMemo(
    () =>
      parent !== null
        ? [THEME.listChildContainer, ...[listChildContainerStyle].flat()]
        : [THEME.listParentContainer, ...[listParentContainerStyle].flat()],
    [THEME, listChildContainerStyle, listParentContainerStyle, parent],
  );

  const _selectedItemContainerStyle = useMemo(
    () => (isSelected ? selectedItemContainerStyle : undefined),
    [isSelected, selectedItemContainerStyle],
  );

  const _disabledItemContainerStyle = useMemo(
    () => (disabled ? disabledItemContainerStyle : undefined),
    [disabled, disabledItemContainerStyle],
  );

  const _customItemContainerStyle = useMemo(
    () => (custom ? [THEME.customItemContainer, ...[customItemContainerStyle].flat()] : undefined),
    [THEME, custom, customItemContainerStyle],
  );

  const _listItemContainerStyle = useMemo(
    () => [
      ...[listItemContainerStyle].flat(),
      ...[_listParentChildContainerStyle].flat(),
      ...[containerStyle].flat(),
      ...[_selectedItemContainerStyle].flat(),
      ...[_customItemContainerStyle].flat(),
      ...[_disabledItemContainerStyle].flat(),
    ],
    [
      listItemContainerStyle,
      _listParentChildContainerStyle,
      _selectedItemContainerStyle,
      _customItemContainerStyle,
      _disabledItemContainerStyle,
      containerStyle,
    ],
  );

  const _listParentChildLabelStyle = useMemo(
    () =>
      parent !== null
        ? [THEME.listChildLabel, ...[listChildLabelStyle].flat()]
        : [THEME.listParentLabel, ...[listParentLabelStyle].flat()],
    [THEME, listChildLabelStyle, listParentLabelStyle, parent],
  );

  const _selectedItemLabelStyle = useMemo(
    () => (isSelected ? selectedItemLabelStyle : undefined),
    [isSelected, selectedItemLabelStyle],
  );

  const _disabledItemLabelStyle = useMemo(
    () => (disabled ? disabledItemLabelStyle : undefined),
    [disabled, disabledItemLabelStyle],
  );

  const _customItemLabelStyle = useMemo(
    () => (custom ? [THEME.customItemLabel, ...[customItemLabelStyle].flat()] : undefined),
    [THEME, custom, customItemLabelStyle],
  );

  const _listItemLabelStyle = useMemo(
    () => [
      ...[listItemLabelStyle].flat(),
      ...[_listParentChildLabelStyle].flat(),
      ...[labelStyle].flat(),
      ...[_selectedItemLabelStyle].flat(),
      ...[_customItemLabelStyle].flat(),
      ...[_disabledItemLabelStyle].flat(),
    ],
    [
      listItemLabelStyle,
      _listParentChildLabelStyle,
      _selectedItemLabelStyle,
      _customItemLabelStyle,
      _disabledItemLabelStyle,
      labelStyle,
    ],
  );

  const __onPress = useCallback(() => {
    if (parent === null && !categorySelectable && selectable !== true) {
      return;
    }
    onPress(item, custom);
  }, [onPress, parent, categorySelectable, custom, item, selectable]);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      setPosition(value, e.nativeEvent.layout.y);
    },
    [setPosition, value],
  );

  return (
    <TouchableOpacity
      style={_listItemContainerStyle}
      onPress={__onPress}
      onLayout={onLayout}
      {...props}
      disabled={selectable === false || disabled}
      testID={item.testID}
    >
      {IconComponent}
      <Text style={_listItemLabelStyle} allowFontScaling={allowFontScaling} {...labelProps}>
        {label}
      </Text>
      {_TickIconComponent}
    </TouchableOpacity>
  );
}

function areEqual<T extends ValueType>(
  prevProps: Readonly<RenderListItemProps<T>>,
  nextProps: Readonly<RenderListItemProps<T>>,
): boolean {
  if (nextProps.label !== prevProps.label) return false;
  if (nextProps.value !== prevProps.value) return false;
  if (nextProps.parent !== prevProps.parent) return false;
  if (nextProps.selectable !== prevProps.selectable) return false;
  if (nextProps.disabled !== prevProps.disabled) return false;
  if (nextProps.custom !== prevProps.custom) return false;
  if (nextProps.isSelected !== prevProps.isSelected) return false;
  if (nextProps.categorySelectable !== prevProps.categorySelectable) return false;
  if (nextProps.rtl !== prevProps.rtl) return false;
  return true;
}

export default memo(RenderListItem, areEqual) as typeof RenderListItem;
