import React, { memo } from 'react';

import { Text, View } from 'react-native';

function ListEmpty({
  loading,
  message,
  ActivityIndicatorComponent,
  listMessageContainerStyle,
  listMessageTextStyle,
  allowFontScaling = false,
}) {
  return (
    <View style={listMessageContainerStyle}>
      {loading ? (
        <ActivityIndicatorComponent />
      ) : (
        <Text style={listMessageTextStyle} allowFontScaling={allowFontScaling}>
          {message}
        </Text>
      )}
    </View>
  );
}

export default memo(ListEmpty);
