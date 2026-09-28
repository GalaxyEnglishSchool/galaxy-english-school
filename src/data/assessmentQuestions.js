import { getReadingQuestionsForGrade } from './readingQuestions'

/** Basic admission MCQ tests — one set per class. Staff taps the student's answer. */

const INSTRUCTIONS =
  'Visual questions appear on screen — ask aloud if needed. Tap the option the student chooses. Each answer is final and cannot be changed.'

function mcq(id, section, question, choices, correctIndex, extras = {}) {
  const config = typeof extras === 'string' ? { display: extras } : extras
  const ids = ['a', 'b', 'c', 'd']
  const { display, optionIcons, staffNote, visualType, shapes } = config

  return {
    id,
    section,
    question,
    display,
    shapes,
    visualType: visualType ?? (display || optionIcons || shapes ? 'visual' : 'text'),
    staffNote,
    options: choices.map((label, i) => ({
      id: ids[i],
      label,
      icon: optionIcons?.[i] ?? null,
    })),
    correctOptionId: ids[correctIndex],
    marks: 1,
  }
}

const playgroupQuestions = [
  mcq('pg1', 'Colours', 'Which colour is the sun?', ['Yellow', 'Blue', 'Green', 'Black'], 0, '☀️'),
  mcq('pg2', 'Animals', 'Which one is a dog?', ['Dog', 'Cat', 'Cow', 'Bird'], 0, {
    optionIcons: ['🐕', '🐈', '🐄', '🐦'],
  }),
  mcq('pg3', 'Counting', 'How many balls?', ['1', '2', '3', '4'], 1, '⚽ ⚽'),
  mcq('pg4', 'Shapes', 'Which shape is round?', ['Circle', 'Square', 'Triangle', 'Star'], 0, '⭕'),
  mcq('pg5', 'Body', 'We see with our ___', ['Eyes', 'Ears', 'Nose', 'Hands'], 0),
  mcq('pg6', 'Colours', 'Colour of grass?', ['Green', 'Red', 'Pink', 'White'], 0, '🌿'),
  mcq('pg7', 'Sounds', 'Cat says ___', ['Meow', 'Moo', 'Woof', 'Quack'], 0, '🐈'),
  mcq('pg8', 'Big & Small', 'Which is bigger?', ['Elephant', 'Mouse', 'Both same', "Don't know"], 0, {
    optionIcons: ['🐘', '🐁', '⚖️', '❓'],
  }),
  mcq('pg9', 'Fruits', 'Which is a fruit?', ['Apple', 'Carrot', 'Bread', 'Cheese'], 0, {
    optionIcons: ['🍎', '🥕', '🍞', '🧀'],
  }),
  mcq('pg10', 'Listening', 'Child follows simple instruction?', ['Yes', 'With help', 'No', 'Not tried'], 0, {
    staffNote: 'Say: "Touch your head"',
    optionIcons: ['👍', '🤝', '👎', '⏳'],
  }),
]

const nurseryQuestions = [
  mcq('n1', 'Numbers', 'How many fingers on one hand?', ['3', '4', '5', '6'], 2, '🖐️'),
  mcq('n2', 'Letters', 'Which letter is A?', ['A', 'B', 'C', 'D'], 0, 'A'),
  mcq('n3', 'Numbers', 'What comes after 2?', ['1', '3', '4', '5'], 1),
  mcq('n4', 'Colours', 'Sky colour?', ['Blue', 'Red', 'Yellow', 'Brown'], 0),
  mcq('n5', 'Shapes', 'Square has how many sides?', ['3', '4', '5', '6'], 1, '■'),
  mcq('n6', 'Rhymes', 'Twinkle twinkle little ___', ['Star', 'Car', 'Ball', 'Tree'], 0),
  mcq('n7', 'Animals', 'Who gives us milk?', ['Cow', 'Lion', 'Snake', 'Fish'], 0, {
    optionIcons: ['🐄', '🦁', '🐍', '🐟'],
  }),
  mcq('n8', 'Counting', 'Count the stars', ['2', '3', '4', '5'], 2, '⭐ ⭐ ⭐'),
  mcq('n9', 'Letters', '"B" for ___', ['Ball', 'Cat', 'Dog', 'Egg'], 0, {
    display: 'B',
    optionIcons: ['⚽', '🐈', '🐕', '🥚'],
  }),
  mcq('n10', 'Speaking', 'Child speaks in simple words?', ['Yes', 'Few words', 'No', 'Not tried'], 0),
]

const std1Questions = [
  mcq('s1q1', 'Letters', 'Which letter is this?', ['A', 'B', 'C', 'D'], 0, 'A'),
  mcq('s1q2', 'Letters', 'Vowel letter?', ['E', 'B', 'F', 'G'], 0),
  mcq('s1q3', 'Numbers', 'How many apples?', ['2', '3', '4', '5'], 1, '🍎 🍎 🍎'),
  mcq('s1q4', 'Numbers', 'What comes after 6?', ['5', '7', '8', '9'], 1),
  mcq('s1q5', 'Maths', '2 + 1 = ?', ['2', '3', '4', '5'], 1),
  mcq('s1q6', 'Colours', 'Banana colour?', ['Yellow', 'Blue', 'Black', 'Pink'], 0, '🍌'),
  mcq('s1q7', 'Shapes', 'Round shape?', ['Circle', 'Square', 'Line', 'Dot'], 0),
  mcq('s1q8', 'GK', 'We breathe through ___', ['Nose', 'Ears', 'Hair', 'Nails'], 0),
  mcq('s1q9', 'English', 'Opposite of hot?', ['Cold', 'Big', 'Fast', 'Tall'], 0),
  mcq('s1q10', 'GK', 'National bird of India?', ['Peacock', 'Crow', 'Pigeon', 'Duck'], 0),
]

const std2Questions = [
  mcq('s2q1', 'Maths', '5 + 3 = ?', ['6', '7', '8', '9'], 2),
  mcq('s2q2', 'Maths', '10 − 4 = ?', ['4', '5', '6', '7'], 2),
  mcq('s2q3', 'English', 'Plural of cat?', ['Cats', 'Cates', 'Caties', 'Cat'], 0),
  mcq('s2q4', 'English', 'He ___ to school.', ['go', 'goes', 'going', 'gone'], 1),
  mcq('s2q5', 'EVS', 'We get rain from ___', ['Clouds', 'Rocks', 'Sand', 'Wood'], 0, {
    display: '🌧️ ☁️',
    optionIcons: ['☁️', '🪨', '🏖️', '🪵'],
  }),
  mcq('s2q6', 'Maths', 'Which is bigger: 12 or 9?', ['12', '9', 'Same', "Don't know"], 0),
  mcq('s2q7', 'GK', 'Capital of Maharashtra?', ['Mumbai', 'Delhi', 'Chennai', 'Kolkata'], 0),
  mcq('s2q8', 'English', 'Synonym of happy?', ['Sad', 'Glad', 'Angry', 'Tired'], 1),
  mcq('s2q9', 'Maths', 'Half of 10?', ['4', '5', '6', '8'], 1),
  mcq('s2q10', 'EVS', 'Plants need ___ to grow', ['Water', 'Plastic', 'Stone', 'Glass'], 0),
]

const std3Questions = [
  mcq('s3q1', 'Maths', '7 × 2 = ?', ['12', '14', '16', '9'], 1),
  mcq('s3q2', 'Maths', '45 − 15 = ?', ['20', '25', '30', '35'], 2),
  mcq('s3q3', 'English', 'Past tense of run?', ['Ran', 'Running', 'Runs', 'Runed'], 0),
  mcq('s3q4', 'English', 'Masculine of queen?', ['King', 'Prince', 'Duke', 'Lord'], 0),
  mcq('s3q5', 'EVS', 'Largest planet?', ['Earth', 'Mars', 'Jupiter', 'Moon'], 2, {
    optionIcons: ['🌍', '🔴', '🪐', '🌙'],
  }),
  mcq('s3q6', 'Maths', '1 hour = ___ minutes', ['30', '45', '60', '100'], 2),
  mcq('s3q7', 'GK', 'Our country is ___', ['India', 'Japan', 'USA', 'UK'], 0),
  mcq('s3q8', 'Maths', '3 + 4 + 2 = ?', ['7', '8', '9', '10'], 2),
  mcq('s3q9', 'English', 'Opposite of day?', ['Night', 'Sun', 'Light', 'Morning'], 0),
  mcq('s3q10', 'EVS', 'Fish live in ___', ['Water', 'Air', 'Sand', 'Fire'], 0),
]

const std4Questions = [
  mcq('s4q1', 'Maths', '9 × 3 = ?', ['24', '27', '30', '21'], 1),
  mcq('s4q2', 'Maths', '100 ÷ 10 = ?', ['5', '10', '20', '50'], 1),
  mcq('s4q3', 'English', 'Collective noun for lions?', ['Pride', 'Herd', 'Flock', 'Pack'], 0),
  mcq('s4q4', 'Maths', '¼ of 20 = ?', ['4', '5', '6', '8'], 1),
  mcq('s4q5', 'EVS', 'Human body has ___ sense organs', ['4', '5', '6', '7'], 1),
  mcq('s4q6', 'GK', 'Father of Nation?', ['Gandhi', 'Nehru', 'Patel', 'Tagore'], 0),
  mcq('s4q7', 'Maths', 'Perimeter of square side 3 cm?', ['6 cm', '9 cm', '12 cm', '15 cm'], 2, {
    shapes: ['square'],
    display: '3 cm',
  }),
  mcq('s4q8', 'English', 'Adjective in: "Tall tree"', ['Tall', 'Tree', 'The', 'Is'], 0),
  mcq('s4q9', 'EVS', 'Sun rises in the ___', ['East', 'West', 'North', 'South'], 0),
  mcq('s4q10', 'Maths', 'Smallest 3-digit number?', ['99', '100', '101', '999'], 1),
]

const std5Questions = [
  mcq('s5q1', 'Maths', '8 × 3 = ?', ['21', '24', '27', '30'], 1),
  mcq('s5q2', 'Maths', '½ of 10 = ?', ['4', '5', '6', '8'], 1, {
    display: '½ of 10',
    visualType: 'fraction',
  }),
  mcq('s5q3', 'English', 'Opposite of hot?', ['Cold', 'Big', 'Fast', 'Tall'], 0),
  mcq('s5q4', 'Science', 'We breathe in ___', ['Oxygen', 'Smoke', 'Dust', 'Oil'], 0),
  mcq('s5q5', 'Maths', '15 + 25 = ?', ['30', '35', '40', '45'], 2),
  mcq('s5q6', 'GK', 'Our school is in which state?', ['Maharashtra', 'Gujarat', 'Goa', 'Karnataka'], 0),
  mcq('s5q7', 'English', 'Past tense of go?', ['Went', 'Goed', 'Going', 'Gone'], 0),
  mcq('s5q8', 'Science', 'Water freezes at ___ °C', ['0', '50', '100', '120'], 0),
  mcq('s5q9', 'Maths', 'How many sides in a rectangle?', ['3', '4', '5', '6'], 1, {
    shapes: ['square'],
  }),
  mcq('s5q10', 'EVS', 'Sun gives us ___', ['Light and heat', 'Rain', 'Wind only', 'Snow'], 0, {
    display: '☀️',
    optionIcons: ['☀️', '🌧️', '💨', '❄️'],
  }),
]

const std6Questions = [
  mcq('s6q1', 'Maths', '7 × 6 = ?', ['36', '42', '48', '54'], 1),
  mcq('s6q2', 'Maths', '100 − 35 = ?', ['55', '60', '65', '75'], 2),
  mcq('s6q3', 'Science', 'Plants make food using ___', ['Sunlight', 'Darkness', 'Plastic', 'Stone'], 0, {
    display: '🌱 🌿',
    optionIcons: ['☀️', '🌑', '🧴', '🪨'],
  }),
  mcq('s6q4', 'English', 'Opposite of happy?', ['Sad', 'Glad', 'Big', 'Tall'], 0),
  mcq('s6q5', 'Geography', 'Capital of India?', ['Delhi', 'Mumbai', 'Chennai', 'Kolkata'], 0),
  mcq('s6q6', 'Maths', 'Perimeter of square side 4 cm?', ['8 cm', '12 cm', '16 cm', '20 cm'], 2),
  mcq('s6q7', 'Science', 'We drink ___ when thirsty', ['Water', 'Oil', 'Sand', 'Salt'], 0),
  mcq('s6q8', 'History', 'India got freedom in year?', ['1947', '1950', '1857', '2000'], 0),
  mcq('s6q9', 'Maths', '3/4 means ___ parts out of 4', ['3', '4', '1', '2'], 0),
  mcq('s6q10', 'Science', 'Heart pumps ___ in body', ['Blood', 'Air', 'Water', 'Food'], 0),
]

const std7Questions = [
  mcq('s7q1', 'Maths', '9 × 7 = ?', ['56', '63', '72', '81'], 1),
  mcq('s7q2', 'Maths', '144 ÷ 12 = ?', ['10', '11', '12', '14'], 2),
  mcq('s7q3', 'Science', 'Magnet attracts ___', ['Iron', 'Wood', 'Plastic', 'Paper'], 0),
  mcq('s7q4', 'English', 'Synonym of big?', ['Large', 'Small', 'Tiny', 'Short'], 0),
  mcq('s7q5', 'Geography', 'India is in which continent?', ['Asia', 'Europe', 'Africa', 'Australia'], 0),
  mcq('s7q6', 'Maths', '25% of 100 = ?', ['15', '20', '25', '50'], 2),
  mcq('s7q7', 'Science', 'Sour taste in lemon is due to ___', ['Acid', 'Sugar', 'Salt', 'Oil'], 0, {
    optionIcons: ['🍋', '🍬', '🧂', '🛢️'],
  }),
  mcq('s7q8', 'History', 'Mahatma Gandhi is called Father of ___', ['Nation', 'State', 'City', 'School'], 0),
  mcq('s7q9', 'Maths', 'Average of 10, 20, 30?', ['15', '20', '25', '30'], 1),
  mcq('s7q10', 'Science', 'Moon is a ___', ['Satellite', 'Star', 'Planet', 'Comet'], 0),
]

const std8Questions = [
  mcq('s8q1', 'Maths', '11 × 11 = ?', ['111', '121', '131', '144'], 1),
  mcq('s8q2', 'Maths', '2³ = 2 × 2 × 2 = ?', ['6', '8', '9', '12'], 1),
  mcq('s8q3', 'Science', 'Electricity flows through ___', ['Wire', 'Wood', 'Rubber', 'Glass'], 0),
  mcq('s8q4', 'Geography', 'Himalaya mountains are in ___', ['North India', 'South India', 'West only', 'East only'], 0, {
    display: '🏔️',
    optionIcons: ['🏔️', '🏖️', '🌵', '🌴'],
  }),
  mcq('s8q5', 'English', 'Plural of child?', ['Children', 'Childs', 'Childes', 'Child'], 0),
  mcq('s8q6', 'Maths', 'Area of square side 5 cm?', ['10 cm²', '20 cm²', '25 cm²', '30 cm²'], 2),
  mcq('s8q7', 'Science', 'Human body has ___ bones (approx.)', ['206', '50', '500', '1000'], 0),
  mcq('s8q8', 'History', 'Republic Day of India?', ['26 January', '15 August', '2 October', '1 May'], 0),
  mcq('s8q9', 'Maths', '10% of 200 = ?', ['10', '15', '20', '25'], 2),
  mcq('s8q10', 'Science', 'Sound needs a ___ to travel', ['Medium', 'Vacuum only', 'Nothing', 'Light'], 0),
]

const std9Questions = [
  mcq('s9q1', 'Maths', '√81 = ?', ['7', '8', '9', '10'], 2),
  mcq('s9q2', 'Maths', '5² = ?', ['10', '15', '20', '25'], 3),
  mcq('s9q3', 'Science', 'Centre of atom is called ___', ['Nucleus', 'Shell', 'Electron', 'Gas'], 0),
  mcq('s9q4', 'Science', 'Unit of length is ___', ['Metre', 'Litre', 'Kilogram', 'Second'], 0),
  mcq('s9q5', 'Geography', 'Arabian Sea is on ___ coast of India', ['West', 'East', 'North', 'South pole'], 0),
  mcq('s9q6', 'Maths', 'Simple interest on ₹100 at 10% for 1 year?', ['₹5', '₹10', '₹15', '₹20'], 1),
  mcq('s9q7', 'English', 'Opposite of increase?', ['Decrease', 'Grow', 'Rise', 'Expand'], 0),
  mcq('s9q8', 'Science', 'Green plants release ___', ['Oxygen', 'Smoke', 'Dust', 'Plastic'], 0),
  mcq('s9q9', 'History', 'UNESCO protects world ___', ['Heritage', 'Food only', 'Games only', 'Cars'], 0),
  mcq('s9q10', 'Maths', 'Probability of even number on dice (1–6)?', ['1/6', '2/6', '3/6', '4/6'], 2),
]

const std10Questions = [
  mcq('s10q1', 'Maths', 'x + 5 = 12, x = ?', ['5', '6', '7', '8'], 2),
  mcq('s10q2', 'Maths', '12 × 12 = ?', ['124', '132', '144', '156'], 2),
  mcq('s10q3', 'Science', 'Speed = distance ÷ ___', ['Time', 'Weight', 'Colour', 'Sound'], 0),
  mcq('s10q4', 'Science', 'Table salt is ___ chloride', ['Sodium', 'Iron', 'Gold', 'Copper'], 0),
  mcq('s10q5', 'Geography', 'Rain in India mainly in ___ season', ['Monsoon', 'Winter only', 'Summer only', 'No rain'], 0),
  mcq('s10q6', 'English', 'He ___ playing now (present)', ['is', 'was', 'will', 'has'], 0),
  mcq('s10q7', 'Maths', 'Next number: 2, 4, 6, 8, ___', ['9', '10', '11', '12'], 1),
  mcq('s10q8', 'Science', 'Vaccines help prevent ___', ['Disease', 'Rain', 'Earthquake', 'Wind'], 0),
  mcq('s10q9', 'History', 'Indian national flag has ___ colours', ['Three', 'Two', 'Four', 'Five'], 0),
  mcq('s10q10', 'Maths', 'Chance of head on coin toss?', ['½', '¼', '1', '0'], 0, {
    display: '🪙',
    optionIcons: ['½', '¼', '1', '0'],
  }),
]

export const assessmentsByGrade = {
  playgroup: {
    title: 'Play Group — Basic Readiness Test',
    instructions: INSTRUCTIONS,
    questions: playgroupQuestions,
  },
  nursery: {
    title: 'Nursery — Basic Readiness Test',
    instructions: INSTRUCTIONS,
    questions: nurseryQuestions,
  },
  jrkg: {
    title: 'Jr. KG — Basic Readiness Test',
    instructions: INSTRUCTIONS,
    questions: nurseryQuestions,
  },
  srkg: {
    title: 'Sr. KG — Basic Readiness Test',
    instructions: INSTRUCTIONS,
    questions: std1Questions,
  },
  std1: {
    title: '1st — Basic Admission Test',
    instructions: INSTRUCTIONS,
    questions: std1Questions,
  },
  std2: {
    title: '2nd — Basic Admission Test',
    instructions: INSTRUCTIONS,
    questions: std2Questions,
  },
  std3: {
    title: '3rd — Basic Admission Test',
    instructions: INSTRUCTIONS,
    questions: std3Questions,
  },
  std4: {
    title: '4th — Basic Admission Test',
    instructions: INSTRUCTIONS,
    questions: std4Questions,
  },
  std5: {
    title: '5th — Basic Admission Test',
    instructions: INSTRUCTIONS,
    questions: std5Questions,
  },
  std6: {
    title: '6th — Basic Admission Test',
    instructions: INSTRUCTIONS,
    questions: std6Questions,
  },
  std7: {
    title: '7th — Basic Admission Test',
    instructions: INSTRUCTIONS,
    questions: std7Questions,
  },
  std8: {
    title: '8th — Basic Admission Test',
    instructions: INSTRUCTIONS,
    questions: std8Questions,
  },
  std9: {
    title: '9th — Basic Admission Test',
    instructions: INSTRUCTIONS,
    questions: std9Questions,
  },
  std10: {
    title: '10th — Basic Admission Test',
    instructions: INSTRUCTIONS,
    questions: std10Questions,
  },
}

export function getAssessmentForGrade(gradeId) {
  const base = assessmentsByGrade[gradeId] ?? assessmentsByGrade.std1
  const readingQuestions = getReadingQuestionsForGrade(gradeId)

  return {
    ...base,
    questions: [...base.questions, ...readingQuestions],
  }
}

export function getQuizScore(questions, answers) {
  let earned = 0
  let total = 0
  for (const question of questions) {
    total += question.marks
    if (answers[question.id] === question.correctOptionId) {
      earned += question.marks
    }
  }
  const percent = total > 0 ? Math.round((earned / total) * 100) : 0
  return { earned, total, percent }
}
