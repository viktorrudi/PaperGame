import React, { useState, useEffect } from "react";

import { ScrollView } from "react-native";
import { View, Text, Button, TextField } from "react-native-ui-lib";

import * as CONST from "../../constants";
import * as UTIL from "../../utils";
import * as API from "../../utils/api";
import { useFirebaseListener } from "../../utils/hooks";

export default function WordSetup({ navigation, route }) {
  const { lobbyID } = route.params;
  const [words, setWords] = useState([]);
  const [randomWords, setRandomWords] = useState([]);
  const { data: lobby = {} } = useFirebaseListener(
    `/lobbies/${lobbyID}`,
    "lobby"
  );

  const needsMoreWords = words.some((w) => w?.word === "");
  const availableWords = Object.values(lobby.game?.availableWords || {});

  useEffect(() => API.fetchRandomWords(setRandomWords), []);
  useEffect(() => {
    const usersWords = getUsersWords();
    setWords(usersWords.length > 0 ? usersWords : getNewEmptyWords());
  }, [lobby.rules?.minWords]);

  function getUsersWords() {
    if (!availableWords.length > 0) return [];
    const uid = API.getCurrentUserUID();
    const wordz = availableWords
      .filter((w) => w.author === uid)
      .slice(0, lobby.rules.minWords);
    return wordz;
  }

  function getNewEmptyWords() {
    if (!lobby.rules?.minWords) return [];
    let newWords = [];
    for (let i = 0; i < lobby.rules.minWords; i++) {
      newWords.push(CONST.DEFAULT_DB_PROPS.WORD());
    }
    return newWords;
  }

  function updateWords(wordID, word) {
    const updatedWords = words.map((wordDetails) => {
      if (wordID === wordDetails.id) return { ...wordDetails, word };
      return wordDetails;
    });
    setWords(updatedWords);
  }

  function addRandomWord(wordID) {
    const text = UTIL.getRandomWord(randomWords);
    updateWords(wordID, text);
  }

  async function handleSaveWords() {
    await API.saveWords(lobbyID, UTIL.normalizeIDs(words));
    navigation.navigate(CONST.ROUTE.LOBBY, { lobbyID });
  }

  return (
    <ScrollView>
      <View flex>
        <View paddingH-20>
          <Text text30 blue30 marginV-40 center>
            Add some words!
          </Text>
          <View>
            {words.map((wordDetails, i) => {
              return (
                <View
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "baseline",
                  }}
                >
                  <TextField
                    text60
                    value={wordDetails.word || ""}
                    style={{ width: "78%" }}
                    placeholder={`Word #${parseInt(i) + 1}`}
                    onChangeText={(text) => updateWords(wordDetails.id, text)}
                  />
                  <Button
                    size="small"
                    outline
                    style={{ flexGrow: 1, height: 30, marginLeft: 10 }}
                    label="R"
                    onPress={() => addRandomWord(wordDetails.id)}
                  />
                </View>
              );
            })}
          </View>
        </View>
        <Button
          marginV-20
          marginH-20
          text60
          label={needsMoreWords ? "Fill in all words" : "Save words"}
          onPress={handleSaveWords}
          disabled={needsMoreWords}
        />
      </View>
    </ScrollView>
  );
}
