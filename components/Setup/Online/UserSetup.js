import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { View, Button, TextField, ProgressiveImage } from "react-native-ui-lib";
import { TouchableHighlight, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

import { DB, DB_TYPE, IMAGE } from "../../../constants";
import * as API from "../../../utils/api";

function UserSetup({ navigation }) {
  const user = firebase.auth().currentUser;
  const [userName, setUserName] = useState(user.displayName || "");
  const [imageURL, setImageURL] = useState(user.photoURL || "");

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

      const uploadTask = API.db(DB.USER_IMAGES, DB_TYPE.STORAGE, user.key).put(
        blob
      );

      uploadTask.on(
        "state_changed",
        () => {}, // change
        () => {}, // error
        // complete
        async () =>
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then(setImageURL)
            .catch((e) => setImageURL(""))
      );
    } catch (e) {
      alert("uploadImage", e.message);
    }
  }

  async function continueToLobbySearch() {
    await API.updateCurrentUser({
      displayName: userName,
      photoURL: imageURL,
    });
    // navigation.navigate()
  }

  return (
    <ScrollView style={{ margin: 30 }}>
      <View center marginB-40>
        <TouchableHighlight
          onPress={() => handleUserImageRequest({ useCamera: true })}
        >
          <ProgressiveImage
            style={{ height: 300, width: 300 }}
            source={{ uri: imageURL, cache: "reload" }}
          />
        </TouchableHighlight>
        <Button
          text60
          label="Pick from Library"
          onPress={handleUserImageRequest}
        />
      </View>
      <TextField
        text60
        floatOnFocus
        style={{ width: "100%" }}
        placeholder="User Name"
        value={userName}
        onChangeText={setUserName}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button text60 label="Find lobbies" onPress={continueToLobbySearch} />
        <Button
          text60
          outline
          label="+ Create lobby"
          onPress={continueToLobbySearch}
        />
      </View>
    </ScrollView>
  );
}

export default UserSetup;
