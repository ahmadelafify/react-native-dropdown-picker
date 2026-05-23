import { JSX, memo } from 'react';
import { StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';

interface ActivityIndicatorComponentProps {
  color: string;
  size: number;
}

interface ListEmptyProps {
  ActivityIndicatorComponent: (props: ActivityIndicatorComponentProps) => JSX.Element;
  allowFontScaling?: boolean;
  listMessageContainerStyle: StyleProp<ViewStyle>;
  listMessageTextStyle: StyleProp<TextStyle>;
  loading: boolean;
  message: string;
}

function ListEmpty({
  ActivityIndicatorComponent,
  allowFontScaling = false,
  listMessageContainerStyle,
  listMessageTextStyle,
  loading,
  message,
}: ListEmptyProps): JSX.Element {
  return (
    <View style={listMessageContainerStyle}>
      {loading ? (
        <ActivityIndicatorComponent color="#000" size={20} />
      ) : (
        <Text style={listMessageTextStyle} allowFontScaling={allowFontScaling}>
          {message}
        </Text>
      )}
    </View>
  );
}

export default memo(ListEmpty);
