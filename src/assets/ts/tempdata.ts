import { ref } from 'vue'
import type { BookableObject } from '@/types'

export const bookableObjectList = ref<BookableObject[]>([
  {
    id: 1,
    name: 'The Great Gatsby',
    image:
      'https://images.unsplash.com/photo-1711861413115-797ee0655214?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description:
      "The Great Gatsby is a novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    location: 'New York',
    tags: ['Fiction', 'Romance']
  },
  {
    id: 2,
    name: 'To Kill a Mockingbird',
    image:
      'https://images.unsplash.com/photo-1712135595180-f3902e325574?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description:
      'To Kill a Mockingbird is a novel by Harper Lee published in 1960. Instantly successful, the novel deals with the issues of racism that the author observed as a child in her hometown of Monroeville, Alabama. Through the eyes of the young narrator, Scout Finch, the reader learns about her father Atticus Finch, an attorney who hopelessly strives to prove the innocence of a black man unjustly accused of rape.',
    location: 'Alabama',
    tags: ['Fiction', 'Classic', 'Historical']
  },
  {
    id: 3,
    name: '1984',
    image:
      'https://images.unsplash.com/photo-1711834232076-684d4f7ba628?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description:
      '1984, by George Orwell, is a dystopian novel set in Airstrip One, formerly Great Britain, a province of the superstate Oceania in a world of perpetual war, omnipresent government surveillance, and public manipulation. The novel examines the consequences of totalitarianism, mass surveillance, and repressive regimentation of persons and behaviours within society.',
    location: 'Great Britain',
    tags: ['Fiction', 'Dystopian', 'Political']
  },
  {
    id: 4,
    name: 'Pride and Prejudice',
    image:
      'https://plus.unsplash.com/premium_photo-1671397272333-5807b32630f3?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description:
      'Pride and Prejudice is a romantic novel by Jane Austen, following the character development of Elizabeth Bennet, the dynamic protagonist, who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness. It is a novel of manners that explores the condition of women in the early 19th century England.',
    location: 'England',
    tags: ['Fiction', 'Romance', 'Classic']
  },
  {
    id: 5,
    name: 'The Catcher in the Rye',
    image:
      'https://images.unsplash.com/photo-1711539924968-81d3382a85d9?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description:
      'The Catcher in the Rye is a novel by J. D. Salinger, partially published in serial form in 1945–1946 and as a novel in 1951. A classic novel originally published for adults, it has since become popular with adolescent readers for its themes of angst and alienation, and as a critique on superficiality in society.',
    location: 'New York',
    tags: ['Fiction', 'Classic', 'Coming-of-Age']
  },
  {
    id: 6,
    name: 'Brave New World',
    image:
      'https://images.unsplash.com/photo-1712081024208-f04e1956d736?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description:
      'Brave New World is a dystopian novel by English author Aldous Huxley, written in 1931 and published in 1932. Set in a futuristic World State, inhabited by genetically modified citizens and an intelligence-based social hierarchy, the novel anticipates huge scientific advancements in reproductive technology, sleep-learning, psychological manipulation, and classical conditioning that are combined to make a utopian society.',
    location: 'Futuristic World State',
    tags: ['Fiction', 'Dystopian', 'Science Fiction']
  },
  {
    id: 7,
    name: 'Brave New World',
    image:
      'https://images.unsplash.com/photo-1712081024208-f04e1956d736?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description:
      'Brave New World is a dystopian novel by English author Aldous Huxley, written in 1931 and published in 1932. Set in a futuristic World State, inhabited by genetically modified citizens and an intelligence-based social hierarchy, the novel anticipates huge scientific advancements in reproductive technology, sleep-learning, psychological manipulation, and classical conditioning that are combined to make a utopian society.',
    location: 'Futuristic World State',
    tags: ['Fiction', 'Dystopian', 'Science Fiction']
  },
  {
    id: 8,
    name: 'Brave New World',
    image:
      'https://images.unsplash.com/photo-1712081024208-f04e1956d736?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description:
      'Brave New World is a dystopian novel by English author Aldous Huxley, written in 1931 and published in 1932. Set in a futuristic World State, inhabited by genetically modified citizens and an intelligence-based social hierarchy, the novel anticipates huge scientific advancements in reproductive technology, sleep-learning, psychological manipulation, and classical conditioning that are combined to make a utopian society.',
    location: 'Futuristic World State',
    tags: ['Fiction', 'Dystopian', 'Science Fiction']
  },
  {
    id: 9,
    name: 'Brave New World',
    image:
      'https://images.unsplash.com/photo-1712081024208-f04e1956d736?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description:
      'Brave New World is a dystopian novel by English author Aldous Huxley, written in 1931 and published in 1932. Set in a futuristic World State, inhabited by genetically modified citizens and an intelligence-based social hierarchy, the novel anticipates huge scientific advancements in reproductive technology, sleep-learning, psychological manipulation, and classical conditioning that are combined to make a utopian society.',
    location: 'Futuristic World State',
    tags: ['Fiction', 'Dystopian', 'Science Fiction']
  }
])
