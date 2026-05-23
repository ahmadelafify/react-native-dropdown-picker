import { JSX, memo } from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

interface PickerArrowProps {
  ArrowDownIconComponent: ((props: { style: StyleProp<ViewStyle> }) => JSX.Element) | null;
  ArrowUpIconComponent: ((props: { style: StyleProp<ViewStyle> }) => JSX.Element) | null;
  arrowDownIconSource: ImageSourcePropType;
  arrowIconContainerStyle: StyleProp<ViewStyle>;
  arrowIconStyle: StyleProp<ViewStyle>;
  arrowUpIconSource: ImageSourcePropType;
  open: boolean;
  showArrowIcon: boolean;
}

function PickerArrow({
  ArrowDownIconComponent,
  ArrowUpIconComponent,
  arrowDownIconSource,
  arrowIconContainerStyle,
  arrowIconStyle,
  arrowUpIconSource,
  open,
  showArrowIcon,
}: PickerArrowProps): JSX.Element | null {
  if (!showArrowIcon) return null;

  let icon: JSX.Element;
  if (open && ArrowUpIconComponent !== null) {
    icon = <ArrowUpIconComponent style={arrowIconStyle} />;
  } else if (!open && ArrowDownIconComponent !== null) {
    icon = <ArrowDownIconComponent style={arrowIconStyle} />;
  } else {
    icon = (
      <Image
        source={open ? arrowUpIconSource : arrowDownIconSource}
        style={arrowIconStyle as StyleProp<ImageStyle>}
      />
    );
  }

  return <View style={arrowIconContainerStyle}>{icon}</View>;
}

export default memo(PickerArrow);
