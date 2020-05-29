import React, { Fragment, useState, useEffect } from 'react'
import { connect } from 'react-redux'

import { ScrollBar, View, Text, Button, TextField } from 'react-native-ui-lib'

import * as CONST from '../../constants'

function getRandomID() {
  return Math.floor(Math.random() * 10000)
}

function TeamSetup({ navigation, dispatch }) {
  const [teams, setTeams] = useState([])

  useEffect(addDefaultTeams, [])

  function addDefaultTeams() {
    setTeams([
      { id: 1, name: 'Team One', members: [{ id: 1, name: 'Doggo' }] },
      { id: 2, name: 'Team Two', members: [{ id: 1, name: 'Kocicka' }] },
    ])
  }

  function continueToNextScreen() {
    dispatch({
      type: CONST.ACTION.SAVE_TEAMS,
      payload: teams,
    })
    navigation.navigate(CONST.ROUTE.SETUP_WORDS)
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
        return team.members.map((member) => {
          if (member.id === targetMemberID) return { ...member, name: newName }
          return member
        })
      }
      return team
    })
    setTeams(updatedTeams)
  }

  function addTeam() {
    setTeams([
      ...teams,
      {
        id: getRandomID(),
        name: `New Team`,
        members: [{ id: getRandomID(), name: 'New Member' }],
      },
    ])
  }

  function addMember(targetTeamID) {
    const updatedTeams = teams.map((team) => {
      if (team.id === targetTeamID) {
        const newMember = { id: getRandomID(), name: `New Member` }
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

  return (
    <ScrollBar>
      <View paddingH-20 paddingT-40>
        {teams.map((team) => (
          <Fragment key={team.id}>
            <TextField
              text60
              placeholder={team.name}
              onChangeText={(newName) => updateTeam(team.id, newName)}
            />
            <Button label="Remove Team" onPress={() => removeTeam(team.id)} />
            <View marginL-20>
              {team.members.map((member) => (
                <Fragment key={member.id}>
                  <TextField
                    key={member.id}
                    placeholder={member.name}
                    onChangeText={(memberName) =>
                      updateMember(team.id, member.id, memberName)
                    }
                  />
                  <Button
                    size="small"
                    label="Remove member"
                    onPress={() => removeMember(team.id, member.id)}
                  />
                </Fragment>
              ))}
              <Button
                size="small"
                label="Add Member"
                onPress={() => addMember(team.id)}
              />
            </View>
          </Fragment>
        ))}
        <Button label="Add Team" onPress={addTeam} />
      </View>
      <View>
        <Button label="Continue" onPress={continueToNextScreen} />
      </View>
    </ScrollBar>
  )
}

const mapStateToProps = (state) => ({})
// const mapDispatchToProps = (dispatch) => ({
//   saveTeamsAction: (teams) => dispatch(saveTeams(teams)),
// })

export default connect(mapStateToProps, (dispatch) => ({ dispatch }))(TeamSetup)
