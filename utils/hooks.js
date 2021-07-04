import React, { useLayoutEffect, useEffect, useState, useRef } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { HeaderBackButton } from "@react-navigation/stack";
import firebase from "firebase";

export function useFirebaseListener(refTarget, refName) {
  const prevTarget = usePrevious(refTarget);
  const [target, setTarget] = useState(refTarget);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});

  function onSnapshot(snapshot) {
    const val = snapshot.val();
    setData(val || {});
    setError(val ? null : { message: `Could not find ${refName}` });
    setIsLoading(false);
  }

  useEffect(() => {
    if (prevTarget !== target) setIsLoading(true);
    const ref = firebase.database().ref(target);
    ref.on("value", onSnapshot);
    return () => ref.off("value", onSnapshot);
  }, [target]);

  return { data, error, isLoading, target, setTarget };
}

export function useQRScanner() {
  const [hasPermission, setHasPermission] = useState(false);
  const [shouldAskForPermission, setShouldAskForPermission] = useState(false);
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    (async () => {
      if (shouldAskForPermission && !hasPermission) {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === "granted");
        setShouldAskForPermission(false);
      }
    })();
  }, [shouldAskForPermission, hasPermission]);

  const onScan = ({ data }) => setQrData(data);
  return {
    hasPermission,
    askForPermission: () => setShouldAskForPermission(true),
    qrData,
    onScan,
  };
}

export function useHeaderRouting({ navigation, onBack, onForward }, deps = []) {
  useLayoutEffect(() => {
    navigation.setOptions({
      ...(onBack
        ? {
            headerLeft: (props) => (
              <HeaderBackButton {...props} onPress={onBack} />
            ),
          }
        : {}),
      ...(onForward
        ? {
            headerRight: (props) => (
              <HeaderBackButton {...props} onPress={onForward} />
            ),
          }
        : {}),
    });
  }, [navigation, onBack, onForward, ...deps]);
}

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
