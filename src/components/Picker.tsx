import {
  Dispatch,
  Fragment,
  JSX,
  ReactElement,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  BackHandler,
  Dimensions,
  FlatList,
  FlatListProps,
  Image,
  ImageStyle,
  LayoutChangeEvent,
  Modal,
  ModalProps,
  Platform,
  SafeAreaView,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { distance } from 'fastest-levenshtein';
import { moderateScale } from 'react-native-size-matters';

import {
  DROPDOWN_DIRECTION,
  DropDownDirectionType,
  GET_DROPDOWN_DIRECTION,
  LIST_MODE,
  ListModeType,
  RTL_DIRECTION,
  RTL_STYLE,
  SCHEMA,
  SchemaMap,
} from '../constants';

import Colors from '../constants/colors';
import THEME, { ICONS as ICON } from '../themes';
import ListEmpty from './ListEmpty';
import PickerArrow from './PickerArrow';
import RenderListItem, { ItemType, ValueType } from './RenderListItem';
import PickerLabel from './PickerLabel';

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

interface ActivityIndicatorComponentProps {
  color: string;
  size: number;
}

interface ListEmptyComponentProps {
  ActivityIndicatorComponent: (props: ActivityIndicatorComponentProps) => JSX.Element;
  listMessageContainerStyle: StyleProp<ViewStyle>;
  listMessageTextStyle: StyleProp<TextStyle>;
  loading: boolean;
  message: string;
}

export interface RenderListItemPropsInterface<T extends ValueType> {
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
  labelStyle: StyleProp<TextStyle>;
  listChildContainerStyle: StyleProp<ViewStyle>;
  listChildLabelStyle: StyleProp<TextStyle>;
  listItemContainerStyle: StyleProp<ViewStyle>;
  listItemLabelStyle: StyleProp<TextStyle>;
  listParentContainerStyle: StyleProp<ViewStyle>;
  listParentLabelStyle: StyleProp<TextStyle>;
  onPress: (item: ItemType<T>, custom: boolean) => void;
  parent: T | null;
  props: ViewProps;
  rtl: boolean;
  selectable: boolean | undefined;
  selectedItemContainerStyle: StyleProp<ViewStyle>;
  selectedItemLabelStyle: StyleProp<TextStyle>;
  setPosition: (value: T, y: number) => void;
  TickIconComponent: () => JSX.Element;
  value: T;
}

export type MultipleText = string | ({ [key: number]: string } & { n: string });

interface DropDownPickerBaseProps<T extends ValueType> {
  items: Array<ItemType<T>>;
  setItems?:
    | Dispatch<SetStateAction<Array<ItemType<T>>>>
    | ((getItems: () => Array<ItemType<T>>) => void);
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>> | ((getIsOpen: () => boolean) => void);
  activityIndicatorColor?: string;
  ActivityIndicatorComponent?: (props: ActivityIndicatorComponentProps) => JSX.Element;
  activityIndicatorSize?: number;
  allowFontScaling?: boolean;
  addCustomItem?: boolean;
  ArrowDownIconComponent?: (props: { style: StyleProp<ViewStyle> }) => JSX.Element;
  arrowIconContainerStyle?: StyleProp<ViewStyle>;
  arrowIconStyle?: StyleProp<ViewStyle>;
  ArrowUpIconComponent?: (props: { style: StyleProp<ViewStyle> }) => JSX.Element;
  autoScroll?: boolean;
  bottomOffset?: number;
  categorySelectable?: boolean;
  closeAfterSelecting?: boolean;
  CloseIconComponent?: (props: { style: StyleProp<ViewStyle> }) => JSX.Element;
  closeIconContainerStyle?: StyleProp<ViewStyle>;
  closeIconStyle?: StyleProp<ViewStyle>;
  closeIconTestID?: string;
  closeOnBackPressed?: boolean;
  containerProps?: ViewProps;
  containerStyle?: StyleProp<ViewStyle>;
  customItemContainerStyle?: StyleProp<ViewStyle>;
  customItemLabelStyle?: StyleProp<TextStyle>;
  disableBorderRadius?: boolean;
  disabledItemContainerStyle?: StyleProp<ViewStyle>;
  disabledItemLabelStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  disabledStyle?: StyleProp<ViewStyle>;
  disableLocalSearch?: boolean;
  dropDownContainerStyle?: StyleProp<ViewStyle>;
  dropDownDirection?: DropDownDirectionType;
  dropDownLabelContainerStyle?: StyleProp<ViewStyle>;
  dropDownLabelTextStyle?: StyleProp<TextStyle>;
  dropDownLabelY?: number;
  flatListProps?: Partial<FlatListProps<ItemType<T>>>;
  hidden?: boolean;
  hideListItemsIcons?: boolean;
  hideSelectedItemIcon?: boolean;
  iconContainerStyle?: StyleProp<ViewStyle>;
  itemKey?: string | null;
  itemLabelProps?: TextProps;
  itemProps?: TouchableOpacityProps;
  itemSeparator?: boolean;
  itemSeparatorStyle?: StyleProp<ViewStyle>;
  label?: string;
  labelProps?: TextProps;
  listChildContainerStyle?: StyleProp<ViewStyle>;
  listChildLabelStyle?: StyleProp<TextStyle>;
  ListEmptyComponent?: (props: ListEmptyComponentProps) => JSX.Element;
  leftComponent?: JSX.Element;
  leftComponentIndentLabel?: boolean;
  listItemContainerStyle?: StyleProp<ViewStyle>;
  listItemLabelStyle?: StyleProp<TextStyle>;
  listMessageContainerStyle?: StyleProp<ViewStyle>;
  listMessageTextStyle?: StyleProp<TextStyle>;
  listMode?: ListModeType;
  listParentContainerStyle?: StyleProp<ViewStyle>;
  listParentLabelStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  maxHeight?: number;
  max?: number | null;
  min?: number | null;
  modalAnimationType?: 'none' | 'slide' | 'fade';
  modalContentContainerStyle?: StyleProp<ViewStyle>;
  modalProps?: ModalProps;
  modalTitle?: string;
  modalTitleStyle?: StyleProp<TextStyle>;
  modalTitleContainerStyle?: StyleProp<ViewStyle>;
  multipleText?: MultipleText | null;
  onChangeSearchText?: (text: string) => void;
  onClose?: () => void;
  onDirectionChanged?: (direction: 'top' | 'bottom') => void;
  onLayout?: (e: LayoutChangeEvent) => void;
  onOpen?: () => void;
  onPress?: (open: boolean) => void;
  placeholder?: string | null;
  placeholderStyle?: StyleProp<TextStyle>;
  props?: TouchableOpacityProps;
  renderListItem?: (props: RenderListItemPropsInterface<T>) => JSX.Element;
  rtl?: boolean;
  schema?: Partial<SchemaMap>;
  scrollViewProps?: ScrollViewProps;
  searchable?: boolean;
  searchContainerStyle?: StyleProp<ViewStyle>;
  searchPlaceholder?: string | null;
  searchPlaceholderTextColor?: string;
  searchTextInputProps?: TextInputProps;
  searchTextInputStyle?: StyleProp<TextStyle>;
  searchWithRegionalAccents?: boolean;
  selectedItemContainerStyle?: StyleProp<ViewStyle>;
  selectedItemLabelStyle?: StyleProp<TextStyle>;
  showArrowIcon?: boolean;
  showTickIcon?: boolean;
  stickyHeader?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  textStyle?: StyleProp<TextStyle>;
  TickIconComponent?: (props: { style: StyleProp<ViewStyle> }) => JSX.Element;
  tickIconContainerStyle?: StyleProp<ViewStyle>;
  tickIconStyle?: StyleProp<ViewStyle>;
  zIndexInverse?: number;
  zIndex?: number;
}

interface DropDownPickerSingleProps<T extends ValueType> {
  multiple?: false;
  onChangeValue?: (value: T | null) => void;
  onSelectItem?: (item: ItemType<T>) => void;
  value: T | null;
  setValue: Dispatch<SetStateAction<T | null>> | ((cb: (prev: T | null) => T | null) => void);
}

interface DropDownPickerMultipleProps<T extends ValueType> {
  multiple: true;
  onChangeValue?: (value: Array<T> | null) => void;
  onSelectItem?: (items: Array<ItemType<T>>) => void;
  value: Array<T> | null;
  setValue:
    | Dispatch<SetStateAction<Array<T> | null>>
    | ((cb: (prev: Array<T> | null) => Array<T> | null) => void);
}

export type DropDownPickerProps<T extends ValueType> = DropDownPickerBaseProps<T> &
  (DropDownPickerSingleProps<T> | DropDownPickerMultipleProps<T>);

function Picker<T extends ValueType>(props: DropDownPickerProps<T>): ReactElement {
  const {
    items: itemsProp = [],
    setItems: setItemsProp = () => {},
    open,
    setOpen: setOpenProp = () => {},
    activityIndicatorColor = Colors.GREY,
  ActivityIndicatorComponent = null,
  activityIndicatorSize = 30,
  allowFontScaling = false,
  addCustomItem = false,
  ArrowDownIconComponent = null,
  arrowIconContainerStyle = {},
  arrowIconStyle = {},
  ArrowUpIconComponent = null,
  autoScroll = false,
  bottomOffset = 0,
  categorySelectable = true,
  closeAfterSelecting = true,
  CloseIconComponent = null,
  closeIconContainerStyle = {},
  closeIconStyle = {},
  closeOnBackPressed = false,
  closeIconTestID,
  containerProps = {},
  containerStyle = {},
  customItemContainerStyle = {},
  customItemLabelStyle = {},
  disableBorderRadius = true,
  disabled = false,
  disabledItemContainerStyle = {},
  disabledItemLabelStyle = {},
  disabledStyle = {},
  disableLocalSearch = false,
  dropDownContainerStyle = {},
  dropDownDirection = DROPDOWN_DIRECTION.DEFAULT,
  dropDownLabelContainerStyle = {},
  dropDownLabelTextStyle = {},
  dropDownLabelY = 0,
  flatListProps = {},
  hidden = false,
  hideSelectedItemIcon = false,
  hideListItemsIcons = false,
  iconContainerStyle = {},
  itemKey = null,
  itemLabelProps = {},
  itemProps = {},
  itemSeparator = false,
  itemSeparatorStyle = {},
  label = '',
  labelProps = {},
  leftComponent = undefined,
  leftComponentIndentLabel = true,
  listChildContainerStyle = {},
  listChildLabelStyle = {},
  ListEmptyComponent = null,
  listItemContainerStyle = {},
  listItemLabelStyle = {},
  listMessageContainerStyle = {},
  listMessageTextStyle = {},
  listMode = LIST_MODE.DEFAULT,
  listParentContainerStyle = {},
  listParentLabelStyle = {},
  loading = false,
  max = null,
  maxHeight = 200,
  min = null,
  modalAnimationType = 'none',
  modalContentContainerStyle = {},
  modalProps = {},
  modalTitle,
  modalTitleStyle = {},
  modalTitleContainerStyle = {},
  multipleText = null,
  onChangeSearchText = () => {},
  onClose = () => {},
  onDirectionChanged = () => {},
  onLayout = () => {},
  onOpen = () => {},
  onPress = () => {},
  placeholder = null,
  placeholderStyle = {},
  props: pickerTouchableProps = {},
  renderListItem = null,
  rtl = false,
  schema = {},
  scrollViewProps = {},
  searchable = false,
  searchContainerStyle = {},
  searchPlaceholder = null,
  searchPlaceholderTextColor = Colors.GREY,
  searchTextInputProps = {},
  searchTextInputStyle = {},
  searchWithRegionalAccents = false,
  selectedItemContainerStyle = {},
  selectedItemLabelStyle = {},
  showArrowIcon = true,
  showTickIcon = true,
  stickyHeader = false,
  style = {},
  testID,
  textStyle = {},
  TickIconComponent = null,
  tickIconContainerStyle = {},
  tickIconStyle = {},
  zIndex = 5000,
  zIndexInverse = 6000,
  } = props;
  const multiple = props.multiple ?? false;
  // Internal: discriminated narrowing dropped intentionally — keeps the body expressible
  // without ~50 narrowing branches. Public surface stays correctly typed via DropDownPickerProps.
  const items = itemsProp as Array<ItemType<T>>;
  const setItems = setItemsProp as (
    next: Array<ItemType<T>> | ((prev: Array<ItemType<T>>) => Array<ItemType<T>>),
  ) => void;
  const setOpen = setOpenProp as (next: boolean | ((prev: boolean) => boolean)) => void;
  const value = props.value as any;
  const setValue = props.setValue as (next: any) => void;
  const onChangeValue = props.onChangeValue as ((v: any) => void) | undefined;
  const onSelectItem = props.onSelectItem as ((v: any) => void) | undefined;
  const [necessaryItems, setNecessaryItems] = useState<Array<ItemType<T>>>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [pickerHeight, setPickerHeight] = useState<number>(0);
  const [direction, setDirection] = useState<'top' | 'bottom'>(
    GET_DROPDOWN_DIRECTION(dropDownDirection),
  );

  const pickerRef = useRef<View | null>(null);
  const initializationRef = useRef<boolean>(false);
  const itemPositionsRef = useRef<Record<string, number>>({});
  const flatListRef = useRef<FlatList<ItemType<T>> | null>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const memoryRef = useRef<{ items: Array<ItemType<T>>; value: ValueType | Array<ValueType> | null }>(
    {
      items: [],
      value: null,
    },
  );

  /**
   * The item schema.
   * @returns {object}
   */
  const ITEM_SCHEMA = useMemo(() => ({ ...SCHEMA, ...schema }), [schema]);

  /**
   * componentDidMount.
   */
  useEffect(() => {
    if (multiple) {
      memoryRef.current.value = Array.isArray(value) ? value : [];
    } else memoryRef.current.value = value;

    // Get initial selected items
    let initialSelectedItems: Array<ItemType<T>> = [];
    const valueNotNull = value !== null && Array.isArray(value) && value.length !== 0;

    if (valueNotNull) {
      if (multiple) {
        initialSelectedItems = items.filter((item) => value.includes(item[ITEM_SCHEMA.value]));
      } else {
        const found = items.find((item) => item[ITEM_SCHEMA.value] === value);
        initialSelectedItems = found ? [found] : [];
      }
    }

    setNecessaryItems(initialSelectedItems);
  }, []);

  useEffect(() => {
    if (closeOnBackPressed && open) {
      const backAction = () => {
        setOpen(false);

        return true;
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => backHandler.remove();
    }
    return undefined;
  }, [open]);

  /**
   * Update necessary items.
   */
  useEffect(() => {
    setNecessaryItems(state =>
      [...state].map(item => {
        const _item = items.find(x => x[ITEM_SCHEMA.value] === item[ITEM_SCHEMA.value]);

        if (_item) {
          return { ...item, ..._item };
        }

        return item;
      }),
    );
  }, [items]);

  /**
   * Sync necessary items.
   */
  useEffect(() => {
    if (multiple) {
      setNecessaryItems((state) => {
        if (value === null || (Array.isArray(value) && value.length === 0)) return [];

        const newState = [...state].filter((item) => value.includes(item[ITEM_SCHEMA.value]));

        const newItems = value.reduce(
          (accumulator: Array<ItemType<T>>, currentValue: T) => {
            const itemIndex = newState.findIndex((item) => item[ITEM_SCHEMA.value] === currentValue);

            if (itemIndex === -1) {
              const item = items.find((it) => it[ITEM_SCHEMA.value] === currentValue);

              if (item) {
                return [...accumulator, item];
              }

              return accumulator;
            }

            return accumulator;
          },
          [],
        );

        return [...newState, ...newItems];
      });
    } else {
      const state: Array<ItemType<T>> = [];

      if (value !== null) {
        const item = items.find((it) => it[ITEM_SCHEMA.value] === value);

        if (item) {
          state.push(item);
        }
      }

      setNecessaryItems(state);
    }

    if (initializationRef.current) {
      onChangeValue?.(value);
    } else {
      initializationRef.current = true;
    }
  }, [value, items]);

  /**
   * Update value in the memory.
   */
  useEffect(() => {
    memoryRef.current.value = value;
  }, [value]);

  /**
   * Update items in the memory.
   */
  useEffect(() => {
    memoryRef.current.items = necessaryItems;
  }, [necessaryItems]);

  /**
   * Automatically scroll to the first selected item.
   */
  useEffect(() => {
    if (open && autoScroll) {
      scroll();
    }
  }, [open]);

  /**
   * dropDownDirection changed.
   */
  useEffect(() => {
    setDirection(GET_DROPDOWN_DIRECTION(dropDownDirection));
  }, [dropDownDirection]);

  /**
   * onPressClose.
   */
  const onPressClose = useCallback(() => {
    setOpen(false);
    setSearchText('');
    onClose();
  }, [setOpen, onClose]);

  /**
   * onPressToggle.
   */
  const onPressToggle = useCallback(() => {
    const isOpen = !open;

    setOpen(isOpen);
    setSearchText('');

    if (isOpen) onOpen();
    else onClose();

    return isOpen;
  }, [open, setOpen, onOpen, onClose]);

  /**
   * The sorted items.
   * @returns {object}
   */
  const sortedItems = useMemo(() => {
    const sortedItems = items.filter(
      item => item[ITEM_SCHEMA.parent] === undefined || item[ITEM_SCHEMA.parent] === null,
    );
    const children = items.filter(
      item => item[ITEM_SCHEMA.parent] !== undefined && item[ITEM_SCHEMA.parent] !== null,
    );

    children.forEach(child => {
      const index = sortedItems.findIndex(
        item =>
          item[ITEM_SCHEMA.parent] === child[ITEM_SCHEMA.parent] ||
          item[ITEM_SCHEMA.value] === child[ITEM_SCHEMA.parent],
      );

      if (index > -1) {
        sortedItems.splice(index + 1, 0, child);
      }
    });

    return sortedItems;
  }, [items, ITEM_SCHEMA.parent, ITEM_SCHEMA.value]);

  /**
   * Scroll to the first selected item.
   */
  const scroll = useCallback(() => {
    setTimeout(() => {
      if (scrollViewRef.current || flatListRef.current) {
        const memValue = memoryRef.current.value as ValueType | ValueType[] | null;
        const isArray = Array.isArray(memValue);

        if (memValue === null || (isArray && memValue.length === 0)) return;

        const scrollValue = (isArray ? memValue[0] : memValue) as ValueType;
        const scrollKey = String(scrollValue);

        if (
          scrollViewRef.current &&
          Object.prototype.hasOwnProperty.call(itemPositionsRef.current, scrollKey)
        ) {
          scrollViewRef.current.scrollTo({
            x: 0,
            y: itemPositionsRef.current[scrollKey] ?? 0,
            animated: true,
          });
        } else {
          const index = sortedItems.findIndex(
            (item) => item[ITEM_SCHEMA.value] === scrollValue,
          );

          if (index > -1) {
            flatListRef.current?.scrollToIndex({
              index,
              animated: true,
            });
          }
        }
      }
    }, 200);
  }, [sortedItems, ITEM_SCHEMA.value]);

  /**
   * onScrollToIndexFailed.
   */
  const onScrollToIndexFailed = useCallback(
    ({ averageItemLength, index }: { averageItemLength: number; index: number }) => {
      flatListRef.current?.scrollToOffset({
        offset: averageItemLength * index,
        animated: true,
      });
    },
    [],
  );

  /**
   * The indices of all parent items.
   * @returns {object}
   */
  const stickyHeaderIndices = useMemo(() => {
    const indices: number[] = [];
    if (stickyHeader) {
      const parents = sortedItems.filter(
        (item) => item[ITEM_SCHEMA.parent] === undefined || item[ITEM_SCHEMA.parent] === null,
      );
      parents.forEach((parent) => {
        const index = sortedItems.findIndex(
          (item) => item[ITEM_SCHEMA.value] === parent[ITEM_SCHEMA.value],
        );
        if (index > -1) indices.push(index);
      });
    }
    return indices;
  }, [stickyHeader, sortedItems, ITEM_SCHEMA.parent, ITEM_SCHEMA.value]);

  /**
   * The items.
   * @returns {object}
   */
  const _items = useMemo(() => {
    if (searchText.length === 0) {
      return sortedItems;
    }
    if (disableLocalSearch) return sortedItems;

    const normalizeText = (text: string) =>
      text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    let results = sortedItems
      .filter((item) => {
        const label = String(item[ITEM_SCHEMA.label]).toLowerCase();
        return normalizeText(label).includes(searchText.toLowerCase());
      })
      .sort((a, b) => {
        const labelA = normalizeText(String(a[ITEM_SCHEMA.label]).toLowerCase());
        const labelB = normalizeText(String(b[ITEM_SCHEMA.label]).toLowerCase());

        const distA = distance(searchText.toLowerCase(), labelA);
        const distB = distance(searchText.toLowerCase(), labelB);

        if (distA === distB) {
          return labelA.length - labelB.length;
        }
        return distA - distB;
      });

    const values: unknown[] = [];
    results.forEach((item, idx) => {
      if (
        item[ITEM_SCHEMA.parent] === undefined ||
        item[ITEM_SCHEMA.parent] === null ||
        values.includes(item[ITEM_SCHEMA.parent])
      )
        return;

      const parent = sortedItems.find(
        (x) => x[ITEM_SCHEMA.value] === item[ITEM_SCHEMA.parent],
      );
      if (!parent) return;
      values.push(item[ITEM_SCHEMA.parent]);

      results.splice(idx, 0, parent);
    });
    if (
      (results.length === 0 ||
        results.findIndex(
          (item) => String(item[ITEM_SCHEMA.label]).toLowerCase() === searchText.toLowerCase(),
        ) === -1) &&
      addCustomItem
    ) {
      results.push({
        [ITEM_SCHEMA.label]: searchText,
        [ITEM_SCHEMA.value]: searchText.replace(' ', '-'),
        custom: true,
      } as ItemType<T>);
    }

    return results;
  }, [
    sortedItems,
    searchText,
    addCustomItem,
    disableLocalSearch,
    ITEM_SCHEMA.label,
    searchWithRegionalAccents,
    ITEM_SCHEMA.value,
    ITEM_SCHEMA.parent,
  ]);

  /**
   * The value.
   * @returns {string|object|null}}
   */
  const _value = useMemo(() => {
    if (multiple) {
      return value === null ? [] : [...new Set(value)];
    }

    return value;
  }, [value, multiple]);

  /**
   * The placeholder.
   * @returns {string}
   */
  const _placeholder = useMemo(() => placeholder ?? 'Select an item', [placeholder]);

  /**
   * The multiple text.
   * @returns {string | { 1: string; n: string }}
   */
  const _multipleText = useMemo(
    () =>
      multipleText ?? {
        1: 'An item has been selected',
        n: '{count} items have been selected',
      },
    [multipleText],
  );

  /**
   * Indicates whether the value is null.
   * @returns {boolean}
   */
  const isNull = useMemo(() => {
    if (_value === null || (Array.isArray(_value) && _value.length === 0)) return true;

    return necessaryItems.length === 0;
  }, [_value, necessaryItems.length]);

  /**
   * Get the selected item.
   * @returns {object}
   */
  const getSelectedItem = useCallback(() => {
    if (multiple) return _value;

    if (isNull) return null;

    try {
      return necessaryItems.find(item => item[ITEM_SCHEMA.value] === _value);
    } catch (e) {
      return null;
    }
  }, [_value, necessaryItems, isNull, multiple, ITEM_SCHEMA.value]);

  /**
   * Get the label of the selected item.
   * @param {string|null} fallback
   * @returns {string}
   */
  const getLabel = useCallback(
    (fallback: string | null = null): string | null => {
      const item = getSelectedItem();

      if (multiple) {
        const arr = (item as unknown as unknown[]) ?? [];
        if (arr.length > 0) {
          let mtext: any = _multipleText;
          if (typeof mtext !== 'string') {
            mtext = mtext[arr.length] ?? mtext.n;
          }
          return String(mtext).replace('{count}', String(arr.length));
        }
        return fallback;
      }

      try {
        return (item as any)?.[ITEM_SCHEMA.label] ?? fallback;
      } catch (e) {
        return fallback;
      }
    },
    [getSelectedItem, multiple, _multipleText, ITEM_SCHEMA.label],
  );

  /**
   * The label of the selected item / placeholder.
   */
  const _selectedItemLabel = useMemo(() => getLabel(_placeholder), [getLabel, _placeholder]);

  const [labelIndentWidth, setLabelIndentWidth] = useState(0);

  /**
   * The icon of the selected item.
   */
  const _selectedItemIcon = useCallback(() => {
    if (multiple) return null;

    const item = getSelectedItem();

    try {
      return ((item as any)?.[ITEM_SCHEMA.icon] ?? null) as (() => JSX.Element) | null;
    } catch (e) {
      return null;
    }
  }, [getSelectedItem, multiple, ITEM_SCHEMA.icon]);

  /**
   * onPress.
   */
  const __onPress = useCallback(async () => {
    const isOpen = !open;

    onPress(isOpen);

    if (isOpen && dropDownDirection === DROPDOWN_DIRECTION.AUTO) {
      const [, y] = (await new Promise<number[]>((resolve) =>
        pickerRef.current?.measureInWindow((...args: number[]) => resolve(args)),
      )) as [number, number, number, number];
      const size = y + maxHeight + pickerHeight + bottomOffset;

      const direction = size < WINDOW_HEIGHT ? 'top' : 'bottom';

      onDirectionChanged(direction);
      setDirection(direction);
    }

    onPressToggle();
  }, [
    open,
    onPress,
    onDirectionChanged,
    maxHeight,
    pickerHeight,
    bottomOffset,
    dropDownDirection,
    WINDOW_HEIGHT,
  ]);

  /**
   * onLayout.
   */
  const __onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (Platform.OS !== 'web') (e as any).persist?.();

      onLayout(e);

      setPickerHeight(e.nativeEvent.layout.height);
    },
    [onLayout],
  );

  // When disableBorderRadius is on and the dropdown is open, zero the corners that
  // touch the dropdown — picker zeroes its facing edge, dropdown zeroes the opposite.
  const [pickerNoBorderRadius, dropDownNoBorderRadius] = useMemo(() => {
    if (listMode === LIST_MODE.MODAL) return [null, null];
    if (!(disableBorderRadius && open)) return [{}, {}];

    const top = { borderTopLeftRadius: 0, borderTopRightRadius: 0 };
    const bottom = { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 };
    return direction === 'top' ? [bottom, top] : [top, bottom];
  }, [disableBorderRadius, open, direction, listMode]);

  const _disabledStyle = disabled ? disabledStyle : undefined;

  /**
   * The zIndex.
   * @returns {number}
   */
  const _zIndex = useMemo(() => {
    if (open) {
      return direction === 'top' ? zIndex : zIndexInverse;
    }

    return zIndex;
  }, [zIndex, direction, open]);

  /**
   * The style.
   * @returns {object}
   */
  const _style = useMemo(
    () => [
      RTL_DIRECTION(rtl, THEME.style),
      {
        zIndex: _zIndex,
      },
      ...[style].flat(),
      ...[_disabledStyle].flat(),
      pickerNoBorderRadius,
    ],
    [rtl, style, _disabledStyle, pickerNoBorderRadius, _zIndex, THEME.style],
  );

  /**
   * The placeholder style.
   * @returns {object}
   */
  const _placeholderStyle = useMemo(() => isNull && placeholderStyle, [isNull, placeholderStyle]);

  /**
   * The style of the label.
   * @returns {object}
   */
  const _displayValueStyle = useMemo(
    () => [THEME.label, ...[textStyle].flat(), ...[_placeholderStyle].flat()],
    [textStyle, _placeholderStyle, THEME.label],
  );

  /**
   * The arrow icon style.
   * @returns {object}
   */
  const _arrowIconStyle = useMemo(
    () => [THEME.arrowIcon, ...[arrowIconStyle].flat()],
    [arrowIconStyle, THEME.arrowIcon],
  );

  /**
   * The dropdown container style.
   * @returns {object}
   */
  const _dropDownContainerStyle = useMemo(
    () => [
      THEME.dropDownContainer,
      {
        [direction]: pickerHeight - 1,
        maxHeight,
        zIndex: _zIndex,
      },
      ...[dropDownContainerStyle].flat(),
      dropDownNoBorderRadius,
    ],
    [
      direction,
      dropDownContainerStyle,
      dropDownNoBorderRadius,
      maxHeight,
      pickerHeight,
      _zIndex,
      THEME.dropDownContainer,
    ],
  );

  /**
   * The modal content container style.
   * @returns {object}
   */
  const _modalContentContainerStyle = useMemo(
    () => [THEME.modalContentContainer, ...[modalContentContainerStyle].flat()],
    [modalContentContainerStyle, THEME.modalContentContainer],
  );

  /**
   * The zIndex of the container.
   * @returns {object}
   */
  const zIndexContainer = useMemo(
    () =>
      Platform.OS !== 'android' && {
        zIndex: _zIndex,
      },
    [_zIndex],
  );

  /**
   * The container style.
   * @returns {object}
   */
  const _containerStyle = useMemo(
    () => [THEME.container, zIndexContainer, ...[containerStyle].flat()],
    [zIndexContainer, containerStyle, THEME.container],
  );

  /**
   * The arrow icon container style.
   * @returns {object}
   */
  const _arrowIconContainerStyle = useMemo(
    () => [RTL_STYLE(rtl, THEME.arrowIconContainer), ...[arrowIconContainerStyle].flat()],
    [rtl, arrowIconContainerStyle, THEME.arrowIconContainer],
  );

  /**
   * The arrow component.
   * @returns {JSX.Element}
   */
  const _ArrowComponent = useMemo(() => {
    if (!showArrowIcon) return null;

    let Component;
    if (open && ArrowUpIconComponent !== null)
      Component = <ArrowUpIconComponent style={_arrowIconStyle} />;
    else if (!open && ArrowDownIconComponent !== null)
      Component = <ArrowDownIconComponent style={_arrowIconStyle} />;
    else
      Component = <Image source={open ? ICON.ARROW_UP : ICON.ARROW_DOWN} style={_arrowIconStyle as StyleProp<ImageStyle>} />;

    return <View style={_arrowIconContainerStyle}>{Component}</View>;
  }, [
    showArrowIcon,
    open,
    ArrowUpIconComponent,
    ArrowDownIconComponent,
    _arrowIconStyle,
    _arrowIconContainerStyle,
    ICON.ARROW_UP,
    ICON.ARROW_DOWN,
  ]);

  /**
   * The icon container style.
   * @returns {object}
   */
  const _iconContainerStyle = useMemo(
    () => [RTL_STYLE(rtl, THEME.iconContainer), ...[iconContainerStyle].flat()],
    [rtl, iconContainerStyle, THEME.iconContainer],
  );

  /**
   * The selected item icon component.
   * @returns {JSX.Element|null}
   */
  const SelectedItemIconComponent = useMemo(() => {
    const Component = _selectedItemIcon();

    if (hideSelectedItemIcon) return null;

    return (
      Component !== null && (
        <View style={_iconContainerStyle}>
          <Component />
        </View>
      )
    );
  }, [_selectedItemIcon, hideSelectedItemIcon, _iconContainerStyle]);

  /**
   * The simple body component.
   * @returns {JSX.Element}
   */
  const SimpleBodyComponent = useMemo(
    () => (
      <>
        <View
          onLayout={event => {
            const { width } = event.nativeEvent.layout;
            if (leftComponentIndentLabel) setLabelIndentWidth(width);
          }}
        >
          {leftComponent || SelectedItemIconComponent}
        </View>
        <Text style={_displayValueStyle} allowFontScaling={allowFontScaling} {...labelProps}>
          {_selectedItemLabel}
        </Text>
      </>
    ),
    [leftComponent, SelectedItemIconComponent, _displayValueStyle, labelProps, _selectedItemLabel],
  );

  /**
   * The item key.
   * @returns {string}
   */
  const _itemKey = useMemo(() => {
    if (itemKey === null) return ITEM_SCHEMA.value;

    return itemKey;
  }, [itemKey, ITEM_SCHEMA.value]);

  /**
   * The key extractor.
   * @returns {string}
   */
  const keyExtractor = useCallback((item: ItemType<T>) => `${item[_itemKey]}`, [_itemKey]);

  const LoadingBodyComponent = (
    <View style={{ flexDirection: 'row' }}>
      <View
        style={{
          paddingLeft: moderateScale(10),
          paddingRight: moderateScale(17.5),
        }}
      >
        <ActivityIndicator size={moderateScale(10)} color="#0000ff" />
      </View>
      <Text
        style={[_displayValueStyle, { flex: 0 }]}
        allowFontScaling={allowFontScaling}
        {...labelProps}
      >
        Loading
      </Text>
    </View>
  );

  /**
   * The body component.
   */
  const _BodyComponent = useMemo(() => {
    if (loading) {
      return LoadingBodyComponent;
    }
    return SimpleBodyComponent;
  }, [SimpleBodyComponent]);

  /**
   * The list item container style.
   * @returns {object}
   */
  const _listItemContainerStyle = useMemo(
    () => [
      RTL_DIRECTION(rtl, THEME.listItemContainer),
      ...[listItemContainerStyle].flat(),
      stickyHeader && { backgroundColor: (THEME.style as any).backgroundColor },
    ],
    [
      rtl,
      listItemContainerStyle,
      THEME.listItemContainer,
      stickyHeader,
      THEME.style,
    ],
  );

  /**
   * The tick icon container style.
   * @returns {object}
   */
  const _tickIconContainerStyle = useMemo(
    () => [RTL_STYLE(rtl, THEME.tickIconContainer), ...[tickIconContainerStyle].flat()],
    [rtl, tickIconContainerStyle, THEME.tickIconContainer],
  );

  /**
   * The list item label style.
   * @returns {object}
   */
  const _listItemLabelStyle = useMemo(
    () => [THEME.listItemLabel, ...[textStyle].flat(), ...[listItemLabelStyle].flat()],
    [textStyle, listItemLabelStyle, THEME.listItemLabel],
  );

  /**
   * The tick icon style.
   * @returns {object}
   */
  const _tickIconStyle = useMemo(
    () => [THEME.tickIcon, ...[tickIconStyle].flat()],
    [tickIconStyle, THEME.tickIcon],
  );

  /**
   * The search container style.
   * @returns {object}
   */
  const _searchContainerStyle = useMemo(
    () => [
      RTL_DIRECTION(rtl, THEME.searchContainer),
      ...[searchContainerStyle].flat(),
      !searchable &&
        !modalTitle &&
        listMode === LIST_MODE.MODAL && {
          flexDirection: 'row-reverse' as const,
        },
    ],
    [rtl, listMode, searchable, modalTitle, searchContainerStyle, THEME.searchContainer],
  );

  /**
   * The search text input style.
   * @returns {object}
   */
  const _searchTextInputStyle = useMemo(
    () => [textStyle, THEME.searchTextInput, ...[searchTextInputStyle].flat()],
    [textStyle, searchTextInputStyle, THEME.searchTextInput],
  );

  /**
   * The close icon container style.
   * @returns {object}
   */
  const _closeIconContainerStyle = useMemo(
    () => [RTL_STYLE(rtl, THEME.closeIconContainer), ...[closeIconContainerStyle].flat()],
    [rtl, closeIconContainerStyle, THEME.closeIconContainer],
  );

  /**
   * The close icon style.
   * @returns {object}
   */
  const _closeIconStyle = useMemo(
    () => [THEME.closeIcon, ...[closeIconStyle].flat()],
    [closeIconStyle, THEME.closeIcon],
  );

  /**
   * The list message container style.
   * @returns {objects}
   */
  const _listMessageContainerStyle = useMemo(
    () => [THEME.listMessageContainer, ...[listMessageContainerStyle].flat()],
    [listMessageContainerStyle, THEME.listMessageContainer],
  );

  /**
   * The list message text style.
   * @returns {object}
   */
  const _listMessageTextStyle = useMemo(
    () => [THEME.listMessageText, ...[textStyle].flat(), ...[listMessageTextStyle].flat()],
    [listMessageTextStyle, THEME.listMessageText, textStyle],
  );

  /**
   * onPress item.
   */
  const onPressItem = useCallback(
    (item: ItemType<T>, customItem: boolean = false) => {
      if (customItem !== false) {
        (item as any).custom = false;
        setItems((state) => [...state, item]);
      }

      const memValue = memoryRef.current.value as any;
      if (multiple) {
        if (Array.isArray(memValue) && memValue.includes(item[ITEM_SCHEMA.value])) {
          const index = memoryRef.current.items.findIndex(
            (x) => x[ITEM_SCHEMA.value] === item[ITEM_SCHEMA.value],
          );

          if (index > -1) {
            memoryRef.current.items.splice(index, 1);
            onSelectItem?.(memoryRef.current.items.slice());
          }
        } else {
          onSelectItem?.([...memoryRef.current.items, item]);
        }
      } else {
        onSelectItem?.(item);
      }

      setValue((state: any) => {
        if (multiple) {
          const newState = state === null || state === undefined ? [] : [...state];

          if (newState.includes(item[ITEM_SCHEMA.value])) {
            if (!Number.isInteger(min) || (min as number) < newState.length) {
              newState.splice(newState.indexOf(item[ITEM_SCHEMA.value]), 1);
            }
          } else if (!Number.isInteger(max) || (max as number) > newState.length) {
            newState.push(item[ITEM_SCHEMA.value]);
          }

          return newState;
        }

        return item[ITEM_SCHEMA.value];
      });

      setNecessaryItems((state) => {
        if (multiple) {
          const newState = [...state];

          const itemIndex = newState.findIndex(
            (x) => x[ITEM_SCHEMA.value] === item[ITEM_SCHEMA.value],
          );

          if (itemIndex > -1) {
            if (!Number.isInteger(min) || (min as number) < newState.length) {
              newState.splice(itemIndex, 1);
            }
          } else if (!Number.isInteger(max) || (max as number) > newState.length) {
            newState.push(item);
          }

          return newState;
        }
        return [item];
      });

      // if picker is a single-item picker and to close after an item gets selected, close it since press selected item.
      if (closeAfterSelecting && !multiple) onPressClose();
    },
    [
      closeAfterSelecting,
      max,
      min,
      multiple,
      onPressClose,
      onSelectItem,
      setItems,
      setValue,
      ITEM_SCHEMA.value,
    ],
  );

  /**
   * The tick icon component.
   * @returns {JSX.Element}
   */
  const _TickIconComponent = useCallback(() => {
    if (!showTickIcon) return null;

    let Component: JSX.Element;
    if (TickIconComponent !== null) Component = <TickIconComponent style={_tickIconStyle} />;
    else Component = <Image source={ICON.TICK} style={_tickIconStyle as StyleProp<ImageStyle>} />;

    return <View style={_tickIconContainerStyle}>{Component}</View>;
  }, [TickIconComponent, _tickIconStyle, _tickIconContainerStyle, showTickIcon, ICON.TICK]);

  const RenderItemComponent = renderListItem ?? RenderListItem;

  /**
   * The selected item container style.
   * @returns {object}
   */
  const _selectedItemContainerStyle = useMemo(
    () => [THEME.selectedItemContainer, selectedItemContainerStyle],
    [selectedItemContainerStyle, THEME.selectedItemContainer],
  );

  /**
   * The selected item label style.
   * @returns {object}
   */
  const _selectedItemLabelStyle = useMemo(
    () => [THEME.selectedItemLabel, selectedItemLabelStyle],
    [selectedItemLabelStyle, THEME.selectedItemLabel],
  );

  const _disabledItemContainerStyle = disabledItemContainerStyle;
  const _disabledItemLabelStyle = disabledItemLabelStyle;

  /**
   * Set item position.
   * @param {string|number|boolean} value
   * @param {number} y
   */
  const setItemPosition = useCallback(
    (value: ValueType, y: number) => {
      if (autoScroll && listMode === LIST_MODE.SCROLLVIEW) {
        itemPositionsRef.current[String(value)] = y;
      }
    },
    [autoScroll, listMode],
  );

  /**
   * Render list item.
   * @returns {JSX.Element}
   */
  const __renderListItem = useCallback(
    ({ item }: { item: ItemType<T> }) => {
      let IconComponent: any = hideListItemsIcons ? null : item[ITEM_SCHEMA.icon] ?? null;

      if (IconComponent) {
        IconComponent = (
          <View style={_iconContainerStyle}>
            <IconComponent />
          </View>
        );
      }

      let isSelected;
      if (multiple) {
        isSelected = _value.includes(item[ITEM_SCHEMA.value]);
      } else {
        isSelected = _value === item[ITEM_SCHEMA.value];
      }

      return (
        <RenderItemComponent
          rtl={rtl}
          item={item}
          label={String(item[ITEM_SCHEMA.label] ?? '')}
          value={item[ITEM_SCHEMA.value] as T}
          parent={(item?.[ITEM_SCHEMA.parent] as T | null | undefined) ?? null}
          selectable={(item?.[ITEM_SCHEMA.selectable] as boolean | undefined) ?? undefined}
          disabled={Boolean(item?.[ITEM_SCHEMA.disabled])}
          custom={Boolean((item as any).custom)}
          props={itemProps}
          labelProps={itemLabelProps}
          isSelected={isSelected}
          IconComponent={IconComponent}
          TickIconComponent={_TickIconComponent as () => JSX.Element}
          listItemContainerStyle={_listItemContainerStyle}
          listItemLabelStyle={_listItemLabelStyle}
          listChildContainerStyle={listChildContainerStyle}
          listChildLabelStyle={listChildLabelStyle}
          listParentContainerStyle={listParentContainerStyle}
          listParentLabelStyle={listParentLabelStyle}
          customItemContainerStyle={customItemContainerStyle}
          customItemLabelStyle={customItemLabelStyle}
          selectedItemContainerStyle={_selectedItemContainerStyle}
          selectedItemLabelStyle={_selectedItemLabelStyle}
          disabledItemContainerStyle={_disabledItemContainerStyle}
          disabledItemLabelStyle={_disabledItemLabelStyle}
          labelStyle={item?.[ITEM_SCHEMA.labelStyle] ?? {}}
          containerStyle={item?.[ITEM_SCHEMA.containerStyle] ?? {}}
          categorySelectable={categorySelectable}
          onPress={onPressItem}
          setPosition={setItemPosition}
          THEME={THEME}
        />
      );
    },
    [
      categorySelectable,
      customItemContainerStyle,
      customItemLabelStyle,
      itemLabelProps,
      itemProps,
      listChildContainerStyle,
      listChildLabelStyle,
      listParentContainerStyle,
      listParentLabelStyle,
      multiple,
      onPressItem,
      rtl,
      THEME,
      _disabledItemContainerStyle,
      _disabledItemLabelStyle,
      _iconContainerStyle,
      _listItemContainerStyle,
      _listItemLabelStyle,
      _selectedItemContainerStyle,
      _selectedItemLabelStyle,
      _TickIconComponent,
      _value,
      ITEM_SCHEMA.icon,
      ITEM_SCHEMA.value,
      ITEM_SCHEMA.label,
      ITEM_SCHEMA.parent,
      ITEM_SCHEMA.selectable,
      ITEM_SCHEMA.disabled,
      ITEM_SCHEMA.containerStyle,
      setItemPosition,
    ],
  );

  /**
   * The item separator.
   * @returns {JSX.Element|null}
   */
  const ItemSeparatorComponent = useCallback(() => {
    if (!itemSeparator) return null;

    return <View style={[THEME.itemSeparator, ...[itemSeparatorStyle].flat()]} />;
  }, [itemSeparator, THEME.itemSeparator]);

  /**
   * The search placeholder.
   * @returns {string}
   */
  const _searchPlaceholder = useMemo(
    () => searchPlaceholder ?? 'Type something...',
    [searchPlaceholder],
  );

  /**
   * onChangeSearchText.
   * @param {string} text
   */
  const _onChangeSearchText = useCallback(
    (text: string) => {
      setSearchText(text);
      onChangeSearchText(text);
    },
    [onChangeSearchText],
  );

  /**
   * The close icon component.
   * @returns {JSX.Element}
   */
  const _CloseIconComponent = useMemo(() => {
    if (listMode !== LIST_MODE.MODAL) return null;

    let Component;

    if (CloseIconComponent !== null) Component = <CloseIconComponent style={_closeIconStyle} />;
    else Component = <Image source={ICON.CLOSE} style={_closeIconStyle as StyleProp<ImageStyle>} />;

    return (
      <TouchableOpacity
        testID={closeIconTestID}
        style={_closeIconContainerStyle}
        onPress={onPressClose}
      >
        {Component}
      </TouchableOpacity>
    );
  }, [
    listMode,
    CloseIconComponent,
    _closeIconStyle,
    _closeIconContainerStyle,
    onPressClose,
    ICON.CLOSE,
    closeIconTestID,
  ]);

  /**
   * Indicates if the search component is visible.
   * @returns {boolean}
   */
  const isSearchComponentVisible = useMemo(() => {
    if (listMode === LIST_MODE.MODAL) return true;

    return searchable;
  }, [listMode, searchable]);

  /**
   * modalTitleStyle.
   * @returns {object}
   */
  const _modalTitleStyle = useMemo(
    () => [THEME.modalTitle, ...[modalTitleStyle].flat(), ...[textStyle].flat()],
    [textStyle, modalTitleStyle, THEME.modalTitle],
  );

  /**
   * The search component.
   * @returns {JSX.Element}
   */
  const SearchComponent = useMemo(
    () =>
      isSearchComponentVisible && (
        <View style={_searchContainerStyle}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
            }}
          >
            <View style={{ flexDirection: 'column', width: '80%' }}>
              {listMode === LIST_MODE.MODAL && (
                <View
                  style={[
                    {
                      paddingTop: moderateScale(5),
                      paddingBottom: searchable ? moderateScale(15) : 0,
                    },
                    modalTitleContainerStyle,
                  ]}
                >
                  <Text style={_modalTitleStyle} allowFontScaling={allowFontScaling}>
                    {modalTitle}
                  </Text>
                </View>
              )}

              {searchable && (
                <TextInput
                  value={searchText}
                  onChangeText={_onChangeSearchText}
                  style={_searchTextInputStyle}
                  placeholder={_searchPlaceholder}
                  placeholderTextColor={searchPlaceholderTextColor}
                  allowFontScaling={allowFontScaling}
                  {...searchTextInputProps}
                />
              )}
            </View>
            {_CloseIconComponent}
          </View>
        </View>
      ),
    [
      isSearchComponentVisible,
      listMode,
      modalTitle,
      searchable,
      searchPlaceholderTextColor,
      searchText,
      _modalTitleStyle,
      _onChangeSearchText,
      _searchContainerStyle,
      _searchPlaceholder,
      _searchTextInputStyle,
      _CloseIconComponent,
    ],
  );

  /**
   * The dropdown component wrapper.
   * @returns {JSX.Element}
   */
  const DropDownComponentWrapper = useCallback(
    (Component: JSX.Element | null) => (
      <View style={_dropDownContainerStyle}>
        {SearchComponent}
        {Component}
      </View>
    ),
    [_dropDownContainerStyle, SearchComponent],
  );

  /**
   * The ActivityIndicatorComponent.
   * @returns {JSX.Element}
   */
  const _ActivityIndicatorComponent = useCallback(() => {
    let Component;

    if (ActivityIndicatorComponent !== null) Component = ActivityIndicatorComponent;
    else Component = ActivityIndicator;

    return <Component size={activityIndicatorSize} color={activityIndicatorColor} />;
  }, [ActivityIndicatorComponent, activityIndicatorSize, activityIndicatorColor]);

  /**
   * The ListEmptyComponent.
   * @returns {JSX.Element}
   */
  const _ListEmptyComponent = useCallback(() => {
    let Component;
    const message = "There's nothing to show!";

    if (ListEmptyComponent !== null) Component = ListEmptyComponent;
    else Component = ListEmpty;

    return (
      <Component
        listMessageContainerStyle={_listMessageContainerStyle}
        listMessageTextStyle={_listMessageTextStyle}
        ActivityIndicatorComponent={_ActivityIndicatorComponent}
        loading={loading}
        message={message}
        allowFontScaling={allowFontScaling}
      />
    );
  }, [ListEmptyComponent, loading]);

  /**
   * onRequestCloseModal.
   */
  const onRequestCloseModal = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  /**
   * The dropdown flatlist component.
   * @returns {JSX.Element}
   */
  const DropDownFlatListComponent = useMemo(
    () => (
      <FlatList
        ref={flatListRef}
        style={[
          styles.flex,
          {
            backgroundColor: 'white',
            borderRadius:
              (_dropDownContainerStyle.flat()[0] as { borderRadius?: number } | undefined)
                ?.borderRadius,
          },
        ]}
        contentContainerStyle={THEME.flatListContentContainer}
        ListEmptyComponent={_ListEmptyComponent}
        data={_items}
        renderItem={__renderListItem}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={'handled'}
        extraData={_value}
        ItemSeparatorComponent={ItemSeparatorComponent}
        stickyHeaderIndices={stickyHeaderIndices}
        onScrollToIndexFailed={onScrollToIndexFailed}
        {...flatListProps}
      />
    ),
    [
      flatListProps,
      ItemSeparatorComponent,
      keyExtractor,
      _items,
      _ListEmptyComponent,
      _value,
      __renderListItem,
      _dropDownContainerStyle,
      THEME.flatListContentContainer,
      stickyHeaderIndices,
      onScrollToIndexFailed,
    ],
  );

  /**
   * The dropdown scrollview component.
   * @returns {JSX.Element}
   */
  const DropDownScrollViewComponent = useMemo(
    () => (
      <ScrollView
        ref={scrollViewRef}
        nestedScrollEnabled
        stickyHeaderIndices={stickyHeaderIndices}
        {...scrollViewProps}
      >
        {_items.map((item, index) => (
          <Fragment key={String(item[_itemKey])}>
            {index > 0 && ItemSeparatorComponent()}
            {__renderListItem({ item })}
          </Fragment>
        ))}
        {_items.length === 0 && _ListEmptyComponent()}
      </ScrollView>
    ),
    [
      __renderListItem,
      _itemKey,
      scrollViewProps,
      _ListEmptyComponent,
      stickyHeaderIndices,
      _items,
      ItemSeparatorComponent,
    ],
  );

  /**
   * The dropdown modal component.
   * @returns {JSX.Element}
   */
  const DropDownModalComponent = useMemo(
    () => (
      <Modal
        animationType={modalAnimationType}
        visible={open}
        presentationStyle="fullScreen"
        onRequestClose={onRequestCloseModal}
        {...modalProps}
      >
        <SafeAreaView style={_modalContentContainerStyle}>
          {SearchComponent}
          {DropDownFlatListComponent}
        </SafeAreaView>
      </Modal>
    ),
    [
      open,
      SearchComponent,
      _modalContentContainerStyle,
      modalProps,
      modalAnimationType,
      onRequestCloseModal,
      DropDownFlatListComponent,
    ],
  );

  /**
   * The dropdown component.
   * @returns {JSX.Element}
   */
  const DropDownComponent = useMemo(() => {
    switch (listMode) {
      case LIST_MODE.FLATLIST:
        return DropDownComponentWrapper(DropDownFlatListComponent);
      case LIST_MODE.SCROLLVIEW:
        return DropDownComponentWrapper(DropDownScrollViewComponent);
      case LIST_MODE.MODAL:
        return DropDownModalComponent;
      default:
        return null;
    }
  }, [
    listMode,
    DropDownFlatListComponent,
    DropDownScrollViewComponent,
    DropDownModalComponent,
    DropDownComponentWrapper,
  ]);

  /**
   * The body of the dropdown component.
   * @returns {JSX.Element}
   */
  const DropDownBodyComponent = useMemo(() => {
    if (open || listMode === LIST_MODE.MODAL) return DropDownComponent;
    return null;
  }, [open, listMode, DropDownComponent]);

  /**
   * onRef.
   */
  const onRef = useCallback((ref: View | null) => {
    pickerRef.current = ref;
  }, []);

  const pointerEvents = disabled ? 'none' : 'auto';
  const [dimlabel, setDimLabel] = useState(false);

  const themeStyleObj = THEME.style as unknown as { backgroundColor?: string } & Record<string, unknown>;
  const { backgroundColor: _bgC, ...touchOpacityStyle } = themeStyleObj;
  void _bgC;
  const _innerStyle = [touchOpacityStyle, label ? { paddingTop: moderateScale(7.5) } : {}, _style];

  return (
    <View style={_containerStyle} {...containerProps}>
      {!loading && label && (
        <PickerLabel
          label={label}
          labelContainerStyle={dropDownLabelContainerStyle}
          labelTextStyle={[dropDownLabelTextStyle, dimlabel ? { opacity: 0.15 } : {}]}
          indentWidth={labelIndentWidth}
          transformY={dropDownLabelY}
          allowFontScaling={allowFontScaling}
        />
      )}
      {!hidden && (
        <TouchableOpacity
          style={_innerStyle}
          onPressIn={() => setDimLabel(true)}
          onPressOut={() => setDimLabel(false)}
          onPress={__onPress}
          onLayout={__onLayout}
          {...(pickerTouchableProps as TouchableOpacityProps)}
          ref={onRef as any}
          {...{ pointerEvents }}
          disabled={disabled}
          testID={testID}
        >
          {_BodyComponent}
          <PickerArrow
            ArrowDownIconComponent={ArrowDownIconComponent}
            ArrowUpIconComponent={ArrowUpIconComponent}
            arrowDownIconSource={ICON.ARROW_DOWN}
            arrowIconContainerStyle={_arrowIconContainerStyle}
            arrowIconStyle={_arrowIconStyle}
            arrowUpIconSource={ICON.ARROW_UP}
            open={open}
            showArrowIcon={showArrowIcon}
          />
        </TouchableOpacity>
      )}
      {DropDownBodyComponent}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default memo(Picker) as typeof Picker;
