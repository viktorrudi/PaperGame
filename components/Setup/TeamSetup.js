import React, { Fragment, useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { ScrollView } from 'react-native'
import { View, Button, TextField } from 'react-native-ui-lib'

import * as CONST from '../../constants'
import * as UTIL from '../../utils'

function TeamSetup({ navigation, dispatch }) {
  const [teams, setTeams] = useState([])

  useEffect(addDefaultTeams, [])

  function addDefaultTeams() {
    setTeams(CONST.DEFAULT.TEAMS)
  }

  function updateTeam(targetTeamID, newName) {
    const updatedTeams = teams.map((team) => {
      if (team.id === targetTeamID) return { ...team, name: newName }
      return team
    })
    setTeams(updatedTeams)
  }

  function updateMember(targetTeamID, targetMemberID, newName) {
    const updatedTeams = teams.map((team) => {
      if (team.id === targetTeamID) {
        const updatedMembers = team.members.map((member) => {
          if (member.id === targetMemberID) return { ...member, name: newName }
          return member
        })
        return { ...team, members: updatedMembers }
      }
      return team
    })
    setTeams(updatedTeams)
  }

  function addTeam() {
    setTeams([
      ...teams,
      {
        id: UTIL.getRandomID(),
        name: `New Team`,
        members: [
          { id: UTIL.getRandomID(), name: 'New Member' },
          { id: UTIL.getRandomID(), name: 'New Member' },
        ],
      },
    ])
  }

  function addMember(targetTeamID) {
    const updatedTeams = teams.map((team) => {
      if (team.id === targetTeamID) {
        const newMember = {
          id: UTIL.getRandomID(),
          name: 'New Member',
          teamID: team.id,
        }
        return { ...team, members: [...team.members, newMember] }
      }
      return team
    })
    setTeams(updatedTeams)
  }

  function removeTeam(targetTeamID) {
    const updatedTeams = teams.filter((team) => team.id !== targetTeamID)
    setTeams(updatedTeams)
  }

  function removeMember(targetTeamID, targetMemberID) {
    const updatedTeams = teams.map((team) => {
      if (team.id === targetTeamID) {
        return {
          ...team,
          members: team.members.filter(
            (member) => member.id !== targetMemberID
          ),
        }
      }
      return team
    })
    setTeams(updatedTeams)
  }

  function continueToWordSetup() {
    dispatch({
      type: CONST.ACTION.SAVE_TEAMS,
      payload: teams.map((team) => ({ ...team, ...CONST.DEFAULT.TEAM_PROPS })),
    })
    navigation.navigate(CONST.ROUTE.SETUP_WORDS)
  }

  return (
    <ScrollView>
      <View paddingH-20>
        {teams.map((team) => (
          <View marginT-30 key={team.id}>
            <TextField
              text60
              placeholder={team.name}
              onChangeText={(newName) => updateTeam(team.id, newName)}
            />
            <Button label="Remove Team" onPress={() => removeTeam(team.id)} />
            <View marginL-20>
              {team.members.map((member) => (
                <View marginT-20 key={member.id}>
                  <TextField
                    key={member.id}
                    placeholder={member.name}
                    onChangeText={(memberName) =>
                      updateMember(team.id, member.id, memberName)
                    }
                  />
                  <Button
                    marginB-20
                    size="small"
                    label="Remove member"
                    onPress={() => removeMember(team.id, member.id)}
                  />
                </View>
              ))}
              <Button
                size="small"
                label="Add Member"
                onPress={() => addMember(team.id)}
              />
            </View>
          </View>
        ))}
        <Button label="Add Team" onPress={addTeam} />
      </View>
      <View>
        <Button
          style={{ borderRadius: 0 }}
          marginT-20
          text30
          label="Continue"
          onPress={continueToWordSetup}
        />
      </View>
    </ScrollView>
  )
}

export default connect(null, (dispatch) => ({ dispatch }))(TeamSetup)
