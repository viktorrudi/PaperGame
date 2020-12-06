import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import { ScrollView } from "react-native";
import { View, Text, Button, TextField } from "react-native-ui-lib";

import * as CONST from "../../constants";
import * as UTIL from "../../utils";
import * as API from "../../utils/api";

function nonEmptyWords(wordGroup) {
  return Object.values(wordGroup).filter((word) => word !== "");
}

function WordSetup({ navigation, dispatch, teams, gameSettings }) {
  const [isLastMember, setIsLastMember] = useState(false);
  const [currentMember, setCurrentMember] = useState({});
  const [memberQueue, setMemberQueue] = useState([]);

  const [randomWords, setRandomWords] = useState([]);
  const [wordGroup, setWordGroup] = useState({});
  const [allWords, setAllWords] = useState([]);

  const [nextMember] = memberQueue;
  const needsMoreWords =
    nonEmptyWords(wordGroup).length < gameSettings.minWords;

  let continueButtonLabel = "";
  if (!isLastMember) continueButtonLabel = `Continue to ${nextMember?.name}`;
  if (isLastMember) continueButtonLabel = "Begin Game!";
  if (needsMoreWords) continueButtonLabel = "You still need to add more words";

  useEffect(initializeMemberQueue, []);

  function initializeMemberQueue() {
    API.fetchRandomPeople(setRandomWords);
    if (teams.length > 0) {
      const allMembers = teams.flatMap((team) => team.members);
      const allExceptFirst = allMembers.slice(1, allMembers.length);
      const [firstMember] = allMembers;

      setCurrentMember(firstMember);
      setMemberQueue(allExceptFirst);
      setWordGroup(getEmptyWordGroup());
    }
  }

  function getEmptyWordGroup() {
    return Array(gameSettings.minWords)
      .fill("")
      .reduce((txt, _, i) => {
        txt[i] = "";
        return txt;
      }, {});
  }

  function getAllWords() {
    return [
      ...allWords,
      {
        words: nonEmptyWords(wordGroup),
        owner: { teamID: currentMember.teamID, member: currentMember },
      },
    ];
  }

  function queueNextMember() {
    setWordGroup(getEmptyWordGroup());
    setIsLastMember(memberQueue.length === 1);
    setAllWords(getAllWords());

    const remainingMembers = memberQueue.slice(1, memberQueue.length);
    const [nextMember] = memberQueue;
    setCurrentMember(nextMember);
    setMemberQueue(remainingMembers);
  }

  function addTextToWordGroup(wordIndex, text) {
    const updatedWords = { ...wordGroup };
    updatedWords[wordIndex] = text;
    setWordGroup({ ...updatedWords });
  }

  function addRandomWord(wordIndex) {
    const text = UTIL.getRandomWord(randomWords);
    addTextToWordGroup(wordIndex, text);
  }

  function beginGame() {
    dispatch({
      type: CONST.ACTION.SAVE_WORDS,
      payload: getAllWords(),
    });
    navigation.navigate(CONST.ROUTE.GAME);
  }

  if (!currentMember) return null;
  return (
    <ScrollView>
      <View flex>
        <View paddingH-20>
          <Text text30 blue30 marginV-40 center>
            Hey {currentMember.name}, add some words!
          </Text>
          <View>
            {Object.entries(wordGroup).map(([wordIndex, word]) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "baseline",
                }}
                key={wordIndex}
              >
                <TextField
                  text60
                  value={word}
                  style={{ width: "78%" }}
                  placeholder={`Word #${parseInt(wordIndex) + 1}`}
                  onChangeText={(text) => addTextToWordGroup(wordIndex, text)}
                />
                <Button
                  size="small"
                  outline
                  style={{ flexGrow: 1, height: 30, marginLeft: 10 }}
                  label="R"
                  onPress={() => addRandomWord(wordIndex)}
                />
              </View>
            ))}
          </View>
        </View>
        <Button
          marginV-20
          marginH-20
          text60
          label={continueButtonLabel}
          disabled={needsMoreWords}
          onPress={isLastMember ? beginGame : queueNextMember}
        />
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => ({
  teams: state.teams || [],
  gameSettings: state.gameSettings || [],
});

export default connect(mapStateToProps, (dispatch) => ({ dispatch }))(
  WordSetup
);
