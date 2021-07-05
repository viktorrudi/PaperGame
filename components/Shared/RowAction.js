import React from "react";
import { View, Button, Text } from "react-native-ui-lib";

export default function RowAction({
  title,
  subtitle,
  button,
  button2,
  disabled = false,
  disabled2 = false,
}) {
  return (
    <View
      marginT-20
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View>
        {title && <Text text50>{title}</Text>}
        {subtitle && <Text text80>{subtitle}</Text>}
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {button && (
          <Button
            bg-red30={button.red || false}
            text60
            disabled={disabled}
            label={button.label}
            onPress={button.action}
            style={button.style || {}}
          />
        )}
        {button2 && (
          <Button
            bg-red30={button2.red || false}
            text60
            style={{ marginLeft: 5 }}
            disabled={disabled2}
            label={button2.label}
            style={button2.style || {}}
            onPress={button2.action}
          />
        )}
      </View>
    </View>
  );
}
