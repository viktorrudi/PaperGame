export function fetchRandomPeople(callback) {
  fetch('https://www.randomlists.com/data/people.json')
    .then((res) => res.json())
    .then(({ RandL }) => callback(RandL.items))
}
