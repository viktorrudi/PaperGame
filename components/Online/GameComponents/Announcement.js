import React from "react";

import { View, Text, Button } from "react-native-ui-lib";

export default function Announcement({
  heading,
  subheading,
  text,
  action = {},
}) {
  return (
    <View flex marginT-100 marginH-30>
      {heading ? (
        <Text center text40 marginB-10>
          {heading}
        </Text>
      ) : null}
      {subheading ? (
        <Text center text20 blue30>
          {subheading}
        </Text>
      ) : null}
      {text ? (
        <Text center marginB-30>
          {text}
        </Text>
      ) : null}
      {action ? (
        <View flex>
          <Button
            text60
            marginB-10
            label={action.label}
            onPress={action.onClick}
          />
        </View>
      ) : null}
    </View>
  );
}