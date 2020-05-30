export function shuffle(arr) {
  return arr.sort(() => 0.5 - Math.random())
}

export function getRandomWord(words) {
  if (words.length === 0) return
  const randomWord = shuffle(words)[0]
  return randomWord
}

export function getMemberTeamName(teams, targetTeamID) {
  return teams.find((team) => team.id === targetTeamID).name
}

export function getRandomID() {
  return Math.floor(Math.random() * 10000)
}

export function generateQueues(players) {
  console.log({ players })
  const uniq = [...new Set(players.map(({ teamID }) => teamID))]
  let helper = {}
  uniq.forEach((teamID) => {
    helper[teamID] = players
      .filter((player) => player.teamID === teamID)
      .map((playerGroup) => playerGroup.id)
  })

  return Object.entries(helper).map(([teamID, playerIDs]) => {
    return { teamID: parseInt(teamID), playerIDs }
  })
}
