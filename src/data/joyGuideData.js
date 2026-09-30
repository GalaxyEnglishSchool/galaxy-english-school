import { site } from './siteData'

export const JOY_ANCHORED_SECTIONS = ['about']

export const JOY_SECTION_IDS = [
  'home',
  'about',
  'gallery',
  'facilities',
  'courses',
  'journey',
  'contact',
]

export const JOY_INTRO_STORAGE_KEY = 'galaxy-joy-intro-seen'

export const joyGuideMessages = {
  homeFirstVisit: {
    title: 'Joy',
    lines: [
      'Hi! I\'m Joy 👋',
      `Welcome to ${site.name}!`,
      'Tap Start site tour — I\'ll walk you through every section!',
    ],
  },
  home: {
    title: 'Joy',
    lines: [
      'Hey! Welcome!',
      'How are you?',
      "I'm Joy!",
      `Welcome to ${site.name}!`,
    ],
  },
  about: {
    title: 'About us',
    lines: [
      'This is our story!',
      'Meet our founders and see what makes Galaxy special.',
    ],
  },
  gallery: {
    title: 'Campus Life',
    lines: [
      'Take a peek at school life!',
      'Photos from classrooms, events, and daily activities.',
    ],
  },
  facilities: {
    title: 'Facilities',
    lines: [
      'We have great facilities for every student!',
      'E-learning, sports, bus service, CCTV, and more.',
    ],
  },
  courses: {
    title: 'Academics',
    lines: [
      'From Play Group to 12th standard!',
      'Follow the tree to see each stage of learning.',
    ],
  },
  journey: {
    title: 'Our Journey',
    lines: [
      'Our school has grown since 2002!',
      'Walk through our milestones with me.',
    ],
  },
  contact: {
    title: 'Contact',
    lines: [
      'Want to visit or apply?',
      'Call, WhatsApp, or send a message — we are happy to help!',
    ],
  },
}
