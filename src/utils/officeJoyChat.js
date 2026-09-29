import { officeJoyQuickPrompts, officeJoyTopics } from '../data/officeJoyData'

const MIN_MATCH_SCORE = 2

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function scoreTopic(text, topic) {
  let score = 0

  topic.keywords.forEach((keyword) => {
    const key = normalize(keyword)
    if (!key) return
    if (text.includes(key)) {
      score += key.split(' ').length >= 2 ? 4 : 2
    }
  })

  const queryWords = text.split(' ').filter((word) => word.length >= 3)
  queryWords.forEach((word) => {
    topic.keywords.forEach((keyword) => {
      const key = normalize(keyword)
      if (key.includes(word) || word.includes(key)) {
        score += 1
      }
    })
  })

  const labelWords = topic.shortLabel.toLowerCase().split(/\s+/)
  labelWords.forEach((word) => {
    if (word.length > 3 && text.includes(word)) score += 1
  })

  if (topic.fieldSteps?.length) {
    score += 1
  }

  return score
}

export function findJoyTopic(query) {
  const text = normalize(query)
  if (!text) return null

  let bestTopic = null
  let bestScore = 0

  officeJoyTopics.forEach((topic) => {
    const score = scoreTopic(text, topic)
    if (score > bestScore) {
      bestScore = score
      bestTopic = topic
    }
  })

  if (bestScore < MIN_MATCH_SCORE) return null
  return bestTopic
}

export function getJoyFallbackReply() {
  return {
    isFallback: true,
    icon: '🙂',
    title: 'I can help with these topics:',
    steps: officeJoyQuickPrompts.map((prompt) => `Try asking: "${prompt}"`),
    tip: 'Or open **Bus Fees** / **Assessment & Fees** — Joy\'s guide panel is at the top of each tool.',
    toolId: null,
    toolLabel: null,
  }
}
