import { I18nManager, StyleProp, ViewStyle } from 'react-native';

export const SCHEMA = {
  label: 'label',
  value: 'value',
  icon: 'icon',
  parent: 'parent',
  selectable: 'selectable',
  disabled: 'disabled',
  testID: 'testID',
  containerStyle: 'containerStyle',
  labelStyle: 'labelStyle',
} as const;

export type SchemaKey = keyof typeof SCHEMA;
export type SchemaMap = Record<SchemaKey, string>;

export type ListModeType = 'FLATLIST' | 'SCROLLVIEW' | 'MODAL';

export const LIST_MODE: { DEFAULT: ListModeType; FLATLIST: ListModeType; SCROLLVIEW: ListModeType; MODAL: ListModeType } = {
  DEFAULT: 'FLATLIST',
  FLATLIST: 'FLATLIST',
  SCROLLVIEW: 'SCROLLVIEW',
  MODAL: 'MODAL',
};

export type DropDownDirectionType = 'TOP' | 'BOTTOM' | 'AUTO';

export const DROPDOWN_DIRECTION: { DEFAULT: DropDownDirectionType; TOP: DropDownDirectionType; BOTTOM: DropDownDirectionType; AUTO: DropDownDirectionType } = {
  DEFAULT: 'AUTO',
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
  AUTO: 'AUTO',
};
export type ResolvedDropDownDirection = 'top' | 'bottom';

export const GET_DROPDOWN_DIRECTION = (
  direction: DropDownDirectionType,
): ResolvedDropDownDirection => {
  switch (direction) {
    case 'AUTO':
      return 'top';
    case 'TOP':
      return 'bottom';
    case 'BOTTOM':
      return 'top';
    default:
      return 'top';
  }
};

const STYLE_DIRECTION_KEYS = {
  marginStart: 'marginRight',
  marginEnd: 'marginLeft',
  paddingStart: 'paddingRight',
  paddingEnd: 'paddingLeft',
  marginLeft: 'marginRight',
  marginRight: 'marginLeft',
  paddingLeft: 'paddingRight',
  paddingRight: 'paddingLeft',
} as const satisfies Record<string, keyof ViewStyle>;

type StyleObject = { [key: string]: unknown; flexDirection?: ViewStyle['flexDirection'] };

export const RTL_DIRECTION = (rtl: boolean, style: StyleProp<ViewStyle>): ViewStyle => {
  const newStyle: StyleObject = { ...(style as StyleObject) };

  if (rtl && !I18nManager.isRTL) {
    if (Object.prototype.hasOwnProperty.call(newStyle, 'flexDirection')) {
      newStyle.flexDirection = newStyle.flexDirection === 'row' ? 'row-reverse' : 'row';
    } else {
      newStyle.flexDirection = 'row-reverse';
    }
  }

  return newStyle as ViewStyle;
};

export const RTL_STYLE = (rtl: boolean, style: StyleProp<ViewStyle>): ViewStyle => {
  const newStyle = { ...(style as StyleObject) };

  if (rtl && !I18nManager.isRTL) {
    for (const key of Object.keys(newStyle)) {
      if (Object.prototype.hasOwnProperty.call(STYLE_DIRECTION_KEYS, key)) {
        const target = STYLE_DIRECTION_KEYS[key as keyof typeof STYLE_DIRECTION_KEYS];
        newStyle[target] = newStyle[key];
        delete newStyle[key];
      }
    }
  }

  return newStyle as ViewStyle;
};

export const ASCII_CODE = (str: string): number => {
  let chr = 0;

  if (str.length === 0) return chr;

  for (let i = 0; i < str.length; i++) chr += str.charCodeAt(i);

  return chr;
};
