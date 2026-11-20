export type LearningResource = {
  id: string;
  title: string;
  kind: 'Article' | 'Video';
  topic: string;
  source: string;
  url: string;
  description: string;
  practice: string;
  challengeId: string;
};
export const resources: LearningResource[] = [
  {
    id: 'stand-up-writing',
    title: 'How to write stand up comedy',
    kind: 'Article',
    topic: 'Stand-up',
    source: 'BBC Maestro',
    url: 'https://www.bbcmaestro.com/blog/how-to-write-stand-up-comedy',
    description:
      'Explore how observations develop into a structured stand-up routine, from collecting ideas to refining a set.',
    practice:
      'Pick an everyday frustration. Write down what you expected, what actually happened, and one exaggerated alternative.',
    challengeId: '3',
  },
  {
    id: 'joke-writing',
    title: 'How to write a joke',
    kind: 'Article',
    topic: 'Writing',
    source: 'BBC Maestro',
    url: 'https://www.bbcmaestro.com/blog/how-to-write-a-joke',
    description:
      'An introduction to joke structure, surprise, and the relationship between a setup and its punchline.',
    practice:
      'Write one ordinary sentence. Give it three unexpected endings, then choose the shortest one that still makes sense.',
    challengeId: '32',
  },
  {
    id: 'improv-explained',
    title: 'Improv, explained',
    kind: 'Article',
    topic: 'Improv',
    source: 'University of Chicago',
    url: 'https://news.uchicago.edu/explainer/improv-explained',
    description:
      'Learn about unscripted theatre, its history, common games, and the ideas behind “Yes, and”.',
    practice:
      'Start an imaginary scene with a strange location. Add a character who wants something very ordinary.',
    challengeId: '17',
  },
  {
    id: 'improv-listening',
    title: 'Four Improv Techniques That Can Help You Communicate Better',
    kind: 'Article',
    topic: 'Improv',
    source: 'The Second City',
    url: 'https://www.secondcity.com/four-improv-techniques-that-can-help-you-communicate-better',
    description:
      'Discover how the habits of improvisation can inform listening, collaboration, and conversation.',
    practice:
      'Imagine a partner offers an unlikely idea. Write a response that accepts it and adds one new detail.',
    challengeId: '26',
  },
  {
    id: 'everyday-laughter',
    title: 'How to find laughter anywhere',
    kind: 'Video',
    topic: 'Observation',
    source: 'TED · Chris Duffy',
    url: 'https://www.ted.com/talks/chris_duffy_how_to_find_laughter_anywhere',
    description:
      'Comedian Chris Duffy explores finding humor through curiosity and a fresh view of everyday life.',
    practice:
      'Notice one ordinary object nearby. Imagine the most unexpected complaint it would make if it could talk.',
    challengeId: '5',
  },
  {
    id: 'comedy-on-stage',
    title: 'The funniest TED Talks',
    kind: 'Video',
    topic: 'Performance',
    source: 'TED · Video collection',
    url: 'https://www.ted.com/playlists/235/the_funniest_ted_talks',
    description:
      'A collection of talks that combine ideas with comedy. Explore different approaches to storytelling and delivery.',
    practice:
      'Watch a talk and notice one pause, gesture, or change in tone. Describe how it shapes the joke.',
    challengeId: '8',
  },
];
