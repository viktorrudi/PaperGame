import React, { Fragment, useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { View, Text, Button, TextField } from 'react-native-ui-lib'

import * as CONST from '../../constants'

const emptyWordGroup = Array(5)
  .fill('')
  .reduce((txt, _, i) => {
    txt[i] = ''
    return txt
  }, {})

function parseWords(wordGroup) {
  return Object.values(wordGroup).filter((word) => word !== '')
}

function WordSetup({ navigator, dispatch, teams }) {
  const [isLastMember, setIsLastMember] = useState(false)
  const [currentMember, setCurrentMember] = useState({})
  const [memberQueue, setMemberQueue] = useState([])

  const [wordGroup, setWordGroup] = useState(emptyWordGroup)
  const [allWords, setAllWords] = useState([])
  console.log('all words: ', allWords)
  const [nextMember] = memberQueue

  useEffect(initializeMemberQueue, [])
  useEffect(onMemberChange, [currentMember])

  function initializeMemberQueue() {
    if (teams.length > 0) {
      const allMembers = teams.flatMap((team) => team.members)
      const allExceptFirst = allMembers.slice(1, allMembers.length)
      const [firstMember] = allMembers

      setCurrentMember(firstMember)
      setMemberQueue(allExceptFirst)
    }
  }

  function onMemberChange() {
    setAllWords([...allWords, ...parseWords(wordGroup)])
    setWordGroup(emptyWordGroup)
  }

  function queueNextMember() {
    setIsLastMember(memberQueue.length === 1)

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

  function continueToNextScreen() {
    // Send this:
    // [...allWords, ...parseWords(wordGroup)]
  }

  if (!currentMember) return null
  return (
    <View paddingH-20 paddingT-40>
      <Text text30 blue30 center>
        Hey {currentMember.name}, add some words!
      </Text>
      <View marginT-40>
        {Object.entries(wordGroup).map(([wordIndex, word]) => (
          <TextField
            key={wordIndex}
            value={word}
            text60
            placeholder={`Word #${parseInt(wordIndex) + 1}`}
            onChangeText={(text) => addTextToWordGroup(wordIndex, text)}
          />
        ))}
      </View>
      <Button
        label={isLastMember ? 'Begin game!' : `Continue to ${nextMember?.name}`}
        onPress={isLastMember ? continueToNextScreen : queueNextMember}
      />
    </View>
  )
}

const mapStateToProps = (state) => ({
  teams: state.teams || [],
})

export default connect(mapStateToProps, (dispatch) => ({ dispatch }))(WordSetup)
