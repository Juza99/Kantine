import type { QuestionDef } from '../types/room'

// Dry, adult-humor prompts for the "That's You" round. {name} in a `guess`
// prompt is replaced with the subject's name at send-time.
export const QUESTION_BANK: QuestionDef[] = [
  {
    id: 'vote-crack-first',
    type: 'vote',
    prompt: {
      nl: 'Wie zou het eerst instorten tijdens een spelletjesavond?',
      en: 'Who would crack first during a game night?',
    },
  },
  {
    id: 'vote-lecture',
    type: 'vote',
    prompt: {
      nl: 'Wie geeft een preek over iets waar ze zelf geen verstand van hebben?',
      en: "Who'd lecture you about something they know nothing about?",
    },
  },
  {
    id: 'vote-frugal-funeral',
    type: 'vote',
    prompt: {
      nl: 'Wie neemt hun eigen broodtrommel mee naar hun eigen begrafenis?',
      en: 'Who would bring their own packed lunch to their own funeral?',
    },
  },
  {
    id: 'vote-interview-yes',
    type: 'vote',
    prompt: {
      nl: 'Wie zegt "ja, zeker" op elke sollicitatievraag, ongeacht of het klopt?',
      en: "Who'd say \"yes, absolutely\" to every job interview question, true or not?",
    },
  },
  {
    id: 'vote-fake-recognize',
    type: 'vote',
    prompt: {
      nl: 'Wie doet het langst alsof ze een vreemde op straat herkennen?',
      en: 'Who would fake recognizing a stranger on the street the longest?',
    },
  },
  {
    id: 'vote-fishing-compliment',
    type: 'vote',
    prompt: {
      nl: 'Wie geeft een compliment puur om er zelf beter uit te zien?',
      en: "Who'd give a compliment purely to make themselves look good?",
    },
  },
  {
    id: 'vote-emergency-google',
    type: 'vote',
    prompt: {
      nl: 'Wie belt 112 voor iets wat prima met Google op te lossen was?',
      en: 'Who would call emergency services for something Google could fix?',
    },
  },
  {
    id: 'vote-never-wrong',
    type: 'vote',
    prompt: {
      nl: 'Wie geeft als laatste toe dat ze fout zaten, zelfs met bewijs erbij?',
      en: "Who'd be the last to admit they were wrong, even with proof on the table?",
    },
  },
  {
    id: 'guess-desert-island',
    type: 'guess',
    prompt: {
      nl: 'Wat zou {name} het eerst opgeven op een onbewoond eiland?',
      en: 'What would {name} give up first on a deserted island?',
    },
    options: [
      { nl: 'Koffie', en: 'Coffee' },
      { nl: 'Social media', en: 'Social media' },
      { nl: 'Hun gevoel voor humor', en: 'Their sense of humor' },
      { nl: 'Persoonlijke hygiëne', en: 'Personal hygiene' },
    ],
  },
  {
    id: 'guess-guilty-pleasure',
    type: 'guess',
    prompt: {
      nl: 'Wat is {name}\'s stiekeme guilty pleasure?',
      en: "What is {name}'s secret guilty pleasure?",
    },
    options: [
      { nl: 'Trash-tv kijken', en: 'Watching trash TV' },
      { nl: 'Fastfood om middernacht', en: 'Midnight fast food' },
      { nl: 'Stalken op social media', en: 'Social media stalking' },
      { nl: 'Onder de douche keihard meezingen', en: 'Belting songs in the shower' },
    ],
  },
  {
    id: 'guess-first-date-lie',
    type: 'guess',
    prompt: {
      nl: 'Waarover zou {name} het eerst liegen op een eerste date?',
      en: 'What would {name} lie about first on a first date?',
    },
    options: [
      { nl: 'Hun salaris', en: 'Their salary' },
      { nl: 'Hoe vaak ze sporten', en: 'How often they work out' },
      { nl: 'Hun leeftijd', en: 'Their age' },
      { nl: 'Hun ex', en: 'Their ex' },
    ],
  },
  {
    id: 'guess-late-excuse',
    type: 'guess',
    prompt: {
      nl: 'Wat zou {name}\'s excuus zijn als ze te laat komen?',
      en: "What would {name}'s excuse be for being late?",
    },
    options: [
      { nl: 'De trein', en: 'The train' },
      { nl: 'Hun wekker', en: 'Their alarm' },
      { nl: 'Een "noodgeval"', en: 'A "family emergency"' },
      { nl: 'Verkeer', en: 'Traffic' },
    ],
  },
  {
    id: 'guess-lottery',
    type: 'guess',
    prompt: {
      nl: 'Wat zou {name} als eerste kopen als ze de loterij winnen?',
      en: 'What would {name} buy first if they won the lottery?',
    },
    options: [
      { nl: 'Een te dure auto', en: 'A way too expensive car' },
      { nl: 'Een huis met een hottub', en: 'A house with a hot tub' },
      { nl: 'Niks, alles beleggen', en: 'Nothing, invest it all' },
      { nl: 'Een rond voor iedereen hier', en: 'A round of drinks for everyone here' },
    ],
  },
  {
    id: 'photo-meeting-face',
    type: 'photo',
    prompt: {
      nl: 'Maak een selfie van je "ik luister aandachtig in een vergadering" gezicht.',
      en: 'Take a selfie of your "I\'m paying attention in this meeting" face.',
    },
  },
  {
    id: 'photo-random-object',
    type: 'photo',
    prompt: {
      nl: 'Maak een foto van het meest random object binnen handbereik.',
      en: 'Take a photo of the most random object within arm\'s reach.',
    },
  },
  {
    id: 'photo-bad-news',
    type: 'photo',
    prompt: {
      nl: 'Maak een selfie alsof je net slecht nieuws hebt gehoord.',
      en: "Take a selfie as if you just heard bad news.",
    },
  },
  {
    id: 'photo-linkedin-pose',
    type: 'photo',
    prompt: {
      nl: 'Maak een foto van je beste "dit-hoort-op-LinkedIn" pose.',
      en: 'Take a photo of your best "this belongs on LinkedIn" pose.',
    },
  },
]
