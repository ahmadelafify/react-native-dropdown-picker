import React, {
  Fragment,
  JSX,
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
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import {
  ASCII_CODE,
  DROPDOWN_DIRECTION,
  GET_DROPDOWN_DIRECTION,
  LIST_MODE,
  RTL_DIRECTION,
  RTL_STYLE,
  SCHEMA,
} from '../constants';

import Colors from '../constants/colors';
import THEME, { ICONS as ICON } from '../themes';
import ListEmpty from './ListEmpty';
import RenderListItem from './RenderListItem';
import PickerLabel from './PickerLabel';

const { distance, closest } = require('fastest-levenshtein');

const { height: WINDOW_HEIGHT } = Dimensions.get('window');

function Picker({
  items = [],
  setItems = () => {},
  open,
  setOpen = () => {},
  value = null,
  setValue = callback => {},
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
  multiple = false,
  multipleText = null,
  onChangeSearchText = text => {},
  onChangeValue = value => {},
  onClose = () => {},
  onDirectionChanged = direction => {},
  onLayout = e => {},
  onOpen = () => {},
  onPress = open => {},
  onSelectItem = item => {},
  placeholder = null,
  placeholderStyle = {},
  props = {},
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
}) {
  const [necessaryItems, setNecessaryItems] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [pickerHeight, setPickerHeight] = useState(0);
  const [direction, setDirection] = useState(GET_DROPDOWN_DIRECTION(dropDownDirection));

  const pickerRef = useRef(null);
  const initializationRef = useRef(false);
  const itemPositionsRef = useRef({});
  const flatListRef = useRef();
  const scrollViewRef = useRef();
  const memoryRef = useRef({
    items: [],
    value: null,
  });

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
    let initialSelectedItems = [];
    const valueNotNull = value !== null && Array.isArray(value) && value.length !== 0;

    if (valueNotNull) {
      if (multiple) {
        initialSelectedItems = items.filter(item => value.includes(item[ITEM_SCHEMA.value]));
      } else {
        initialSelectedItems = items.find(item => item[ITEM_SCHEMA.value] === value);
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
      setNecessaryItems(state => {
        if (value === null || (Array.isArray(value) && value.length === 0)) return [];

        const newState = [...state].filter(item => value.includes(item[ITEM_SCHEMA.value]));

        const newItems = value.reduce((accumulator, currentValue) => {
          const itemIndex = newState.findIndex(item => item[ITEM_SCHEMA.value] === currentValue);

          if (itemIndex === -1) {
            const item = items.find(item => item[ITEM_SCHEMA.value] === currentValue);

            if (item) {
              return [...accumulator, item];
            }

            return accumulator;
          }

          return accumulator;
        }, []);

        return [...newState, ...newItems];
      });
    } else {
      const state = [];

      if (value !== null) {
        const item = items.find(item => item[ITEM_SCHEMA.value] === value);

        if (item) {
          state.push(item);
        }
      }

      setNecessaryItems(state);
    }

    if (initializationRef.current) {
      onChangeValue(value);
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
   * onPressClose.
   */
  const onPressOpen = useCallback(() => {
    setOpen(true);
    onOpen();
  }, [setOpen, onOpen]);

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
        const isArray = Array.isArray(memoryRef.current.value);

        if (memoryRef.current.value === null || (isArray && memoryRef.current.value.length === 0))
          return;

        const value = isArray ? memoryRef.current.value[0] : memoryRef.current.value;

        if (scrollViewRef.current && itemPositionsRef.current.hasOwnProperty(value)) {
          scrollViewRef.current?.scrollTo?.({
            x: 0,
            y: itemPositionsRef.current[value],
            animated: true,
          });
        } else {
          const index = sortedItems.findIndex(item => item[ITEM_SCHEMA.value] === value);

          if (index > -1)
            flatListRef.current?.scrollToIndex?.({
              index,
              animated: true,
            });
        }
      }
    }, 200);
  }, [sortedItems, ITEM_SCHEMA.value]);

  /**
   * onScrollToIndexFailed.
   */
  const onScrollToIndexFailed = useCallback(({ averageItemLength, index }) => {
    flatListRef.current.scrollToOffset?.({
      offset: averageItemLength * index,
      animated: true,
    });
  }, []);

  /**
   * The indices of all parent items.
   * @returns {object}
   */
  const stickyHeaderIndices = useMemo(() => {
    const stickyHeaderIndices = [];
    if (stickyHeader) {
      const parents = sortedItems.filter(
        item => item[ITEM_SCHEMA.parent] === undefined || item[ITEM_SCHEMA.parent] === null,
      );
      parents.forEach(parent => {
        const index = sortedItems.findIndex(
          item => item[ITEM_SCHEMA.value] === parent[ITEM_SCHEMA.value],
        );
        if (index > -1) stickyHeaderIndices.push(index);
      });
    }
    return stickyHeaderIndices;
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

    const normalizeText = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    let results = sortedItems
      .filter(item => {
        const label = String(item[ITEM_SCHEMA.label]).toLowerCase();

        return normalizeText(label).includes(searchText.toLowerCase());
      })
      .sort((a, b) => {
        const labelA = normalizeText(String(a[ITEM_SCHEMA.label]).toLowerCase());
        const labelB = normalizeText(String(b[ITEM_SCHEMA.label]).toLowerCase());

        // Calculate distances from searchText
        const distA = distance(searchText.toLowerCase(), labelA);
        const distB = distance(searchText.toLowerCase(), labelB);

        // If distances are the same, compare by length
        if (distA === distB) {
          return labelA.length - labelB.length;
        }

        // Otherwise, sort by distance
        return distA - distB;
      });

    const values = [];
    results.forEach((item, index) => {
      if (
        item[ITEM_SCHEMA.parent] === undefined ||
        item[ITEM_SCHEMA.parent] === null ||
        values.includes(item[ITEM_SCHEMA.parent])
      )
        return;

      const parent = sortedItems.find(x => x[ITEM_SCHEMA.value] === item[ITEM_SCHEMA.parent]);
      values.push(item[ITEM_SCHEMA.parent]);

      results.splice(index, 0, parent);
    });
    if (
      (results.length === 0 ||
        results.findIndex(
          item => String(item[ITEM_SCHEMA.label]).toLowerCase() === searchText.toLowerCase(),
        ) === -1) &&
      addCustomItem
    ) {
      results.push({
        [ITEM_SCHEMA.label]: searchText,
        [ITEM_SCHEMA.value]: searchText.replace(' ', '-'),
        custom: true,
      });
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
   * Selected items only for multiple items.
   * @returns {object}
   */
  const selectedItems = useMemo(() => {
    if (!multiple) return [];

    return necessaryItems.filter(item => _value.includes(item[ITEM_SCHEMA.value]));
  }, [necessaryItems, _value, multiple, ITEM_SCHEMA.value]);

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
    (fallback = null) => {
      const item = getSelectedItem();

      if (multiple)
        if (item.length > 0) {
          let mtext = _multipleText;

          if (typeof mtext !== 'string') {
            mtext = mtext[item.length] ?? mtext.n;
          }

          return mtext.replace('{count}', item.length);
        } else return fallback;

      try {
        return item[ITEM_SCHEMA.label];
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
      return item[ITEM_SCHEMA.icon] ?? null;
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
      const [, y] = await new Promise(resolve =>
        pickerRef.current.measureInWindow((...args) => resolve(args)),
      );
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
    e => {
      if (Platform.OS !== 'web') e.persist();

      onLayout(e);

      setPickerHeight(e.nativeEvent.layout.height);
    },
    [onLayout],
  );

  /**
   * Disable borderRadius for the picker.
   * @returns {object}
   */
  const pickerNoBorderRadius = useMemo(() => {
    if (listMode === LIST_MODE.MODAL) return null;

    if (disableBorderRadius && open) {
      return direction === 'top'
        ? {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }
        : {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          };
    }

    return {};
  }, [disableBorderRadius, open, direction, listMode]);

  /**
   * Disable borderRadius for the drop down.
   * @returns {object}
   */
  const dropDownNoBorderRadius = useMemo(() => {
    if (listMode === LIST_MODE.MODAL) return null;

    if (disableBorderRadius && open) {
      return direction === 'top'
        ? {
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }
        : {
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          };
    }
  }, [disableBorderRadius, open, direction, listMode]);

  /**
   * The disabled style.
   * @returns {object}
   */
  const _disabledStyle = useMemo(() => disabled && disabledStyle, [disabled]);

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
      Component = <Image source={open ? ICON.ARROW_UP : ICON.ARROW_DOWN} style={_arrowIconStyle} />;

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
  const keyExtractor = useCallback(item => `${item[_itemKey]}`, [_itemKey]);

  /**
   * The label container style.
   * @returns {object}
   */
  const labelContainerStyle = useMemo(
    () => [
      THEME.labelContainer,
      rtl && {
        transform: [{ scaleX: -1 }],
      },
    ],
    [rtl, THEME.labelContainer],
  );

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
      stickyHeader && { backgroundColor: THEME.style.backgroundColor },
    ],
    [
      rtl,
      listItemContainerStyle,
      THEME.listItemContainer,
      stickyHeader,
      THEME.style.backgroundColor,
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
          flexDirection: 'row-reverse',
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
  let _listMessageTextStyle;
  _listMessageTextStyle = useMemo(
    () => [THEME.listMessageText, ...[textStyle].flat(), ...[listMessageTextStyle].flat()],
    [listMessageTextStyle, THEME.listMessageText, textStyle],
  );

  /**
   * onPress item.
   */
  const onPressItem = useCallback(
    (item, customItem = false) => {
      // if pressed item was a custom item by the user, add it to the list of items (?)
      if (customItem !== false) {
        item.custom = false;
        setItems(state => [...state, item]);
      }

      // call onSelectItem() callback for item/s now selected after item press.
      // Not a reliable method for external value changes.
      if (multiple) {
        if (memoryRef.current.value?.includes(item[ITEM_SCHEMA.value])) {
          const index = memoryRef.current.items.findIndex(
            x => x[ITEM_SCHEMA.value] === item[ITEM_SCHEMA.value],
          );

          if (index > -1) {
            memoryRef.current.items.splice(index, 1);
            onSelectItem(memoryRef.current.items.slice());
          }
        } else {
          onSelectItem([...memoryRef.current.items, item]);
        }
      } else {
        onSelectItem(item);
      }

      setValue(state => {
        // call setValue() callback to change selected value/s after item press.
        if (multiple) {
          const newState = state === null || state === undefined ? [] : [...state];

          if (newState.includes(item[ITEM_SCHEMA.value])) {
            // if value already included, remove it if doing so wouldn't go under min number
            if (!Number.isInteger(min) || min < newState.length) {
              newState.splice(newState.indexOf(item[ITEM_SCHEMA.value]), 1);
            }
          } else if (!Number.isInteger(max) || max > newState.length) {
            // if value not already included, add it if doing so wouldn't go above max number
            newState.push(item[ITEM_SCHEMA.value]);
          }

          return newState;
        }

        return item[ITEM_SCHEMA.value]; // single-value picker
      });

      // adjust necessary items after item press.
      // if single-item picker, set necessary items with array whose only element is the item pressed.
      // if multi-item picker, if item in necessary items remove it or if not then add it, within min/max constraints
      setNecessaryItems(state => {
        if (multiple) {
          const newState = [...state];

          const itemIndex = newState.findIndex(
            x => x[ITEM_SCHEMA.value] === item[ITEM_SCHEMA.value],
          );

          if (itemIndex > -1) {
            // If pressed item already in necessary items, remove it if doing so doesn't go below min number of items
            if (!Number.isInteger(min) || min < newState.length) {
              newState.splice(itemIndex, 1);
            }
          } else if (!Number.isInteger(max) || max > newState.length) {
            // If pressed item not already in necessary items, add it if doing so doesn't go above max number of items
            newState.push(item);
          }

          return newState;
        }
        // if a single-item picker, set pressed item as array of only necessary item
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

    let Component;
    if (TickIconComponent !== null) Component = <TickIconComponent style={_tickIconStyle} />;
    else Component = <Image source={ICON.TICK} style={_tickIconStyle} />;

    return <View style={_tickIconContainerStyle}>{Component}</View>;
  }, [TickIconComponent, _tickIconStyle, _tickIconContainerStyle, showTickIcon, ICON.TICK]);

  /**
   * The renderItem component.
   * @returns {JSX.Element}
   */
  const RenderItemComponent = useMemo(
    () => (renderListItem !== null ? renderListItem : RenderListItem),
    [renderListItem],
  );

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

  /**
   * The disabled item container style.
   * @returns {object}
   */
  const _disabledItemContainerStyle = useMemo(
    () => disabledItemContainerStyle,
    [disabledItemContainerStyle],
  );

  /**
   * The disabled item label style.
   * @returns {object}
   */
  const _disabledItemLabelStyle = useMemo(
    () => disabledItemLabelStyle,
    [disabledItemLabelStyle],
  );

  /**
   * Set item position.
   * @param {string|number|boolean} value
   * @param {number} y
   */
  const setItemPosition = useCallback(
    (value, y) => {
      if (autoScroll && listMode === LIST_MODE.SCROLLVIEW) itemPositionsRef.current[value] = y;
    },
    [autoScroll, listMode],
  );

  /**
   * Render list item.
   * @returns {JSX.Element}
   */
  const __renderListItem = useCallback(
    ({ item }) => {
      let IconComponent = hideListItemsIcons ? null : item[ITEM_SCHEMA.icon] ?? null;

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
          label={item[ITEM_SCHEMA.label]}
          value={item[ITEM_SCHEMA.value]}
          parent={item?.[ITEM_SCHEMA.parent] ?? null}
          selectable={item?.[ITEM_SCHEMA.selectable] ?? null}
          disabled={item?.[ITEM_SCHEMA.disabled] ?? false}
          custom={item.custom ?? false}
          props={itemProps}
          labelProps={itemLabelProps}
          isSelected={isSelected}
          IconComponent={IconComponent}
          TickIconComponent={_TickIconComponent}
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
    text => {
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
    else Component = <Image source={ICON.CLOSE} style={_closeIconStyle} />;

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
                  style={{
                    paddingTop: moderateScale(5),
                    paddingBottom: searchable ? moderateScale(15) : 0,
                    ...modalTitleContainerStyle,
                  }}
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
    Component => (
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
            borderRadius: _dropDownContainerStyle.flat()[0].borderRadius,
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
          <Fragment key={item[_itemKey]}>
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
      default: //
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
  const onRef = useCallback(ref => {
    pickerRef.current = ref;
  }, []);

  /**
   * Pointer events.
   * @returns {string}
   */
  const pointerEvents = useMemo(() => (disabled ? 'none' : 'auto'), [disabled]);
  const [dimlabel, setDimLabel] = useState(false);

  const { backgroundColor: _bgC, ...touchOpacityStyle } = THEME.style;
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
          {...props}
          ref={onRef}
          pointerEvents={pointerEvents}
          disabled={disabled}
          testID={testID}
        >
          {_BodyComponent}
          {_ArrowComponent}
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

export default memo(Picker);
