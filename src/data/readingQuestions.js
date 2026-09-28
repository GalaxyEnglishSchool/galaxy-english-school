/** Marathi & English reading passages — appended to every grade test. */

function readingMcq(id, lang, question, choices, correctIndex, passage, extras = {}) {
  const ids = ['a', 'b', 'c', 'd']
  const section = lang === 'mr' ? 'Reading (Marathi)' : 'Reading (English)'

  return {
    id,
    section,
    question,
    passage,
    passageLang: lang,
    display: null,
    visualType: 'reading',
    staffNote: extras.staffNote,
    options: choices.map((label, i) => ({ id: ids[i], label, icon: null })),
    correctOptionId: ids[correctIndex],
    marks: 1,
  }
}

const earlyReading = [
  readingMcq(
    'read-mr-1',
    'mr',
    'मुलगा काय करतो?',
    ['खेळतो', 'झोपतो', 'रडतो', 'उडतो'],
    0,
    'राजू एक छोटा मुलगा आहे. तो दररोज शाळेत जातो. शाळेत तो मित्रांसोबत खेळतो.',
    { staffNote: 'विद्यार्थ्याला मराठी परिच्छेद वाचायला सांगा.' },
  ),
  readingMcq(
    'read-mr-2',
    'mr',
    'राजू कुठे जातो?',
    ['शाळेत', 'बाजारात', 'सिनेमात', 'पोलिसात'],
    0,
    'राजू एक छोटा मुलगा आहे. तो दररोज शाळेत जातो. शाळेत तो मित्रांसोबत खेळतो.',
  ),
  readingMcq(
    'read-en-1',
    'en',
    'What does Ravi do every day?',
    ['Goes to school', 'Sleeps all day', 'Goes to market', 'Watches TV'],
    0,
    'Ravi is a small boy. He goes to school every day. At school he plays with his friends and learns new things.',
    { staffNote: 'Ask the child to read the English paragraph aloud.' },
  ),
  readingMcq(
    'read-en-2',
    'en',
    'Where does Ravi play?',
    ['At school', 'In a shop', 'On the road', 'At night'],
    0,
    'Ravi is a small boy. He goes to school every day. At school he plays with his friends and learns new things.',
  ),
]

const primaryReading = [
  readingMcq(
    'read-mr-1',
    'mr',
    'शाळेचे नाव काय आहे?',
    ['गॅलेक्सी इंग्लिश शाळा', 'सिटी स्कूल', 'नवी शाळा', 'महाराजा स्कूल'],
    0,
    'गॅलेक्सी इंग्लिश शाळा छत्रपती संभाजीनगर येथे आहे. शाळेत खेळ, अभ्यास आणि चांगली शिस्त आहे. विद्यार्थी दररोज वेळेवर शाळेत येतात.',
    { staffNote: 'विद्यार्थ्याला मराठी परिच्छेद वाचायला सांगा.' },
  ),
  readingMcq(
    'read-mr-2',
    'mr',
    'शाळेत काय आहे?',
    ['खेळ आणि अभ्यास', 'फक्त खेळ', 'फक्त सुट्टी', 'काहीही नाही'],
    0,
    'गॅलेक्सी इंग्लिश शाळा छत्रपती संभाजीनगर येथे आहे. शाळेत खेळ, अभ्यास आणि चांगली शिस्त आहे. विद्यार्थी दररोज वेळेवर शाळेत येतात.',
  ),
  readingMcq(
    'read-en-1',
    'en',
    'Where is Galaxy English School?',
    ['Chh. Sambhajinagar', 'Mumbai', 'Pune', 'Nagpur'],
    0,
    'Galaxy English School is in Chh. Sambhajinagar. Students come on time every day. The school has good discipline, sports, and quality education for all classes.',
    { staffNote: 'Ask the child to read the English paragraph aloud.' },
  ),
  readingMcq(
    'read-en-2',
    'en',
    'What does the school provide?',
    ['Sports and education', 'Only games', 'Only holidays', 'Nothing'],
    0,
    'Galaxy English School is in Chh. Sambhajinagar. Students come on time every day. The school has good discipline, sports, and quality education for all classes.',
  ),
]

const upperReading = [
  readingMcq(
    'read-mr-1',
    'mr',
    'विद्यार्थी कशासाठी प्रयत्न करतात?',
    ['चांगले शिकण्यासाठी', 'फक्त सुट्टीसाठी', 'फक्त खेळासाठी', 'काहीही नाही'],
    0,
    'शिक्षण हे भविष्य घडवण्याचे साधन आहे. गॅलेक्सी इंग्लिश शाळेत विद्यार्थी अभ्यास, खेळ आणि सांस्कृतिक कार्यक्रमांमध्ये सहभागी होतात. शिक्षक विद्यार्थ्यांना ज्ञान, शिस्त आणि आत्मविश्वास देतात.',
    { staffNote: 'विद्यार्थ्याला मराठी परिच्छेद वाचायला सांगा.' },
  ),
  readingMcq(
    'read-mr-2',
    'mr',
    'शिक्षक काय देतात?',
    ['ज्ञान आणि आत्मविश्वास', 'फक्त खेळ', 'फक्त परीक्षा', 'फक्त दंड'],
    0,
    'शिक्षण हे भविष्य घडवण्याचे साधन आहे. गॅलेक्सी इंग्लिश शाळेत विद्यार्थी अभ्यास, खेळ आणि सांस्कृतिक कार्यक्रमांमध्ये सहभागी होतात. शिक्षक विद्यार्थ्यांना ज्ञान, शिस्त आणि आत्मविश्वास देतात.',
  ),
  readingMcq(
    'read-en-1',
    'en',
    'What is education described as?',
    ['A tool to build the future', 'Only play', 'Only exams', 'A holiday'],
    0,
    'Education helps us build a bright future. At Galaxy English School, students take part in studies, sports, and cultural activities. Teachers guide students with knowledge, discipline, and confidence.',
    { staffNote: 'Ask the student to read the English paragraph aloud.' },
  ),
  readingMcq(
    'read-en-2',
    'en',
    'What do teachers give students?',
    ['Knowledge and confidence', 'Only punishment', 'Only games', 'Only homework'],
    0,
    'Education helps us build a bright future. At Galaxy English School, students take part in studies, sports, and cultural activities. Teachers guide students with knowledge, discipline, and confidence.',
  ),
]

const READING_BY_TIER = {
  early: earlyReading,
  primary: primaryReading,
  upper: upperReading,
}

function getReadingTier(gradeId) {
  if (['playgroup', 'nursery', 'jrkg'].includes(gradeId)) return 'early'
  if (['srkg', 'std1', 'std2', 'std3', 'std4', 'std5'].includes(gradeId)) return 'primary'
  return 'upper'
}

export function getReadingQuestionsForGrade(gradeId) {
  const tier = getReadingTier(gradeId)
  const prefix = gradeId.replace(/[^a-z0-9]/gi, '')
  return READING_BY_TIER[tier].map((q, index) => ({
    ...q,
    id: `${prefix}-${q.id}-${index}`,
  }))
}
