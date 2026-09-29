export const ADMISSION_JOY_TOUR_STEPS = [
  {
    target: 'student-name',
    message: 'Enter the student\'s full name here.',
    example: 'As on birth certificate',
    requiredStep: 1,
  },
  {
    target: 'dob',
    message: 'Pick the date of birth here.',
    requiredStep: 1,
  },
  {
    target: 'grade',
    message: 'Select the class the child is applying for.',
    requiredStep: 1,
  },
  {
    target: 'parent-name',
    message: 'Enter parent or guardian name here.',
    requiredStep: 1,
  },
  {
    target: 'parent-phone',
    message: 'Enter the parent WhatsApp number here.',
    example: '10-digit mobile',
    requiredStep: 1,
  },
  {
    target: 'start-test',
    message: 'Click here when details are complete to start the test.',
    requiredStep: 1,
  },
  {
    target: 'quiz',
    secondaryTarget: 'quiz-next',
    message: 'Help the child tap one answer here, then click Next to move on.',
    requiredStep: 2,
  },
  {
    target: 'sibling',
    message: 'Turn on sibling discount if another child already studies here.',
    requiredStep: 3,
  },
  {
    target: 'fees',
    message: 'Review the fee calculation and scholarship here.',
    requiredStep: 3,
  },
  {
    target: 'whatsapp',
    message: 'Send the full admission report to the parent on WhatsApp.',
    requiredStep: 3,
  },
]
