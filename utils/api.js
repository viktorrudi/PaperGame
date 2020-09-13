import { capitalize } from './index'

export function fetchRandomPeople(callback) {
  const dataSets = ['things.json', 'people.json', 'animals.json']
  Promise.all(
    dataSets.map((url) => fetch(`https://www.randomlists.com/data/${url}`))
  )
    .then((res) => Promise.all(res.map((r) => r.json())))
    .then((data) => {
      callback(
        data.flatMap(({ RandL }) =>
          RandL.items.map((word) => {
            return capitalize(word)
          })
        )
      )
    })
}
