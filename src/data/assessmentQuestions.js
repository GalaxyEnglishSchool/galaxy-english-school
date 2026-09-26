/** Basic admission MCQ tests — one set per class. Staff taps the student's answer. */

const INSTRUCTIONS =
  'Ask the question aloud. Tap the option the student answers. Use Next to move through all questions.'

function mcq(id, section, question, choices, correctIndex, display) {
  const ids = ['a', 'b', 'c', 'd']
  return {
    id,
    section,
    question,
    display,
    options: choices.map((label, i) => ({ id: ids[i], label })),
    correctOptionId: ids[correctIndex],
    marks: 1,
  }
}

const playgroupQuestions = [
  mcq('pg1', 'Colours', 'Which colour is the sun?', ['Yellow', 'Blue', 'Green', 'Black'], 0, '☀️'),
  mcq('pg2', 'Animals', 'Which one is a dog?', ['🐕 Dog', '🐈 Cat', '🐄 Cow', '🐦 Bird'], 0),
  mcq('pg3', 'Counting', 'How many balls?', ['1', '2', '3', '4'], 1, '⚽ ⚽'),
  mcq('pg4', 'Shapes', 'Which shape is round?', ['Circle', 'Square', 'Triangle', 'Star'], 0, '⭕'),
  mcq('pg5', 'Body', 'We see with our ___', ['Eyes', 'Ears', 'Nose', 'Hands'], 0),
  mcq('pg6', 'Colours', 'Colour of grass?', ['Green', 'Red', 'Pink', 'White'], 0, '🌿'),
  mcq('pg7', 'Sounds', 'Cat says ___', ['Meow', 'Moo', 'Woof', 'Quack'], 0, '🐈'),
  mcq('pg8', 'Big & Small', 'Which is bigger?', ['🐘 Elephant', '🐁 Mouse', 'Both same', "Don't know"], 0),
  mcq('pg9', 'Fruits', 'Which is a fruit?', ['🍎 Apple', '🥕 Carrot', '🍞 Bread', '🧀 Cheese'], 0),
  mcq('pg10', 'Listening', 'Child follows simple instruction?', ['Yes', 'With help', 'No', 'Not tried'], 0),
]
playgroupQuestions[9].staffNote = 'Say: "Touch your head"'

const nurseryQuestions = [
  mcq('n1', 'Numbers', 'How many fingers on one hand?', ['3', '4', '5', '6'], 2, '🖐️'),
  mcq('n2', 'Letters', 'Which letter is A?', ['A', 'B', 'C', 'D'], 0, 'A'),
  mcq('n3', 'Numbers', 'What comes after 2?', ['1', '3', '4', '5'], 1),
  mcq('n4', 'Colours', 'Sky colour?', ['Blue', 'Red', 'Yellow', 'Brown'], 0),
  mcq('n5', 'Shapes', 'Square has how many sides?', ['3', '4', '5', '6'], 1, '■'),
  mcq('n6', 'Rhymes', 'Twinkle twinkle little ___', ['Star', 'Car', 'Ball', 'Tree'], 0),
  mcq('n7', 'Animals', 'Who gives us milk?', ['Cow', 'Lion', 'Snake', 'Fish'], 0, '🐄'),
  mcq('n8', 'Counting', 'Count the stars', ['2', '3', '4', '5'], 2, '⭐ ⭐ ⭐'),
  mcq('n9', 'Letters', '"B" for ___', ['Ball', 'Cat', 'Dog', 'Egg'], 0, '⚽'),
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
  mcq('s2q5', 'EVS', 'We get rain from ___', ['Clouds', 'Rocks', 'Sand', 'Wood'], 0),
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
  mcq('s3q5', 'EVS', 'Largest planet?', ['Earth', 'Mars', 'Jupiter', 'Moon'], 2),
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
  mcq('s4q7', 'Maths', 'Perimeter of square side 3 cm?', ['6 cm', '9 cm', '12 cm', '15 cm'], 2),
  mcq('s4q8', 'English', 'Adjective in: "Tall tree"', ['Tall', 'Tree', 'The', 'Is'], 0),
  mcq('s4q9', 'EVS', 'Sun rises in the ___', ['East', 'West', 'North', 'South'], 0),
  mcq('s4q10', 'Maths', 'Smallest 3-digit number?', ['99', '100', '101', '999'], 1),
]

const std5Questions = [
  mcq('s5q1', 'Maths', '12 × 5 = ?', ['50', '55', '60', '65'], 2),
  mcq('s5q2', 'Maths', '3/5 + 1/5 = ?', ['4/5', '3/5', '2/5', '1/5'], 0),
  mcq('s5q3', 'English', 'Synonym of begin?', ['Start', 'End', 'Stop', 'Close'], 0),
  mcq('s5q4', 'Science', 'Gas we breathe in?', ['Oxygen', 'Smoke', 'Dust', 'Oil'], 0),
  mcq('s5q5', 'Maths', 'Area of rectangle 4×5?', ['9', '18', '20', '25'], 2),
  mcq('s5q6', 'GK', 'State we live in (school)?', ['Maharashtra', 'Gujarat', 'Goa', 'Karnataka'], 0),
  mcq('s5q7', 'English', 'Past tense of eat?', ['Ate', 'Eated', 'Eating', 'Eaten'], 0),
  mcq('s5q8', 'Science', 'Boiling point of water (°C)?', ['50', '80', '100', '120'], 2),
  mcq('s5q9', 'Maths', 'LCM of 4 and 6?', ['10', '12', '18', '24'], 1),
  mcq('s5q10', 'EVS', 'Renewable energy source?', ['Solar', 'Coal', 'Petrol', 'Diesel'], 0),
]

const std6Questions = [
  mcq('s6q1', 'Maths', '(-3) + 5 = ?', ['-8', '-2', '2', '8'], 2),
  mcq('s6q2', 'Maths', '20% of 50 = ?', ['5', '10', '15', '20'], 1),
  mcq('s6q3', 'Science', 'Unit of force?', ['Newton', 'Joule', 'Watt', 'Pascal'], 0),
  mcq('s6q4', 'English', 'Antonym of ancient?', ['Modern', 'Old', 'Past', 'Historic'], 0),
  mcq('s6q5', 'Geography', 'Longest river in India?', ['Ganga', 'Narmada', 'Godavari', 'Yamuna'], 0),
  mcq('s6q6', 'Maths', 'Sum of angles in triangle?', ['90°', '180°', '270°', '360°'], 1),
  mcq('s6q7', 'Science', 'Photosynthesis needs ___', ['Sunlight', 'Darkness', 'Salt', 'Oil'], 0),
  mcq('s6q8', 'History', 'Independence year of India?', ['1942', '1945', '1947', '1950'], 2),
  mcq('s6q9', 'Maths', 'HCF of 12 and 18?', ['3', '6', '9', '12'], 1),
  mcq('s6q10', 'Science', 'Heart pumps ___', ['Blood', 'Air', 'Water', 'Food'], 0),
]

const std7Questions = [
  mcq('s7q1', 'Maths', '2³ = ?', ['6', '8', '9', '12'], 1),
  mcq('s7q2', 'Maths', 'Simple interest formula uses?', ['P, R, T', 'A, B, C', 'X, Y, Z', 'L, W, H'], 0),
  mcq('s7q3', 'Science', 'Speed = ?', ['Distance ÷ Time', 'Time ÷ Distance', 'Mass × Volume', 'Force × Area'], 0),
  mcq('s7q4', 'English', 'Figure of speech: "Busy as a bee"', ['Simile', 'Metaphor', 'Rhyme', 'Verb'], 0),
  mcq('s7q5', 'Geography', 'Tropic of Cancer passes through India?', ['Yes', 'No', 'Only south', 'Only north'], 0),
  mcq('s7q6', 'Maths', '√49 = ?', ['6', '7', '8', '9'], 1),
  mcq('s7q7', 'Science', 'Acid found in lemon?', ['Citric', 'Sulphuric', 'Nitric', 'Hydrochloric'], 0),
  mcq('s7q8', 'History', 'Quit India Movement year?', ['1940', '1942', '1945', '1947'], 1),
  mcq('s7q9', 'Maths', 'Ratio 2:3, total 25, first part?', ['10', '12', '15', '20'], 0),
  mcq('s7q10', 'Science', 'Greenhouse gas?', ['CO₂', 'O₂', 'N₂', 'He'], 0),
]

const std8Questions = [
  mcq('s8q1', 'Maths', 'Solve: 2x + 4 = 10, x = ?', ['2', '3', '4', '5'], 1),
  mcq('s8q2', 'Maths', '(a+b)² = ?', ['a²+b²', 'a²+2ab+b²', 'a²−b²', '2a+2b'], 1),
  mcq('s8q3', 'Science', "Ohm's law: V = ?", ['IR', 'I/R', 'R/I', 'I+R'], 0),
  mcq('s8q4', 'Geography', 'Highest peak in India?', ['K2', 'Kanchenjunga', 'Nanda Devi', 'Everest'], 1),
  mcq('s8q5', 'English', 'Active voice: "Ravi eats mango"', ['Ravi is eaten', 'Mango is eaten by Ravi', 'Mango eats Ravi', 'Eating mango'], 1),
  mcq('s8q6', 'Maths', 'Volume of cube side 3 cm?', ['9 cm³', '18 cm³', '27 cm³', '36 cm³'], 2),
  mcq('s8q7', 'Science', 'pH of pure water?', ['5', '7', '9', '14'], 1),
  mcq('s8q8', 'History', 'Constitution adopted year?', ['1947', '1949', '1950', '1952'], 2),
  mcq('s8q9', 'Maths', 'Profit 20% on CP 500 = SP?', ['520', '550', '600', '620'], 2),
  mcq('s8q10', 'Science', 'Metal that is liquid at room temp?', ['Mercury', 'Iron', 'Copper', 'Gold'], 0),
]

const std9Questions = [
  mcq('s9q1', 'Maths', 'Polynomial degree of 3x² + 5x + 1?', ['1', '2', '3', '4'], 1),
  mcq('s9q2', 'Maths', 'Distance between (0,0) and (3,4)?', ['5', '6', '7', '8'], 0),
  mcq('s9q3', 'Science', 'Atomic number = number of ___', ['Protons', 'Neutrons', 'Electrons only', 'Nuclei'], 0),
  mcq('s9q4', 'Science', 'Unit of electric current?', ['Ampere', 'Volt', 'Ohm', 'Watt'], 0),
  mcq('s9q5', 'Geography', "India's southern tip state?", ['Kerala', 'Tamil Nadu', 'Karnataka', 'Goa'], 1),
  mcq('s9q6', 'Maths', 'sin 30° = ?', ['0', '½', '1', '√3/2'], 1),
  mcq('s9q7', 'English', 'Type of noun: "Honesty"', ['Abstract', 'Proper', 'Collective', 'Material'], 0),
  mcq('s9q8', 'Science', 'Mitochondria is ___ of cell', ['Powerhouse', 'Brain', 'Wall', 'Nucleus'], 0),
  mcq('s9q9', 'History', 'First battle of Panipat year?', ['1526', '1556', '1761', '1857'], 0),
  mcq('s9q10', 'Maths', 'Surface area of sphere formula has?', ['4πr²', 'πr²', '2πr', 'πr³'], 0),
]

const std10Questions = [
  mcq('s10q1', 'Maths', 'Quadratic roots of x² − 5x + 6 = 0?', ['2, 3', '1, 6', '−2, −3', '5, 6'], 0),
  mcq('s10q2', 'Maths', 'tan θ = ?', ['sin/cos', 'cos/sin', '1/sin', 'sin×cos'], 0),
  mcq('s10q3', 'Science', 'Lens formula involves?', ['1/f', 'f²', 'f³', '2f'], 0),
  mcq('s10q4', 'Science', 'Valency of sodium?', ['1', '2', '3', '4'], 0),
  mcq('s10q5', 'Geography', 'Monsoon in India mainly from?', ['South-West', 'North-East only', 'East-West', 'Polar'], 0),
  mcq('s10q6', 'English', 'Reported speech: He said he ___ tired', ['is', 'was', 'will be', 'has been'], 1),
  mcq('s10q7', 'Maths', 'AP 2, 5, 8... 10th term?', ['26', '29', '32', '35'], 1),
  mcq('s10q8', 'Science', 'Human blood group types?', ['4 main', '2 main', '6 main', '8 main'], 0),
  mcq('s10q9', 'History', 'Swadeshi Movement linked to?', ['Partition of Bengal', 'World War I', 'Green Revolution', 'Blue Revolution'], 0),
  mcq('s10q10', 'Maths', 'Probability of head in fair coin?', ['½', '¼', '1', '0'], 0),
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
  return assessmentsByGrade[gradeId] ?? assessmentsByGrade.std1
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
