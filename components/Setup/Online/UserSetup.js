import React, { useCallback, useState, useEffect } from "react";
import { connect } from "react-redux";
import firebase from "firebase";
import { View, Button, TextField, ProgressiveImage } from "react-native-ui-lib";
import { TouchableHighlight, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";

import * as CONST from "../../../constants";
import * as UTIL from "../../../utils";

const imageOptions = {
  quality: 0.5,
  allowsEditing: true,
  aspect: [1, 1],
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
};

function UserSetup({ navigation, user, dispatch }) {
  const [userName, setUserName] = useState("");
  const [imageURL, setImageURL] = useState("");

  const imageStorage = firebase
    .storage()
    .ref("user_images")
    .child(user.user.uid);

  // Initially set previously stored image
  useEffect(() => updateImage(imageStorage), []);

  function updateImage(storageRef) {
    storageRef
      .getDownloadURL()
      .then(setImageURL)
      .catch((e) => setImageURL(""));
  }

  async function handleImagePress() {
    const result = await ImagePicker.launchCameraAsync(imageOptions);
    if (!result.cancelled) {
      await uploadImage(result.uri);
    }
  }

  async function uploadImage(blobURI) {
    try {
      const response = await fetch(blobURI);
      const blob = await response.blob();

      const uploadTask = imageStorage.put(blob);
      uploadTask.on(
        "state_changed",
        () => {}, // change
        () => {}, // error
        // complete
        async () => updateImage(uploadTask.snapshot.ref)
      );
    } catch (e) {
      alert(e.message);
    }
  }

  /**
   * Store username and image url.
   */
  async function storeUserData() {
    try {
      firebase
        .database()
        .ref("user_details")
        // Replace if user already has details in database
        .set({
          [user.user.uid]: {
            email: user.user.email,
            uid: user.user.uid,
            userName,
            imageURL,
          },
        });
    } catch (e) {
      alert(e.message);
    }
  }

  function continueToLobbySearch() {
    storeUserData();
    // navigation.navigate()
  }

  return (
    <ScrollView style={{ margin: 30 }}>
      <View center marginB-40>
        <TouchableHighlight onPress={handleImagePress}>
          <ProgressiveImage
            style={{ height: 300, width: 300 }}
            source={{ uri: imageURL, cache: "reload" }}
          />
        </TouchableHighlight>
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

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, (dispatch) => ({ dispatch }))(
  UserSetup
);
