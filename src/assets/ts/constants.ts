export const bookableObjectRandomsSingular = ['Room', 'Object', 'Space', 'Anything']
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

const exampleEmails: string[] = [
  'alice@wonder.land',
  'bob@canwebuild.it',
  'charlie@golden.ticket',
  'dora@map.quest',
  'eddie@pasta.love',
  'fiona@fairy.tales',
  'gary@grump.corp',
  'hannah@fruit.bowl',
  'ivan@brainstorm.club',
  'judy@word.play',
  'karl@sunny.days',
  'lilly@flower.power',
  'mike@awesome.sauce',
  'nina@cool.cat',
  'oliver@tasty.bites',
  'peter@pan.adventure',
  'quincy@quirky.mail',
  'rachel@rain.bow',
  'steve@universe.explorer',
  'tina@tiny.travels',
  'ursula@ocean.wave',
  'victor@victory.royale',
  'wanda@magic.spell',
  'xander@xtra.fun',
  'yara@yo.yo',
  'zeke@zippy.dude'
]

export const randomEmail = (): string => {
  return exampleEmails[Math.floor(Math.random() * exampleEmails.length)]
}
