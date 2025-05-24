import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const PickerLabel = ({
  label,
  onLayout,
  labelTextStyle,
  labelContainerStyle,
  transformY = 0,
  indentWidth = 0,
  allowFontScaling = false,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          transform: [{ translateY: transformY * -1 }, { translateX: indentWidth }],
        },
        labelContainerStyle,
      ]}
      onLayout={onLayout}
    >
      <Text style={[styles.label, labelTextStyle]} allowFontScaling={allowFontScaling}>
        {label}
      </Text>
    </View>
  );
};

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

export default PickerLabel;
