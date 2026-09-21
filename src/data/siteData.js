export const site = {
  name: 'Galaxy English School',
  tagline: 'Nurturing Every Student, Since 2002.',
  description:
    'Founded in 2002 with a vision to nurture students and bring out the best in them, Galaxy English School received its government affiliation in 2008 and has been serving students in Chh. Sambhajinagar ever since.',
}

export const contact = {
  phone: '+91 XXXXX XXXXX', // TODO: add real phone number
  phoneLink: '91XXXXXXXXXX', // TODO: add real phone number (digits only, with country code)
  email: 'info@galaxyenglishschool.com', // TODO: confirm this is the real email
  address: 'Chh. Sambhajinagar, Maharashtra', // TODO: add full street address
  hours: 'Mon – Sat: 9:00 AM – 7:00 PM', // TODO: confirm actual school hours
  whatsappMessage: 'Hi! I would like to know more about Galaxy English School courses.',
}

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Courses', href: '#courses' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
]

// Optional: custom captions for specific photos (key = exact filename)
// Photos are auto-detected from src/assets/Photo*.jpg — just add Photo4.jpg, Photo5.jpg, etc.
export const photoCaptions = {
  'Photo1.jpg': {
    caption: 'Galaxy English School — the school building',
    alt: 'Galaxy English School campus building in Chh. Sambhajinagar',
  },
  'Photo2.jpg': {
    caption: 'Deep Prajwalan at the inauguration ceremony',
    alt: 'Dignitaries lighting the lamp at Galaxy English School inauguration',
  },
  'Photo3.jpg': {
    caption: 'Ribbon-cutting ceremony',
    alt: 'Ribbon-cutting ceremony at Galaxy English School inauguration',
  },
}

export const stats = [
  { value: '20+', label: 'Years of Excellence' }, // TODO: confirm (2002 → present)
  { value: '2000+', label: 'Students Trained' }, // TODO: add real number
  { value: '95%', label: 'Success Rate' }, // TODO: add real number
  { value: '25+', label: 'Expert Teachers' }, // TODO: add real number
]

export const features = [
  {
    icon: '👨‍🏫',
    title: 'Certified Teachers',
    description: 'Learn from experienced instructors who focus on practical communication.', // TODO: confirm/adjust
  },
  {
    icon: '👥',
    title: 'Small Batch Sizes',
    description: 'Small class sizes so every learner gets personal attention and feedback.', // TODO: confirm batch size
  },
  {
    icon: '🎯',
    title: 'Goal-Based Learning',
    description: 'Custom study plans for school, career, travel, or international exam preparation.',
  },
  {
    icon: '📱',
    title: 'Online & Offline',
    description: 'Flexible classroom and live online sessions to fit your schedule.', // TODO: confirm if online classes are offered
  },
]

export const courses = [
  // TODO: replace with Galaxy English School's actual course offerings
  {
    level: 'Beginner',
    title: 'English Foundations',
    description: 'Alphabet, pronunciation, basic grammar, and everyday conversation for absolute beginners.',
    duration: '3 months',
    schedule: 'Mon, Wed, Fri · 10 AM',
    highlight: false,
  },
  {
    level: 'Intermediate',
    title: 'Confident Communicator',
    description: 'Improve fluency, expand vocabulary, and practice real-life speaking scenarios.',
    duration: '4 months',
    schedule: 'Tue, Thu, Sat · 5 PM',
    highlight: true,
  },
  {
    level: 'Advanced',
    title: 'Professional English',
    description: 'Business writing, presentations, interviews, and advanced grammar for career growth.',
    duration: '5 months',
    schedule: 'Mon – Fri · 6 PM',
    highlight: false,
  },
  {
    level: 'Kids',
    title: 'Galaxy Juniors',
    description: 'Fun, interactive English for children aged 6–14 with games, stories, and creative activities.',
    duration: '6 months',
    schedule: 'Sat & Sun · 11 AM',
    highlight: false,
  },
]

export const testimonials = [
  // ⚠️ PLACEHOLDER CONTENT — replace every entry below with a real testimonial
  // from an actual student/parent before this site goes live. Do not publish
  // these as-is; presenting invented reviews as genuine could mislead visitors.
  {
    name: 'Placeholder Name 1',
    role: 'Student',
    quote:
      'Replace this with a real quote from a student about their experience learning at Galaxy English School.',
    rating: 5,
  },
  {
    name: 'Placeholder Name 2',
    role: 'Parent',
    quote:
      'Replace this with a real quote from a parent about their child\'s progress at Galaxy English School.',
    rating: 5,
  },
  {
    name: 'Placeholder Name 3',
    role: 'Student',
    quote:
      'Replace this with a real quote about a specific course or teacher at Galaxy English School.',
    rating: 5,
  },
  {
    name: 'Placeholder Name 4',
    role: 'Alumni',
    quote:
      'Replace this with a real quote from a former student about how the school helped them long-term.',
    rating: 5,
  },
  {
    name: 'Placeholder Name 5',
    role: 'Parent',
    quote:
      'Replace this with a real quote from a parent about the school environment or teaching quality.',
    rating: 5,
  },
]

export const footerLinks = [
  { label: 'About Us', href: '#about' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Courses', href: '#courses' },
  { label: 'Contact', href: '#contact' },
]