// These will be deprecated - use the composable
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

export const randomBookableObjectList: {
  name: string
  description: string
}[] = [
  {
    name: 'Unicorn Ride',
    description: 'Experience a magical journey through enchanted forests on a majestic unicorn.'
  },
  {
    name: 'Time Travel Session',
    description: 'Book a trip to the past or future with our state-of-the-art time machines.'
  },
  {
    name: 'Giant Bubble Soccer',
    description: 'Enjoy a hilarious game of soccer while encased in a giant inflatable bubble.'
  },
  {
    name: 'Gourmet Pizza Class',
    description: 'Learn to make gourmet pizzas with a world-renowned chef in a fun, interactive class.'
  },
  {
    name: 'Skydiving Lesson',
    description: 'Take the leap and learn how to skydive with our experienced instructors.'
  },
  {
    name: 'VR Space Adventure',
    description: 'Explore distant galaxies and battle aliens in this thrilling virtual reality experience.'
  },
  {
    name: 'Underwater Yoga',
    description: 'Relax and rejuvenate with a serene yoga session beneath the waves.'
  },
  {
    name: 'Dragon Training',
    description: 'Train a friendly dragon and embark on epic adventures together.'
  },
  {
    name: 'Chocolate Tasting Tour',
    description: 'Indulge in a decadent tour of the finest chocolate shops and factories.'
  },
  {
    name: 'Mystery Room Escape',
    description: 'Solve puzzles and find clues to escape from a thrilling mystery room.'
  }
]

export const randomBookableObject = (): {
  name: string
  description: string
} => {
  return randomBookableObjectList[Math.floor(Math.random() * randomBookableObjectList.length)]
}

export const randomEmail = (): string => {
  return exampleEmails[Math.floor(Math.random() * exampleEmails.length)]
}
