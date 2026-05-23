import { JSX, memo } from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

interface PickerLabelProps {
  allowFontScaling?: boolean;
  indentWidth?: number;
  label: string;
  labelContainerStyle?: StyleProp<ViewStyle>;
  labelTextStyle?: StyleProp<TextStyle>;
  onLayout?: (e: LayoutChangeEvent) => void;
  transformY?: number;
}

function PickerLabel({
  allowFontScaling = false,
  indentWidth = 0,
  label,
  labelContainerStyle,
  labelTextStyle,
  onLayout,
  transformY = 0,
}: PickerLabelProps): JSX.Element {
  return (
    <View
      style={[
        styles.container,
        { transform: [{ translateY: transformY * -1 }, { translateX: indentWidth }] },
        labelContainerStyle,
      ]}
      onLayout={onLayout}
    >
      <Text style={[styles.label, labelTextStyle]} allowFontScaling={allowFontScaling}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 99999,
    width: '100%',
    paddingTop: moderateScale(1),
  },
  label: {
    paddingLeft: moderateScale(10),
    color: '#000',
    fontSize: moderateScale(11),
    textAlign: 'left',
  },
});

export default memo(PickerLabel);
