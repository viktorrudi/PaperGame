export function shuffle(arr) {
  return arr.sort(() => 0.5 - Math.random());
}

export function capitalize(string) {
  if (typeof string !== "string") return string;
  return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}

export function getRandomWord(words) {
  if (words.length === 0) return "";
  const [randomWord] = shuffle(words);
  return randomWord;
}

export function getRandomID() {
  return Math.floor(Math.random() * 100000);
}

export function getWinner(teams) {
  let winner = {};
  Object.entries(teams).forEach(([team, score], i, allTeams) => {
    if (i === 0) {
      winner.team = team;
      winner.score = score;
    }
    if (i > 0) {
      const [_, prevTeamScore] = i > 0 ? allTeams[i - 1] : allTeams[0];
      if (prevTeamScore < score) {
        winner.team = team;
        winner.score = score;
      }
    }
  });
  return winner;
}

export function generateQueues(players) {
  const uniq = [...new Set(players.map(({ teamID }) => teamID))];
  let helper = {};
  uniq.forEach((teamID) => {
    helper[teamID] = players
      .filter((player) => player.teamID === teamID)
      .map((playerGroup) => playerGroup.id);
  });

  const helperArray = Object.entries(helper).map(([teamID, tempPlayerIDs]) => {
    return { teamID: parseInt(teamID), tempPlayerIDs };
  });

  const duplicates = [...helperArray, ...helperArray];
  let members = duplicates.map((team, i) => {
    if (i < duplicates.length / 2) {
      const playerID = team.tempPlayerIDs[0];
      return {
        ...team,
        id: playerID,
        name: players.find((p) => p.id === playerID).name,
      };
    }
    const playerID = team.tempPlayerIDs[1];
    return {
      ...team,
      id: playerID,
      name: players.find((p) => p.id === playerID).name,
    };
  });
  members.forEach((member) => delete member.tempPlayerIDs);
  return members;
}

export function normalizeIDs(arr, idKey) {
  return arr.reduce(
    (allItems, item) => ({
      ...allItems,
      [idKey || item.id || Math.floor(Math.random()) * 100000]: item,
    }),
    {}
  );
}

export function randomTeamName() {
  const names = ["Team A", "Team B", "Team C", "Team D", "Team E"];
  return names[Math.floor(Math.random() * names.length)];
}
