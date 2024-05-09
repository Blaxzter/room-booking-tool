export const bookableObjectRandoms = ['Rooms', 'Objects', 'Spaces', 'Anything']
export const bookableObjectRandomsLower = ['rooms', 'objects', 'spaces', 'anything']

const exampleGroupNames: string[] = [
  'Power Rangers',
  'Die Fantastischen Vier',
  'Die Ärzte',
  'Scorpions',
  'Simpsons',
  'Die drei ???',
  'Backstreet Boys',
  "Destiny's Child",
  'Nirvana',
  'The Beatles',
  'ABBA',
  'Queen'
]

export const randomGroupName = (): string => {
  return exampleGroupNames[Math.floor(Math.random() * exampleGroupNames.length)]
}
