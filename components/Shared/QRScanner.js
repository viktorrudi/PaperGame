import React, { useState, useEffect } from "react";
import { View, Text } from "react-native-ui-lib";
import { StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

import { useQRScanner } from "../../utils/hooks";

export default function QRScanner({ navigation, route }) {
  const { rerouteTo, qrKey } = route?.params || {};
  const { hasPermission, qrData, onScan, askForPermission } = useQRScanner();

  useEffect(() => {
    if (!hasPermission) askForPermission();
  }, []);

  useEffect(() => {
    if (qrData) {
      navigation.navigate(rerouteTo, { [qrKey]: qrData });
    }
  }, [qrData]);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {hasPermission ? (
        <BarCodeScanner
          onBarCodeScanned={onScan}
          style={StyleSheet.absoluteFillObject}
        />
      ) : (
        <Text center blue30 text40>
          Please allow us to use your camera. Very safe. No danger 🤔
        </Text>
      )}
    </View>
  );
}
