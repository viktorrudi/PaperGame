import React, { Fragment, useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { ScrollView } from 'react-native'
import { View, Text, Button, TextField } from 'react-native-ui-lib'

import * as CONST from '../../constants'
import * as UTIL from '../../utils'
import * as API from '../../utils/api'

const emptyWordGroup = Array(5)
  .fill('')
  .reduce((txt, _, i) => {
    txt[i] = ''
    return txt
  }, {})

function parseWords(wordGroup) {
  return Object.values(wordGroup).filter((word) => word !== '')
}

function WordSetup({ navigation, dispatch, teams }) {
  const [isLastMember, setIsLastMember] = useState(false)
  const [currentMember, setCurrentMember] = useState({})
  const [memberQueue, setMemberQueue] = useState([])

  const [randomWords, setRandomWords] = useState([])
  const [wordGroup, setWordGroup] = useState(emptyWordGroup)
  const [allWords, setAllWords] = useState([])

  const [nextMember] = memberQueue
  const hasEmptyFields = Object.values(wordGroup).includes('')
  const hasDuplicates = checkHasDuplicates()

  useEffect(initializeMemberQueue, [])

  function initializeMemberQueue() {
    API.fetchRandomPeople(setRandomWords)
    if (teams.length > 0) {
      const allMembers = teams.flatMap((team) => team.members)
      const allExceptFirst = allMembers.slice(1, allMembers.length)
      const [firstMember] = allMembers

      setCurrentMember(firstMember)
      setMemberQueue(allExceptFirst)
      setWordGroup(emptyWordGroup)
    }
  }

  function checkHasDuplicates() {
    const everyWord = [
      ...Object.values(wordGroup),
      ...allWords.flatMap(({ words }) => words),
    ]
    return new Set(everyWord).size !== everyWord.length
  }

  function getAllWords() {
    return [
      ...allWords,
      {
        words: parseWords(wordGroup),
        owner: { teamID: currentMember.teamID, member: currentMember },
      },
    ]
  }

  function queueNextMember() {
    setWordGroup(emptyWordGroup)
    setIsLastMember(memberQueue.length === 1)
    setAllWords(getAllWords())

    const remainingMembers = memberQueue.slice(1, memberQueue.length)
    const [nextMember] = memberQueue
    setCurrentMember(nextMember)
    setMemberQueue(remainingMembers)
  }

  function addTextToWordGroup(wordIndex, text) {
    const updatedWords = { ...wordGroup }
    updatedWords[wordIndex] = text
    setWordGroup({ ...updatedWords })
  }

  function addRandomWord(wordIndex) {
    const text = UTIL.getRandomWord(randomWords)
    addTextToWordGroup(wordIndex, text)
  }

  function beginGame() {
    dispatch({
      type: CONST.ACTION.SAVE_WORDS,
      payload: getAllWords(),
    })
    navigation.navigate(CONST.ROUTE.GAME)
  }

  if (!currentMember) return null
  return (
    <ScrollView>
      <View flex>
        <View paddingH-20 paddingT-20>
          <Text text30 blue30 center>
            Hey {currentMember.name}, add 5 words!
          </Text>
          <View flex>
            {Object.entries(wordGroup).map(([wordIndex, word]) => (
              <Fragment key={wordIndex}>
                <TextField
                  text60
                  value={word}
                  style={{ flexGrow: 1 }}
                  placeholder={`Word #${parseInt(wordIndex) + 1}`}
                  onChangeText={(text) => addTextToWordGroup(wordIndex, text)}
                />
                <Button
                  size="small"
                  label="Get random word"
                  onPress={() => addRandomWord(wordIndex)}
                />
              </Fragment>
            ))}
          </View>
        </View>
        <Button
          style={{ borderRadius: 0 }}
          marginT-20
          text30
          label={
            isLastMember ? 'Begin game!' : `Continue to ${nextMember?.name}`
          }
          // disabled={hasEmptyFields || hasDuplicates}
          onPress={isLastMember ? beginGame : queueNextMember}
        />
      </View>
    </ScrollView>
  )
}

const mapStateToProps = (state) => ({
  teams: state.teams || [],
})

export default connect(mapStateToProps, (dispatch) => ({ dispatch }))(WordSetup)
