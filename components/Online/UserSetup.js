import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import firebase from "firebase";
import {
  View,
  Button,
  TextField,
  ProgressiveImage,
  Text,
} from "react-native-ui-lib";
import { TouchableHighlight, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

import FullScreenLoader from "../FullScreenLoader";

import { DB, DB_TYPE, IMAGE, ROUTE } from "../../constants";
import * as API from "../../utils/api";
import * as UTIL from "../../utils";

function UserSetup({ navigation, userID }) {
  const [usernameField, setUsernameField] = useState("");
  const [imageURLField, setImageURLField] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    API.getCurrentUser().then(({ username, imageURL }) => {
      setUsernameField(username);
      setImageURLField(imageURL);
      setIsLoading(false);
    });
  }, []);

  async function handleUserImageRequest({ useCamera = false }) {
    const result = useCamera
      ? await ImagePicker.launchCameraAsync(IMAGE.OPTIONS)
      : await ImagePicker.launchImageLibraryAsync(IMAGE.OPTIONS);

    if (result.cancelled) return;
    await uploadImage(result.uri);
  }

  async function uploadImage(userPhotoURI) {
    try {
      const img = await ImageManipulator.manipulateAsync(
        userPhotoURI,
        [IMAGE.CONSTRAINTS.SIZE],
        IMAGE.CONSTRAINTS.FORMAT
      );
      const response = await fetch(img.uri);
      const blob = await response.blob();
      const uploadTask = API.uploadImage(userID, blob);

      uploadTask.on(
        "state_changed",
        () => {}, // change
        () => {}, // error
        // complete
        async () => {
          try {
            const imageURL = await uploadTask.snapshot.ref.getDownloadURL();
            setImageURLField(imageURL);
            await API.updateCurrentUser({
              username: usernameField,
              imageURL,
            });
          } catch (e) {
            setImageURLField("");
            console.error(e);
          }
        }
      );
    } catch (e) {
      console.error(e);
      UTIL.toast("Sorry, failed to upload your image");
    }
  }

  async function saveUser() {
    await API.updateCurrentUser({
      username: usernameField,
      imageURL: imageURLField,
    });
  }

  if (isLoading) return <FullScreenLoader />;

  return (
    <ScrollView style={{ margin: 30 }}>
      <View center marginB-40>
        <TouchableHighlight
          onPress={() => handleUserImageRequest({ useCamera: true })}
        >
          <ProgressiveImage
            style={{
              height: 300,
              width: 300,
              backgroundColor: "#68B7F1",
              borderRadius: 300,
            }}
            source={{ uri: imageURLField, cache: "reload" }}
          />
        </TouchableHighlight>
        <Button
          text60
          style={{ position: "absolute", bottom: 10 }}
          label="Pick from library"
          onPress={handleUserImageRequest}
        />
      </View>
      <TextField
        text60
        floatOnFocus
        style={{ width: "100%" }}
        placeholder="User Name"
        value={usernameField}
        onChangeText={setUsernameField}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          text60
          label="Find lobbies"
          onPress={async () => {
            await saveUser();
            navigation.navigate(ROUTE.JOIN_LOBBY);
          }}
        />
        <Button
          text60
          outline
          label="+ Create lobby"
          onPress={async () => {
            await saveUser();
            navigation.navigate(ROUTE.CREATE_LOBBY);
          }}
        />
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => ({
  userID: state.user.uid,
});

export default connect(mapStateToProps)(UserSetup);
