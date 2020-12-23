import React from "react";
import { View, Button, Text } from "react-native-ui-lib";

export default function RowAction({ title, subtitle, button }) {
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
      {button && (
        <Button
          bg-red30={button.red || false}
          text60
          label={button.label}
          onPress={button.action}
        />
      )}
    </View>
  );
}
