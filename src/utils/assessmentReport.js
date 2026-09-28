import { getQuizScore } from '../data/assessmentQuestions'

const CONDITION_LEVELS = [
  { min: 90, label: 'Excellent', summary: 'Strong readiness for the applied class. Confident across most areas.' },
  { min: 75, label: 'Good', summary: 'Good overall foundation. Ready for admission with light support in weak areas.' },
  { min: 60, label: 'Average', summary: 'Basic understanding present. Needs regular guidance in several topics.' },
  { min: 40, label: 'Needs Support', summary: 'Foundational gaps noted. Extra attention and remedial help recommended.' },
  { min: 0, label: 'Weak Foundation', summary: 'Significant gaps in basics. Close follow-up and parent counselling advised.' },
]

const SECTION_NOTES = {
  'Reading (Marathi)': { strong: 'Good Marathi reading & comprehension', weak: 'Marathi reading needs practice' },
  'Reading (English)': { strong: 'Good English reading & comprehension', weak: 'English reading needs practice' },
  Maths: { strong: 'Strong in Maths', weak: 'Maths concepts need revision' },
  English: { strong: 'Good English language skills', weak: 'English grammar/vocabulary needs work' },
  Science: { strong: 'Good science understanding', weak: 'Science basics need strengthening' },
  EVS: { strong: 'Good environmental awareness', weak: 'EVS concepts need revision' },
  GK: { strong: 'Good general knowledge', weak: 'General knowledge needs improvement' },
  Colours: { strong: 'Knows colours well', weak: 'Colour recognition needs practice' },
  Animals: { strong: 'Good animal recognition', weak: 'Animal vocabulary needs practice' },
  Numbers: { strong: 'Good number sense', weak: 'Number skills need practice' },
  Counting: { strong: 'Good counting ability', weak: 'Counting needs more practice' },
  Letters: { strong: 'Good letter recognition', weak: 'Letter recognition needs work' },
  Shapes: { strong: 'Understands shapes well', weak: 'Shape concepts need practice' },
  Listening: { strong: 'Follows instructions well', weak: 'Needs help following instructions' },
  Speaking: { strong: 'Speaks confidently', weak: 'Speaking needs encouragement' },
}

function getSectionNote(section, isStrong) {
  const notes = SECTION_NOTES[section]
  if (notes) return isStrong ? notes.strong : notes.weak
  if (isStrong) return `Good performance in ${section}`
  return `${section} needs improvement`
}

export function getStudentAssessmentReport(questions, answers) {
  const score = getQuizScore(questions, answers)
  const sectionMap = new Map()

  for (const question of questions) {
    if (!sectionMap.has(question.section)) {
      sectionMap.set(question.section, { correct: 0, total: 0, missed: [] })
    }
    const stat = sectionMap.get(question.section)
    stat.total += 1
    const isCorrect = answers[question.id] === question.correctOptionId
    if (isCorrect) {
      stat.correct += 1
    } else if (answers[question.id]) {
      stat.missed.push(question.question)
    }
  }

  const sections = [...sectionMap.entries()].map(([name, stat]) => ({
    name,
    correct: stat.correct,
    total: stat.total,
    percent: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
    missed: stat.missed,
  }))

  const strongPoints = sections
    .filter((s) => s.percent >= 70)
    .sort((a, b) => b.percent - a.percent)
    .map((s) => getSectionNote(s.name, true))

  const weakPoints = sections
    .filter((s) => s.percent < 70)
    .sort((a, b) => a.percent - b.percent)
    .map((s) => getSectionNote(s.name, false))

  const condition =
    CONDITION_LEVELS.find((level) => score.percent >= level.min) ?? CONDITION_LEVELS.at(-1)

  const readingSections = sections.filter((s) => s.name.startsWith('Reading'))
  const readingSummary = readingSections.length
    ? {
        marathi: readingSections.find((s) => s.name.includes('Marathi')),
        english: readingSections.find((s) => s.name.includes('English')),
      }
    : null

  if (strongPoints.length === 0 && score.percent >= 60) {
    strongPoints.push('Shows willingness to attempt questions')
  }
  if (weakPoints.length === 0 && score.percent < 100) {
    weakPoints.push('Review incorrect answers with the student')
  }

  return {
    ...score,
    conditionLabel: condition.label,
    conditionSummary: condition.summary,
    sections,
    strongPoints,
    weakPoints,
    readingSummary,
  }
}
